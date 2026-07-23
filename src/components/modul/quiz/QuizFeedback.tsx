"use client";

// Shared feedback modal for every quiz type — non-punitive palette (green
// correct / amber "not yet", never red) per docs/spec/lessons.md §4.3. The
// hint lives inside this modal, not a banner that can scroll out of view.
interface QuizFeedbackProps {
  correct: boolean;
  hint?: string;
  onContinue: () => void;
}

export function QuizFeedback({ correct, hint, onContinue }: QuizFeedbackProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 sm:items-center"
      role="alertdialog"
      aria-live="assertive"
    >
      <div
        className={`w-full max-w-md rounded-t-3xl border-t-8 bg-white p-6 sm:rounded-3xl sm:border-8 ${
          correct ? "border-feedback-correct" : "border-feedback-retry"
        }`}
      >
        <p className="font-gohan text-2xl text-gema-navy">
          {correct ? "Benar Sekali!" : "Belum Tepat"}
        </p>

        {!correct && hint && (
          <p className="mt-2 font-gilroy text-gema-navy/70">{hint}</p>
        )}

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 min-h-12 w-full rounded-full bg-gema-tosca font-gohan font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
        >
          {correct ? "Lanjut" : "Coba Lagi"}
        </button>
      </div>
    </div>
  );
}
