// Single shared audio channel for the whole app — narration and system
// feedback sounds both route through this, so starting any new clip always
// stops whatever was playing before it. Without this, a slide's narration
// can keep talking underneath a "Benar!" sound, or into the next slide's
// own narration, which is exactly the crashing/overlapping sound bug this
// fixes.
let current: HTMLAudioElement | null = null;

export function stopCurrentAudio() {
  if (current) {
    current.pause();
    current.currentTime = 0;
  }
  current = null;
}

/**
 * Plays one clip, stopping anything else first. Fires onEnded when it
 * finishes naturally (not when interrupted). Returns a "safe stop" — it
 * only stops audio if this clip is still the one actually playing, so a
 * caller that stops late (e.g. a slide's cleanup running after some other,
 * newer sound already took over) can't accidentally cut off that newer
 * sound.
 */
export function playAudioClip(src: string, onEnded?: () => void): () => void {
  stopCurrentAudio();
  const audio = new Audio(src);
  current = audio;
  audio.addEventListener(
    "ended",
    () => {
      if (current === audio) current = null;
      onEnded?.();
    },
    { once: true },
  );
  audio.play().catch(() => {
    // Autoplay blocked or file missing — caller has no fallback UI here by
    // design; NarrationPlayer's replay button is the recovery path.
  });
  return () => {
    if (current === audio) stopCurrentAudio();
  };
}
