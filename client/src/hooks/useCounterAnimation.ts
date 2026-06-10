import { useEffect, useRef, useState } from "react";

interface CounterOptions {
  duration?: number;
  delay?: number;
  easing?: "linear" | "easeOut" | "easeInOut";
}

function parseNumber(value: string): { num: number; prefix: string; suffix: string } {
  const cleaned = value.trim();
  const prefixMatch = cleaned.match(/^([^0-9]*)/);
  const suffixMatch = cleaned.match(/([^0-9.]*)$/);
  const numMatch = cleaned.match(/([0-9]+(?:\.[0-9]+)?)/);

  const prefix = prefixMatch ? prefixMatch[1] : "";
  const suffix = suffixMatch && suffixMatch[1] !== cleaned ? suffixMatch[1] : "";
  const num = numMatch ? parseFloat(numMatch[1]) : 0;

  return { num, prefix, suffix };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useCounterAnimation(
  targetValue: string,
  isVisible: boolean,
  options: CounterOptions = {}
): string {
  const { duration = 2000, delay = 0, easing = "easeOut" } = options;
  const [displayValue, setDisplayValue] = useState("0");
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    const { num, prefix, suffix } = parseNumber(targetValue);

    if (num === 0) {
      setDisplayValue(targetValue);
      return;
    }

    const isDecimal = targetValue.includes(".");
    const decimalPlaces = isDecimal ? (targetValue.split(".")[1]?.length ?? 1) : 0;

    const startAnimation = () => {
      hasAnimated.current = true;
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        let easedProgress: number;
        if (easing === "easeOut") easedProgress = easeOutCubic(progress);
        else if (easing === "easeInOut") easedProgress = easeInOutCubic(progress);
        else easedProgress = progress;

        const current = easedProgress * num;
        const formatted = isDecimal
          ? current.toFixed(decimalPlaces)
          : Math.floor(current).toString();

        setDisplayValue(`${prefix}${formatted}${suffix}`);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, targetValue, duration, delay, easing]);

  return displayValue;
}

export function useGroupCounterAnimation(
  isVisible: boolean,
  staggerDelay = 150
): boolean[] {
  const [triggered, setTriggered] = useState<boolean[]>([]);

  useEffect(() => {
    if (!isVisible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const results: boolean[] = [];

    for (let i = 0; i < 10; i++) {
      results.push(false);
      const timer = setTimeout(() => {
        setTriggered((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * staggerDelay);
      timers.push(timer);
    }

    setTriggered(results);
    return () => timers.forEach(clearTimeout);
  }, [isVisible, staggerDelay]);

  return triggered;
}
