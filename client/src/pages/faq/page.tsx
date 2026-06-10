import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicFAQData as usePublicFAQ } from "@/hooks/useCMSFAQ";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";
import TypewriterText from "@/components/base/TypewriterText";

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-brand-cream-400 bg-brand-cream-50"
          : "border-gray-100 bg-white hover:border-brand-cream-300"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-right cursor-pointer"
      >
        <span
          className={`font-bold text-sm md:text-base leading-relaxed ${
            isOpen ? "text-brand-forest-700" : "text-gray-800"
          }`}
        >
          {question}
        </span>
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${
            isOpen ? "bg-brand-forest-600 rotate-180" : "bg-gray-100"
          }`}
        >
          <i
            className={`ri-arrow-down-s-line text-lg ${
              isOpen ? "text-white" : "text-gray-500"
            }`}
          ></i>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">
          <div className="h-px bg-brand-cream-300 mb-4"></div>
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");
  const { faqs, categories: faqCategories } = usePublicFAQ();

  const [activeCategory, setActiveCategory] = useState("general");
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const heroWords = t("faq.hero.words").split("|");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.includes(searchQuery) ||
      faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-forest-900 via-brand-forest-800 to-brand-forest-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20question%20mark%20pattern%20minimal%20geometric%20shapes%20clean%20white%20lines%20on%20dark%20forest%20green%20background%20modern%20design%20healthcare%20precision%20medicine&width=1440&height=500&seq=faq-hero-v2&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Shapes — decorative */}
        <div className="absolute top-14 left-10 pointer-events-none" style={{ opacity: 0.10 }}>
          <LotusShape size={110} color="white" />
        </div>
        <div className="absolute bottom-8 right-14 pointer-events-none" style={{ opacity: 0.08 }}>
          <StarShape size={90} color="white" />
        </div>
        <div className="absolute top-24 right-1/4 pointer-events-none" style={{ opacity: 0.05 }}>
          <SunShape size={70} color="white" />
        </div>
        <div className="absolute bottom-20 left-1/3 pointer-events-none" style={{ opacity: 0.05 }}>
          <SwanShape size={65} color="white" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/20">
            <LotusShape size={12} color="white" />
            {t("faq.hero.badge")}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight min-h-[1.3em]">
            <TypewriterText
              words={heroWords}
              typeSpeed={68}
              deleteSpeed={40}
              pauseAfter={2700}
              startDelay={650}
              cursorChar="▌"
              cursorClassName="text-brand-cream-400/60 text-4xl md:text-5xl"
            />
          </h1>
          <p className="text-brand-cream-200 text-lg mb-10 leading-relaxed">
            {t("faq.hero.desc")}
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-lg"></i>
            </div>
            <input
              type="text"
              placeholder={t("faq.search.placeholder")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCategory("all");
              }}
              className="w-full bg-white rounded-full py-4 pr-12 pl-6 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-cream-300"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("general");
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-gray-400 text-lg"></i>
              </button>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { icon: "ri-question-answer-line", value: `${faqs.length}+`, label: isAr ? "سؤال وجواب" : "Q&A" },
              { icon: "ri-time-line", value: "< 1h", label: isAr ? "وقت الرد" : "Response Time" },
              { icon: "ri-customer-service-2-line", value: "24/7", label: isAr ? "دعم متواصل" : "Continuous Support" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${s.icon} text-brand-cream-300 text-sm`}></i>
                </div>
                <span className="text-white font-black text-sm">{s.value}</span>
                <span className="text-brand-cream-300 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-brand-cream-200 p-5 sticky top-28">
                <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                    <i className="ri-list-unordered text-brand-forest-600 text-xs"></i>
                  </div>
                  {isAr ? "التصنيفات" : "Categories"}
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      activeCategory === "all" && !searchQuery
                        ? "bg-brand-forest-600 text-white"
                        : "text-gray-600 hover:bg-brand-cream-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-apps-line text-base"></i>
                      </div>
                      <span>{isAr ? "جميع الأسئلة" : "All Questions"}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        activeCategory === "all" && !searchQuery
                          ? "bg-white/20 text-white"
                          : "bg-brand-cream-100 text-gray-500"
                      }`}
                    >
                      {faqs.length}
                    </span>
                  </button>

                  {faqCategories.map((cat) => {
                    const count = faqs.filter((f) => f.category === cat.id).length;
                    const isActive = activeCategory === cat.id && !searchQuery;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-brand-forest-600 text-white"
                            : "text-gray-600 hover:bg-brand-cream-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className={`${cat.icon} text-base`}></i>
                          </div>
                          <span>{cat.label}</span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-brand-cream-100 text-gray-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Contact */}
                <div className="mt-6 pt-5 border-t border-brand-cream-200">
                  <p className="text-xs text-gray-500 mb-3 font-medium">{t("faq.still_have")}</p>
                  <Link
                    to="/contact"
                    className="w-full flex items-center justify-center gap-2 bg-brand-forest-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-brand-forest-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-message-3-line"></i>
                    {t("faq.contact_us")}
                  </Link>
                  <a
                    href="tel:+966112345678"
                    className="w-full flex items-center justify-center gap-2 border border-brand-cream-300 text-gray-700 text-sm font-medium py-3 rounded-xl hover:border-brand-forest-400 hover:text-brand-forest-600 transition-colors mt-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-phone-line"></i>
                    {isAr ? "اتصل بنا مباشرة" : "Call Us Directly"}
                  </a>
                </div>

                {/* Brand shape mini */}
                <div className="mt-5 pt-4 border-t border-brand-cream-100 flex items-center justify-center gap-3">
                  {[StarShape, SunShape, SwanShape, LotusShape].map((Shape, i) => (
                    <div key={i} className="w-7 h-7 flex items-center justify-center">
                      <Shape size={18} color="#4a6741" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* FAQ List */}
            <div className="flex-1">
              {searchQuery && (
                <div className="mb-5 flex items-center gap-2 text-sm text-gray-500 bg-white rounded-xl border border-brand-cream-200 px-4 py-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-search-line text-brand-forest-500"></i>
                  </div>
                  <span>
                    {isAr ? "نتائج البحث عن:" : "Search results for:"}{" "}
                    <strong className="text-gray-800">{searchQuery}</strong>{" "}
                    <span className="text-brand-forest-600 font-bold">({filteredFaqs.length} {isAr ? "نتيجة" : "results"})</span>
                  </span>
                </div>
              )}

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-brand-cream-200">
                  <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-100 rounded-full mx-auto mb-4">
                    <i className="ri-search-line text-3xl text-brand-forest-400"></i>
                  </div>
                  <h3 className="font-bold text-gray-700 mb-2">{t("faq.no_results")}</h3>
                  <p className="text-gray-400 text-sm">{isAr ? "جرب كلمات بحث مختلفة أو تواصل معنا مباشرة" : "Try different search terms or contact us directly"}</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 mt-5 bg-brand-forest-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-brand-forest-700 transition-colors whitespace-nowrap cursor-pointer text-sm"
                  >
                    <i className="ri-message-3-line"></i>
                    {t("btn.contact_us")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openId === String(faq.id)}
                      onToggle={() => handleToggle(String(faq.id))}
                    />
                  ))}
                </div>
              )}

              {/* Bottom Stats */}
              {!searchQuery && (
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { icon: "ri-question-answer-line", num: `${faqs.length}+`, label: isAr ? "سؤال وجواب" : "Q&A" },
                    { icon: "ri-time-line", num: "< 1h", label: isAr ? "وقت الرد" : "Response Time" },
                    { icon: "ri-customer-service-2-line", num: "24/7", label: isAr ? "دعم متواصل" : "Support" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-brand-cream-200 p-4 text-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-100 rounded-xl mx-auto mb-3">
                        <i className={`${s.icon} text-xl text-brand-forest-600`}></i>
                      </div>
                      <div className="font-black text-gray-900 text-lg">{s.num}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-br from-brand-cream-100 to-brand-cream-200 rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 border border-brand-cream-300 relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-4 left-4 pointer-events-none" style={{ opacity: 0.12 }}>
              <LotusShape size={70} color="#4a6741" />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none" style={{ opacity: 0.10 }}>
              <StarShape size={60} color="#4a6741" />
            </div>

            <div className="relative flex-1 text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-brand-forest-600/10 text-brand-forest-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <SunShape size={12} color="#4a6741" />
                {isAr ? "منصة الطب الدقيق" : "Precision Medicine Platform"}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                {t("faq.still_have")}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {isAr
                  ? "فريق خبراء الطب الدقيق لدينا متاح للإجابة على جميع استفساراتك — سواء حول التقييم العميق أو تحليل DNA أو الرأي الطبي الدولي"
                  : "Our precision medicine experts are available to answer all your inquiries — whether about deep assessment, DNA analysis, or international second opinion"}
              </p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/contact"
                className="bg-brand-forest-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-brand-forest-700 transition-colors whitespace-nowrap cursor-pointer text-center text-sm"
              >
                <i className="ri-mail-send-line ml-2"></i>
                {isAr ? "أرسل رسالة" : "Send a Message"}
              </Link>
              <Link
                to="/booking"
                className="border-2 border-brand-forest-600 text-brand-forest-600 font-bold px-7 py-3.5 rounded-full hover:bg-brand-forest-600 hover:text-white transition-all whitespace-nowrap cursor-pointer text-center text-sm"
              >
                <i className="ri-calendar-check-line ml-2"></i>
                {t("cta.btn_book")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Precision Medicine CTA */}
      <section className="py-14 bg-brand-forest-900 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-6 right-10 pointer-events-none" style={{ opacity: 0.07 }}>
          <SwanShape size={100} color="white" />
        </div>
        <div className="absolute bottom-6 left-10 pointer-events-none" style={{ opacity: 0.06 }}>
          <SunShape size={90} color="white" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                Shape: StarShape,
                title: "تقييم عميق متعدد الطبقات",
                desc: "جلسات 90–120 دقيقة لفهم الحالة بالكامل قبل أي قرار",
              },
              {
                Shape: LotusShape,
                title: "تحليل DNA والمخاطر المستقبلية",
                desc: "نقرأ استعداداتك الجينية لنستبق المخاطر قبل أن تتحول إلى واقع",
              },
              {
                Shape: SwanShape,
                title: "امتداد دولي عند الحاجة",
                desc: "شبكة خبرات في USA وكوريا الجنوبية للحالات التي تحتاج منظوراً أوسع",
              },
            ].map(({ Shape, title, desc }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-2xl mb-4">
                  <Shape size={28} color="#d4c5a9" />
                </div>
                <h3 className="font-black text-white text-sm mb-2">{title}</h3>
                <p className="text-brand-cream-300 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
