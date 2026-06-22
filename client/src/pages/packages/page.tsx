import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicPackages } from "@/hooks/useCMSPackages";
import { useDataContext, type MedicalPackage, type PackageCategory } from "@/context/DataContext";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";
import TypewriterText from "@/components/base/TypewriterText";
import { trustStats } from "@/mocks/clinicData";

const accentMap: Record<string, { bg: string; text: string; border: string; badge: string; btn: string; iconBg: string; headerBg: string; headerText: string }> = {
  teal:   { bg: "bg-brand-cream-100", text: "text-brand-forest-700", border: "border-brand-cream-300", badge: "bg-brand-forest-600", btn: "bg-brand-forest-600 hover:bg-brand-forest-700", iconBg: "bg-brand-cream-200", headerBg: "bg-brand-forest-800", headerText: "text-brand-cream-200" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   badge: "bg-rose-600",   btn: "bg-rose-600 hover:bg-rose-700",   iconBg: "bg-rose-100",   headerBg: "bg-rose-700",   headerText: "text-rose-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-500", btn: "bg-orange-500 hover:bg-orange-600", iconBg: "bg-orange-100", headerBg: "bg-orange-600", headerText: "text-orange-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-600", btn: "bg-violet-600 hover:bg-violet-700", iconBg: "bg-violet-100", headerBg: "bg-violet-700", headerText: "text-violet-100" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   badge: "bg-cyan-600",   btn: "bg-cyan-600 hover:bg-cyan-700",   iconBg: "bg-cyan-100",   headerBg: "bg-cyan-700",   headerText: "text-cyan-100" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  badge: "bg-amber-500",  btn: "bg-amber-500 hover:bg-amber-600",  iconBg: "bg-amber-100",  headerBg: "bg-amber-600",  headerText: "text-amber-100" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   badge: "bg-pink-600",   btn: "bg-pink-600 hover:bg-pink-700",   iconBg: "bg-pink-100",   headerBg: "bg-pink-700",   headerText: "text-pink-100" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  badge: "bg-green-600",  btn: "bg-green-600 hover:bg-green-700",  iconBg: "bg-green-100",  headerBg: "bg-green-700",  headerText: "text-green-100" },
};

const categoryMeta: Record<string, { icon: string; desc: string; color: string }> = {
  "التقييم العميق":    { icon: "ri-focus-3-line",       desc: "جلسات تقييم شاملة تكشف ما وراء الأعراض وتبني صورة صحية متكاملة",         color: "teal" },
  "الطب الدقيق":      { icon: "ri-dna-line",            desc: "منصة متكاملة تجمع التقييم العميق وتحليل DNA لبناء خطة وقائية شخصية",     color: "violet" },
  "الخلل الأيضي":     { icon: "ri-scales-line",         desc: "تقييم متخصص للسمنة وأمراض الكبد الدهني والخلل الأيضي المزمن",           color: "orange" },
  "Second Opinion":   { icon: "ri-global-line",         desc: "رأي طبي دولي من مراكز متخصصة في USA وKorea وألمانيا",                   color: "teal" },
  "الجينات والDNA":   { icon: "ri-radar-line",          desc: "تحليل جيني شامل يكشف مخاطرك الصحية المستقبلية قبل ظهورها",             color: "violet" },
  "الطب النفسي":      { icon: "ri-mental-health-line",  desc: "تقييم نفسي عميق يدمج الجانب الجيني والمعرفي لرعاية شاملة",             color: "rose" },
  "هشاشة العظام":     { icon: "ri-body-scan-line",      desc: "تقييم متخصص لكثافة العظام والمخاطر الجينية مع خطة علاجية مكثفة",       color: "amber" },
  "العلاجات الوريدية":{ icon: "ri-drop-line",           desc: "بروتوكولات وريدية مخصصة لدعم الطاقة الخلوية والأيض والجهاز العصبي",    color: "cyan" },
  "الوقاية العصبية":  { icon: "ri-brain-line",          desc: "برامج وقاية متخصصة من الزهايمر والتدهور المعرفي المبكر",               color: "violet" },
  "الرعاية الدولية":  { icon: "ri-route-line",          desc: "رعاية متكاملة تجمع العمق المحلي والخبرة الدولية في منظومة واحدة",       color: "teal" },
  "VIP":              { icon: "ri-vip-crown-line",      desc: "تجربة طبية استثنائية بأعلى مستويات الخصوصية والرعاية الشخصية",          color: "amber" },
};

