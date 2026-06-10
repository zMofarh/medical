import { useState } from "react";
import { servicesData } from "@/mocks/servicesData";
import PackageSummaryBanner from "@/pages/booking/components/PackageSummaryBanner";

const accentMap: Record<string, { bg: string; text: string; border: string; activeBg: string; activeBorder: string }> = {
  teal:   { bg: "bg-brand-cream-50",  text: "text-brand-forest-600", border: "border-brand-cream-200",  activeBg: "bg-brand-cream-100",  activeBorder: "border-brand-forest-500" },
  orange: { bg: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-100",  activeBg: "bg-orange-100",  activeBorder: "border-orange-400" },
  violet: { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  activeBg: "bg-violet-100",  activeBorder: "border-violet-400" },
  cyan:   { bg: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-100",    activeBg: "bg-cyan-100",    activeBorder: "border-cyan-400" },
  rose:   { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100",    activeBg: "bg-rose-100",    activeBorder: "border-rose-400" },
  amber:  { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   activeBg: "bg-amber-100",   activeBorder: "border-amber-400" },
  green:  { bg: "bg-green-50",   text: "text-green-600",   border: "border-green-100",   activeBg: "bg-green-100",   activeBorder: "border-green-400" },
};

const categories = ["الكل", ...Array.from(new Set(servicesData.map((s) => s.category)))];

interface StepServiceProps {
  selected: string;
  onSelect: (id: string) => void;
  onNext: () => void;
  packageId?: string;
}

export default function StepService({ selected, onSelect, onNext, packageId }: StepServiceProps) {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered = servicesData.filter(
    (s) => activeCategory === "الكل" || s.category === activeCategory
  );

  return (
    <div>
      {/* Package Banner — shown when coming from a package page */}
      {packageId && <PackageSummaryBanner packageId={packageId} />}

      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900 mb-1">اختر الخدمة الطبية</h2>
        <p className="text-gray-400 text-sm">حدد الخدمة التي تحتاجها وسنوجهك للطبيب المناسب</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 flex-nowrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? "bg-brand-forest-600 text-white"
                : "bg-brand-cream-100 text-gray-600 hover:bg-brand-cream-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pl-1 pb-1">
        {filtered.map((service) => {
          const accent = accentMap[service.accentColor] ?? accentMap.teal;
          const isSelected = selected === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-right transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? `${accent.activeBg} ${accent.activeBorder}`
                  : `bg-white ${accent.border} hover:${accent.activeBg} hover:${accent.activeBorder}`
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors ${
                isSelected ? accent.activeBg : accent.bg
              }`}>
                <i className={`${service.icon} text-lg ${accent.text}`}></i>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-bold text-sm leading-snug ${isSelected ? "text-gray-900" : "text-gray-800"}`}>
                    {service.name.split("—")[0].trim()}
                  </p>
                  {isSelected && (
                    <div className="w-5 h-5 flex items-center justify-center bg-brand-forest-600 rounded-full flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{service.tagline}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                    {service.category}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    من {Math.min(...service.prices.map((p) => p.price)).toLocaleString()} ريال
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected service summary */}
      {selected && (() => {
        const svc = servicesData.find((s) => s.id === selected);
        if (!svc) return null;
        const accent = accentMap[svc.accentColor] ?? accentMap.teal;
        return (
          <div className={`mt-4 flex items-center gap-3 p-3 rounded-xl border ${accent.activeBorder} ${accent.activeBg}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.bg}`}>
              <i className={`${svc.icon} text-sm ${accent.text}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{svc.name.split("—")[0].trim()}</p>
              <p className="text-[10px] text-gray-500">{svc.tagline}</p>
            </div>
            <i className="ri-check-double-line text-brand-forest-600 text-base"></i>
          </div>
        );
      })()}

      <div className="mt-6">
        <button
          onClick={() => selected && onNext()}
          disabled={!selected}
          className={`inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
            selected
              ? "bg-brand-forest-600 hover:bg-brand-forest-700 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          التالي — اختر الطبيب
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
    </div>
  );
}
