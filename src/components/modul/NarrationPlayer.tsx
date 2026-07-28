"use client";

import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";

interface NarrationPlayerProps {
  src?: string;
  hasInteracted: boolean;
}

/**
 * Optional recorded-voice narration for a slide. Purely supplementary —
 * the on-screen text is always the source of truth (deaf students must lose
 * nothing by not hearing this), so a missing file or playback failure is
 * swallowed silently and never blocks navigation.
 */
export default function NarrationPlayer({ src, hasInteracted }: NarrationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (hasInteracted && src) {
      audioRef.current?.play().catch(() => {
        // Autoplay blocked or file missing — the replay button still works.
      });
    }
  }, [src, hasInteracted]);

  if (!src) return null;

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <div>
      <audio ref={audioRef} src={src} preload="none" onError={() => {}} />
      <button
        type="button"
        onClick={handleReplay}
        aria-label="Dengarkan lagi"
        className="w-12 h-12 shrink-0 rounded-full bg-gema-sky/20 text-gema-navy flex items-center justify-center hover:bg-gema-sky/40 transition-colors active:scale-95"
      >
        <Volume2 size={22} />
      </button>
    </div>
  );
}
