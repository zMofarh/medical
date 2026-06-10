import { useTypewriter, useTypewriterOnce } from "@/hooks/useTypewriter";

interface TypewriterTextProps {
  /** Multiple words to cycle through */
  words?: string[];
  /** Single static text typed once */
  text?: string;
  /** CSS class for the cursor character */
  cursorClassName?: string;
  /** Cursor character */
  cursorChar?: string;
  /** Wrapper className */
  className?: string;
  /** Type speed ms/char */
  typeSpeed?: number;
  /** Delete speed ms/char */
  deleteSpeed?: number;
  /** Pause after full word (ms) */
  pauseAfter?: number;
  /** Start delay (ms) */
  startDelay?: number;
  /** Loop */
  loop?: boolean;
  /** Type once, no delete */
  once?: boolean;
}

export function TypewriterText({
  words,
  text,
  cursorClassName = "",
  cursorChar = "|",
  className = "",
  typeSpeed = 65,
  deleteSpeed = 38,
  pauseAfter = 2400,
  startDelay = 500,
  loop = true,
  once = false,
}: TypewriterTextProps) {
  const isOnce = once || !!text;
  const wordList = text ? [text] : words ?? [];

  const { text: displayed, cursorVisible } = isOnce
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useTypewriterOnce(wordList[0] ?? "", { typeSpeed, startDelay })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useTypewriter(wordList, { typeSpeed, deleteSpeed, pauseAfter, startDelay, loop });

  return (
    <span className={className}>
      {displayed}
      <span
        className={`inline-block transition-opacity duration-100 ${
          cursorVisible ? "opacity-100" : "opacity-0"
        } ${cursorClassName}`}
        aria-hidden="true"
      >
        {cursorChar}
      </span>
    </span>
  );
}

export default TypewriterText;
