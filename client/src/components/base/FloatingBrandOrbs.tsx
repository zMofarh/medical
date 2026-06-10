import { useEffect, useRef } from "react";
import { StarShape, LotusShape, SwanShape, SunShape } from "./BrandShapes";

interface Orb {
  id: number;
  x: number;       // % from left
  y: number;       // % from top
  size: number;    // px
  delay: number;   // animation delay s
  duration: number;// animation duration s
  shape: "star" | "lotus" | "swan" | "sun" | "circle";
  color: string;
  opacity: number;
  rotate: number;
  driftX: number;  // drift range px
  driftY: number;
}

const ORBS: Orb[] = [
  { id: 1,  x: 8,  y: 15, size: 56,  delay: 0,   duration: 9,  shape: "star",   color: "#C8A96E", opacity: 0.18, rotate: 0,   driftX: 12, driftY: 18 },
  { id: 2,  x: 88, y: 20, size: 90,  delay: 1.5, duration: 12, shape: "lotus",  color: "#2E4E45", opacity: 0.12, rotate: 15,  driftX: 8,  driftY: 22 },
  { id: 3,  x: 5,  y: 60, size: 40,  delay: 3,   duration: 8,  shape: "star",   color: "#D4C9B0", opacity: 0.22, rotate: 45,  driftX: 15, driftY: 12 },
  { id: 4,  x: 92, y: 55, size: 50,  delay: 0.8, duration: 11, shape: "swan",   color: "#C8A96E", opacity: 0.14, rotate: -10, driftX: 10, driftY: 20 },
  { id: 5,  x: 50, y: 5,  size: 30,  delay: 2,   duration: 7,  shape: "star",   color: "#E3DAC9", opacity: 0.25, rotate: 22,  driftX: 20, driftY: 10 },
  { id: 6,  x: 15, y: 80, size: 70,  delay: 4,   duration: 14, shape: "sun",    color: "#C8A96E", opacity: 0.10, rotate: 0,   driftX: 6,  driftY: 16 },
  { id: 7,  x: 75, y: 85, size: 35,  delay: 1,   duration: 9,  shape: "star",   color: "#D4C9B0", opacity: 0.20, rotate: 60,  driftX: 14, driftY: 8  },
  { id: 8,  x: 40, y: 90, size: 22,  delay: 5,   duration: 6,  shape: "circle", color: "#C8A96E", opacity: 0.30, rotate: 0,   driftX: 18, driftY: 14 },
  { id: 9,  x: 62, y: 30, size: 18,  delay: 2.5, duration: 8,  shape: "circle", color: "#2E4E45", opacity: 0.20, rotate: 0,   driftX: 10, driftY: 20 },
  { id: 10, x: 28, y: 45, size: 14,  delay: 0.5, duration: 7,  shape: "star",   color: "#E3DAC9", opacity: 0.28, rotate: 30,  driftX: 22, driftY: 10 },
];

function OrbShape({ orb }: { orb: Orb }) {
  const props = { size: orb.size, color: orb.color };
  if (orb.shape === "star")   return <StarShape {...props} />;
  if (orb.shape === "lotus")  return <LotusShape {...props} />;
  if (orb.shape === "swan")   return <SwanShape {...props} />;
  if (orb.shape === "sun")    return <SunShape {...props} />;
  return (
    <div
      style={{
        width: orb.size,
        height: orb.size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${orb.color}80, ${orb.color}20)`,
        border: `1px solid ${orb.color}40`,
      }}
    />
  );
}

interface FloatingBrandOrbsProps {
  className?: string;
  count?: number;
}

export default function FloatingBrandOrbs({ className = "", count }: FloatingBrandOrbsProps) {
  const visibleOrbs = count ? ORBS.slice(0, count) : ORBS;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {visibleOrbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            opacity: orb.opacity,
            transform: `rotate(${orb.rotate}deg)`,
            animation: `orb-float-${orb.id % 3} ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
          }}
        >
          <OrbShape orb={orb} />
        </div>
      ))}

      <style>{`
        @keyframes orb-float-0 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25%  { transform: translateY(-14px) translateX(8px) rotate(3deg); }
          50%  { transform: translateY(-8px) translateX(-6px) rotate(-2deg); }
          75%  { transform: translateY(-18px) translateX(4px) rotate(1deg); }
        }
        @keyframes orb-float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33%  { transform: translateY(-20px) translateX(-10px) rotate(-4deg); }
          66%  { transform: translateY(-10px) translateX(12px) rotate(2deg); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          40%  { transform: translateY(-12px) translateX(6px) rotate(5deg); }
          80%  { transform: translateY(-22px) translateX(-8px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
