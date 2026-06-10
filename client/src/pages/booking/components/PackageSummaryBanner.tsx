import { useState } from "react";
import { Link } from "react-router-dom";
import { allPackages } from "@/mocks/packagesData";

const accentMap: Record<string, {
  bg: string; text: string; border: string; iconBg: string;
  badge: string; savingsBg: string;
}> = {
  teal:   { bg: "bg-brand-cream-50",  text: "text-brand-forest-700", border: "border-brand-cream-300", iconBg: "bg-brand-cream-200", badge: "bg-brand-forest-600", savingsBg: "bg-brand-forest-100" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   iconBg: "bg-rose-100",   badge: "bg-rose-600",   savingsBg: "bg-rose-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-100", badge: "bg-orange-500", savingsBg: "bg-orange-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", iconBg: "bg-violet-100", badge: "bg-violet-600", savingsBg: "bg-violet-100" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   iconBg: "bg-cyan-100",   badge: "bg-cyan-600",   savingsBg: "bg-cyan-100" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  iconBg: "bg-amber-100",  badge: "bg-amber-500",  savingsBg: "bg-amber-100" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   iconBg: "bg-pink-100",   badge: "bg-pink-600",   savingsBg: "bg-pink-100" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  iconBg: "bg-green-100",  badge: "bg-green-600",  savingsBg: "bg-green-100" },
};

interface PackageSummaryBannerProps {
  packageId: string;
}

export default function PackageSummaryBanner({ packageId }: PackageSummaryBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const pkg = allPackages.find((p) => p.id === packageId);
  if (!pkg) return null;

  const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
  const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
  const savingsPct = pkg.originalPrice ? Math.round((savings / pkg.originalPrice) * 100) : 0;

  return (
    <div className={`rounded-2xl border-2 ${accent.border} overflow-hidden mb-6`}>
      {/* Header strip */}
      <div className={`${accent.bg} px-5 py-3 flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 flex items-center justify-center rounded-full ${accent.badge}`}>
            <i className="ri-gift-line text-white text-xs"></i>
          </div>
          <span className={`text-xs font-black ${accent.text}`}>
            باقة محددة مسبقاً
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/packages/${pkg.id}`}
            className={`text-[10px] font-bold ${accent.text} hover:underline cursor-pointer whitespace-nowrap`}
          >
            <i className="ri-external-link-line ml-0.5 text-xs"></i>
            عرض التفاصيل
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-[10px] font-bold ${accent.text} cursor-pointer whitespace-nowrap flex items-center gap-0.5`}
          >
            {expanded ? "إخفاء" : "عرض الكل"}
            <i className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}></i>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white px-5 py-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${accent.iconBg}`}>
            <i className={`${pkg.icon} text-xl ${accent.text}`}></i>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-black text-gray-900 text-sm leading-snug">{pkg.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                    {pkg.category}
                  </span>
                  {pkg.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${accent.badge}`}>
                      {pkg.badge}
                    </span>
                  )}
                  {pkg.duration && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <i className="ri-time-line text-xs"></i>
                      {pkg.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-left flex-shrink-0">
                {pkg.originalPrice && (
                  <p className="text-xs text-gray-400 line-through text-left">{pkg.originalPrice.toLocaleString()} ريال</p>
                )}
                <p className={`text-xl font-black ${accent.text}`}>
                  {pkg.price.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400 mr-1">ريال</span>
                </p>
                {savings > 0 && (
                  <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${accent.savingsBg} ${accent.text}`}>
                    وفر {savings.toLocaleString()} ريال ({savingsPct}%)
                  </span>
                )}
              </div>
            </div>

            {/* Features preview */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {pkg.features.slice(0, expanded ? pkg.features.length : 3).map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className={`w-3.5 h-3.5 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                    <i className={`ri-check-line text-[8px] ${accent.text}`}></i>
                  </div>
                  {f}
                </div>
              ))}
              {!expanded && pkg.features.length > 3 && (
                <button
                  onClick={() => setExpanded(true)}
                  className={`text-xs font-bold ${accent.text} cursor-pointer hover:underline`}
                >
                  +{pkg.features.length - 3} ميزة أخرى
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preparation tips (if expanded) */}
        {expanded && pkg.preparation && pkg.preparation.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className={`text-xs font-black ${accent.text} mb-2 flex items-center gap-1.5`}>
              <i className="ri-clipboard-line text-sm"></i>
              تعليمات التحضير للفحص
            </p>
            <div className="space-y-1.5">
              {pkg.preparation.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-[9px] font-black text-white ${accent.badge}`}>
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div className={`${accent.bg} px-5 py-2.5 flex items-center gap-2`}>
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`ri-information-line text-xs ${accent.text}`}></i>
        </div>
        <p className={`text-[10px] ${accent.text} leading-relaxed`}>
          هذه الباقة ستُضاف لحجزك تلقائياً. يمكنك تغييرها في أي وقت.
        </p>
      </div>
    </div>
  );
}
