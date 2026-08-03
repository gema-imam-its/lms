"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { MASCOT_URLS, MascotVariant } from "@/types/module";

interface InteractiveMascotProps {
  /** Short welcome line shown in an auto-appearing speech bubble. Omit for an ambient-only mascot. */
  greeting?: string;
  /** Enables cursor-follow tilt and click-to-react. Default true. */
  interactive?: boolean;
  className?: string;
}

const REST_POSE: MascotVariant = "hello";
const REACT_POSE: MascotVariant = "book";
const TILT_MAX_DEG = 10;
const TILT_MAX_DIST = 400;

export default function InteractiveMascot({
  greeting,
  interactive = true,
  className = "",
}: InteractiveMascotProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const isReactingRef = useRef(false);

  const [pose, setPose] = useState<MascotVariant>(REST_POSE);
  const [showGreeting, setShowGreeting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  const startIdleLoop = () =>
    controls.start({
      y: [0, -8, 0],
      rotate: [-2, 2, -2],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    });

  // Entrance pop-in, then settle into the idle loop. Skipped entirely under
  // reduced motion, where the mascot just renders at rest (see initial/animate below).
  useEffect(() => {
    if (prefersReducedMotion) return;
    let cancelled = false;
    (async () => {
      await controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: { type: "spring", bounce: 0.5, duration: 1 },
      });
      if (!cancelled) startIdleLoop();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, prefersReducedMotion]);

  // Auto greeting speech bubble, once, a beat after the mascot settles in.
  useEffect(() => {
    if (!greeting) return;
    const delay = prefersReducedMotion ? 400 : 1400;
    const timer = setTimeout(() => setShowGreeting(true), delay);
    return () => clearTimeout(timer);
  }, [greeting, prefersReducedMotion]);

  // Cursor-follow tilt: mascot subtly leans toward the pointer. Fine-pointer only,
  // so touch devices no-op.
  useEffect(() => {
    if (!interactive || prefersReducedMotion) return;
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const fracX = Math.max(-1, Math.min(1, (e.clientX - centerX) / TILT_MAX_DIST));
      const fracY = Math.max(-1, Math.min(1, (e.clientY - centerY) / TILT_MAX_DIST));
      rotateY.set(fracX * TILT_MAX_DEG);
      rotateX.set(fracY * -TILT_MAX_DEG);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [interactive, prefersReducedMotion, rotateX, rotateY]);

  const handleClick = () => {
    if (!interactive || isReactingRef.current) return;
    isReactingRef.current = true;
    setPose(REACT_POSE);

    if (prefersReducedMotion) {
      window.setTimeout(() => {
        setPose(REST_POSE);
        isReactingRef.current = false;
      }, 900);
      return;
    }

    controls
      .start({
        scale: [1, 1.15, 0.95, 1.05, 1],
        rotate: [0, -10, 10, -6, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      })
      .then(() => {
        setPose(REST_POSE);
        startIdleLoop();
        isReactingRef.current = false;
      });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        className={`relative w-full h-full ${interactive ? "cursor-pointer" : ""}`}
        style={
          interactive && !prefersReducedMotion
            ? { rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 600 }
            : undefined
        }
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40, scale: 0.8, rotate: -8 }}
        animate={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : controls}
        onClick={handleClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        aria-label={interactive ? "Sapa maskot Gema Imam" : undefined}
      >
        <Image
          src={MASCOT_URLS[pose]}
          alt="Mascot Gema Imam"
          fill
          className="object-contain drop-shadow-md"
          priority
        />
      </motion.div>

      <AnimatePresence>
        {showGreeting && !dismissed && greeting && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/4 z-20 w-56 bg-white border-4 border-gema-mint rounded-2xl px-4 py-3 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Tutup sapaan maskot"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gema-navy text-white text-xs leading-none flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-gema-tosca"
            >
              &times;
            </button>
            <p className="font-gilroy font-semibold text-sm text-gema-navy">{greeting}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 w-4 h-4 bg-white border-b-4 border-r-4 border-gema-mint rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
