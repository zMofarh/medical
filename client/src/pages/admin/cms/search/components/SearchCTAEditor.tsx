import { useState } from "react";
import { searchCTAData, type SearchCTAData } from "@/mocks/searchPageData";

const ICON_OPTIONS = [
  "ri-dna-line", "ri-heart-pulse-line", "ri-microscope-line", "ri-hospital-line",
  "ri-stethoscope-line", "ri-capsule-line", "ri-shield-check-line", "ri-star-line",
  "ri-award-line", "ri-brain-line",
];

export default function SearchCTAEditor() {
  const [data, setData] = useState<SearchCTAData>(searchCTAData);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg">
            <i className="ri-megaphone-line text-[#2E4E45] text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">بانر CTA السفلي</h3>
            <p className="text-xs text-gray-400">يظهر أسفل الصفحة عند عدم وجود بحث</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setData({ ...data, active: !data.active })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
              data.active
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <i className={`${data.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`}></i>
            {data.active ? "ظاهر" : "مخفي"}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              saved ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#243d36]"
            }`}
          >
            <i className={saved ? "ri-check-line" : "ri-save-line"}></i>
            {saved ? "تم الحفظ!" : "حفظ"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">النص التوضيحي</label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">نص الزر</label>
          <input
            type="text"
            value={data.ctaLabel}
            onChange={(e) => setData({ ...data, ctaLabel: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">مسار الزر (Path)</label>
          <input
            type="text"
            value={data.ctaPath}
            onChange={(e) => setData({ ...data, ctaPath: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
            placeholder="/services"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">الأيقونة</label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                onClick={() => setData({ ...data, icon })}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  data.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <i className={`${icon} text-lg text-gray-700`}></i>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className={`mt-5 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-opacity ${data.active ? "opacity-100" : "opacity-40"} bg-[#1a3530]`}>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 flex items-center justify-center bg-white/15 rounded-xl flex-shrink-0">
            <i className={`${data.icon} text-white text-xl`}></i>
          </div>
          <div>
            <div className="font-black text-white text-sm">{data.title}</div>
            <div className="text-white/60 text-xs mt-0.5">{data.subtitle}</div>
          </div>
        </div>
        <div className="bg-[#C8A96E] text-[#1a3530] text-xs font-black px-5 py-2.5 rounded-xl whitespace-nowrap">
          {data.ctaLabel}
        </div>
      </div>
    </div>
  );
}
