import { useEffect, useRef } from "react";

interface MouseFollowerProps {
  color?: string;
  size?: number;
  opacity?: number;
}

export default function MouseFollower({
  color = "46,78,69",
  size = 600,
  opacity = 0.06,
}: MouseFollowerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -1000, y: -1000 });
  const currentRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * 0.08;

      if (el) {
        el.style.transform = `translate3d(${currentRef.current.x - size / 2}px, ${currentRef.current.y - size / 2}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-0"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, transparent 70%)`,
        willChange: "transform",
        top: 0,
        left: 0,
        transition: "none",
      }}
    />
  );
}
