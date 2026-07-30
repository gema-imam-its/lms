"use client";

import { useEffect, useRef, useState } from "react";
import { playAudioClip } from "./audioChannel";

export interface NarrationPlayback {
  /** 0-1 progress across the *whole* sequence (see playSequence below — not per-clip). */
  progress: number;
  /** True while a clip is actively playing. */
  isPlaying: boolean;
  /** Restarts the whole sequence from its first clip. */
  replay: () => void;
  /** False if there's nothing to play — callers can skip rendering any narration UI. */
  hasNarration: boolean;
}

function playSequence(
  clips: string[],
  onProgress: (ratio: number) => void,
  onPlayingChange: (playing: boolean) => void,
): () => void {
  let stopped = false;
  let stopCurrent: (() => void) | null = null;

  // Overall progress = (finished clips + progress through the current one) /
  // total clips — each clip counts as an equal share of the whole sequence.
  // Resetting to 0 at the start of every clip (the previous behavior) made a
  // read-along highlight sweep the *entire* displayed sentence once per
  // clip — for a 2-clip slide that's the same words highlighted twice in
  // quick succession, which reads as too fast / restarting mid-sentence.
  const playAt = (index: number) => {
    if (stopped || index >= clips.length) {
      onPlayingChange(false);
      return;
    }
    onPlayingChange(true);
    onProgress(index / clips.length);
    stopCurrent = playAudioClip(
      clips[index],
      () => {
        if (!stopped) playAt(index + 1);
      },
      (clipRatio) => onProgress((index + clipRatio) / clips.length),
    );
  };

  playAt(0);

  return () => {
    stopped = true;
    stopCurrent?.();
    onPlayingChange(false);
  };
}

/**
 * Plays a slide's narration (single clip or a sequence) and reports
 * playback progress, so a "read-along" word-highlight can move in sync with
 * the voice. The highlight is a bonus for students who can hear — the text
 * itself must always be fully visible regardless of this hook's state, so
 * deaf/hard-of-hearing students lose nothing (this hook only ever adds a
 * highlight on top of text a caller is already rendering in full).
 */
export function useNarrationPlayback(src?: string | string[]): NarrationPlayback {
  const clips = src ? (Array.isArray(src) ? src : [src]) : [];
  const clipsKey = clips.join("|");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const play = () => {
    stopRef.current?.();
    stopRef.current = playSequence(clips, setProgress, setIsPlaying);
  };

  useEffect(() => {
    if (clips.length === 0) return;
    play();
    return () => {
      stopRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipsKey]);

  return { progress, isPlaying, replay: play, hasNarration: clips.length > 0 };
}
