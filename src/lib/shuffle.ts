// Fisher-Yates shuffle. Callers must seed this in a useState lazy initializer
// (`useState(() => shuffle(items))`) or another one-time init, never inline in
// a render body — the as-built version called Math.random() directly during
// render, which is a React-Compiler purity violation this rewrite must not
// repeat (docs/spec/pm-review-lessons.md §7).
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
