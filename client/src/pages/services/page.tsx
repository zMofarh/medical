import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicServices } from "@/hooks/useCMSServices";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";
import TypewriterText from "@/components/base/TypewriterText";

// ... existing code ...

export default function Services() {
  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");
  const [activeCategory, setActiveCategory] = useState(isAr ? "الكل" : "All");
  const [search, setSearch] = useState("");
  const { services } = usePublicServices();

  const allCategories = isAr
    ? ["الكل", ...Array.from(new Set(services.map((s) => s.category)))]
    : ["All", ...Array.from(new Set(services.map((s) => s.category)))];

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "الكل" || activeCategory === "All" || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.includes(q) || s.description.includes(q) || s.category.includes(q);
    return matchCat && matchSearch;
  });

  const heroWords = t("services.hero.words").split("|");

  const whyUsItems = isAr
    ? [
        { Shape: StarShape,  title: "جلسات 90–120 دقيقة",   desc: "نمنح الحالة الوقت الذي تستحقه — لأن بعض الملفات لا تُفهم في دقائق" },
        { Shape: SunShape,   title: "تقنيات الطب الدقيق",    desc: "DNA Risk Score، العمر البيولوجي، التقييم الأيضي الوظيفي" },
        { Shape: SwanShape,  title: "امتداد دولي حقيقي",     desc: "Second Opinion من مراكز في USA وKorea للحالات المعقدة" },
        { Shape: LotusShape, title: "خطة شخصية لكل حالة",   desc: "لا بروتوكولات عامة — كل مريض يملك بيولوجيا ومسارًا مختلفًا" },
      ]
    : [
        { Shape: StarShape,  title: "90–120 Min Sessions",   desc: "We give each case the time it deserves — some files can't be understood in minutes" },
        { Shape: SunShape,   title: "Precision Medicine Tech", desc: "DNA Risk Score, Biological Age, Functional Metabolic Assessment" },
        { Shape: SwanShape,  title: "Real International Reach", desc: "Second Opinion from centers in USA & Korea for complex cases" },
        { Shape: LotusShape, title: "Personal Plan for Each Case", desc: "No generic protocols — every patient has a unique biology and health trajectory" },
      ];

  return (
    <div className="min-h-screen bg-white" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-forest-900 to-brand-forest-800 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://readdy.ai/api/search-image?query=precision%20medicine%20laboratory%20DNA%20genomics%20advanced%20diagnostics%20dark%20teal%20background%20sophisticated%20technology%20professional%20healthcare%20modern%20clinical&width=1440&height=500&seq=srv-ma-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest-900/40 to-brand-forest-900/60"></div>

        <div className="absolute top-10 right-14 opacity-[0.13] pointer-events-none">
          <StarShape size={96} color="#e8dcc8" />
        </div>
        <div className="absolute bottom-8 left-14 opacity-[0.10] pointer-events-none">
          <LotusShape size={80} color="#e8dcc8" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-8 opacity-[0.07] pointer-events-none">
          <SwanShape size={64} color="#e8dcc8" />
        </div>
        <div className="absolute top-8 right-1/3 opacity-[0.06] pointer-events-none">
          <SunShape size={52} color="#e8dcc8" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/25 backdrop-blur-sm">
            <StarShape size={12} color="#e8dcc8" />
            {t("services.hero.badge")}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight min-h-[1.3em]">
            <TypewriterText
              words={heroWords}
              typeSpeed={60}
              deleteSpeed={35}
              pauseAfter={2600}
              startDelay={700}
              cursorChar="▌"
              cursorClassName="text-brand-cream-400/60 text-4xl md:text-5xl"
            />
          </h1>
          <p className="text-brand-cream-200/80 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("services.hero.desc")}
          </p>
          <div className="max-w-lg mx-auto relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-base"></i>
            </div>
            <input
              type="text"
              placeholder={t("services.search.placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-gray-800 text-sm pr-11 pl-4 py-4 rounded-2xl outline-none placeholder-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mt-10">
            {[
              { value: "8+", label: isAr ? "خدمة متخصصة" : "Specialized Services" },
              { value: "90–120", label: isAr ? "دقيقة لكل جلسة" : "min per session" },
              { value: "12+", label: isAr ? "مركز دولي شريك" : "International Partners" },
              { value: "4.9", label: isAr ? "تقييم المرضى" : "Patient Rating" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/15">
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-brand-cream-200/70 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-5 bg-white border-b border-brand-cream-200 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-brand-forest text-white"
                    : "bg-brand-cream-100 text-gray-600 hover:bg-brand-forest-100 hover:text-brand-forest"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-100 rounded-full mx-auto mb-4">
                <i className="ri-search-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500 font-semibold">{t("services.no_results")}</p>
              <button onClick={() => { setSearch(""); setActiveCategory(isAr ? "الكل" : "All"); }} className="mt-3 text-brand-forest text-sm font-semibold hover:underline cursor-pointer">
                {t("packages.reset")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((service, i) => {
                const accentMap: Record<string, { bg: string; text: string; border: string; iconBg: string; btn: string; badge: string }> = {
                  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",  iconBg: "bg-rose-100",  btn: "bg-rose-600 hover:bg-rose-700",   badge: "bg-rose-600" },
                  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200",iconBg: "bg-orange-100",btn: "bg-orange-500 hover:bg-orange-600", badge: "bg-orange-500" },
                  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200",iconBg: "bg-violet-100",btn: "bg-violet-600 hover:bg-violet-700", badge: "bg-violet-600" },
                  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",  iconBg: "bg-cyan-100",  btn: "bg-cyan-600 hover:bg-cyan-700",   badge: "bg-cyan-600" },
                  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200", iconBg: "bg-amber-100", btn: "bg-amber-500 hover:bg-amber-600",  badge: "bg-amber-500" },
                  teal:   { bg: "bg-brand-forest-50", text: "text-brand-forest", border: "border-brand-forest-100", iconBg: "bg-brand-forest-100", btn: "bg-brand-forest hover:bg-brand-forest-700", badge: "bg-brand-forest" },
                  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200", iconBg: "bg-green-100", btn: "bg-green-600 hover:bg-green-700",  badge: "bg-green-600" },
                  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",  iconBg: "bg-pink-100",  btn: "bg-pink-600 hover:bg-pink-700",   badge: "bg-pink-600" },
                };
                const accent = accentMap[service.accentColor] ?? accentMap.teal;
                const minPrice = Math.min(...service.prices.map((p) => p.price));
                return (
                  <div
                    key={service.id}
                    style={{ opacity: 1, transform: "translateY(0)", transition: `opacity 0.6s ease ${i * 50}ms, transform 0.6s ease ${i * 50}ms` }}
                  >
                    <div className={`group bg-white rounded-2xl border ${accent.border} overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
                      <div className="relative overflow-hidden h-44 flex-shrink-0">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl ${accent.iconBg}`}>
                          <i className={`${service.icon} text-base ${accent.text}`}></i>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${accent.badge}`}>{service.category}</span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-black text-gray-900 text-sm leading-snug mb-1.5">{service.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">{service.description}</p>
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-brand-cream-100">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <i className="ri-user-line text-gray-400"></i>
                            <span>{service.doctors.length} {isAr ? "طبيب" : "Dr."}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <i className="ri-list-check-2 text-gray-400"></i>
                            <span>{service.procedures.length} {isAr ? "إجراء" : "proc."}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <i className="ri-star-fill text-amber-400"></i>
                            <span>4.9</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[10px] text-gray-400">{t("services.from")}</p>
                            <p className={`text-base font-black ${accent.text}`}>{minPrice.toLocaleString()} <span className="text-xs font-normal text-gray-400">{t("label.sar")}</span></p>
                          </div>
                          <Link to={`/services/${service.id}`} className={`text-xs font-bold text-white px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}>
                            {t("services.details")}
                            <i className="ri-arrow-left-line mr-1"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-brand-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              {isAr ? "لماذا خدماتنا مختلفة؟" : "Why Are Our Services Different?"}
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              {isAr ? "نجمع بين العمق السريري، الدقة التقنية، والامتداد الدولي" : "We combine clinical depth, technical precision, and international reach"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUsItems.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-brand-cream-200 hover:-translate-y-0.5 transition-transform duration-200">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-brand-forest-800 mx-auto mb-4">
                  <item.Shape size={28} color="#e8dcc8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-forest-900 relative overflow-hidden">
        <div className="absolute top-6 right-12 opacity-[0.12] pointer-events-none"><LotusShape size={88} color="#e8dcc8" /></div>
        <div className="absolute bottom-6 left-12 opacity-[0.09] pointer-events-none"><StarShape size={72} color="#e8dcc8" /></div>
        <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-white/15 rounded-full mx-auto mb-5">
            <SunShape size={28} color="#e8dcc8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{t("services.cta.heading")}</h2>
          <p className="text-brand-cream-200/80 mb-8 text-sm leading-relaxed">{t("services.cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 bg-brand-cream text-brand-forest-900 font-bold px-8 py-3.5 rounded-full hover:bg-brand-cream-100 transition-colors whitespace-nowrap cursor-pointer text-sm">
              <i className="ri-calendar-check-line"></i>
              {t("cta.btn_book")}
            </Link>
            <Link to="/packages" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-sm">
              <i className="ri-gift-line"></i>
              {isAr ? "تصفح الباقات" : "Browse Packages"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
