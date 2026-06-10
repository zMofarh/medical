import { recentMessages } from "@/mocks/adminData";

const messageStats = [
  { month: "يناير", received: 48, replied: 45, pending: 3 },
  { month: "فبراير", received: 62, replied: 59, pending: 3 },
  { month: "مارس", received: 71, replied: 68, pending: 3 },
  { month: "أبريل", received: 54, replied: 51, pending: 3 },
];

const topSubjects = [
  { subject: "استفسار عن الخدمات", count: 67, pct: 28 },
  { subject: "طلب تغيير موعد", count: 54, pct: 23 },
  { subject: "شكاوى وملاحظات", count: 38, pct: 16 },
  { subject: "استفسار عن الأسعار", count: 45, pct: 19 },
  { subject: "شكر وتقدير", count: 31, pct: 13 },
];

export default function MessagesReport() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الرسائل", value: "235", sub: "هذا الربع" },
          { label: "تم الرد عليها", value: "223", sub: "95% معدل الرد" },
          { label: "معلقة", value: "12", sub: "تحتاج رد" },
          { label: "متوسط وقت الرد", value: "2.4 ساعة", sub: "هذا الشهر" },
        ].map((k) => (
          <div key={k.label} className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#2E4E45]">{k.value}</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{k.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Stats */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#2E4E45] text-sm">إحصائيات الرسائل الشهرية</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="text-right px-5 py-3 font-medium">الشهر</th>
              <th className="text-right px-5 py-3 font-medium">المستلمة</th>
              <th className="text-right px-5 py-3 font-medium">تم الرد</th>
              <th className="text-right px-5 py-3 font-medium">معلقة</th>
              <th className="text-right px-5 py-3 font-medium">معدل الرد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {messageStats.map((m) => {
              const rate = Math.round((m.replied / m.received) * 100);
              return (
                <tr key={m.month} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-800">{m.month}</td>
                  <td className="px-5 py-3 text-gray-600">{m.received}</td>
                  <td className="px-5 py-3 text-emerald-600 font-medium">{m.replied}</td>
                  <td className="px-5 py-3 text-amber-600">{m.pending}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="text-xs font-medium text-emerald-600">{rate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top Subjects */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-[#2E4E45] text-sm mb-4">أكثر موضوعات الرسائل</h3>
        <div className="space-y-3">
          {topSubjects.map((s, i) => (
            <div key={s.subject}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{s.subject}</span>
                <span className="text-sm font-semibold text-[#2E4E45]">{s.count} ({s.pct}%)</span>
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
            </div>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#2E4E45] text-sm">آخر الرسائل</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentMessages.map((m) => (
            <div key={m.id} className="px-5 py-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${m.isRead ? "bg-gray-300" : "bg-[#C8A96E]"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-800 text-sm">{m.name}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{m.date}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{m.subject}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{m.message}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${m.isRead ? "bg-gray-100 text-gray-500" : "bg-amber-100 text-amber-700"}`}>
                {m.isRead ? "مقروءة" : "جديدة"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
