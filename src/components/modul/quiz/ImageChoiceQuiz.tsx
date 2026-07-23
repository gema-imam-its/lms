"use client";

import { useState } from "react";
import type { ImageChoiceSlide } from "@/types/lesson";
import ModulImage from "../ModulImage";
import { QuizFeedback } from "./QuizFeedback";
import { shuffle } from "@/lib/shuffle";

interface ImageChoiceQuizProps {
  slide: ImageChoiceSlide;
  onResult: (correct: boolean) => void;
}

// Simplest, purest visual-first quiz type (single tap = answer) — built first
// per the PM review's recommendation, since it proves the shared feedback
// modal + shuffle util + attempt-loop infra that sort-order/matching-line
// will reuse later.
export function ImageChoiceQuiz({ slide, onResult }: ImageChoiceQuizProps) {
  const [order] = useState(() => shuffle(slide.options.map((_, i) => i)));
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null);

  function handleSelect(originalIndex: number) {
    if (answeredCorrect !== null) return;
    setAnsweredCorrect(originalIndex === slide.correctIndex);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <p className="text-center font-gohan text-xl text-gema-navy">
        {slide.question}
      </p>

      <div className="grid w-full grid-cols-2 gap-4">
        {order.map((originalIndex) => {
          const option = slide.options[originalIndex];
          return (
            <button
              key={originalIndex}
              type="button"
              onClick={() => handleSelect(originalIndex)}
              disabled={answeredCorrect !== null}
              className="flex min-h-12 flex-col items-center gap-2 rounded-2xl border-2 border-gema-navy/10 p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca disabled:opacity-60"
            >
              <div className="relative h-24 w-24">
                <ModulImage
                  src={option.image}
                  alt={option.label ?? ""}
                  fill
                  className="object-contain"
                />
              </div>
              {option.label && (
                <span className="font-gilroy text-gema-navy">
                  {option.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {answeredCorrect !== null && (
        <QuizFeedback
          correct={answeredCorrect}
          hint={slide.hint}
          onContinue={() => onResult(answeredCorrect)}
        />
      )}
    </div>
  );
}
