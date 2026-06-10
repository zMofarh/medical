import { useEffect, useRef } from "react";

interface BrandAccentLineProps {
  className?: string;
  width?: number | string;
  height?: number;
  color1?: string;
  color2?: string;
  animated?: boolean;
  vertical?: boolean;
}

export default function BrandAccentLine({
  className = "",
  width = "100%",
  height = 2,
  color1 = "#2E4E45",
  color2 = "#C8A96E",
  animated = true,
  vertical = false,
}: BrandAccentLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;
    const el = lineRef.current;
    const inner = innerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transform = vertical ? "scaleY(1)" : "scaleX(1)";
          el.style.opacity = "1";
          // Start shimmer after line draws in
          if (inner) {
            setTimeout(() => {
              inner.style.opacity = "1";
            }, 900);
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated, vertical]);

  const containerStyle: React.CSSProperties = {
    width: vertical ? height : width,
    height: vertical ? width : height,
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    background: `linear-gradient(${vertical ? "to bottom" : "to left"}, ${color1}, ${color2}, ${color1})`,
    ...(animated
      ? {
          transform: vertical ? "scaleY(0)" : "scaleX(0)",
          transformOrigin: vertical ? "top" : "right",
          opacity: 0,
          transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
        }
      : {}),
  };

  const shimmerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    opacity: 0,
    transition: "opacity 0.3s ease",
    animation: "shimmer 3s linear infinite",
  };

  return (
    <div ref={lineRef} className={className} style={containerStyle} aria-hidden="true">
      {animated && <div ref={innerRef} style={shimmerStyle} />}
    </div>
  );
}
