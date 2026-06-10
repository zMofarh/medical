import { useState } from "react";
import { testimonialsConfig, testimonialsStats } from "@/mocks/testimonialsData";

export default function TestimonialsSettings() {
  const [config, setConfig] = useState({ ...testimonialsConfig });
  const [stats, setStats] = useState({ ...testimonialsStats });

  const update = (field: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Rating stats */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <i className="ri-star-fill text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">إحصائيات التقييمات</p>
            <p className="text-xs text-gray-400">المعدل العام وتوزيع النجوم</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Average */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900">{stats.averageRating}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(s => (
                  <i key={s} className={`text-sm ${s <= Math.round(stats.averageRating) ? "ri-star-fill text-amber-400" : "ri-star-line text-gray-200"}`} />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{stats.totalReviews} تقييم</p>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { stars: 5, pct: stats.fiveStars },
                { stars: 4, pct: stats.fourStars },
                { stars: 3, pct: stats.threeStars },
                { stars: 2, pct: 0 },
                { stars: 1, pct: 0 },
              ].map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4 text-left">{stars}</span>
                  <i className="ri-star-fill text-amber-400 text-xs" />
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-left">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Editable stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">المعدل العام</label>
              <input
                type="number"
                min="1" max="5" step="0.1"
                value={stats.averageRating}
                onChange={(e) => setStats(p => ({ ...p, averageRating: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">إجمالي التقييمات</label>
              <input
                type="number"
                value={stats.totalReviews}
                onChange={(e) => setStats(p => ({ ...p, totalReviews: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section text */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
            <i className="ri-text text-[#2E4E45]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">نصوص القسم</p>
            <p className="text-xs text-gray-400">العنوان والوصف الذي يظهر فوق التقييمات</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">نص الشارة (Badge)</label>
            <input
              type="text"
              value={config.sectionBadge}
              onChange={(e) => update("sectionBadge", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">عنوان القسم</label>
            <input
              type="text"
              value={config.sectionTitle}
              onChange={(e) => update("sectionTitle", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">الوصف</label>
            <textarea
              rows={2}
              value={config.sectionSubtitle}
              onChange={(e) => update("sectionSubtitle", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Display options */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <i className="ri-layout-line text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">خيارات العرض</p>
            <p className="text-xs text-gray-400">كيف تظهر التقييمات للزوار</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-2 block">طريقة العرض</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "slider", label: "Slider", icon: "ri-slideshow-line", desc: "تقييم واحد في كل مرة" },
                { value: "grid", label: "Grid", icon: "ri-layout-grid-line", desc: "عرض شبكي لكل التقييمات" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update("displayStyle", opt.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-right ${
                    config.displayStyle === opt.value
                      ? "border-[#2E4E45] bg-[#2E4E45]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    config.displayStyle === opt.value ? "bg-[#2E4E45]/10 text-[#2E4E45]" : "bg-gray-100 text-gray-400"
                  }`}>
                    <i className={`${opt.icon} text-sm`} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${config.displayStyle === opt.value ? "text-[#2E4E45]" : "text-gray-600"}`}>{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {[
              { field: "showRating", label: "إظهار النجوم", icon: "ri-star-line" },
              { field: "showImage", label: "إظهار صورة المريض", icon: "ri-user-line" },
            ].map(({ field, label, icon }) => (
              <label key={field} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config[field as keyof typeof config] as boolean}
                  onChange={(e) => update(field, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#2E4E45]"
                />
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className={`${icon} text-gray-400 text-sm`} />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
