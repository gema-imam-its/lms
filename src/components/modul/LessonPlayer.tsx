"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lesson, Slide } from "@/types/lesson";
import { MAX_QUIZ_ATTEMPTS } from "@/types/lesson";
import { SlideFrame } from "./SlideFrame";
import { ContentSlideView } from "./ContentSlideView";
import { ImageChoiceQuiz } from "./quiz/ImageChoiceQuiz";
import { Mascot } from "./Mascot";
import {
  lessonStorage,
  LOCAL_STUDENT_ID,
  type QuizResult,
} from "@/lib/lesson-storage";

type Phase = "presenting" | "reviewing" | "completed";

interface LessonPlayerProps {
  lesson: Lesson;
}

// Locked scoring (docs/spec/pm-review-lessons.md §2/§8): solved on any
// attempt = 1.0, never solved (failed the post-re-teach final retry, or no
// re-teach slide exists) = 0.5 effort credit, never zero. No quizzes at all
// (shouldn't happen, but matches the as-built behavior) = auto 3 stars.
function computeStars(results: QuizResult[], totalQuizzes: number): number {
  if (totalQuizzes === 0) return 3;
  const weight = results.reduce(
    (sum, r) => sum + (r.correct ? 1 : r.partialCredit ? 0.5 : 0),
    0,
  );
  const percentage = weight / totalQuizzes;
  if (percentage >= 0.8) return 3;
  if (percentage >= 0.5) return 2;
  return 1;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("presenting");
  const [attempts, setAttempts] = useState(0);
  const [reviewReturnIndex, setReviewReturnIndex] = useState<number | null>(
    null,
  );
  const [results, setResults] = useState<QuizResult[]>([]);

  const slide: Slide = lesson.slides[currentIndex];
  const totalQuizzes = lesson.slides.filter((s) => s.type !== "content").length;

  function finishLesson(finalResults: QuizResult[]) {
    setPhase("completed");
    const stars = computeStars(finalResults, totalQuizzes);
    void lessonStorage.saveResult(LOCAL_STUDENT_ID, {
      lessonId: lesson.id,
      completed: true,
      stars,
      quizResults: finalResults,
    });
  }

  // Advances past the current slide, or finishes the lesson if it's the
  // last one. Takes the results array explicitly rather than reading the
  // `results` state, because a caller that just added a result via
  // setResults() can't rely on that update having applied yet in the same
  // handler — reading stale `results` here would silently drop the score
  // for whichever quiz happens to be the lesson's last slide.
  function goToNextSlide(updatedResults: QuizResult[] = results) {
    setPhase("presenting");
    setAttempts(0);
    if (currentIndex >= lesson.slides.length - 1) {
      finishLesson(updatedResults);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleContentNext() {
    if (phase === "reviewing" && reviewReturnIndex !== null) {
      const target = reviewReturnIndex;
      setReviewReturnIndex(null);
      setCurrentIndex(target);
      return; // stay in "reviewing" so the quiz knows this is the final retry
    }
    goToNextSlide();
  }

  function handleBack() {
    if (currentIndex === 0 || phase === "reviewing") return;
    setCurrentIndex((i) => i - 1);
    setAttempts(0);
  }

  function recordAndAdvance(slideId: string, correct: boolean, partialCredit: boolean) {
    const nextResults = [...results, { slideId, correct, partialCredit }];
    setResults(nextResults);
    goToNextSlide(nextResults);
  }

  // 3 wrong attempts -> jump to the quiz's related content slide to re-teach,
  // then exactly one final retry -> always continue afterward (pass or fail),
  // a failed final retry still earns partial (effort) credit, never zero.
  function handleQuizResult(
    quizSlide: Extract<Slide, { relatedSlideId?: string }>,
    correct: boolean,
  ) {
    if (phase === "reviewing") {
      recordAndAdvance(quizSlide.id, correct, !correct);
      return;
    }

    if (correct) {
      recordAndAdvance(quizSlide.id, true, false);
      return;
    }

    const newAttempts = attempts + 1;
    if (newAttempts >= MAX_QUIZ_ATTEMPTS) {
      const targetIndex = quizSlide.relatedSlideId
        ? lesson.slides.findIndex((s) => s.id === quizSlide.relatedSlideId)
        : -1;
      if (targetIndex !== -1) {
        setReviewReturnIndex(currentIndex);
        setCurrentIndex(targetIndex);
        setPhase("reviewing");
        setAttempts(0);
      } else {
        // No re-teach slide configured — still never truly zero (no dead-ends).
        recordAndAdvance(quizSlide.id, false, true);
      }
      return;
    }

    setAttempts(newAttempts);
  }

  if (phase === "completed") {
    const stars = computeStars(results, totalQuizzes);
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <Mascot state="rayakan" size={120} />
        <p className="font-gohan text-2xl text-gema-navy">Selesai!</p>
        <div
          className="flex gap-2 text-4xl"
          aria-label={`${stars} dari 3 bintang`}
        >
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? "" : "opacity-20 grayscale"}>
              ⭐
            </span>
          ))}
        </div>
        <Link
          href="/modul"
          className="mt-4 flex min-h-12 items-center rounded-full bg-gema-tosca px-8 font-gohan font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
        >
          Kembali ke Modul
        </Link>
      </div>
    );
  }

  return (
    <SlideFrame
      current={currentIndex}
      total={lesson.slides.length}
      onBack={
        currentIndex > 0 && phase !== "reviewing" ? handleBack : undefined
      }
      primaryAction={
        slide.type !== "image-choice"
          ? { label: "Lanjut", onClick: handleContentNext }
          : undefined
      }
    >
      {slide.type === "content" && <ContentSlideView slide={slide} />}
      {slide.type === "image-choice" && (
        <ImageChoiceQuiz
          key={`${slide.id}-${attempts}-${phase}`}
          slide={slide}
          onResult={(correct) => handleQuizResult(slide, correct)}
        />
      )}
      {slide.type !== "content" && slide.type !== "image-choice" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-gilroy text-gema-navy/70">
            Tipe soal ini akan segera hadir.
          </p>
        </div>
      )}
    </SlideFrame>
  );
}
