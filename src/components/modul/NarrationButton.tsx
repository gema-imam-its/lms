import { Volume2 } from "lucide-react";

/** Manual replay control for a slide's narration — paired with useNarrationPlayback. */
export default function NarrationButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dengarkan lagi"
      className="w-12 h-12 shrink-0 rounded-full bg-gema-sky/20 text-gema-navy flex items-center justify-center hover:bg-gema-sky/40 transition-colors active:scale-95"
    >
      <Volume2 size={22} />
    </button>
  );
}
