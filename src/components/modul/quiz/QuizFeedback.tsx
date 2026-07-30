"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MASCOT_URLS } from "@/types/module";
import { Check, X, PartyPopper, Sparkles, Lightbulb, Star } from "lucide-react";
import { playSystemSound } from "@/lib/systemSounds";
import { playSoundEffect } from "@/lib/soundEffects";

interface QuizFeedbackProps {
  correct: boolean;
  onContinue: () => void;
  message?: string;
  hint?: string;
}

const CONFETTI_COLORS = [
  "text-gema-tosca fill-gema-tosca",
  "text-yellow-400 fill-yellow-400",
  "text-gema-pink fill-gema-pink",
  "text-gema-mint fill-gema-mint",
  "text-gema-sky fill-gema-sky",
];

export default function QuizFeedback({
  correct,
  onContinue,
  message,
  hint,
}: QuizFeedbackProps) {
  const [show, setShow] = useState(false);
  const hasCelebratedRef = useRef(false);
  // Seeded once at mount (lazy initializer), never recomputed during render —
  // Math.random() directly in JSX is a React purity violation.
  const [confetti] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 0.6}s`,
      animationDuration: `${0.8 + Math.random()}s`,
      rotate: Math.round(Math.random() * 360),
      size: 16 + Math.round(Math.random() * 16),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: i % 3 === 0 ? "sparkle" : "star",
    })),
  );

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);

    let t2: NodeJS.Timeout;
    if (correct) {
      // Guarded so this only ever fires once per modal, even if the effect
      // re-runs (e.g. onContinue's identity changing on a parent re-render)
      // — otherwise the celebration sound could replay mid-animation.
      if (!hasCelebratedRef.current) {
        hasCelebratedRef.current = true;
        playSystemSound("benar");
        playSoundEffect("celebrate");
      }
      t2 = setTimeout(() => {
        onContinue();
      }, 2500);
    }

    return () => {
      clearTimeout(t);
      if (t2) clearTimeout(t2);
    };
  }, [correct, onContinue]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
        show ? (correct ? "bg-green-500/20 backdrop-blur-sm" : "bg-orange-500/20 backdrop-blur-sm") : "bg-transparent backdrop-blur-none"
      }`}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center text-center transform transition-all duration-500 ${
          show ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
        } ${correct && show ? "animate-mascot-bob" : ""}`}
      >
        {/* Icon & Mascot Header */}
        <div className="relative w-full flex justify-center mb-6">
          <div className="relative w-40 h-40 drop-shadow-xl z-10">
            <Image
              src={correct ? MASCOT_URLS.hello : MASCOT_URLS.book}
              alt="Feedback Mascot"
              fill
              className="object-contain"
            />
          </div>

          {/* Status Badge */}
          <div className={`absolute -bottom-4 z-20 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-lg ${
            correct ? "bg-green-500" : "bg-orange-500"
          }`}>
            {correct ? (
              <Check size={32} className="text-white" strokeWidth={4} />
            ) : (
              <X size={32} className="text-white" strokeWidth={4} />
            )}
          </div>
        </div>

        {/* Text Content */}
        <h2 className={`font-gohan text-4xl mb-4 flex items-center justify-center gap-2 ${
          correct ? "text-green-600" : "text-orange-500"
        }`}>
          {message ? (
            message
          ) : correct ? (
            <>Horeee, Benar! <PartyPopper size={32} /></>
          ) : (
            <>Masih Kurang Tepat <Sparkles size={32} /></>
          )}
        </h2>

        {!correct && (
          <div className="mb-8 w-full">
            <p className="font-gilroy text-xl text-gray-600 mb-4">
              Jangan menyerah, ayo kita coba sekali lagi!
            </p>
            {hint && (
              <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left">
                <Lightbulb size={28} className="shrink-0 text-amber-500" aria-hidden />
                <p className="font-gilroy text-lg text-amber-900">
                  <span className="font-bold">Petunjuk: </span>
                  {hint}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onContinue}
          className={`w-full min-h-[64px] rounded-full font-gohan text-2xl font-bold text-white transition-transform active:scale-95 shadow-lg hover:shadow-xl ${
            correct
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {correct ? "Lanjut" : "Coba Lagi"}
        </button>
      </div>

      {/* Confetti burst if correct */}
      {correct && show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: c.left,
                top: c.top,
                animationDelay: c.animationDelay,
                animationDuration: c.animationDuration,
                transform: `rotate(${c.rotate}deg)`,
              }}
            >
              {c.shape === "sparkle" ? (
                <Sparkles size={c.size} className={c.color} />
              ) : (
                <Star size={c.size} className={c.color} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
