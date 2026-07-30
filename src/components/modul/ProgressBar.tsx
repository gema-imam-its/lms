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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-1">
      <div className="flex justify-between items-center px-1">
        <span className="font-gohan text-gema-tosca font-bold text-sm">
          Progress Belajar
        </span>
        <span className="font-gohan text-gema-navy font-bold text-sm bg-white px-2.5 py-0.5 rounded-full shadow-sm">
          {current} <span className="text-gray-400">/ {safeTotal}</span>
        </span>
      </div>

      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-100">
        <div
          className="h-full bg-gema-tosca rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
