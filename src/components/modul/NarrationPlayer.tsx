"use client";

import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import { playAudioClip } from "@/lib/audioChannel";

interface NarrationPlayerProps {
  src?: string | string[];
}

/** Plays clips back-to-back; returns a stop function for whichever clip is currently active. */
function playSequence(clips: string[]): () => void {
  let stopped = false;
  let stopCurrent: (() => void) | null = null;

  const playAt = (index: number) => {
    if (stopped || index >= clips.length) return;
    stopCurrent = playAudioClip(clips[index], () => {
      if (!stopped) playAt(index + 1);
    });
  };

  playAt(0);

  return () => {
    stopped = true;
    stopCurrent?.();
  };
}

/**
 * Optional recorded-voice narration for a slide. Purely supplementary —
 * the on-screen text is always the source of truth (deaf students must lose
 * nothing by not hearing this), so a missing file or playback failure is
 * swallowed silently and never blocks navigation. `src` can be a single clip
 * or an array played back-to-back as one sequence (e.g. a quiz narrated
 * across a few short recorded lines).
 *
 * Always attempts to autoplay on mount — the student always arrives here via
 * a real click (from the modul list, or from "Lanjut"), which is enough of a
 * gesture for browsers to allow it; if a browser blocks it anyway (e.g. a
 * fresh direct URL load with no prior interaction), it fails silently and
 * the replay button is the fallback. An earlier version gated this behind a
 * "has the user interacted yet" flag, but that flag became true on the exact
 * same click that advanced past slide 1, so slide 1's narration could never
 * play automatically — removed rather than patched.
 *
 * Routes through the shared audio channel (src/lib/audioChannel.ts) and
 * stops itself on unmount — the stop is ownership-safe, so if some other
 * sound (a different slide's narration, or a "Benar!" feedback chime)
 * already took over by the time cleanup runs, this won't cut that one off.
 */
export default function NarrationPlayer({ src }: NarrationPlayerProps) {
  const clips = src ? (Array.isArray(src) ? src : [src]) : [];
  const clipsKey = clips.join("|");
  const stopRef = useRef<(() => void) | null>(null);

  const play = () => {
    stopRef.current = playSequence(clips);
  };

  useEffect(() => {
    if (clips.length === 0) return;
    play();
    return () => {
      stopRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipsKey]);

  if (clips.length === 0) return null;

  return (
    <button
      type="button"
      onClick={play}
      aria-label="Dengarkan lagi"
      className="w-12 h-12 shrink-0 rounded-full bg-gema-sky/20 text-gema-navy flex items-center justify-center hover:bg-gema-sky/40 transition-colors active:scale-95"
    >
      <Volume2 size={22} />
    </button>
  );
}
