"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  // Prevent division by zero
  const safeTotal = Math.max(1, total);
  const percentage = Math.min(100, Math.max(0, (current / safeTotal) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      <div className="flex justify-between items-end px-2">
        <span className="font-gohan text-gema-tosca font-bold text-xl">
          Progress Belajar
        </span>
        <span className="font-gohan text-gema-navy font-bold text-2xl bg-white px-4 py-1 rounded-full shadow-sm">
          {current} <span className="text-gray-400">/ {safeTotal}</span>
        </span>
      </div>

      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner border-2 border-gray-100 p-1">
        <div
          className="h-full bg-gema-tosca rounded-full transition-all duration-700 ease-out flex items-center justify-end px-2"
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect for the progress bar */}
          <div className="w-4 h-full bg-white/30 rounded-full -skew-x-12 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
