import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { type MedicalPackage } from "@/mocks/packagesData";
import { usePublicPackages } from "@/hooks/useCMSPackages";

const accentMap: Record<string, {
  bg: string; text: string; border: string; badge: string;
  btn: string; iconBg: string; gradient: string; lightBg: string; ring: string;
}> = {
  teal:   { bg: "bg-brand-cream-100", text: "text-brand-forest-700", border: "border-brand-cream-300", badge: "bg-brand-forest-600", btn: "bg-brand-forest-600 hover:bg-brand-forest-700", iconBg: "bg-brand-cream-200", gradient: "from-brand-forest-900 via-brand-forest-800 to-brand-forest-700", lightBg: "bg-brand-cream-50", ring: "ring-brand-forest-300" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   badge: "bg-rose-600",   btn: "bg-rose-600 hover:bg-rose-700",   iconBg: "bg-rose-100",   gradient: "from-rose-900 via-rose-800 to-rose-700",     lightBg: "bg-rose-50",   ring: "ring-rose-300" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-500", btn: "bg-orange-500 hover:bg-orange-600", iconBg: "bg-orange-100", gradient: "from-orange-900 via-orange-800 to-orange-700", lightBg: "bg-orange-50", ring: "ring-orange-300" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   badge: "bg-pink-600",   btn: "bg-pink-600 hover:bg-pink-700",   iconBg: "bg-pink-100",   gradient: "from-pink-900 via-pink-800 to-pink-700",     lightBg: "bg-pink-50",   ring: "ring-pink-300" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  badge: "bg-green-600",  btn: "bg-green-600 hover:bg-green-700",  iconBg: "bg-green-100",  gradient: "from-green-900 via-green-800 to-green-700",   lightBg: "bg-green-50",  ring: "ring-green-300" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-600", btn: "bg-violet-600 hover:bg-violet-700", iconBg: "bg-violet-100", gradient: "from-violet-900 via-violet-800 to-violet-700", lightBg: "bg-violet-50", ring: "ring-violet-300" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   badge: "bg-cyan-600",   btn: "bg-cyan-600 hover:bg-cyan-700",   iconBg: "bg-cyan-100",   gradient: "from-cyan-900 via-cyan-800 to-cyan-700",     lightBg: "bg-cyan-50",   ring: "ring-cyan-300" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  badge: "bg-amber-500",  btn: "bg-amber-500 hover:bg-amber-600",  iconBg: "bg-amber-100",  gradient: "from-amber-900 via-amber-800 to-amber-700",   lightBg: "bg-amber-50",  ring: "ring-amber-300" },
};

type TabId = "overview" | "includes" | "preparation" | "compare" | "faq";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-right bg-white hover:bg-brand-cream-50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">
          <i className={`ri-arrow-down-s-line text-gray-400 text-lg transition-transform duration-200 ${open ? "rotate-180" : ""}`}></i>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-3 bg-brand-cream-50 text-sm text-gray-600 leading-relaxed border-t border-brand-cream-100">
          {a}
        </div>
      )}
    </div>
  );
}

