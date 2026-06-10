import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import { StarShape, LotusShape, SwanShape, SunShape } from "@/components/base/BrandShapes";
import ScrollReveal from "@/components/base/ScrollReveal";
import TypewriterText from "@/components/base/TypewriterText";

export default function Doctors() {
  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");

  const specialties = isAr
    ? ["الكل", "الطب الدقيق وتقييم المخاطر", "الخلل الأيضي وMASLD", "الطب النفسي للبالغين", "الجينات والطب الدقيق", "هشاشة العظام المكثفة", "العلاجات الوريدية المتخصصة"]
    : ["All", "Precision Medicine & Risk Assessment", "Metabolic Dysfunction & MASLD", "Adult Psychiatry", "Genetics & Precision Medicine", "Intensive Osteoporosis", "Specialized IV Therapy"];

  const [activeSpec, setActiveSpec] = useState(specialties[0]);
  const [search, setSearch] = useState("");
  const { doctors } = usePublicDoctors();

  const filtered = doctors.filter((d) => {
    const matchSpec = activeSpec === "الكل" || activeSpec === "All" || d.specialty === activeSpec || d.specialty.includes(activeSpec.split(" ")[0]);
    const matchSearch = d.name.includes(search) || d.specialty.includes(search) || d.title.includes(search);
    return matchSpec && matchSearch;
  });

  const heroWords = t("doctors.hero.words").split("|");

  const philosophyItems = isAr
    ? [
        { Shape: StarShape, label: "الخبرة الطبية", desc: "استشاريون بخبرة دولية" },
        { Shape: SunShape,  label: "الحيوية والصحة", desc: "نهج شامل للعافية" },
        { Shape: SwanShape, label: "التوازن الأيضي", desc: "تقييم دقيق ومتكامل" },
        { Shape: LotusShape,label: "التجدد الداخلي", desc: "خطة مخصصة لكل حالة" },
      ]
    : [
        { Shape: StarShape, label: "Medical Expertise", desc: "Internationally trained consultants" },
        { Shape: SunShape,  label: "Vitality & Health", desc: "Holistic wellness approach" },
        { Shape: SwanShape, label: "Metabolic Balance", desc: "Precise integrated assessment" },
        { Shape: LotusShape,label: "Inner Renewal", desc: "Personalized plan for each case" },
      ];

  return (
    <div className="min-h-screen bg-white" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-brand-forest-800 to-brand-forest-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=precision%20medicine%20team%20doctors%20advanced%20clinical%20environment%20dark%20forest%20green%20background%20sophisticated%20medical%20science%20professional&width=1440&height=400&seq=doc-ma-hero-v2&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-10 right-16 opacity-15 pointer-events-none"><StarShape size={90} color="#e8dcc8" /></div>
        <div className="absolute bottom-8 left-20 opacity-10 pointer-events-none"><LotusShape size={80} color="#e8dcc8" /></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/30">
            <StarShape size={12} color="#e8dcc8" />
            {t("doctors.hero.badge")}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 min-h-[1.3em]">
            <TypewriterText
              words={heroWords}
              typeSpeed={65}
              deleteSpeed={38}
              pauseAfter={2800}
              startDelay={600}
              cursorChar="▌"
              cursorClassName="text-brand-cream-400/60 text-4xl md:text-5xl"
            />
          </h1>
          <p className="text-brand-cream-200 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("doctors.hero.desc")}
          </p>
          <div className="max-w-md mx-auto relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-base"></i>
            </div>
            <input
              type="text"
              placeholder={t("doctors.search.placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-gray-800 text-sm pr-11 pl-4 py-3.5 rounded-full outline-none placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Specialty Filter */}
      <section className="py-5 bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setActiveSpec(spec)}
                className={`flex-shrink-0 text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeSpec === spec
                    ? "bg-brand-forest-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-brand-cream-100 hover:text-brand-forest-700"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
                <i className="ri-search-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500">{t("doctors.no_results")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc, i) => (
                <ScrollReveal key={doc.id} variant="up" delay={i * 70}>
                  <Link to={`/doctors/${doc.id}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                    <div className="relative overflow-hidden bg-gradient-to-br from-brand-cream-100 to-brand-cream-200" style={{ height: "260px" }}>
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full">
                        <i className="ri-star-fill text-amber-400 text-xs"></i>
                        <span className="text-xs font-bold text-gray-800">{doc.rating}</span>
                        <span className="text-xs text-gray-400">({doc.reviewsCount})</span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <StarShape size={20} color="rgba(232,220,200,0.8)" />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="font-black text-gray-900 text-base mb-0.5">{doc.name}</h3>
                        <p className="text-brand-forest-600 text-sm font-semibold">{doc.title}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 bg-brand-cream-100 text-brand-forest-700 text-xs px-2.5 py-1 rounded-full">
                          <i className="ri-stethoscope-line text-xs"></i>
                          {doc.specialty}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                          <i className="ri-time-line text-xs"></i>
                          {doc.experience}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                        <div>
                          <span className="text-xs text-gray-400">{t("doctors.fee")}</span>
                          <p className="font-black text-brand-forest-700 text-sm">{doc.consultationFee} {t("label.sar")}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-brand-forest-600 text-sm font-semibold group-hover:gap-2 transition-all duration-200 whitespace-nowrap">
                          {t("doctors.profile")}
                          <i className="ri-arrow-left-line"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Strip */}
      <section className="py-10 bg-brand-cream-50 border-y border-brand-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {philosophyItems.map(({ Shape, label, desc }, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 p-4">
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

      {/* Join Team CTA */}
      <section className="py-16 bg-brand-cream-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="relative bg-brand-forest-900 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute top-6 right-8 opacity-15 pointer-events-none"><LotusShape size={64} color="#e8dcc8" /></div>
            <div className="absolute bottom-6 left-8 opacity-10 pointer-events-none"><StarShape size={48} color="#e8dcc8" /></div>
            <div className="relative z-10">
              <div className="w-16 h-16 flex items-center justify-center bg-white/15 rounded-2xl mx-auto mb-5">
                <SunShape size={32} color="#e8dcc8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                {isAr ? "هل أنت متخصص في الطب الدقيق؟" : "Are You a Precision Medicine Specialist?"}
              </h2>
              <p className="text-brand-cream-200 mb-6 max-w-xl mx-auto leading-relaxed">
                {isAr
                  ? "نرحب بانضمام الاستشاريين المتخصصين في تخصصات دقيقة ونادرة إلى منصة ذا مديكال أفينيو."
                  : "We welcome specialized consultants in rare and precise specialties to join The Medical Avenue platform."}
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-cream-300 text-brand-forest-900 font-bold px-8 py-3.5 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-mail-send-line"></i>
                {t("btn.contact_us")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
