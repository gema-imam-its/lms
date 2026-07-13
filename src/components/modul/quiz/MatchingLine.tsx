"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MatchingPair } from "@/types/module";
import { Check, X } from "lucide-react";

interface MatchingLineProps {
  pairs: MatchingPair[];
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

// Colors for matching pairs to help tuna grahita students visually connect them
const COLORS = [
  "bg-blue-100 border-blue-400 text-blue-700",
  "bg-pink-100 border-pink-400 text-pink-700",
  "bg-purple-100 border-purple-400 text-purple-700",
  "bg-orange-100 border-orange-400 text-orange-700",
];

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
  
  // Map to assign consistent colors to completed matches
  const [matchColors, setMatchColors] = useState<Record<string, string>>({});

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
  }, [pairs]);

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
    
    // Assign a color
    const colorIndex = Object.keys(newMatches).length % COLORS.length;
    const newMatchColors = { ...matchColors, [selectedLeftId]: COLORS[colorIndex] };
    
    setMatches(newMatches);
    setMatchColors(newMatchColors);
    setSelectedLeftId(null); // Reset selection
    
    // Check if all pairs are matched
    if (Object.keys(newMatches).length === pairs.length) {
      // Evaluate if all matches are correct
      // A match is correct if leftId === rightId (since they come from the same pair object)
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
    <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl mx-auto gap-12 p-4">
      {/* Left Column (Images/Items) */}
      <div className="flex-1 flex flex-col gap-6">
        {leftItems.map((item) => {
          const isMatched = !!matches[item.id];
          const isSelected = selectedLeftId === item.id;
          const matchedColor = isMatched ? matchColors[item.id] : "";
          
          // Determine if it's the final validation state
          const isFull = Object.keys(matches).length === pairs.length;
          const isCorrectMatch = isFull && matches[item.id] === item.id;
          const isWrongMatch = isFull && matches[item.id] !== item.id;

          let borderClass = "border-transparent";
          if (isSelected) borderClass = "border-gema-tosca shadow-lg scale-105";
          else if (isCorrectMatch) borderClass = "border-green-500 shadow-green-500/30 shadow-lg";
          else if (isWrongMatch) borderClass = "border-red-500 shadow-red-500/30 shadow-lg";
          else if (isMatched) borderClass = "border-transparent opacity-90";
          else if (!disabled) borderClass = "hover:border-gray-300";

          return (
            <button
              key={`left-${item.id}`}
              onClick={() => isMatched ? undoMatch(item.id) : handleLeftSelect(item.id)}
              disabled={disabled || (isMatched && isFull)}
              className={`relative flex items-center p-4 bg-white rounded-2xl shadow-sm border-4 transition-all duration-300 min-h-[120px] w-full ${borderClass} ${isMatched ? matchedColor : ""}`}
            >
              {/* Image */}
              <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden mr-6 p-2">
                <Image
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
                  isCorrectMatch ? "bg-green-500" : "bg-red-500"
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

      {/* Connection Indicator (Visual only, on desktop) */}
      <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-16 opacity-30">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-300 rounded-full my-4"></div>
        ))}
      </div>

      {/* Right Column (Labels) */}
      <div className="flex-1 flex flex-col gap-6">
        {rightItems.map((item) => {
          // Find if this right item is matched to any left item
          const matchedLeftId = Object.keys(matches).find(key => matches[key] === item.id);
          const isMatched = !!matchedLeftId;
          const matchedColor = isMatched ? matchColors[matchedLeftId] : "";
          
          const isFull = Object.keys(matches).length === pairs.length;
          const isCorrectMatch = isFull && matchedLeftId === item.id;
          const isWrongMatch = isFull && isMatched && matchedLeftId !== item.id;

          let borderClass = "border-transparent";
          if (isCorrectMatch) borderClass = "border-green-500 shadow-green-500/30 shadow-lg";
          else if (isWrongMatch) borderClass = "border-red-500 shadow-red-500/30 shadow-lg";
          else if (isMatched) borderClass = "border-transparent opacity-90";
          else if (selectedLeftId && !disabled) borderClass = "border-gema-tosca border-dashed animate-pulse hover:border-solid hover:bg-teal-50";

          return (
            <button
              key={`right-${item.id}`}
              onClick={() => handleRightSelect(item.id)}
              disabled={disabled || isMatched || !selectedLeftId}
              className={`flex items-center justify-center p-6 bg-white rounded-2xl shadow-sm border-4 transition-all duration-300 min-h-[120px] w-full ${borderClass} ${isMatched ? matchedColor : ""}`}
            >
              <span className="font-gohan text-2xl md:text-3xl font-bold text-center">
                {item.rightLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
