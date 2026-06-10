/**
 * Brand Shapes — The Medical Avenue
 * Four symbolic elements from the brand identity:
 * Star · Sun · Swan · Lotus
 */

interface ShapeProps {
  className?: string;
  size?: number;
  color?: string;
}

/** ✦ Star — 4-point star, embodies doctors and medical expertise */
export function StarShape({ className = "", size = 48, color = "currentColor" }: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 3 C51.5 28 72 49 97 50 C72 51.5 51.5 72 50 97 C48.5 72 28 51.5 3 50 C28 48.5 48.5 28 50 3Z"
        fill={color}
      />
    </svg>
  );
}

/** ☀ Sun — half-risen sun with rays, radiates vitality */
export function SunShape({ className = "", size = 48, color = "currentColor" }: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Half circle body — bottom half */}
      <path
        d="M18 62 A32 32 0 0 1 82 62 Z"
        fill={color}
      />
      {/* Rays — top arc */}
      <line x1="50" y1="8"  x2="50" y2="20" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="72" y1="14" x2="66" y2="24" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="88" y1="30" x2="78" y2="36" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="28" y1="14" x2="34" y2="24" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="12" y1="30" x2="22" y2="36" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="94" y1="50" x2="82" y2="50" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="6"  y1="50" x2="18" y2="50" stroke={color} strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

/** 𝕊 Swan — elegant S-curve swan, symbolizes balance */
export function SwanShape({ className = "", size = 48, color = "currentColor" }: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Swan as elegant S shape — filled */}
      <path
        d="
          M50 8
          C62 8 72 16 72 28
          C72 38 64 44 56 48
          C68 52 76 62 76 74
          C76 88 64 94 52 90
          C40 86 34 76 36 66
          C38 58 44 54 50 52
          C42 48 28 42 28 28
          C28 16 38 8 50 8Z
        "
        fill={color}
      />
    </svg>
  );
}

/** 🪷 Lotus — multi-petal lotus, conveys beauty and renewal */
export function LotusShape({ className = "", size = 48, color = "currentColor" }: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Center tall petal */}
      <path
        d="M50 78 C46 64 42 50 42 38 C42 24 46 14 50 10 C54 14 58 24 58 38 C58 50 54 64 50 78Z"
        fill={color}
      />
      {/* Left inner petal */}
      <path
        d="M50 78 C44 66 34 56 24 52 C16 48 10 50 8 54 C12 60 22 66 34 70 C42 74 50 78 50 78Z"
        fill={color}
        opacity="0.9"
      />
      {/* Right inner petal */}
      <path
        d="M50 78 C56 66 66 56 76 52 C84 48 90 50 92 54 C88 60 78 66 66 70 C58 74 50 78 50 78Z"
        fill={color}
        opacity="0.9"
      />
      {/* Left outer petal */}
      <path
        d="M50 78 C42 70 28 64 16 64 C8 64 4 68 4 72 C8 76 18 78 30 76 C40 74 50 78 50 78Z"
        fill={color}
        opacity="0.65"
      />
      {/* Right outer petal */}
      <path
        d="M50 78 C58 70 72 64 84 64 C92 64 96 68 96 72 C92 76 82 78 70 76 C60 74 50 78 50 78Z"
        fill={color}
        opacity="0.65"
      />
      {/* Stem */}
      <path
        d="M48 78 C48 82 47 88 47 92 C47 95 48.5 97 50 97 C51.5 97 53 95 53 92 C53 88 52 82 52 78Z"
        fill={color}
        opacity="0.7"
      />
    </svg>
  );
}

/** Circular badge wrapper — matches the brand identity image style */
export function ShapeBadge({
  children,
  size = 64,
  className = "",
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand-forest-700 ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}
