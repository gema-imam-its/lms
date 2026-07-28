interface HighlightedTextProps {
  text: string;
  progress: number;
  active: boolean;
  className?: string;
  highlightClassName?: string;
}

/**
 * Renders `text` always fully visible — the highlight is purely a "read-
 * along" bonus for students who can hear the narration, moving across the
 * words as `progress` (0-1) advances. Never hides or delays any text, so a
 * deaf/hard-of-hearing student sees the complete sentence immediately,
 * exactly as if this component didn't exist.
 */
export default function HighlightedText({
  text,
  progress,
  active,
  className,
  highlightClassName = "bg-gema-tosca/20 text-gema-tosca rounded px-0.5",
}: HighlightedTextProps) {
  const tokens = text.split(/(\s+)/);

  // Pure pass (no outer-variable mutation) assigning each word token its
  // 0-based word index; whitespace tokens carry -1 and are never highlighted.
  const items = tokens.reduce<{ token: string; wordIndex: number }[]>((acc, token) => {
    const isWord = token.trim().length > 0;
    const prevIndex = acc.length > 0 ? acc[acc.length - 1].wordIndex : -1;
    return [...acc, { token, wordIndex: isWord ? prevIndex + 1 : prevIndex }];
  }, []);

  const wordCount = items.length > 0 ? items[items.length - 1].wordIndex + 1 : 0;
  const activeIndex = active && wordCount > 0 ? Math.min(wordCount - 1, Math.floor(progress * wordCount)) : -1;

  return (
    <p className={className}>
      {items.map((item, i) => (
        <span
          key={i}
          className={item.wordIndex === activeIndex ? `transition-colors duration-150 ${highlightClassName}` : undefined}
        >
          {item.token}
        </span>
      ))}
    </p>
  );
}
