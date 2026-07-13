"use client";

import { QuizSlide } from "@/types/module";
import MascotBubble from "./MascotBubble";
import ImageChoice from "./quiz/ImageChoice";
import MatchingLine from "./quiz/MatchingLine";
import SortOrder from "./quiz/SortOrder";
import QuizFeedback from "./quiz/QuizFeedback";
import { useState } from "react";

interface SlideQuizProps {
  slide: QuizSlide;
  onCorrect: () => void;
  onWrong: () => void;
  attempts: number;
  showHint: boolean;
}

export default function SlideQuiz({
  slide,
  onCorrect,
  onWrong,
  attempts,
  showHint,
}: SlideQuizProps) {
  const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
  const [disabled, setDisabled] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    setDisabled(true);
    setFeedbackState(isCorrect ? "correct" : "wrong");
  };

  const handleFeedbackContinue = () => {
    const wasCorrect = feedbackState === "correct";
    setFeedbackState("idle");
    setDisabled(false);
    
    if (wasCorrect) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center py-8 animate-in zoom-in-95 fade-in duration-500 relative">
      
      {/* Quiz Header & Mascot Hint */}
      <div className="w-full max-w-5xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="font-gohan text-3xl md:text-4xl text-gema-navy text-center md:text-left flex-1">
          {slide.question}
        </h2>

        {/* Mascot Hint Area */}
        {showHint && slide.hint && (
          <div className="md:max-w-xs scale-75 md:scale-100 origin-right">
            <MascotBubble mascot="book" message={slide.hint} size="sm" />
          </div>
        )}
      </div>

      {/* Quiz Content Container */}
      <div className="w-full flex-1 flex items-center justify-center bg-gray-50/50 rounded-3xl p-4 md:p-8">
        {slide.quizType === "image-choice" && (
          <ImageChoice
            options={slide.options}
            correctAnswerId={slide.correctAnswerId}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        )}

        {slide.quizType === "matching-line" && (
          <MatchingLine
            pairs={slide.pairs}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        )}

        {slide.quizType === "sort-order" && (
          <SortOrder
            items={slide.items}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        )}
      </div>

      {/* Feedback Overlay */}
      {feedbackState !== "idle" && (
        <QuizFeedback
          correct={feedbackState === "correct"}
          onContinue={handleFeedbackContinue}
        />
      )}
    </div>
  );
}
