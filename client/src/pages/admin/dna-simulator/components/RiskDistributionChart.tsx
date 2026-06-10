interface RiskItem {
  level: string;
  count: number;
  color: string;
  percentage: number;
}

interface RiskDistributionChartProps {
  data: RiskItem[];
}

export default function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center bg-brand-forest-100 rounded-lg">
          <i className="ri-pie-chart-line text-brand-forest-700 text-xs"></i>
        </div>
        توزيع مستويات المخاطر
      </h3>

      {/* Horizontal bars */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.level}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">{item.level}</span>
              <span className="text-xs font-bold text-gray-900">
                {item.count} <span className="text-gray-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">الإجمالي</span>
        <span className="text-sm font-bold text-gray-900">{total} تقييم</span>
      </div>
    </div>
  );
}