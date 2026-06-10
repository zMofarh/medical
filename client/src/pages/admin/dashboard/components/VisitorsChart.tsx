interface VisitorsChartProps {
  data: { day: string; visitors: number }[];
}

export default function VisitorsChart({ data }: VisitorsChartProps) {
  const max = Math.max(...data.map((d) => d.visitors));
  const total = data.reduce((s, d) => s + d.visitors, 0);
  const avg = Math.round(total / data.length);
  const todayIdx = data.length - 3; // Tuesday as "today"

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-base">زوار الموقع</h3>
          <p className="text-xs text-gray-400 mt-0.5">هذا الأسبوع</p>
        </div>
        <div className="text-left">
          <p className="text-lg font-bold text-gray-800">{total.toLocaleString("ar-SA")}</p>
          <p className="text-[10px] text-gray-400">إجمالي الزوار</p>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E4E45]" />
          <span className="text-xs text-gray-500">متوسط يومي: <strong className="text-gray-700">{avg}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C8A96E]" />
          <span className="text-xs text-gray-500">أعلى يوم: <strong className="text-gray-700">{max}</strong></span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => {
          const height = (d.visitors / max) * 100;
          const isToday = i === todayIdx;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-gray-500 font-medium">{d.visitors}</span>
              <div className="w-full relative" style={{ height: `${height}%` }}>
                <div
                  className={`w-full h-full rounded-t-lg transition-all duration-700 ${isToday ? "bg-[#C8A96E]" : "bg-[#2E4E45]/20 hover:bg-[#2E4E45]/40"}`}
                />
                {isToday && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* X labels */}
      <div className="flex gap-2 mt-2">
        {data.map((d, i) => (
          <div key={d.day} className="flex-1 text-center">
            <span className={`text-[9px] ${i === todayIdx ? "text-[#C8A96E] font-bold" : "text-gray-400"}`}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
