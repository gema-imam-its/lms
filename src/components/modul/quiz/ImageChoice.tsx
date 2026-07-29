"use client";

import { useState } from "react";
import { ImageChoiceOption } from "@/types/module";
import { Check, X } from "lucide-react";
import ModulImage from "../ModulImage";
import { playSoundEffect } from "@/lib/soundEffects";

interface ImageChoiceProps {
  options: ImageChoiceOption[];
  correctAnswerId: string;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export default function ImageChoice({
  options,
  correctAnswerId,
  onAnswer,
  disabled,
}: ImageChoiceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (disabled || selectedId !== null) return;

    playSoundEffect("click");
    setSelectedId(id);
    const isCorrect = id === correctAnswerId;
    
    // Slight delay to show the selected state before passing it up
    setTimeout(() => {
      onAnswer(isCorrect);
      // Reset selection after giving the parent time to show feedback
      setTimeout(() => setSelectedId(null), 2000);
    }, 500);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${options.length > 2 ? 'lg:grid-cols-3' : ''} gap-3 md:gap-4 w-full max-w-3xl mx-auto p-2`}>
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const isCorrect = isSelected && option.id === correctAnswerId;

        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={disabled || selectedId !== null}
            className={`relative flex flex-col items-center p-3 md:p-4 bg-white rounded-2xl shadow-md transition-all duration-300 min-h-[48px] border-4 ${
              isSelected
                ? isCorrect
                  ? "border-green-500 scale-105 shadow-xl shadow-green-500/20"
                  : "border-amber-400 scale-95 opacity-80"
                : disabled
                  ? "border-transparent opacity-50 cursor-not-allowed"
                  : "border-transparent hover:border-gema-tosca hover:shadow-lg hover:-translate-y-1 active:scale-95 cursor-pointer"
            }`}
          >
            {/* Status Icons */}
            {isSelected && (
              <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-md ${
                isCorrect ? "bg-green-500" : "bg-amber-500"
              }`}>
                {isCorrect ? (
                  <Check size={18} className="text-white" strokeWidth={4} />
                ) : (
                  <X size={18} className="text-white" strokeWidth={4} />
                )}
              </div>
            )}

            {/* Image */}
            <div className="relative w-full aspect-square max-w-[120px] md:max-w-[140px] mb-2 drop-shadow-md">
              <ModulImage
                src={option.imageUrl}
                alt={option.label}
                fill
                className="object-contain"
              />
            </div>

            {/* Label */}
            <span className="font-gohan text-lg text-gema-navy font-bold mt-auto w-full text-center">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
