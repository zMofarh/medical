import { Link } from "react-router-dom";
import { usePublicPackages } from "@/hooks/useCMSPackages";

const accentMap: Record<string, { text: string; iconBg: string; ring: string; btn: string }> = {
  teal:   { text: "text-brand-forest-700", iconBg: "bg-brand-forest-100", ring: "ring-brand-forest",   btn: "bg-brand-forest hover:bg-brand-forest-700" },
  rose:   { text: "text-rose-700",         iconBg: "bg-rose-100",         ring: "ring-rose-400",        btn: "bg-rose-600 hover:bg-rose-700" },
  orange: { text: "text-orange-700",       iconBg: "bg-orange-100",       ring: "ring-orange-400",      btn: "bg-orange-500 hover:bg-orange-600" },
  violet: { text: "text-violet-700",       iconBg: "bg-violet-100",       ring: "ring-violet-400",      btn: "bg-violet-600 hover:bg-violet-700" },
  cyan:   { text: "text-cyan-700",         iconBg: "bg-cyan-100",         ring: "ring-cyan-400",        btn: "bg-cyan-600 hover:bg-cyan-700" },
  amber:  { text: "text-amber-700",        iconBg: "bg-amber-100",        ring: "ring-amber-400",       btn: "bg-amber-500 hover:bg-amber-600" },
  pink:   { text: "text-pink-700",         iconBg: "bg-pink-100",         ring: "ring-pink-400",        btn: "bg-pink-600 hover:bg-pink-700" },
  green:  { text: "text-green-700",        iconBg: "bg-green-100",        ring: "ring-green-400",       btn: "bg-green-600 hover:bg-green-700" },
};

export default function FeaturedPackages() {
  const { packages } = usePublicPackages();
  // Show first 3 packages as featured
  const featured = packages.slice(0, 3);

  return (
    <section dir="rtl" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-brand-forest-100 text-brand-forest text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            مستويات الرعاية
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">اختر مستوى التقييم المناسب</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            من التقييم العميق الشامل إلى الرعاية الدولية المتكاملة — كل مستوى مصمم لحالة مختلفة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((pkg, i) => {
            const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
            const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
            const isFeatured = i === 1;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border-2 border-brand-cream-200 bg-white p-6 flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                  isFeatured ? `ring-2 ${accent.ring} ring-offset-2` : ""
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 right-6 bg-brand-forest text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {pkg.badge}
                  </span>
                )}

                <div className="mb-5">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${accent.iconBg}`}>
                    <i className={`${pkg.icon} text-lg ${accent.text}`}></i>
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-1 leading-snug">{pkg.name}</h3>
                  <p className="text-gray-400 text-xs mb-3">{pkg.category}</p>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`text-3xl font-black ${accent.text}`}>{pkg.price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">ريال</span>
                    {pkg.originalPrice && (
                      <span className="text-gray-400 text-xs line-through mr-1">{pkg.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className={`text-xs font-bold mt-1 ${accent.text}`}>وفر {savings.toLocaleString()} ريال</p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {pkg.features.slice(0, 5).map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                        <i className={`ri-check-line text-xs ${accent.text}`}></i>
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                  {pkg.features.length > 5 && (
                    <li className={`text-xs font-semibold ${accent.text} pr-7`}>
                      +{pkg.features.length - 5} ميزة إضافية
                    </li>
                  )}
                </ul>

                <div className="flex gap-2">
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm border-2 border-brand-cream-200 text-gray-600 hover:border-brand-forest hover:text-brand-forest transition-colors whitespace-nowrap cursor-pointer"
                  >
                    التفاصيل
                  </Link>
                  <Link
                    to={`/booking?package=${pkg.id}`}
                    className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm text-white transition-colors whitespace-nowrap cursor-pointer ${accent.btn}`}
                  >
                    احجز الآن
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 border-2 border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            عرض جميع الباقات
            <i className="ri-arrow-left-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
