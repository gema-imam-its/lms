"use client";

import { QuizSlide } from "@/types/module";
import MascotBubble from "./MascotBubble";
import NarrationButton from "./NarrationButton";
import ImageChoice from "./quiz/ImageChoice";
import MatchingLine from "./quiz/MatchingLine";
import SortOrder from "./quiz/SortOrder";
import QuizFeedback from "./quiz/QuizFeedback";
import { useState } from "react";
import { stopCurrentAudio } from "@/lib/audioChannel";
import { useNarrationPlayback } from "@/lib/useNarrationPlayback";

interface SlideQuizProps {
  slide: QuizSlide;
  onCorrect: () => void;
  onWrong: () => void;
  showHint: boolean;
}

export default function SlideQuiz({
  slide,
  onCorrect,
  onWrong,
  showHint,
}: SlideQuizProps) {
  const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
  const [disabled, setDisabled] = useState(false);
  // Bumped on retry to remount the quiz-type child (ImageChoice/MatchingLine/
  // SortOrder), clearing its local selection state without touching the
  // attempt/score tracking that lives in SlidePresentation.
  const [attemptKey, setAttemptKey] = useState(0);
  const { replay, hasNarration } = useNarrationPlayback(slide.narrationUrl);

  const handleAnswer = (isCorrect: boolean) => {
    // Cut the quiz's own narration the instant an answer is picked — a
    // quick student can answer well before a multi-clip sequence finishes,
    // and letting it keep talking under the feedback modal (and the
    // benar/belum sound about to play) is exactly what caused sounds to
    // overlap/crash into each other.
    stopCurrentAudio();
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

  // Dismisses the success modal and resets the quiz for another go, without
  // recording a result or advancing — the correct answer was already given,
  // this is just "let me try that again" for practice.
  const handleRetry = () => {
    setFeedbackState("idle");
    setDisabled(false);
    setAttemptKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center py-2 animate-in zoom-in-95 fade-in duration-500 relative">

      {/* Quiz Header & Mascot Hint */}
      <div className="w-full max-w-5xl mb-3 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-20 bg-white/90 backdrop-blur-sm py-1">
        <h2 className="font-gohan text-xl md:text-2xl text-gema-navy text-center md:text-left flex-1">
          {slide.question}
        </h2>

        {hasNarration && <NarrationButton onClick={replay} />}

        {/* Mascot Hint Area */}
        {showHint && slide.hint && (
          <div className="md:max-w-xs scale-75 md:scale-100 origin-right">
            <MascotBubble mascot="book" message={slide.hint} size="sm" />
          </div>
        )}
      </div>

      {/* Quiz Content Container */}
      <div className="w-full flex-1 flex items-center justify-center bg-gray-50/50 rounded-3xl p-2 md:p-4">
        {slide.quizType === "image-choice" && (
          <ImageChoice
            key={attemptKey}
            options={slide.options}
            correctAnswerId={slide.correctAnswerId}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        )}

        {slide.quizType === "matching-line" && (
          <MatchingLine
            key={attemptKey}
            pairs={slide.pairs}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        )}

        {slide.quizType === "sort-order" && (
          <SortOrder
            key={attemptKey}
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
          onRetry={feedbackState === "correct" ? handleRetry : undefined}
          hint={slide.hint}
        />
      )}
    </div>
  );
}
