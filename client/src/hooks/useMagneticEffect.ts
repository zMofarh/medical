import { useRef, useCallback } from "react";

interface MagneticOptions {
  strength?: number;
  radius?: number;
}

export function useMagneticEffect<T extends HTMLElement = HTMLButtonElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.35, radius = 80 } = options;
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < radius) {
        const moveX = distX * strength;
        const moveY = distY * strength;
        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        el.style.transition = "transform 0.15s ease";
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
