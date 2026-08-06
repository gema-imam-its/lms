"use client";

import { MascotVariant } from "@/types/module";
import { useNarrationPlayback } from "@/lib/useNarrationPlayback";
import HighlightedText from "./HighlightedText";
import NarrationButton from "./NarrationButton";
import InteractiveMascot from "@/components/siswa/InteractiveMascot";

interface MascotBubbleProps {
  mascot: MascotVariant;
  message?: string;
  size?: "sm" | "md" | "lg";
  narrationUrl?: string | string[];
}

export default function MascotBubble({
  mascot,
  message,
  size = "md",
  narrationUrl,
}: MascotBubbleProps) {
  const { progress, isPlaying, replay, hasNarration } = useNarrationPlayback(narrationUrl);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56",
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      {/* Mascot — entrance pop-in, idle bob, and click-to-react via Framer Motion */}
      <InteractiveMascot pose={mascot} className={`shrink-0 drop-shadow-lg ${sizeClasses[size]}`} />

      {/* Speech Bubble */}
      {message && (
        <div className="relative bg-white border-4 border-gema-mint rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl w-full flex items-start gap-3">
          {/* Arrow/Tail pointing to mascot */}
          <div className="absolute -top-4 left-12 md:top-1/2 md:-left-4 md:-translate-y-1/2 w-8 h-8 bg-white border-l-4 border-t-4 md:border-t-0 md:border-b-4 border-gema-mint rotate-45 transform origin-center"></div>

          <HighlightedText
            text={message}
            progress={progress}
            active={isPlaying}
            className="font-gilroy text-xl md:text-3xl text-gema-navy font-semibold leading-relaxed relative z-10 flex-1"
          />

          {hasNarration && <NarrationButton onClick={replay} />}
        </div>
      )}
    </div>
  );
}
