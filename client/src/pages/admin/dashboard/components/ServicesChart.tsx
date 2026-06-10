interface ServicesChartProps {
  data: { service: string; count: number; color: string }[];
}

export default function ServicesChart({ data }: ServicesChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map((d) => d.count));

  // Donut chart
  let cumulative = 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const segments = data.map((d) => {
    const pct = d.count / total;
    const dash = pct * circumference;
    const offset = circumference - cumulative * circumference;
    cumulative += pct;
    return { ...d, dash, offset };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-800 text-base">الخدمات الأكثر طلباً</h3>
          <p className="text-xs text-gray-400 mt-0.5">هذا الشهر — {total} حجز</p>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#C8A96E]/10">
          <i className="ri-pie-chart-2-line text-[#C8A96E]" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-28 h-28 -rotate-90">
            <circle cx="40" cy="40" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-gray-800">{total}</p>
            <p className="text-[9px] text-gray-400">حجز</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.service} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-gray-600 flex-1 truncate">{d.service}</span>
              <span className="text-xs font-semibold text-gray-800">{d.count}</span>
              <span className="text-[10px] text-gray-400 w-8 text-left">{((d.count / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar list */}
      <div className="mt-5 space-y-2.5">
        {data.map((d) => (
          <div key={d.service}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{d.service}</span>
              <span className="text-xs font-medium text-gray-700">{d.count}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(d.count / max) * 100}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
