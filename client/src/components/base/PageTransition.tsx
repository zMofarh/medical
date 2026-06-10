import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [fading, setFading] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const prevPath = useRef(location.pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    // Clear any pending timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: "instant" });

    // Show progress bar
    setBarVisible(true);

    // Brief fade flash
    setFading(true);
    timeoutRef.current = setTimeout(() => {
      setFading(false);
      timeoutRef.current = setTimeout(() => {
        setBarVisible(false);
      }, 400);
    }, 150);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Page content — always rendered, just fades briefly */}
      <div
        style={{
          opacity: fading ? 0.6 : 1,
          transition: fading
            ? "opacity 0.15s ease"
            : "opacity 0.25s ease",
        }}
      >
        {children}
      </div>

      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[9995] h-0.5 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #2E4E45, #C8A96E)",
          transformOrigin: "left",
          transform: barVisible ? "scaleX(1)" : "scaleX(0)",
          transition: barVisible
            ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
            : "transform 0.3s ease, opacity 0.3s ease",
          opacity: barVisible ? 1 : 0,
        }}
      />
    </>
  );
}
