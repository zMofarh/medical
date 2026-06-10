interface ReportCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: { value: number; label: string };
}

export default function ReportCard({ title, value, subtitle, icon, color, trend }: ReportCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <i className={`${icon} text-xl text-white`} />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend.value >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}>
            <i className={trend.value >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line"} />
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#2E4E45] mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      {trend && <p className="text-xs text-gray-400 mt-1">{trend.label}</p>}
    </div>
  );
}
