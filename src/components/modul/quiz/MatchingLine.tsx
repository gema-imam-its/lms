"use client";

import { useState, useEffect, useRef } from "react";
import { MatchingPair } from "@/types/module";
import { Check, X } from "lucide-react";
import ModulImage from "../ModulImage";

interface MatchingLineProps {
  pairs: MatchingPair[];
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

// Per-match palettes (index-aligned) — box tint, SVG line stroke, number badge.
// Colors help tuna grahita students visually connect a pair even before the
// answer is checked.
const COLORS = [
  "bg-blue-100 border-blue-400 text-blue-700",
  "bg-pink-100 border-pink-400 text-pink-700",
  "bg-purple-100 border-purple-400 text-purple-700",
  "bg-orange-100 border-orange-400 text-orange-700",
];
const STROKE_COLORS = ["#60a5fa", "#f472b6", "#c084fc", "#fb923c"];
const BADGE_COLORS = ["bg-blue-500", "bg-pink-500", "bg-purple-500", "bg-orange-500"];

interface Line {
  leftId: string;
  rightId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export default function MatchingLine({
  pairs,
  onAnswer,
  disabled,
}: MatchingLineProps) {
  // Shuffle arrays on mount
  const [leftItems, setLeftItems] = useState<MatchingPair[]>([]);
  const [rightItems, setRightItems] = useState<MatchingPair[]>([]);

  // State for selections
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);

  // Map of completed matches: { leftId: rightId }
  const [matches, setMatches] = useState<Record<string, string>>({});

  // Map of leftId -> color index, so a pair's box tint / line / badge all agree
  const [matchColors, setMatchColors] = useState<Record<string, number>>({});

  // Geometry for the connecting lines (computed from the DOM, never in render)
  const [lines, setLines] = useState<Line[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    // Shuffle arrays independently
    const shuffledLeft = [...pairs].sort(() => Math.random() - 0.5);
    const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);

