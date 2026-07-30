const SOUND_EFFECTS = {
  click: "/audio/sfx/click.mp3",
  whoosh: "/audio/sfx/whoosh.mp3",
  celebrate: "/audio/sfx/celebrate.mp3",
} as const;

export type SoundEffectName = keyof typeof SOUND_EFFECTS;

/**
 * Short, non-verbal UI sound effects (button taps, slide transitions).
 * Deliberately independent from the narration/system-sound audio channel
 * (src/lib/audioChannel.ts) — a brief click or whoosh playing under ongoing
 * speech is normal, expected UI feedback (like any app's tap sounds), unlike
 * two spoken lines overlapping, which is genuinely confusing. This never
 * stops, and is never stopped by, voice playback.
 */
export function playSoundEffect(name: SoundEffectName, onEnded?: () => void) {
  try {
    const audio = new Audio(SOUND_EFFECTS[name]);
    if (onEnded) audio.addEventListener("ended", onEnded, { once: true });
    audio.play().catch(() => {
      // Blocked or missing — fire onEnded anyway so a caller waiting on
      // this (e.g. a celebration modal waiting to dismiss) doesn't hang.
      onEnded?.();
    });
  } catch {
    // Ignore — e.g. Audio() unavailable outside a real browser context.
    onEnded?.();
  }
}
