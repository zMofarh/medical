import { recentBookings, chartData } from "@/mocks/adminData";

interface BookingsReportProps {
  dateRange: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  confirmed: { label: "مؤكد", color: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "معلق",  color: "bg-amber-100 text-amber-700" },
  cancelled: { label: "ملغي",  color: "bg-red-100 text-red-600" },
  completed: { label: "مكتمل", color: "bg-[#2E4E45]/10 text-[#2E4E45]" },
};

export default function BookingsReport({ dateRange }: BookingsReportProps) {
  const totalBookings = recentBookings.length;
  const confirmed = recentBookings.filter((b) => b.status === "confirmed").length;
  const pending = recentBookings.filter((b) => b.status === "pending").length;
  const cancelled = recentBookings.filter((b) => b.status === "cancelled").length;

  const serviceStats = chartData.bookingsByService;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الحجوزات", value: totalBookings + 336, color: "text-[#2E4E45]" },
          { label: "مؤكدة", value: confirmed + 280, color: "text-emerald-600" },
          { label: "معلقة", value: pending + 45, color: "text-amber-600" },
          { label: "ملغية", value: cancelled + 11, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* By Service */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#2E4E45] text-sm">الحجوزات حسب الخدمة</h3>
        </div>
        <div className="p-5 space-y-3">
          {serviceStats.map((s) => {
            const pct = Math.round((s.count / serviceStats.reduce((a, b) => a + b.count, 0)) * 100);
            return (
              <div key={s.service}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{s.service}</span>
                  <span className="text-sm font-semibold text-[#2E4E45]">{s.count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#2E4E45] text-sm">آخر الحجوزات ({dateRange})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-right px-5 py-3 font-medium">رقم الحجز</th>
                <th className="text-right px-5 py-3 font-medium">المريض</th>
                <th className="text-right px-5 py-3 font-medium">الخدمة</th>
                <th className="text-right px-5 py-3 font-medium">الطبيب</th>
                <th className="text-right px-5 py-3 font-medium">التاريخ</th>
                <th className="text-right px-5 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => {
                const st = statusMap[b.status] || statusMap.pending;
                return (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{b.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{b.patientName}</td>
                    <td className="px-5 py-3 text-gray-600">{b.service}</td>
                    <td className="px-5 py-3 text-gray-600">{b.doctor}</td>
                    <td className="px-5 py-3 text-gray-500">{b.date}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