function PackageCard({ pkg }: { pkg: MedicalPackage }) {
  const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
  const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;

  return (
    <div className={`relative bg-white rounded-2xl border ${accent.border} flex flex-col transition-all duration-200 hover:-translate-y-1 overflow-hidden group`}>
      {pkg.badge && (
        <span className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap z-10 ${accent.badge}`}>
          {pkg.badge}
        </span>
      )}

      <div className="p-5 pb-4">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${accent.iconBg}`}>
            <i className={`${pkg.icon} text-xl ${accent.text}`}></i>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-black text-gray-900 text-sm leading-snug mb-1">{pkg.name}</h3>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
              {pkg.category}
            </span>
          </div>
        </div>

        <ul className="space-y-1.5">
          {pkg.features.slice(0, 4).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${accent.iconBg}`}>
                <i className={`ri-check-line text-[9px] ${accent.text}`}></i>
              </div>
              <span>{f}</span>
            </li>
          ))}
          {pkg.features.length > 4 && (
            <li className={`text-[11px] font-semibold ${accent.text} pr-6`}>
              +{pkg.features.length - 4} ميزة إضافية
            </li>
          )}
        </ul>
      </div>

      <div className={`mt-auto px-5 py-4 border-t ${accent.border} bg-white`}>
        <div className="flex items-end justify-between mb-3">
          <div>
            {pkg.originalPrice && (
              <div className="text-xs text-gray-400 line-through mb-0.5">
                {pkg.originalPrice.toLocaleString()} ريال
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black ${accent.text}`}>{pkg.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400">ريال</span>
            </div>
          </div>
          {savings > 0 && (
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${accent.bg} ${accent.text}`}>
              وفر {savings.toLocaleString()} ريال
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/packages/${pkg.id}`}
            className={`flex-1 text-center text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors border ${accent.border} ${accent.text} hover:${accent.bg}`}
          >
            التفاصيل
          </Link>
          <Link
            to={`/booking?package=${pkg.id}`}
            className={`flex-1 text-center text-xs font-bold text-white px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}
          >
            احجز الآن
          </Link>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  packages,
}: {
  category: PackageCategory;
  packages: MedicalPackage[];
}) {
  const meta = categoryMeta[category] ?? { icon: "ri-gift-line", desc: "", color: "teal" };
  const accent = accentMap[meta.color] ?? accentMap.teal;
  const pkgs = packages.filter((p) => p.category === category);
  const sectionRef = useRef<HTMLDivElement>(null);

  if (pkgs.length === 0) return null;

  return (
    <section ref={sectionRef} id={`cat-${category}`} className="scroll-mt-28">
      <div className={`rounded-2xl p-6 mb-5 ${accent.bg} border ${accent.border}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${accent.iconBg}`}>
            <i className={`${meta.icon} text-2xl ${accent.text}`}></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`text-lg font-black ${accent.text}`}>{category}</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full text-white ${accent.badge}`}>
                {pkgs.length} {pkgs.length === 1 ? "باقة" : "باقات"}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{meta.desc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {pkgs.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}

export default function PackagesPage() {
  const { services: servicesData, packages: allPackages, posts: blogPosts } = useDataContext();

  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");
  const [activeCategory, setActiveCategory] = useState<PackageCategory | "all">("all");

  // ── CMS data ──────────────────────────────────────────────────────────────
  const { packages, categories } = usePublicPackages();

  const heroWords = t("packages.hero.words").split("|");

  const scrollToCategory = (cat: PackageCategory | "all") => {
    setActiveCategory(cat);
    if (cat === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(`cat-${cat}`);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const visibleCategories = activeCategory === "all" ? categories : [activeCategory];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-brand-forest-900 via-brand-forest-800 to-brand-forest-700">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=precision%20medicine%20DNA%20genomics%20abstract%20pattern%20dark%20forest%20green%20background%20sophisticated%20technology%20professional%20healthcare%20modern%20clinical&width=1440&height=500&seq=pkg-ma-hero-v2&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        <div className="absolute top-8 right-12 opacity-[0.12] pointer-events-none"><LotusShape size={100} color="#e8dcc8" /></div>
        <div className="absolute bottom-6 left-16 opacity-[0.10] pointer-events-none"><StarShape size={72} color="#e8dcc8" /></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <LotusShape size={12} color="#e8dcc8" />
            {t("packages.hero.badge")}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight min-h-[1.4em]">
            <TypewriterText
              words={heroWords}
              typeSpeed={62}
              deleteSpeed={36}
              pauseAfter={2700}
              startDelay={650}
              cursorChar="▌"
              cursorClassName="text-brand-cream-400/60 text-3xl md:text-5xl"
            />
          </h1>
          <p className="text-brand-cream-200 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            {t("packages.hero.desc")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {trustStats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-xl font-black text-white">{stat.number}</div>
                <div className="text-brand-cream-300 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Nav Pills ── */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-brand-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 flex-nowrap scrollbar-hide">
            <button
              onClick={() => scrollToCategory("all")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex-shrink-0 ${
                activeCategory === "all"
                  ? "bg-brand-forest-700 text-white"
                  : "bg-brand-cream-100 text-brand-forest-700 hover:bg-brand-cream-200"
              }`}
            >
              <i className="ri-apps-line text-sm"></i>
              الكل
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-brand-cream-200 text-brand-forest-600"}`}>
                {packages.length}
              </span>
            </button>
            {categories.map((cat) => {
              const meta = categoryMeta[cat] ?? { icon: "ri-gift-line", color: "teal" };
              const count = packages.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex-shrink-0 ${
                    activeCategory === cat
                      ? "bg-brand-forest-700 text-white"
                      : "bg-brand-cream-100 text-brand-forest-700 hover:bg-brand-cream-200"
                  }`}
                >
                  <i className={`${meta.icon} text-sm`}></i>
                  {cat}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeCategory === cat ? "bg-white/20 text-white" : "bg-brand-cream-200 text-brand-forest-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Summary Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-brand-forest-900">
              {activeCategory === "all" ? "جميع مستويات الرعاية" : activeCategory}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeCategory === "all"
                ? `${packages.length} باقة موزعة على ${categories.length} مستوى رعاية`
                : `${packages.filter((p) => p.category === activeCategory).length} باقة متاحة`}
            </p>
          </div>
          <Link
            to="/booking"
            className="hidden md:flex items-center gap-2 bg-brand-forest-700 hover:bg-brand-forest-800 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-calendar-check-line"></i>
            احجز استشارة
          </Link>
        </div>

        {/* Category Sections */}
        <div className="space-y-12">
          {visibleCategories.map((cat) => (
            <CategorySection key={cat} category={cat} packages={packages} />
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-10 bg-brand-cream-100 border border-brand-cream-300 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 flex items-center justify-center bg-brand-cream-200 rounded-xl flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-brand-forest-700 text-lg"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-brand-forest-800 mb-1">ملاحظة مهمة</p>
            <p className="text-sm text-brand-forest-700 leading-relaxed">
              {t("packages.note")}
              <Link to="/contact" className="font-bold underline mr-1">{t("btn.contact_us")}</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Philosophy Strip ── */}
      <section className="py-12 bg-white border-y border-brand-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-black text-brand-forest-900 mb-2">فلسفتنا في الرعاية</h3>
            <p className="text-sm text-gray-500">أربعة مبادئ تحكم كل باقة نقدمها</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Shape: StarShape,  label: isAr ? "الخبرة الطبية" : "Medical Expertise",   desc: isAr ? "استشاريون بخبرة دولية معتمدة" : "Internationally certified consultants" },
              { Shape: SunShape,   label: isAr ? "الحيوية والعافية" : "Vitality & Wellness", desc: isAr ? "نهج شامل يعيد التوازن الصحي" : "Holistic approach restoring health balance" },
              { Shape: SwanShape,  label: isAr ? "التوازن الأيضي" : "Metabolic Balance",  desc: isAr ? "تقييم دقيق للخلل الوظيفي" : "Precise assessment of functional dysfunction" },
              { Shape: LotusShape, label: isAr ? "التجدد الداخلي" : "Inner Renewal",  desc: isAr ? "خطة مخصصة لبيولوجيتك" : "A plan tailored to your biology" },
            ].map(({ Shape, label, desc }, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-brand-cream-50 border border-brand-cream-200">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-brand-forest-800">
                  <Shape size={28} color="#e8dcc8" />
                </div>
                <div>
                  <p className="font-bold text-brand-forest-800 text-sm">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-brand-forest-900 relative overflow-hidden">
        <div className="absolute top-4 right-10 opacity-[0.10] pointer-events-none"><StarShape size={80} color="#e8dcc8" /></div>
        <div className="absolute bottom-4 left-10 opacity-[0.08] pointer-events-none"><LotusShape size={70} color="#e8dcc8" /></div>
        <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-brand-cream-300/20 rounded-2xl mx-auto mb-5">
            <i className="ri-calendar-check-line text-brand-cream-200 text-2xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{t("packages.cta.heading")}</h2>
          <p className="text-brand-cream-200 text-sm mb-8 leading-relaxed">{t("packages.cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/booking" className="bg-brand-cream-300 text-brand-forest-900 font-bold px-8 py-3.5 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer text-sm">
              <i className="ri-calendar-check-line ml-2"></i>
              {t("packages.cta.book")}
            </Link>
            <Link to="/contact" className="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-sm">
              <i className="ri-phone-line ml-2"></i>
              {t("packages.cta.contact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
