import { useEffect, useRef, useMemo } from "react";

interface DNAHelixProps {
  className?: string;
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  rungs?: number;
  speed?: number;
  opacity?: number;
}

let helixCounter = 0;

export default function DNAHelix({
  className = "",
  width = 80,
  height = 400,
  color1 = "#C8A96E",
  color2 = "#2E4E45",
  rungs = 14,
  speed = 1,
  opacity = 0.7,
}: DNAHelixProps) {
  // Unique ID per instance to avoid SVG filter/gradient conflicts
  const uid = useMemo(() => {
    helixCounter += 1;
    return `dna-${helixCounter}`;
  }, []);

  const cx = width / 2;
  const amplitude = width * 0.38;
  const rungSpacing = height / (rungs + 1);

  const strandA: { x: number; y: number }[] = [];
  const strandB: { x: number; y: number }[] = [];
  const points = 80;

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const y = t * height;
    const angle = t * Math.PI * 4;
    strandA.push({ x: cx + Math.sin(angle) * amplitude, y });
    strandB.push({ x: cx - Math.sin(angle) * amplitude, y });
  }

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  const rungElements = Array.from({ length: rungs }, (_, i) => {
    const t = (i + 1) / (rungs + 1);
    const y = t * height;
    const angle = t * Math.PI * 4;
    const x1 = cx + Math.sin(angle) * amplitude;
    const x2 = cx - Math.sin(angle) * amplitude;
    const depth = Math.cos(angle);
    const rungOpacity = 0.3 + Math.abs(depth) * 0.5;
    const rungColor = depth > 0 ? color1 : color2;
    return { x1, x2, y, rungOpacity, rungColor, depth };
  });

  const duration = (8 / speed).toFixed(1);

  const filterId = `${uid}-glow`;
  const gradAId = `${uid}-grad-a`;
  const gradBId = `${uid}-grad-b`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={gradAId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="0.2" />
          <stop offset="40%" stopColor={color1} stopOpacity="0.9" />
          <stop offset="60%" stopColor={color1} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color1} stopOpacity="0.2" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 -1; 0 1; 0 -1"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        </linearGradient>
        <linearGradient id={gradBId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color2} stopOpacity="0.2" />
          <stop offset="40%" stopColor={color2} stopOpacity="0.9" />
          <stop offset="60%" stopColor={color2} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.2" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 1; 0 -1; 0 1"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>

      <path
        d={toPath(strandA)}
        fill="none"
        stroke={`url(#${gradAId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter={`url(#${filterId})`}
      />

      <path
        d={toPath(strandB)}
        fill="none"
        stroke={`url(#${gradBId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter={`url(#${filterId})`}
      />

      {rungElements.map((r, i) => (
        <g key={i}>
          <line
            x1={r.x1}
            y1={r.y}
            x2={r.x2}
            y2={r.y}
            stroke={r.rungColor}
            strokeWidth={r.depth > 0 ? "2" : "1.2"}
            strokeOpacity={r.rungOpacity}
            strokeLinecap="round"
          />
          <circle cx={r.x1} cy={r.y} r="2.5" fill={color1} opacity={r.rungOpacity * 0.9} />
          <circle cx={r.x2} cy={r.y} r="2.5" fill={color2} opacity={r.rungOpacity * 0.9} />
        </g>
      ))}

      <circle r="4" fill={color1} opacity="0.9" filter={`url(#${filterId})`}>
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          path={toPath(strandA)}
        />
      </circle>

      <circle r="4" fill={color2} opacity="0.9" filter={`url(#${filterId})`}>
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={`${parseFloat(duration) / 2}s`}
          path={toPath(strandB)}
        />
      </circle>
    </svg>
  );
}
