import { useEffect, useRef, useState, useCallback } from "react";

type CursorState = "default" | "hover" | "click" | "text";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);

  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Smooth ring follow with lerp
    ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
    ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;

    dot.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%)`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    const handleMouseDown = () => setCursorState("click");
    const handleMouseUp = () => setCursorState("default");

    // Detect hoverable elements
    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer")
      ) {
        setCursorState("hover");
      } else if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        setCursorState("text");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousemove", handleElementEnter, { passive: true });
    window.addEventListener("mouseenter", handleEnter);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousemove", handleElementEnter);
      window.removeEventListener("mouseenter", handleEnter);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, isVisible]);

  // Hide on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  const dotSize = cursorState === "click" ? 6 : cursorState === "hover" ? 8 : 8;
  const ringSize =
    cursorState === "hover" ? 44 : cursorState === "click" ? 28 : cursorState === "text" ? 4 : 36;
  const ringOpacity = cursorState === "text" ? 0 : 1;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-150"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor:
            cursorState === "hover"
              ? "#2E4E45"
              : cursorState === "click"
              ? "#C8A96E"
              : "#2E4E45",
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 transition-all duration-200"
        style={{
          width: ringSize,
          height: ringSize,
          borderColor:
            cursorState === "hover"
              ? "#C8A96E"
              : cursorState === "click"
              ? "#2E4E45"
              : "#2E4E45",
          opacity: isVisible ? ringOpacity * 0.6 : 0,
          willChange: "transform",
          backgroundColor: cursorState === "hover" ? "rgba(200,169,110,0.08)" : "transparent",
        }}
      />
    </>
  );
}
