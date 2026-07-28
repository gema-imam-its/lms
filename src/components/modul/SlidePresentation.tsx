"use client";

import { useState } from "react";
import Image from "next/image";
import { ModuleDefinition, ModuleResult, QuizResult, MAX_QUIZ_ATTEMPTS, MASCOT_URLS } from "@/types/module";
import ProgressBar from "./ProgressBar";
import SlideContent from "./SlideContent";
import SlideQuiz from "./SlideQuiz";

interface SlidePresentationProps {
  module: ModuleDefinition;
  onComplete: (result: ModuleResult) => void;
  onBack: () => void;
}

type PresentationState = "presenting" | "reviewing" | "completed";

// A quiz answered right on the first pass is worth full credit; one only
// answered right after a 3-strikes re-teach cycle still counts, just softer —
// keeps the star thresholds from feeling punishing for a hard-fought pass.
function weightedScore(results: QuizResult[]): number {
  return results.reduce((sum, r) => sum + (r.correct ? (r.reviewed ? 0.5 : 1) : 0), 0);
}

export default function SlidePresentation({
  module,
  onComplete,
  onBack,
}: SlidePresentationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<PresentationState>("presenting");
  
  // Track attempts for the current quiz
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  // Review state
  const [reviewTargetIndex, setReviewTargetIndex] = useState<number | null>(null);
  const [reviewedSlides, setReviewedSlides] = useState<Set<number>>(new Set());

  // First real user gesture (any nav/answer click) — unlocks narration
  // autoplay, since browsers block unmuted audio before user interaction.
  const [hasInteracted, setHasInteracted] = useState(false);

  // Results
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const slide = module.slides[currentIndex];
  const isFirst = currentIndex === 0 && state === "presenting";
  const isLast = currentIndex === module.slides.length - 1 && state === "presenting";

  // Navigation handlers
  const handleNext = () => {
    setHasInteracted(true);
    if (state === "reviewing") {
      // Done reviewing, go back to the quiz
      setState("presenting");
      setCurrentIndex(reviewTargetIndex!);
      setReviewTargetIndex(null);
      setCurrentAttempts(0); // Reset attempts for final try
      setShowHint(false);
      return;
    }

    if (isLast) {
      completeModule();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setHasInteracted(true);
    if (!isFirst && state === "presenting") {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Quiz handlers
  const handleCorrect = () => {
    setHasInteracted(true);
    // Record result
    setQuizResults((prev) => [
      ...prev,
      { slideIndex: currentIndex, correct: true, attempts: currentAttempts + 1, reviewed: reviewedSlides.has(currentIndex) }
    ]);
    
    // Reset state for next slide
    setCurrentAttempts(0);
    setShowHint(false);
    
    // Auto-advance
    handleNext();
  };

  const handleWrong = () => {
    setHasInteracted(true);
    const newAttempts = currentAttempts + 1;
    setCurrentAttempts(newAttempts);

    if (state === "reviewing") {
      // Failed final retry after review. Still give partial reward
      setQuizResults((prev) => [
        ...prev,
        { slideIndex: currentIndex, correct: false, attempts: newAttempts, reviewed: reviewedSlides.has(currentIndex) }
      ]);
      handleNext();
    } else if (newAttempts >= MAX_QUIZ_ATTEMPTS) {
      // Failed 3 times. Go to review mode if there is a related slide
      if (slide.type === "quiz" && slide.relatedSlideIndex !== undefined) {
        setReviewedSlides((prev) => new Set(prev).add(currentIndex));
        setReviewTargetIndex(currentIndex);
        setCurrentIndex(slide.relatedSlideIndex);
        setState("reviewing");
      } else {
        // No review slide, just record as wrong and move on
        setQuizResults((prev) => [
          ...prev,
          { slideIndex: currentIndex, correct: false, attempts: newAttempts }
        ]);
        handleNext();
      }
    } else {
      // Show hint for next try
      setShowHint(true);
    }
  };

  const completeModule = () => {
    setState("completed");
    
    // Calculate final score
    const totalQuizzes = module.slides.filter(s => s.type === "quiz").length;
    const correctAnswers = quizResults.filter(r => r.correct).length;

    // Calculate stars (1-3), weighting a reteach-recovered pass as half credit
    let stars = 1; // Always at least 1 star (partial reward)
    if (totalQuizzes > 0) {
      const percentage = weightedScore(quizResults) / totalQuizzes;
      if (percentage >= 0.8) stars = 3;
      else if (percentage >= 0.5) stars = 2;
    } else {
      stars = 3; // No quizzes = perfect completion
    }

    onComplete({
      moduleId: module.id,
      totalQuizzes,
      correctAnswers,
      quizResults,
      stars,
      completed: true
    });
  };

  // Render Completion Screen
  if (state === "completed") {
    const totalQuizzes = module.slides.filter(s => s.type === "quiz").length;
    const correctAnswers = quizResults.filter(r => r.correct).length;

    let stars = 1;
    if (totalQuizzes > 0) {
      const percentage = weightedScore(quizResults) / totalQuizzes;
      if (percentage >= 0.8) stars = 3;
      else if (percentage >= 0.5) stars = 2;
    } else {
      stars = 3;
    }

    return (
      <div className="flex flex-col h-full min-h-0 w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
          {/* Header: celebration + mascot */}
          <div className="flex flex-col items-center mb-8 shrink-0">
            <h1 className="font-gohan text-5xl text-gema-navy mb-4">Selamat! 🎉</h1>
            <div className="relative w-56 h-56 drop-shadow-2xl animate-mascot-bob">
              <Image src={MASCOT_URLS.hello} alt="Mascot Happy" fill className="object-contain" />
            </div>
          </div>

          {/* Score card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-gema-mint text-center max-w-md w-full mb-8 shrink-0">
            <div className="flex justify-center gap-4 mb-4">
              {[1, 2, 3].map((star) => (
                <div key={star} className={`text-6xl transition-all duration-700 transform ${star <= stars ? 'scale-110' : 'scale-90 opacity-30 grayscale'}`}>
                  ⭐
                </div>
              ))}
            </div>

            {totalQuizzes > 0 && (
              <p className="font-gohan text-2xl text-gema-tosca mb-4">
                {correctAnswers} dari {totalQuizzes} jawaban benar
              </p>
            )}

            <div className="border-t-2 border-gray-100 pt-4">
              <p className="font-gilroy text-lg text-gray-600 mb-1">Kamu berhasil menyelesaikan</p>
              <p className="font-gohan text-2xl text-gema-navy">{module.title}</p>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={onBack}
            className="px-12 py-4 bg-gema-navy text-white font-gohan text-2xl font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all shrink-0"
          >
            Kembali ke Daftar Modul
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header / Progress Bar */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        {state === "reviewing" ? (
          <div className="w-full text-center bg-orange-100 text-orange-600 p-3 rounded-xl font-gohan text-xl">
            Mari kita ingat kembali materinya!
          </div>
        ) : (
          <ProgressBar current={currentIndex + 1} total={module.slides.length} />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10">
        {slide.type === "content" ? (
          <SlideContent
            key={`content-${currentIndex}`} // Force re-render for animation
            slide={slide}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={isFirst}
            isLast={isLast}
            hasInteracted={hasInteracted}
          />
        ) : (
          <SlideQuiz
            key={`quiz-${currentIndex}-${currentAttempts}`}
            slide={slide}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            showHint={showHint}
            hasInteracted={hasInteracted}
          />
        )}
      </div>
    </div>
  );
}