    // Reset state when pairs change
    setSelectedLeftId(null);
    setMatches({});
    setMatchColors({});
    setLines([]);
  }, [pairs]);

  // Draw a line between each matched left/right box. Recompute on match changes
  // and on resize; all DOM measurement happens here (in an effect), not render.
  useEffect(() => {
    const recompute = () => {
      const container = containerRef.current;
      if (!container) return;
      const c = container.getBoundingClientRect();
      const next: Line[] = [];
      for (const [leftId, rightId] of Object.entries(matches)) {
        const l = leftRefs.current[leftId];
        const r = rightRefs.current[rightId];
        if (!l || !r) continue;
        const lr = l.getBoundingClientRect();
        const rr = r.getBoundingClientRect();
        const idx = (matchColors[leftId] ?? 0) % STROKE_COLORS.length;
        next.push({
          leftId,
          rightId,
          x1: lr.right - c.left,
          y1: lr.top + lr.height / 2 - c.top,
          x2: rr.left - c.left,
          y2: rr.top + rr.height / 2 - c.top,
          color: STROKE_COLORS[idx],
        });
      }
      setLines(next);
    };

    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [matches, matchColors, leftItems, rightItems]);

  const handleLeftSelect = (id: string) => {
    if (disabled || matches[id]) return;

    // Toggle selection
    if (selectedLeftId === id) {
      setSelectedLeftId(null);
    } else {
      setSelectedLeftId(id);
    }
  };

  const handleRightSelect = (id: string) => {
    if (disabled || !selectedLeftId || Object.values(matches).includes(id)) return;

    // Make a match
    const newMatches = { ...matches, [selectedLeftId]: id };

    // Assign a color (index based on how many pairs were matched before this one)
    const colorIndex = Object.keys(matches).length % COLORS.length;
    const newMatchColors = { ...matchColors, [selectedLeftId]: colorIndex };

    setMatches(newMatches);
    setMatchColors(newMatchColors);
    setSelectedLeftId(null); // Reset selection

    // Check if all pairs are matched
    if (Object.keys(newMatches).length === pairs.length) {
      // A match is correct if leftId === rightId (both come from the same pair)
      const allCorrect = Object.entries(newMatches).every(([left, right]) => left === right);

      setTimeout(() => {
        onAnswer(allCorrect);
        // Reset if wrong, so they can try again if the parent component allows it
        if (!allCorrect) {
          setTimeout(() => {
            setMatches({});
            setMatchColors({});
          }, 2000);
        }
      }, 800);
    }
  };

  const undoMatch = (leftId: string) => {
    if (disabled) return;
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col md:flex-row justify-between w-full max-w-5xl mx-auto gap-8 md:gap-16 p-4"
    >
      {/* Connecting lines (desktop only — on mobile the columns stack, so the
          shared color + number badge carry the pairing instead). */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
        aria-hidden
      >
        {lines.map((ln) => (
          <g key={`${ln.leftId}-${ln.rightId}`}>
            <line
              x1={ln.x1}
              y1={ln.y1}
              x2={ln.x2}
              y2={ln.y2}
              stroke={ln.color}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <circle cx={ln.x1} cy={ln.y1} r={6} fill={ln.color} />
            <circle cx={ln.x2} cy={ln.y2} r={6} fill={ln.color} />
          </g>
        ))}
      </svg>

      {/* Left Column (Images/Items) */}
      <div className="relative z-10 flex-1 flex flex-col gap-6">
        {leftItems.map((item) => {
          const isMatched = !!matches[item.id];
          const isSelected = selectedLeftId === item.id;
          const colorIdx = matchColors[item.id];
          const matchedColor = isMatched ? COLORS[colorIdx % COLORS.length] : "";

          // Determine if it's the final validation state
          const isFull = Object.keys(matches).length === pairs.length;
          const isCorrectMatch = isFull && matches[item.id] === item.id;
          const isWrongMatch = isFull && matches[item.id] !== item.id;

          let borderClass = "border-transparent";
          if (isSelected) borderClass = "border-gema-tosca shadow-lg scale-105";
          else if (isCorrectMatch) borderClass = "border-green-500 shadow-green-500/30 shadow-lg";
          else if (isWrongMatch) borderClass = "border-amber-400 shadow-amber-400/30 shadow-lg";
          else if (isMatched) borderClass = "border-transparent opacity-90";
          else if (!disabled) borderClass = "hover:border-gray-300";

          return (
            <button
              key={`left-${item.id}`}
              ref={(el) => {
                leftRefs.current[item.id] = el;
              }}
              onClick={() => (isMatched ? undoMatch(item.id) : handleLeftSelect(item.id))}
              disabled={disabled || (isMatched && isFull)}
              className={`relative flex items-center p-4 bg-white rounded-2xl shadow-sm border-4 transition-all duration-300 min-h-[120px] w-full ${borderClass} ${isMatched ? matchedColor : ""}`}
            >
              {/* Pair number badge (reinforces the pairing, esp. on mobile) */}
              {isMatched && !isFull && (
                <div
                  className={`absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-gohan font-bold text-sm shadow-md md:hidden ${BADGE_COLORS[colorIdx % BADGE_COLORS.length]}`}
                >
                  {colorIdx + 1}
                </div>
              )}

              {/* Image */}
              <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden mr-6 p-2">
                <ModulImage
                  src={item.leftImageUrl}
                  alt={item.leftLabel}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Label */}
              <span className="font-gohan text-xl md:text-2xl font-bold text-left">
                {item.leftLabel}
              </span>

              {/* Status Icons for full validation */}
              {isFull && isMatched && (
                <div className={`absolute -right-4 -top-4 w-10 h-10 rounded-full flex items-center justify-center z-20 shadow-md ${
                  isCorrectMatch ? "bg-green-500" : "bg-amber-500"
                }`}>
                  {isCorrectMatch ? (
                    <Check size={24} className="text-white" strokeWidth={4} />
                  ) : (
                    <X size={24} className="text-white" strokeWidth={4} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Column (Labels) */}
      <div className="relative z-10 flex-1 flex flex-col gap-6">
        {rightItems.map((item) => {
          // Find if this right item is matched to any left item
          const matchedLeftId = Object.keys(matches).find(key => matches[key] === item.id);
          const isMatched = !!matchedLeftId;
          const colorIdx = matchedLeftId !== undefined ? matchColors[matchedLeftId] : undefined;
          const matchedColor =
            colorIdx !== undefined ? COLORS[colorIdx % COLORS.length] : "";

          const isFull = Object.keys(matches).length === pairs.length;
          const isCorrectMatch = isFull && matchedLeftId === item.id;
          const isWrongMatch = isFull && isMatched && matchedLeftId !== item.id;

          let borderClass = "border-transparent";
          if (isCorrectMatch) borderClass = "border-green-500 shadow-green-500/30 shadow-lg";
          else if (isWrongMatch) borderClass = "border-amber-400 shadow-amber-400/30 shadow-lg";
          else if (isMatched) borderClass = "border-transparent opacity-90";
          else if (selectedLeftId && !disabled) borderClass = "border-gema-tosca border-dashed animate-pulse hover:border-solid hover:bg-teal-50";

          return (
            <button
              key={`right-${item.id}`}
              ref={(el) => {
                rightRefs.current[item.id] = el;
              }}
              onClick={() => handleRightSelect(item.id)}
              disabled={disabled || isMatched || !selectedLeftId}
              className={`relative flex items-center justify-center p-6 bg-white rounded-2xl shadow-sm border-4 transition-all duration-300 min-h-[120px] w-full ${borderClass} ${isMatched ? matchedColor : ""}`}
            >
              {/* Pair number badge (mobile pairing aid) */}
              {isMatched && colorIdx !== undefined && !isFull && (
                <div
                  className={`absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-gohan font-bold text-sm shadow-md md:hidden ${BADGE_COLORS[colorIdx % BADGE_COLORS.length]}`}
                >
                  {colorIdx + 1}
                </div>
              )}

              <span className="font-gohan text-lg md:text-2xl font-bold text-center leading-snug break-words">
                {item.rightLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
