import { topDoctors } from "@/mocks/adminData";

const doctorDetails = [
  { id: "d1", name: "د. سارة العلي", specialty: "جلدية وتجميل", bookings: 124, revenue: 49600, rating: 4.9, satisfaction: 98, growth: 14, avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20female%20doctor%20portrait%20white%20coat%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=dr1&orientation=squarish" },
  { id: "d2", name: "د. خالد السالم", specialty: "ليزر وتجميل", bookings: 98, revenue: 39200, rating: 4.8, satisfaction: 95, growth: 9, avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20male%20doctor%20portrait%20white%20coat%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=dr2&orientation=squarish" },
  { id: "d3", name: "د. نورة الفهد", specialty: "تغذية علاجية", bookings: 76, revenue: 22800, rating: 4.7, satisfaction: 93, growth: 6, avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20female%20doctor%20portrait%20white%20coat%20neutral%20background%20warm%20smile%20clean%20modern%20style%20hijab&width=80&height=80&seq=dr3&orientation=squarish" },
  { id: "d4", name: "د. عمر الحسن", specialty: "خلايا جذعية", bookings: 61, revenue: 30500, rating: 4.9, satisfaction: 97, growth: 18, avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20male%20doctor%20portrait%20white%20coat%20neutral%20background%20calm%20expression%20clean%20modern%20style&width=80&height=80&seq=dr4&orientation=squarish" },
  { id: "d5", name: "د. منى الشريف", specialty: "تجميل وترميم", bookings: 54, revenue: 21600, rating: 4.6, satisfaction: 91, growth: 4, avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20female%20doctor%20portrait%20white%20coat%20neutral%20background%20professional%20expression%20clean%20modern%20style&width=80&height=80&seq=dr5&orientation=squarish" },
];

export default function DoctorsReport() {
  const maxBookings = Math.max(...doctorDetails.map((d) => d.bookings));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الأطباء", value: "8", sub: "نشطون حالياً" },
          { label: "إجمالي الحجوزات", value: "413", sub: "هذا الشهر" },
          { label: "متوسط التقييم", value: "4.8 ★", sub: "من 5.0" },
          { label: "معدل الرضا", value: "95%", sub: "من المرضى" },
        ].map((k) => (
          <div key={k.label} className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#2E4E45]">{k.value}</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{k.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Doctors Performance */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#2E4E45] text-sm">أداء الأطباء</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-right px-5 py-3 font-medium">الطبيب</th>
                <th className="text-right px-5 py-3 font-medium">التخصص</th>
                <th className="text-right px-5 py-3 font-medium">الحجوزات</th>
                <th className="text-right px-5 py-3 font-medium">الإيراد</th>
                <th className="text-right px-5 py-3 font-medium">التقييم</th>
                <th className="text-right px-5 py-3 font-medium">الرضا</th>
                <th className="text-right px-5 py-3 font-medium">النمو</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctorDetails.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#2E4E45]/10 text-[#2E4E45] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0" />
                      <span className="font-medium text-gray-800 whitespace-nowrap">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{d.specialty}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#2E4E45]">{d.bookings}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-16">
                        <div
                          className="h-full bg-[#2E4E45] rounded-full"
                          style={{ width: `${(d.bookings / maxBookings) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#C8A96E] whitespace-nowrap">{d.revenue.toLocaleString()} ر.س</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <i className="ri-star-fill text-xs" />
                      {d.rating}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.satisfaction}%` }} />
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">{d.satisfaction}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
                      <i className="ri-arrow-up-line" />
                      {d.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Distribution */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-[#2E4E45] text-sm mb-4">توزيع الحجوزات بين الأطباء</h3>
        <div className="space-y-3">
          {doctorDetails.map((d, i) => {
            const pct = Math.round((d.bookings / doctorDetails.reduce((a, b) => a + b.bookings, 0)) * 100);
            const colors = ["#2E4E45", "#C8A96E", "#4A7C6F", "#D4B896", "#6B9E94"];
            return (
              <div key={d.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-28 truncate">{d.name}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: colors[i] }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-10 text-left">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