/* ── Compare Table ── */
function CompareTable({ currentPkg, siblings }: { currentPkg: MedicalPackage; siblings: MedicalPackage[] }) {
  const accent = accentMap[currentPkg.accentColor] ?? accentMap.teal;
  const allPkgs = [currentPkg, ...siblings];

  // Collect all unique features across all packages in category
  const allFeatures = Array.from(
    new Set(allPkgs.flatMap((p) => p.features))
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-cream-200">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="bg-brand-cream-50 border-b border-brand-cream-200">
            <th className="text-right px-5 py-4 font-black text-gray-700 w-48 text-sm">الميزة</th>
            {allPkgs.map((p) => {
              const isCurrentPkg = p.id === currentPkg.id;
              const pAccent = accentMap[p.accentColor] ?? accentMap.teal;
              return (
                <th key={p.id} className={`px-4 py-4 text-center min-w-[160px] ${isCurrentPkg ? `${pAccent.bg} border-x-2 ${pAccent.border}` : ""}`}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isCurrentPkg ? pAccent.iconBg : "bg-gray-100"}`}>
                      <i className={`${p.icon} text-sm ${isCurrentPkg ? pAccent.text : "text-gray-500"}`}></i>
                    </div>
                    <span className={`text-xs font-black leading-tight text-center ${isCurrentPkg ? pAccent.text : "text-gray-700"}`}>
                      {p.name}
                    </span>
                    {isCurrentPkg && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${pAccent.badge}`}>
                        الباقة الحالية
                      </span>
                    )}
                    <span className={`text-xs font-black ${isCurrentPkg ? pAccent.text : "text-gray-600"}`}>
                      {p.price.toLocaleString()} ريال
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature, i) => (
            <tr key={i} className={`border-b border-brand-cream-100 ${i % 2 === 0 ? "bg-white" : "bg-brand-cream-50/40"}`}>
              <td className="px-5 py-3 text-xs text-gray-700 font-medium">{feature}</td>
              {allPkgs.map((p) => {
                const isCurrentPkg = p.id === currentPkg.id;
                const pAccent = accentMap[p.accentColor] ?? accentMap.teal;
                const hasFeature = p.features.includes(feature);
                return (
                  <td key={p.id} className={`px-4 py-3 text-center ${isCurrentPkg ? `${pAccent.bg}/30 border-x-2 ${pAccent.border}` : ""}`}>
                    {hasFeature ? (
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto ${isCurrentPkg ? pAccent.iconBg : "bg-green-50"}`}>
                        <i className={`ri-check-line text-xs ${isCurrentPkg ? pAccent.text : "text-green-600"}`}></i>
                      </div>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center rounded-full mx-auto bg-gray-50">
                        <i className="ri-subtract-line text-xs text-gray-300"></i>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Price Row */}
          <tr className="bg-brand-cream-50 border-t-2 border-brand-cream-200">
            <td className="px-5 py-4 text-xs font-black text-gray-800">السعر الإجمالي</td>
            {allPkgs.map((p) => {
              const isCurrentPkg = p.id === currentPkg.id;
              const pAccent = accentMap[p.accentColor] ?? accentMap.teal;
              return (
                <td key={p.id} className={`px-4 py-4 text-center ${isCurrentPkg ? `${pAccent.bg} border-x-2 border-b-2 ${pAccent.border}` : ""}`}>
                  <div className="flex flex-col items-center gap-1">
                    {p.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">{p.originalPrice.toLocaleString()} ر</span>
                    )}
                    <span className={`text-sm font-black ${isCurrentPkg ? pAccent.text : "text-gray-700"}`}>
                      {p.price.toLocaleString()} ريال
                    </span>
                    {isCurrentPkg ? (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${pAccent.badge}`}>
                        محدد
                      </span>
                    ) : (
                      <Link
                        to={`/packages/${p.id}`}
                        className="text-[10px] font-bold text-brand-forest-600 hover:underline cursor-pointer whitespace-nowrap"
                      >
                        عرض التفاصيل
                      </Link>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Sticky Tab Bar ── */
function TabBar({
  tabs,
  activeTab,
  onTabChange,
  accent,
}: {
  tabs: { id: TabId; label: string; icon: string; count?: number }[];
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  accent: (typeof accentMap)[string];
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-0 flex-nowrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
            activeTab === tab.id
              ? `border-brand-forest-600 ${accent.text}`
              : "border-transparent text-gray-500 hover:text-brand-forest-600"
          }`}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${tab.icon} text-sm`}></i>
          </div>
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.id ? `${accent.bg} ${accent.text}` : "bg-gray-100 text-gray-500"
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const contentRef = useRef<HTMLDivElement>(null);
  const { packages } = usePublicPackages();

  const pkg = packages.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!pkg) {
    return (
      <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 flex items-center justify-center bg-brand-cream-100 rounded-full mb-6">
            <i className="ri-search-line text-3xl text-brand-forest-400"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">الباقة غير موجودة</h2>
          <p className="text-gray-500 mb-6">لم نتمكن من العثور على الباقة المطلوبة</p>
          <Link to="/packages" className="bg-brand-forest-600 text-white font-bold px-6 py-3 rounded-full hover:bg-brand-forest-700 transition-colors whitespace-nowrap cursor-pointer">
            العودة للباقات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
  const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
  const savingsPct = pkg.originalPrice ? Math.round((savings / pkg.originalPrice) * 100) : 0;

  const siblingPackages = packages.filter((p) => p.category === pkg.category && p.id !== pkg.id);

  const tabs: { id: TabId; label: string; icon: string; count?: number }[] = [
    { id: "overview",    label: "نظرة عامة",    icon: "ri-eye-line" },
    { id: "includes",    label: "ما تشمله",      icon: "ri-list-check-2",       count: pkg.features.length },
    ...(pkg.preparation && pkg.preparation.length > 0 ? [{ id: "preparation" as TabId, label: "التحضير",  icon: "ri-clipboard-line", count: pkg.preparation.length }] : []),
    ...(siblingPackages.length > 0 ? [{ id: "compare" as TabId, label: "مقارنة الباقات", icon: "ri-bar-chart-grouped-line", count: siblingPackages.length + 1 }] : []),
    ...(pkg.faqs && pkg.faqs.length > 0 ? [{ id: "faq" as TabId, label: "الأسئلة الشائعة", icon: "ri-question-answer-line", count: pkg.faqs.length }] : []),
  ];

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (contentRef.current) {
      const offset = 140;
      const top = contentRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* ── Hero ── */}
      <section className={`relative pt-28 pb-14 bg-gradient-to-br ${accent.gradient} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20medical%20health%20pattern%20geometric%20shapes%20clean%20minimal%20white%20lines%20on%20dark%20background%20modern%20healthcare%20design%20professional%20clinic&width=1440&height=420&seq=pkg-detail-hero-v3&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-7 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors cursor-pointer">الرئيسية</Link>
            <i className="ri-arrow-left-s-line"></i>
            <Link to="/packages" className="hover:text-white transition-colors cursor-pointer">مستويات الرعاية</Link>
            <i className="ri-arrow-left-s-line"></i>
            <span className="text-white/80">{pkg.category}</span>
            <i className="ri-arrow-left-s-line"></i>
            <span className="text-white font-semibold">{pkg.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                  <i className="ri-folder-line ml-1 text-xs"></i>
                  {pkg.category}
                </span>
                {pkg.badge && (
                  <span className="bg-white text-gray-800 text-xs font-black px-3 py-1.5 rounded-full">
                    <i className="ri-star-fill ml-1 text-amber-500 text-xs"></i>
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex-shrink-0">
                  <i className={`${pkg.icon} text-3xl text-white`}></i>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{pkg.name}</h1>
              </div>

              {pkg.description && (
                <p className="text-white/85 text-sm leading-relaxed max-w-2xl mb-6">
                  {pkg.description}
                </p>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3">
                {pkg.duration && (
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-time-line text-xs"></i>
                    </div>
                    {pkg.duration}
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-list-check-2 text-xs"></i>
                  </div>
                  {pkg.features.length} خدمة مشمولة
                </div>
                {siblingPackages.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-full">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-bar-chart-grouped-line text-xs"></i>
                    </div>
                    {siblingPackages.length + 1} باقات في هذا المستوى
                  </div>
                )}
              </div>
            </div>

            {/* Right: Price Card */}
            <div className="w-full lg:w-72 bg-white rounded-2xl p-6 flex-shrink-0">
              {/* Savings Banner */}
              {savings > 0 && (
                <div className={`-mx-6 -mt-6 mb-5 px-6 py-3 rounded-t-2xl text-center ${accent.bg}`}>
                  <span className={`text-xs font-black ${accent.text}`}>
                    <i className="ri-price-tag-3-line ml-1"></i>
                    وفر {savings.toLocaleString()} ريال ({savingsPct}% خصم)
                  </span>
                </div>
              )}

              <div className="text-center mb-5">
                {pkg.originalPrice && (
                  <div className="text-sm text-gray-400 line-through mb-1">
                    {pkg.originalPrice.toLocaleString()} ريال
                  </div>
                )}
                <div className={`text-4xl font-black ${accent.text}`}>
                  {pkg.price.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm mt-1">ريال سعودي</div>
              </div>

              <Link
                to={`/booking?package=${pkg.id}`}
                className={`block w-full text-center text-white font-bold py-3.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer text-sm mb-3 ${accent.btn}`}
              >
                <i className="ri-calendar-check-line ml-2"></i>
                احجز هذه الباقة الآن
              </Link>

              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-green-700 font-bold py-3 rounded-xl border-2 border-green-200 hover:bg-green-50 transition-colors whitespace-nowrap cursor-pointer text-sm mb-5"
              >
                <i className="ri-whatsapp-line ml-2 text-green-600"></i>
                استفسر عبر واتساب
              </a>

              <div className="space-y-2.5 pt-4 border-t border-gray-100">
                {[
                  { icon: "ri-shield-check-line", color: "text-green-500", text: "ضمان جودة الخدمة" },
                  { icon: "ri-calendar-line",     color: "text-brand-forest-500", text: "حجز مرن وسهل" },
                  { icon: "ri-file-text-line",    color: "text-amber-500", text: "تقرير إلكتروني فوري" },
                  { icon: "ri-percent-line",      color: "text-rose-500",  text: "الأسعار شاملة ضريبة القيمة المضافة" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${item.icon} ${item.color}`}></i>
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Tab Bar ── */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-brand-cream-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} accent={accent} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div ref={contentRef} className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Column (Tab Content) ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ── TAB: Overview ── */}
            {activeTab === "overview" && (
              <>
                {/* What's Included (visual) */}
                {pkg.includes && pkg.includes.length > 0 && (
                  <section className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                    <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                        <i className={`ri-list-check-2 text-base ${accent.text}`}></i>
                      </div>
                      ما تشمله الباقة
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pkg.includes.map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl ${accent.lightBg} border ${accent.border}`}>
                          <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${accent.iconBg} flex-shrink-0`}>
                            <i className={`${item.icon} text-base ${accent.text}`}></i>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Target Audience */}
                {pkg.targetAudience && (
                  <section className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                    <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                        <i className={`ri-user-heart-line text-base ${accent.text}`}></i>
                      </div>
                      لمن هذه الباقة؟
                    </h2>
                    <div className={`flex items-start gap-4 p-5 rounded-xl ${accent.lightBg} border ${accent.border}`}>
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${accent.iconBg}`}>
                        <i className={`ri-information-line text-lg ${accent.text}`}></i>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{pkg.targetAudience}</p>
                    </div>
                  </section>
                )}

                {/* Features Summary */}
                <section className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                  <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                      <i className={`ri-checkbox-circle-line text-base ${accent.text}`}></i>
                    </div>
                    مكونات الباقة
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                      {pkg.features.length} عنصر
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                          <i className={`ri-check-line text-xs ${accent.text}`}></i>
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Compare Teaser */}
                {siblingPackages.length > 0 && (
                  <section className={`rounded-2xl p-5 ${accent.bg} border ${accent.border}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${accent.iconBg} flex-shrink-0`}>
                          <i className={`ri-bar-chart-grouped-line text-lg ${accent.text}`}></i>
                        </div>
                        <div>
                          <p className={`text-sm font-black ${accent.text}`}>قارن مع باقات {pkg.category}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {siblingPackages.length} باقة أخرى في نفس المستوى — اختر الأنسب لك
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTabChange("compare")}
                        className={`text-xs font-black px-4 py-2.5 rounded-xl text-white whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}
                      >
                        <i className="ri-arrow-left-line ml-1"></i>
                        عرض المقارنة
                      </button>
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ── TAB: Includes ── */}
            {activeTab === "includes" && (
              <section className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-list-check-2 text-base ${accent.text}`}></i>
                  </div>
                  كل ما تشمله الباقة
                </h2>

                {pkg.includes && pkg.includes.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">الخدمات الرئيسية</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pkg.includes.map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${accent.lightBg} border ${accent.border}`}>
                          <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${accent.iconBg} flex-shrink-0`}>
                            <i className={`${item.icon} text-lg ${accent.text}`}></i>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">قائمة المكونات الكاملة</p>
                  <div className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${accent.border} bg-white`}>
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                          <i className={`ri-check-line text-xs ${accent.text}`}></i>
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── TAB: Preparation ── */}
            {activeTab === "preparation" && pkg.preparation && (
              <section className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-clipboard-line text-base ${accent.text}`}></i>
                  </div>
                  كيف تستعد للفحص؟
                </h2>
                <div className="space-y-4">
                  {pkg.preparation.map((step, i) => (
                    <div key={i} className={`flex items-start gap-4 p-4 rounded-xl ${accent.lightBg} border ${accent.border}`}>
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 text-sm font-black text-white ${accent.badge}`}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
                <div className={`mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3`}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-100 flex-shrink-0">
                    <i className="ri-alert-line text-amber-600 text-base"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-800 mb-1">تنبيه مهم</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      في حال وجود أي حالة طبية خاصة أو أدوية تتناولها، يُرجى إبلاغ الفريق الطبي قبل الجلسة.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ── TAB: Compare ── */}
            {activeTab === "compare" && siblingPackages.length > 0 && (
              <section className="space-y-5">
                <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                  <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                      <i className={`ri-bar-chart-grouped-line text-base ${accent.text}`}></i>
                    </div>
                    مقارنة باقات {pkg.category}
                  </h2>
                  <p className="text-xs text-gray-500 mb-6">
                    قارن بين جميع الباقات المتاحة في مستوى &quot;{pkg.category}&quot; واختر الأنسب لاحتياجاتك
                  </p>
                  <CompareTable currentPkg={pkg} siblings={siblingPackages} />
                </div>

                {/* Sibling Cards */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">باقات أخرى في نفس المستوى</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {siblingPackages.map((sp) => {
                      const spAccent = accentMap[sp.accentColor] ?? accentMap.teal;
                      const spSavings = sp.originalPrice ? sp.originalPrice - sp.price : 0;
                      return (
                        <div key={sp.id} className={`bg-white rounded-2xl border ${spAccent.border} p-5 flex flex-col`}>
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${spAccent.iconBg}`}>
                              <i className={`${sp.icon} text-lg ${spAccent.text}`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-gray-900 text-sm leading-snug">{sp.name}</h3>
                              {sp.badge && (
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 text-white ${spAccent.badge}`}>
                                  {sp.badge}
                                </span>
                              )}
                            </div>
                          </div>
                          <ul className="space-y-1.5 mb-4 flex-1">
                            {sp.features.slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${spAccent.iconBg}`}>
                                  <i className={`ri-check-line text-[9px] ${spAccent.text}`}></i>
                                </div>
                                {f}
                              </li>
                            ))}
                            {sp.features.length > 3 && (
                              <li className={`text-[11px] font-semibold ${spAccent.text} pr-6`}>
                                +{sp.features.length - 3} ميزة إضافية
                              </li>
                            )}
                          </ul>
                          <div className={`pt-4 border-t ${spAccent.border} flex items-end justify-between`}>
                            <div>
                              {sp.originalPrice && (
                                <p className="text-xs text-gray-400 line-through">{sp.originalPrice.toLocaleString()} ريال</p>
                              )}
                              <p className={`text-lg font-black ${spAccent.text}`}>
                                {sp.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">ريال</span>
                              </p>
                              {spSavings > 0 && (
                                <p className={`text-[10px] font-bold ${spAccent.text}`}>وفر {spSavings.toLocaleString()} ريال</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link
                                to={`/packages/${sp.id}`}
                                className={`text-xs font-semibold px-3 py-2 rounded-xl border ${spAccent.border} ${spAccent.text} hover:${spAccent.bg} transition-colors whitespace-nowrap cursor-pointer`}
                              >
                                التفاصيل
                              </Link>
                              <Link
                                to={`/booking?package=${sp.id}`}
                                className={`text-xs font-bold text-white px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${spAccent.btn}`}
                              >
                                احجز
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ── TAB: FAQ ── */}
            {activeTab === "faq" && pkg.faqs && pkg.faqs.length > 0 && (
              <section className="bg-white rounded-2xl border border-brand-cream-200 p-6">
                <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-question-answer-line text-base ${accent.text}`}></i>
                  </div>
                  الأسئلة الشائعة
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                    {pkg.faqs.length} سؤال
                  </span>
                </h2>
                <div className="space-y-3">
                  {pkg.faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
                <div className={`mt-6 p-4 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-between gap-4`}>
                  <div>
                    <p className={`text-sm font-black ${accent.text}`}>لديك سؤال آخر؟</p>
                    <p className="text-xs text-gray-500 mt-0.5">فريقنا جاهز للإجابة على جميع استفساراتك</p>
                  </div>
                  <Link
                    to="/contact"
                    className={`text-xs font-bold text-white px-4 py-2.5 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}
                  >
                    تواصل معنا
                  </Link>
                </div>
              </section>
            )}

            {/* ── CTA Banner (always visible) ── */}
            <section className={`rounded-2xl p-6 bg-gradient-to-br ${accent.gradient} text-center`}>
              <h3 className="text-xl font-black text-white mb-2">جاهز للحجز؟</h3>
              <p className="text-white/80 text-sm mb-5">احجز الآن وابدأ رحلتك نحو صحة أفضل</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={`/booking?package=${pkg.id}`}
                  className="bg-brand-cream-300 text-brand-forest-900 font-bold px-6 py-3 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer text-sm"
                >
                  <i className="ri-calendar-check-line ml-2"></i>
                  احجز الآن
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white/50 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-sm"
                >
                  <i className="ri-phone-line ml-2"></i>
                  تواصل معنا
                </Link>
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">

            {/* Sticky Quick Book */}
            <div className={`bg-white rounded-2xl border ${accent.border} p-5 sticky top-36`}>
              <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                  <i className={`ri-calendar-check-line text-xs ${accent.text}`}></i>
                </div>
                حجز سريع
              </h3>

              {/* Price Display */}
              <div className={`rounded-xl p-4 mb-4 ${accent.lightBg} border ${accent.border}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">سعر الباقة</span>
                  {pkg.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">{pkg.originalPrice.toLocaleString()} ر</span>
                  )}
                </div>
                <div className={`text-2xl font-black ${accent.text}`}>
                  {pkg.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-400 mr-1">ريال</span>
                </div>
                {savings > 0 && (
                  <div className={`mt-1.5 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                    <i className="ri-price-tag-3-line text-xs"></i>
                    وفر {savings.toLocaleString()} ريال
                  </div>
                )}
              </div>

              <Link
                to={`/booking?package=${pkg.id}`}
                className={`block w-full text-center text-white font-bold py-3 rounded-xl transition-colors whitespace-nowrap cursor-pointer text-sm mb-2 ${accent.btn}`}
              >
                <i className="ri-calendar-check-line ml-1.5"></i>
                احجز الآن
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="block w-full text-center text-gray-600 font-semibold py-2.5 rounded-xl border border-brand-cream-200 hover:bg-brand-cream-50 transition-colors whitespace-nowrap cursor-pointer text-xs"
              >
                <i className="ri-arrow-right-line ml-1.5"></i>
                العودة للباقات
              </button>

              {pkg.duration && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-time-line text-gray-400"></i>
                  </div>
                  <span>المدة: <strong className="text-gray-700">{pkg.duration}</strong></span>
                </div>
              )}
            </div>

            {/* Sibling Packages (sidebar) */}
            {siblingPackages.length > 0 && (
              <div className="bg-white rounded-2xl border border-brand-cream-200 p-5">
                <h3 className="font-black text-gray-900 text-sm mb-1 flex items-center gap-2">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-grid-line text-xs ${accent.text}`}></i>
                  </div>
                  باقات {pkg.category}
                </h3>
                <p className="text-xs text-gray-400 mb-4">اختر الباقة الأنسب لاحتياجاتك</p>
                <div className="space-y-2.5">
                  {siblingPackages.map((sp) => {
                    const spAccent = accentMap[sp.accentColor] ?? accentMap.teal;
                    return (
                      <Link
                        key={sp.id}
                        to={`/packages/${sp.id}`}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${spAccent.border} hover:${spAccent.bg} transition-colors cursor-pointer group`}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${spAccent.iconBg}`}>
                          <i className={`${sp.icon} text-sm ${spAccent.text}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate group-hover:text-brand-forest-700 transition-colors">{sp.name}</p>
                          <p className={`text-xs font-black ${spAccent.text}`}>{sp.price.toLocaleString()} ريال</p>
                        </div>
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <i className="ri-arrow-left-s-line text-gray-400 text-base"></i>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <button
                  onClick={() => handleTabChange("compare")}
                  className={`mt-4 w-full text-center text-xs font-bold py-2.5 rounded-xl border ${accent.border} ${accent.text} hover:${accent.bg} transition-colors cursor-pointer`}
                >
                  <i className="ri-bar-chart-grouped-line ml-1"></i>
                  مقارنة تفصيلية
                </button>
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-brand-cream-200 p-5">
              <h3 className="font-black text-gray-900 text-sm mb-1">هل لديك استفسار؟</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">فريقنا جاهز للإجابة على جميع أسئلتك</p>
              <a
                href="tel:+966112345678"
                className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 hover:text-brand-forest-600 transition-colors cursor-pointer mb-3"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-100 rounded-xl">
                  <i className="ri-phone-line text-brand-forest-600 text-sm"></i>
                </div>
                011 234 5678
              </a>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-green-50 rounded-xl">
                  <i className="ri-whatsapp-line text-green-600 text-sm"></i>
                </div>
                واتساب
              </a>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
