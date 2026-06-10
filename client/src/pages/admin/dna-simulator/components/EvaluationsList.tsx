import { useState } from "react";
import type { DNAEvaluation } from "@/mocks/dnaSimulatorData";

interface EvaluationsListProps {
  evaluations: DNAEvaluation[];
  onViewDetail: (evaluation: DNAEvaluation) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "جديد", color: "text-blue-700", bg: "bg-blue-50" },
  viewed: { label: "تمت المراجعة", color: "text-amber-700", bg: "bg-amber-50" },
  contacted: { label: "تم التواصل", color: "text-violet-700", bg: "bg-violet-50" },
  booked: { label: "تم الحجز", color: "text-emerald-700", bg: "bg-emerald-50" },
};

const riskConfig: Record<string, { color: string; bg: string }> = {
  "منخفض": { color: "text-brand-forest-700", bg: "bg-brand-forest-50" },
  "متوسط": { color: "text-amber-700", bg: "bg-amber-50" },
  "مرتفع": { color: "text-orange-700", bg: "bg-orange-50" },
  "مرتفع جداً": { color: "text-red-700", bg: "bg-red-50" },
};

export default function EvaluationsList({ evaluations, onViewDetail }: EvaluationsListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = evaluations.filter((e) => {
    const matchesSearch =
      e.userName.includes(search) ||
      e.userPhone.includes(search) ||
      e.id.includes(search);
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesRisk = riskFilter === "all" || e.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="بحث بالاسم، الجوال، أو رقم التقييم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest-200"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest-200"
            >
              <option value="all">كل الحالات</option>
              <option value="new">جديد</option>
              <option value="viewed">تمت المراجعة</option>
              <option value="contacted">تم التواصل</option>
              <option value="booked">تم الحجز</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-forest-200"
            >
              <option value="all">كل المخاطر</option>
              <option value="منخفض">منخفض</option>
              <option value="متوسط">متوسط</option>
              <option value="مرتفع">مرتفع</option>
              <option value="مرتفع جداً">مرتفع جداً</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          عرض {filtered.length} من {evaluations.length} تقييم
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs">
              <th className="px-4 py-3 text-right font-semibold">رقم التقييم</th>
              <th className="px-4 py-3 text-right font-semibold">المستخدم</th>
              <th className="px-4 py-3 text-right font-semibold">العمر</th>
              <th className="px-4 py-3 text-right font-semibold">المخاطر</th>
              <th className="px-4 py-3 text-right font-semibold">الباقة الموصى بها</th>
              <th className="px-4 py-3 text-right font-semibold">الحالة</th>
              <th className="px-4 py-3 text-right font-semibold">التاريخ</th>
              <th className="px-4 py-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const status = statusConfig[e.status];
              const risk = riskConfig[e.riskLevel];
              return (
                <tr
                  key={e.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-gray-700">{e.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{e.userName}</p>
                      <p className="text-xs text-gray-500">{e.userPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{e.age}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${risk.bg} ${risk.color}`}>
                        {e.riskLevel}
                      </span>
                      <span className="text-xs font-bold text-gray-700">{e.overallScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700 truncate max-w-[150px] block">
                      {e.recommendedPackage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(e.createdAt).toLocaleDateString("ar-SA", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewDetail(e)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-forest-50 text-brand-forest-600 transition-colors cursor-pointer"
                      title="عرض التفاصيل"
                    >
                      <i className="ri-eye-line"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-3">
            <i className="ri-search-line text-gray-400 text-lg"></i>
          </div>
          <p className="text-sm text-gray-500">لا توجد نتائج مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
}