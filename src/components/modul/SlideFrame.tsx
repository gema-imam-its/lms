import { ArrowLeft } from "lucide-react";

// Canonical slide layout: fixed regions (progress, content, single primary
// action + de-emphasized back) so every slide type looks predictable, per
// docs/spec/lessons.md §4.5 ("predictable, consistent layout") and the PM
// review's flagged gap (no layout template, no primary-action hierarchy rule).
interface SlideFrameProps {
  current: number;
  total: number;
  onBack?: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  children: React.ReactNode;
}

export function SlideFrame({
  current,
  total,
  onBack,
  primaryAction,
  children,
}: SlideFrameProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div
        className="flex gap-1.5 px-6 pt-6"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i <= current ? "bg-gema-tosca" : "bg-gema-navy/10"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
        {children}
      </div>

      <div className="flex items-center justify-between gap-4 px-6 pb-8">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Kembali ke slide sebelumnya"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-full border-2 border-gema-navy/15 text-gema-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca disabled:opacity-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className="min-h-12 flex-1 max-w-xs rounded-full bg-gema-tosca px-8 font-gohan font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca disabled:opacity-40"
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
