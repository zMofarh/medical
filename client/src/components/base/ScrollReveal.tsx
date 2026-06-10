import React, { useEffect, useRef, ReactNode, CSSProperties } from "react";

type RevealVariant = "up" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const variantClass: Record<RevealVariant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
  fade: "reveal",
};

export default function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  duration = 650,
  threshold = 0.12,
  className = "",
  style = {},
  once = true,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDelay = `${delay}ms`;
    el.style.transitionDuration = `${duration}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("visible");
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, threshold, once]);

  const AnyTag = Tag as React.ElementType;

  return (
    <AnyTag
      ref={ref}
      className={`${variantClass[variant]} ${className}`}
      style={style}
    >
      {children}
    </AnyTag>
  );
}
