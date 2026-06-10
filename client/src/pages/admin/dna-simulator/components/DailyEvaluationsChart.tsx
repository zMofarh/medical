interface DailyItem {
  date: string;
  count: number;
}

interface DailyEvaluationsChartProps {
  data: DailyItem[];
}

export default function DailyEvaluationsChart({ data }: DailyEvaluationsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center bg-teal-100 rounded-lg">
          <i className="ri-bar-chart-2-line text-teal-700 text-xs"></i>
        </div>
        التقييمات اليومية (آخر 7 أيام)
      </h3>

      <div className="flex items-end gap-3 h-40">
        {data.map((item) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-xs font-bold text-gray-700">{item.count}</div>
              <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: "120px" }}>
                <div
                  className="absolute bottom-0 w-full bg-brand-forest-600 rounded-t-lg transition-all duration-700"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500 text-center whitespace-nowrap">{item.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}