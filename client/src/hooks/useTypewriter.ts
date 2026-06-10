import { useEffect, useRef, useState } from "react";

interface TypewriterOptions {
  /** Delay before typing starts (ms) */
  startDelay?: number;
  /** Speed per character (ms) */
  typeSpeed?: number;
  /** Speed per character when deleting (ms) */
  deleteSpeed?: number;
  /** Pause after finishing a word before deleting (ms) */
  pauseAfter?: number;
  /** Pause after deleting before typing next word (ms) */
  pauseBefore?: number;
  /** Loop through words indefinitely */
  loop?: boolean;
  /** Show blinking cursor */
  cursor?: boolean;
  /** Stop after typing the first word (no delete/loop) */
  once?: boolean;
}

interface TypewriterResult {
  text: string;
  isTyping: boolean;
  isDeleting: boolean;
  isDone: boolean;
  cursorVisible: boolean;
}

export function useTypewriter(
  words: string[],
  options: TypewriterOptions = {}
): TypewriterResult {
  const {
    startDelay = 400,
    typeSpeed = 60,
    deleteSpeed = 35,
    pauseAfter = 2200,
    pauseBefore = 400,
    loop = true,
    cursor = true,
    once = false,
  } = options;

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cursor blink
  useEffect(() => {
    if (!cursor) return;
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, [cursor]);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const tick = () => {
      const currentWord = words[wordIndexRef.current];
      const currentChar = charIndexRef.current;

      if (!isDeleting) {
        // Typing forward
        setText(currentWord.slice(0, currentChar + 1));
        charIndexRef.current += 1;

        if (charIndexRef.current > currentWord.length) {
          // Finished typing this word
          charIndexRef.current = currentWord.length;

          if (once || (wordIndexRef.current === words.length - 1 && !loop)) {
            setIsTyping(false);
            setIsDone(true);
            return;
          }

          setIsTyping(false);
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseAfter);
          return;
        }

        setIsTyping(true);
        timeoutRef.current = setTimeout(tick, typeSpeed);
      } else {
        // Deleting
        setText(currentWord.slice(0, charIndexRef.current - 1));
        charIndexRef.current -= 1;

        if (charIndexRef.current <= 0) {
          charIndexRef.current = 0;
          setIsDeleting(false);

          wordIndexRef.current = (wordIndexRef.current + 1) % words.length;

          timeoutRef.current = setTimeout(() => {
            setIsTyping(true);
            tick();
          }, pauseBefore);
          return;
        }

        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    };

    // Initial start delay
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
      tick();
    }, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { text, isTyping, isDeleting, isDone, cursorVisible };
}

/** Simple single-word typewriter — types once, no delete */
export function useTypewriterOnce(
  text: string,
  options: Pick<TypewriterOptions, "startDelay" | "typeSpeed" | "cursor"> = {}
): TypewriterResult {
  return useTypewriter([text], { ...options, once: true, loop: false });
}
