import { useEffect, useRef, ReactNode } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // negative = moves up faster, positive = moves down slower
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = -0.3,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const scrolled = window.scrollY;
      const parentTop = rect.top + scrolled;
      const relativeScroll = scrolled - parentTop + window.innerHeight;
      const translateY = relativeScroll * speed;

      el.style.transform = `translateY(${translateY}px)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
