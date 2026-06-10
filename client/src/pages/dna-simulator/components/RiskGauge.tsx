import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number; // 0–100
  label: string;
  animate?: boolean;
}

function getColor(score: number): { stroke: string; text: string; bg: string; label: string } {
  if (score < 30) return { stroke: "#2E4E45", text: "text-brand-forest-700", bg: "bg-brand-forest-50", label: "منخفض" };
  if (score < 55) return { stroke: "#d97706", text: "text-amber-600", bg: "bg-amber-50", label: "متوسط" };
  if (score < 75) return { stroke: "#ea580c", text: "text-orange-600", bg: "bg-orange-50", label: "مرتفع" };
  return { stroke: "#dc2626", text: "text-red-600", bg: "bg-red-50", label: "مرتفع جداً" };
}

export default function RiskGauge({ score, label, animate = true }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const color = getColor(score);

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return; }
    let start = 0;
    const step = score / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(Math.round(start));
    }, 25);
    return () => clearInterval(timer);
  }, [score, animate]);

  // SVG arc gauge
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const circumference = Math.PI * radius; // half circle
  const progress = (displayScore / 100) * circumference;

  // Arc path: left to right, bottom half
  const startAngle = 180;
  const endAngle = 0;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(toRad(startAngle));
  const y1 = cy + radius * Math.sin(toRad(startAngle));
  const x2 = cx + radius * Math.cos(toRad(endAngle));
  const y2 = cy + radius * Math.sin(toRad(endAngle));

  // Needle angle
  const needleAngle = 180 + (displayScore / 100) * 180;
  const needleRad = toRad(needleAngle);
  const needleLen = 42;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="140" height="80" viewBox="0 0 140 80">
          {/* Background arc */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Colored arc segments */}
          {/* Low (0-30%) */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos(toRad(180 + 0.3 * 180))} ${cy + radius * Math.sin(toRad(180 + 0.3 * 180))}`}
            fill="none"
            stroke="#2E4E45"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.25"
          />
          {/* Medium (30-55%) */}
          <path
            d={`M ${cx + radius * Math.cos(toRad(180 + 0.3 * 180))} ${cy + radius * Math.sin(toRad(180 + 0.3 * 180))} A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos(toRad(180 + 0.55 * 180))} ${cy + radius * Math.sin(toRad(180 + 0.55 * 180))}`}
            fill="none"
            stroke="#d97706"
            strokeWidth="10"
            opacity="0.25"
          />
          {/* High (55-75%) */}
          <path
            d={`M ${cx + radius * Math.cos(toRad(180 + 0.55 * 180))} ${cy + radius * Math.sin(toRad(180 + 0.55 * 180))} A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos(toRad(180 + 0.75 * 180))} ${cy + radius * Math.sin(toRad(180 + 0.75 * 180))}`}
            fill="none"
            stroke="#ea580c"
            strokeWidth="10"
            opacity="0.25"
          />
          {/* Very High (75-100%) */}
          <path
            d={`M ${cx + radius * Math.cos(toRad(180 + 0.75 * 180))} ${cy + radius * Math.sin(toRad(180 + 0.75 * 180))} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.25"
          />
          {/* Progress arc */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos(toRad(180 + (displayScore / 100) * 180))} ${cy + radius * Math.sin(toRad(180 + (displayScore / 100) * 180))}`}
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            style={{ transition: "all 0.05s linear" }}
          />
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke={color.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transition: "all 0.05s linear" }}
          />
          <circle cx={cx} cy={cy} r="5" fill={color.stroke} />
          {/* Score text */}
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="18" fontWeight="900" fill={color.stroke}>
            {displayScore}%
          </text>
        </svg>
      </div>
      <div className={`mt-1 text-xs font-bold px-3 py-1 rounded-full ${color.bg} ${color.text}`}>
        {color.label}
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center max-w-[120px]">{label}</p>
    </div>
  );
}
