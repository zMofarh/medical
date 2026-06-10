import { chartData, adminStats } from "@/mocks/adminData";

const monthlyData = [
  { month: "يناير", revenue: 98000, bookings: 245, avg: 400 },
  { month: "فبراير", revenue: 112000, bookings: 278, avg: 403 },
  { month: "مارس", revenue: 125000, bookings: 310, avg: 403 },
  { month: "أبريل", revenue: 128500, bookings: 342, avg: 376 },
];

const serviceRevenue = [
  { service: "تجميل ليزر", revenue: 54000, pct: 42 },
  { service: "علاج بالخلايا", revenue: 32000, pct: 25 },
  { service: "فحص شامل", revenue: 18500, pct: 14 },
  { service: "استشارة جلدية", revenue: 14000, pct: 11 },
  { service: "استشارة تغذية", revenue: 10000, pct: 8 },
];

export default function RevenueReport() {
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إيرادات هذا الشهر", value: "128,500 ر.س", sub: "+12.5% عن الشهر الماضي", pos: true },
          { label: "إيرادات الربع", value: "463,500 ر.س", sub: "يناير — أبريل 2026", pos: true },
          { label: "متوسط قيمة الحجز", value: "376 ر.س", sub: "هذا الشهر", pos: false },
          { label: "أعلى إيراد يومي", value: "8,400 ر.س", sub: "الثلاثاء 22 أبريل", pos: true },
        ].map((k) => (
          <div key={k.label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xl font-bold text-[#2E4E45]">{k.value}</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{k.label}</p>
            <p className={`text-xs mt-1 ${k.pos ? "text-emerald-600" : "text-gray-400"}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-[#2E4E45] text-sm mb-5">الإيرادات الشهرية (ر.س)</h3>
        <div className="flex items-end gap-4 h-40">
          {monthlyData.map((m) => {
            const h = Math.round((m.revenue / maxRevenue) * 100);
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[#2E4E45]">{(m.revenue / 1000).toFixed(0)}k</span>
                <div className="w-full relative group cursor-pointer">
                  <div
                    className="w-full bg-[#2E4E45] rounded-t-lg transition-all duration-500 hover:bg-[#C8A96E]"
                    style={{ height: `${h * 1.2}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2E4E45] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {m.revenue.toLocaleString()} ر.س
                  </div>
                </div>
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-[#2E4E45] text-sm mb-4">الإيرادات حسب الخدمة</h3>
          <div className="space-y-3">
            {serviceRevenue.map((s, i) => (
              <div key={s.service}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{s.service}</span>
                  <span className="text-sm font-semibold text-[#2E4E45]">{s.revenue.toLocaleString()} ر.س</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.pct}%`,
                      backgroundColor: ["#2E4E45", "#C8A96E", "#4A7C6F", "#D4B896", "#6B9E94"][i],
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{s.pct}% من الإجمالي</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#2E4E45] text-sm">ملخص شهري</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-right px-5 py-3 font-medium">الشهر</th>
                <th className="text-right px-5 py-3 font-medium">الإيراد</th>
                <th className="text-right px-5 py-3 font-medium">الحجوزات</th>
                <th className="text-right px-5 py-3 font-medium">المتوسط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monthlyData.map((m) => (
                <tr key={m.month} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-800">{m.month}</td>
                  <td className="px-5 py-3 text-[#2E4E45] font-semibold">{m.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600">{m.bookings}</td>
                  <td className="px-5 py-3 text-gray-500">{m.avg} ر.س</td>
                </tr>
              ))}
              <tr className="bg-[#2E4E45]/5 font-semibold">
                <td className="px-5 py-3 text-[#2E4E45]">الإجمالي</td>
                <td className="px-5 py-3 text-[#2E4E45]">463,500</td>
                <td className="px-5 py-3 text-[#2E4E45]">1,175</td>
                <td className="px-5 py-3 text-[#2E4E45]">394 ر.س</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
