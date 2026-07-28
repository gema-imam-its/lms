"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

interface NarrationPlayerProps {
  src?: string | string[];
  hasInteracted: boolean;
}

/**
 * Optional recorded-voice narration for a slide. Purely supplementary —
 * the on-screen text is always the source of truth (deaf students must lose
 * nothing by not hearing this), so a missing file or playback failure is
 * swallowed silently and never blocks navigation. `src` can be a single clip
 * or an array played back-to-back as one sequence (e.g. a quiz narrated
 * across a few short recorded lines).
 */
export default function NarrationPlayer({ src, hasInteracted }: NarrationPlayerProps) {
  const clips = src ? (Array.isArray(src) ? src : [src]) : [];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [clipIndex, setClipIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!hasInteracted || !audio || clips.length === 0) return;
    audio.load();
    audio.play().catch(() => {
      // Autoplay blocked or file missing — the replay button still works.
    });
    // Re-runs when the auto-play gesture happens and each time the sequence
    // advances to its next clip — not on unrelated re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInteracted, clipIndex]);

  if (clips.length === 0) return null;

  const handleEnded = () => {
    if (clipIndex < clips.length - 1) {
      setClipIndex((i) => i + 1);
    }
  };

  const handleReplay = () => {
    if (clipIndex === 0) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      setClipIndex(0);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={clips[clipIndex]}
        preload="none"
        onEnded={handleEnded}
        onError={() => {}}
      />
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
