import { useState } from "react";

interface RevenueChartProps {
  bookingsByMonth: { month: string; bookings: number; revenue: number }[];
}

export default function RevenueChart({ bookingsByMonth }: RevenueChartProps) {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "bookings">("revenue");

  const data = bookingsByMonth.map((m) => ({
    label: m.month,
    value: activeMetric === "revenue" ? m.revenue : m.bookings,
  }));

  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = 10 + (i / (data.length - 1)) * 80;
    const y = 85 - ((d.value - min) / range) * 65;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `10,90 ${polylinePoints} ${points[points.length - 1].x},90`;

  const totalRevenue = bookingsByMonth.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = bookingsByMonth.reduce((s, m) => s + m.bookings, 0);
  const lastMonth = bookingsByMonth[bookingsByMonth.length - 1];
  const prevMonth = bookingsByMonth[bookingsByMonth.length - 2];
  const growth = prevMonth
    ? (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
    : "0";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-800 text-base">الأداء المالي</h3>
          <p className="text-xs text-gray-400 mt-0.5">آخر 4 أشهر</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${activeMetric === "revenue" ? "bg-white text-[#2E4E45] border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
          >
            الإيرادات
          </button>
          <button
            onClick={() => setActiveMetric("bookings")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${activeMetric === "bookings" ? "bg-white text-[#2E4E45] border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
          >
            الحجوزات
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#2E4E45]/5 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">إجمالي الإيرادات</p>
          <p className="text-base font-bold text-[#2E4E45]">{(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-gray-400">ريال سعودي</p>
        </div>
        <div className="bg-[#C8A96E]/10 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">إجمالي الحجوزات</p>
          <p className="text-base font-bold text-[#C8A96E]">{totalBookings}</p>
          <p className="text-[10px] text-gray-400">حجز مكتمل</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">نمو الإيرادات</p>
          <p className="text-base font-bold text-emerald-600">+{growth}%</p>
          <p className="text-[10px] text-gray-400">مقارنة بالشهر الماضي</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-44" preserveAspectRatio="none">
          {/* Grid */}
          {[20, 40, 60, 80].map((y) => (
            <line key={y} x1="10" y1={y} x2="90" y2={y} stroke="#f3f4f6" strokeWidth="0.5" />
          ))}
          {/* Area */}
          <polygon points={areaPoints} fill="url(#areaGrad)" opacity="0.6" />
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E4E45" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2E4E45" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Line */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#2E4E45"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="2.5" fill="white" stroke="#2E4E45" strokeWidth="1.5" />
              <circle cx={p.x} cy={p.y} r="1" fill="#C8A96E" />
            </g>
          ))}
        </svg>
        {/* X labels */}
        <div className="flex justify-between px-2 mt-1">
          {data.map((d) => (
            <span key={d.label} className="text-[10px] text-gray-400">{d.label}</span>
          ))}
        </div>
      </div>

      {/* Month cards */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {bookingsByMonth.map((m, i) => (
          <div key={m.month} className={`rounded-lg p-2.5 text-center ${i === bookingsByMonth.length - 1 ? "bg-[#2E4E45] text-white" : "bg-gray-50"}`}>
            <p className={`text-[10px] mb-1 ${i === bookingsByMonth.length - 1 ? "text-white/70" : "text-gray-400"}`}>{m.month}</p>
            <p className={`text-xs font-bold ${i === bookingsByMonth.length - 1 ? "text-white" : "text-gray-700"}`}>
              {activeMetric === "revenue" ? `${(m.revenue / 1000).toFixed(0)}K` : m.bookings}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
