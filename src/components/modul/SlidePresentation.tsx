"use client";

import { useState } from "react";
import Image from "next/image";
import { ModuleDefinition, ModuleResult, QuizResult, MAX_QUIZ_ATTEMPTS, FINAL_RETRY_ATTEMPTS, MASCOT_URLS } from "@/types/module";
import ProgressBar from "./ProgressBar";
import SlideContent from "./SlideContent";
import SlideQuiz from "./SlideQuiz";

interface SlidePresentationProps {
  module: ModuleDefinition;
  onComplete: (result: ModuleResult) => void;
  onBack: () => void;
}

type PresentationState = "presenting" | "reviewing" | "completed";

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
  
  // Results
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const slide = module.slides[currentIndex];
  const isFirst = currentIndex === 0 && state === "presenting";
  const isLast = currentIndex === module.slides.length - 1 && state === "presenting";

  // Navigation handlers
  const handleNext = () => {
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
    if (!isFirst && state === "presenting") {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Quiz handlers
  const handleCorrect = () => {
    // Record result
    setQuizResults((prev) => [
      ...prev,
      { slideIndex: currentIndex, correct: true, attempts: currentAttempts + 1 }
    ]);
    
    // Reset state for next slide
    setCurrentAttempts(0);
    setShowHint(false);
    
    // Auto-advance
    handleNext();
  };

  const handleWrong = () => {
    const newAttempts = currentAttempts + 1;
    setCurrentAttempts(newAttempts);

    if (state === "reviewing") {
      // Failed final retry after review. Still give partial reward
      setQuizResults((prev) => [
        ...prev,
        { slideIndex: currentIndex, correct: false, attempts: newAttempts }
      ]);
      handleNext();
    } else if (newAttempts >= MAX_QUIZ_ATTEMPTS) {
      // Failed 3 times. Go to review mode if there is a related slide
      if (slide.type === "quiz" && slide.relatedSlideIndex !== undefined) {
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
    
    // Calculate stars (1-3)
    let stars = 1; // Always at least 1 star (partial reward)
    if (totalQuizzes > 0) {
      const percentage = correctAnswers / totalQuizzes;
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
      const percentage = correctAnswers / totalQuizzes;
      if (percentage >= 0.8) stars = 3;
      else if (percentage >= 0.5) stars = 2;
    } else {
      stars = 3;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-700">
        <h1 className="font-gohan text-5xl text-gema-navy mb-8">Selamat! 🎉</h1>
        
        <div className="relative w-64 h-64 mb-12 drop-shadow-2xl">
          <Image src={MASCOT_URLS.hello} alt="Mascot Happy" fill className="object-contain" />
        </div>

        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((star) => (
            <div key={star} className={`text-6xl transition-all duration-700 transform ${star <= stars ? 'scale-110' : 'scale-90 opacity-30 grayscale'}`}>
              ⭐
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-gema-mint text-center max-w-md w-full mb-8">
          <p className="font-gilroy text-2xl text-gray-600 mb-2">Kamu berhasil menyelesaikan</p>
          <p className="font-gohan text-3xl text-gema-tosca">{module.title}</p>
        </div>

        <button 
          onClick={onBack}
          className="px-12 py-4 bg-gema-navy text-white font-gohan text-2xl font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Kembali ke Daftar Modul
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[900px] w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      
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
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {slide.type === "content" ? (
          <SlideContent
            key={`content-${currentIndex}`} // Force re-render for animation
            slide={slide}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={isFirst}
            isLast={isLast}
          />
        ) : (
          <SlideQuiz
            key={`quiz-${currentIndex}-${currentAttempts}`}
            slide={slide}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            attempts={currentAttempts}
            showHint={showHint}
          />
        )}
      </div>
    </div>
  );
}
