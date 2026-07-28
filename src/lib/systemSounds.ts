const SYSTEM_SOUNDS = {
  benar: "/audio/system/benar.ogg",
  belum: "/audio/system/belum.ogg",
  hampir: "/audio/system/hampir.ogg",
  ulang: "/audio/system/ulang.ogg",
  cobaLagi: "/audio/system/coba-lagi.ogg",
  berusaha: "/audio/system/berusaha.ogg",
  bintang: "/audio/system/bintang.ogg",
  selesai: "/audio/system/selesai.ogg",
} as const;

export type SystemSoundName = keyof typeof SYSTEM_SOUNDS;

/**
 * Fire-and-forget playback for event-triggered feedback (correct/wrong/
 * retry/complete) — separate from NarrationPlayer, which handles per-slide
 * narration tied to slide entry. Same accessibility contract as that
 * component: purely supplementary, so a blocked/missing file is silently
 * swallowed rather than surfaced.
 */
export function playSystemSound(name: SystemSoundName) {
  playSystemSounds([name]);
}

/** Plays several system sounds back-to-back (e.g. star reveal, then "selesai"). */
export function playSystemSounds(names: SystemSoundName[]) {
  const [first, ...rest] = names;
  if (!first) return;
  try {
    const audio = new Audio(SYSTEM_SOUNDS[first]);
    if (rest.length > 0) {
      audio.addEventListener("ended", () => playSystemSounds(rest), { once: true });
    }
    audio.play().catch(() => {});
  } catch {
    // Ignore — e.g. Audio() unavailable outside a real browser context.
  }
}
