interface PackageItem {
  package: string;
  count: number;
  percentage: number;
}

interface PackageRecommendationsChartProps {
  data: PackageItem[];
}

export default function PackageRecommendationsChart({ data }: PackageRecommendationsChartProps) {
  const colors = ["#2E4E45", "#d97706", "#ea580c", "#dc2626", "#7c3aed", "#0891b2"];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center bg-amber-100 rounded-lg">
          <i className="ri-award-line text-amber-700 text-xs"></i>
        </div>
        التوصيات حسب الباقة
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.package}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{item.package}</span>
              <span className="text-xs font-bold text-gray-900">
                {item.count} <span className="text-gray-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: colors[index % colors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}