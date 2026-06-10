import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicServices } from "@/hooks/useCMSServices";

const accentMap: Record<string, {
  bg: string; text: string; border: string; iconBg: string;
  btn: string; gradient: string; lightBg: string; badge: string;
  ring: string; gradientLight: string;
}> = {
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",  iconBg: "bg-rose-100",  btn: "bg-rose-600 hover:bg-rose-700",   gradient: "from-rose-900 via-rose-800 to-rose-700",   lightBg: "bg-rose-50",   badge: "bg-rose-600",   ring: "ring-rose-200",   gradientLight: "from-rose-50 to-white" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200",iconBg: "bg-orange-100",btn: "bg-orange-500 hover:bg-orange-600", gradient: "from-orange-900 via-orange-800 to-orange-700",lightBg: "bg-orange-50", badge: "bg-orange-500", ring: "ring-orange-200", gradientLight: "from-orange-50 to-white" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",  iconBg: "bg-pink-100",  btn: "bg-pink-600 hover:bg-pink-700",   gradient: "from-pink-900 via-pink-800 to-pink-700",   lightBg: "bg-pink-50",   badge: "bg-pink-600",   ring: "ring-pink-200",   gradientLight: "from-pink-50 to-white" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200", iconBg: "bg-green-100", btn: "bg-green-600 hover:bg-green-700",  gradient: "from-green-900 via-green-800 to-green-700", lightBg: "bg-green-50",  badge: "bg-green-600",  ring: "ring-green-200",  gradientLight: "from-green-50 to-white" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200",iconBg: "bg-violet-100",btn: "bg-violet-600 hover:bg-violet-700", gradient: "from-violet-900 via-violet-800 to-violet-700",lightBg: "bg-violet-50", badge: "bg-violet-600", ring: "ring-violet-200", gradientLight: "from-violet-50 to-white" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",  iconBg: "bg-cyan-100",  btn: "bg-cyan-600 hover:bg-cyan-700",   gradient: "from-cyan-900 via-cyan-800 to-cyan-700",   lightBg: "bg-cyan-50",   badge: "bg-cyan-600",   ring: "ring-cyan-200",   gradientLight: "from-cyan-50 to-white" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200", iconBg: "bg-amber-100", btn: "bg-amber-500 hover:bg-amber-600",  gradient: "from-amber-900 via-amber-800 to-amber-700", lightBg: "bg-amber-50",  badge: "bg-amber-500",  ring: "ring-amber-200",  gradientLight: "from-amber-50 to-white" },
  teal:   { bg: "bg-brand-forest-50", text: "text-brand-forest", border: "border-brand-forest-100", iconBg: "bg-brand-forest-100", btn: "bg-brand-forest hover:bg-brand-forest-700", gradient: "from-brand-forest-900 via-brand-forest-800 to-brand-forest-700", lightBg: "bg-brand-forest-50", badge: "bg-brand-forest", ring: "ring-brand-forest-100", gradientLight: "from-brand-forest-50 to-white" },
};

// Methodology steps — shared across all services, adapted per service
const methodologySteps = [
  {
    step: "01",
    icon: "ri-file-search-line",
    title: "الاستماع العميق",
    desc: "نبدأ بجلسة استماع مطوّلة تتجاوز الشكوى الرئيسية — نفهم التاريخ الصحي الكامل، نمط الحياة، العوامل الوراثية، والسياق النفسي والاجتماعي.",
    duration: "30–45 دقيقة",
    tag: "العمق السريري",
  },
  {
    step: "02",
    icon: "ri-stack-line",
    title: "التقييم متعدد الطبقات",
    desc: "نفكك الحالة عبر طبقات متعددة: السريرية، المخبرية، الوظيفية، والجينية. لا نكتفي بما يظهر — نقرأ ما وراء العرض.",
    duration: "60–90 دقيقة",
    tag: "العمق التقني",
  },
  {
    step: "03",
    icon: "ri-radar-line",
    title: "قراءة المخاطر المستقبلية",
    desc: "نربط بين الحاضر الصحي والمخاطر المستقبلية. نستخدم DNA Risk Score، المؤشرات الأيضية، والعمر البيولوجي لبناء صورة استباقية شاملة.",
    duration: "تحليل متكامل",
    tag: "الطب الدقيق",
  },
  {
    step: "04",
    icon: "ri-global-line",
    title: "الاستشارة الدولية عند الحاجة",
    desc: "للحالات المعقدة، نستعين بشبكتنا الدولية في الولايات المتحدة وجنوب كوريا وغيرها. Second Opinion منظم لا شكلي.",
    duration: "7–14 يوم",
    tag: "العمق الدولي",
  },
  {
    step: "05",
    icon: "ri-user-heart-line",
    title: "الخطة الشخصية",
    desc: "نصمم خطة علاجية مبنية على بيولوجيا المريض ومساره الصحي الفريد — لا بروتوكولات عامة، بل قرار طبي مخصص.",
    duration: "جلسة تفسير",
    tag: "التخصيص",
  },
  {
    step: "06",
    icon: "ri-calendar-check-line",
    title: "المتابعة اللصيقة",
    desc: "رعايتنا لا تنتهي عند التشخيص. نتابع المؤشرات، نعدّل الخطة، ونبقى على تواصل مستمر مع المريض عبر التطبيق والزيارات الدورية.",
    duration: "مستمر",
    tag: "الاستمرارية",
  },
];

// Three dimensions of excellence
const threeDimensions = [
  {
    icon: "ri-stethoscope-line",
    title: "العمق السريري",
    desc: "وقت أطول، تقييم غير سريع، وفهم متعدد التخصصات",
    items: ["جلسات 90–120 دقيقة", "تقييم متعدد الطبقات", "فهم السياق الكامل"],
    color: "teal",
  },
  {
    icon: "ri-dna-line",
    title: "العمق التقني",
    desc: "DNA، مخاطر مستقبلية، عمر بيولوجي، تقييم أيضي ووظيفي",
    items: ["DNA Risk Score", "العمر البيولوجي", "التحاليل الوظيفية المتقدمة"],
    color: "violet",
  },
  {
    icon: "ri-global-line",
    title: "العمق الدولي",
    desc: "Second Opinion وربط الحالة بخبرات ومراكز في USA وKorea",
    items: ["12+ مركز دولي شريك", "Second Opinion منظم", "تنسيق السفر للعلاج"],
    color: "slate",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-right bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">
          <i className={`ri-arrow-down-s-line text-gray-400 text-lg transition-transform duration-200 ${open ? "rotate-180" : ""}`}></i>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { services } = usePublicServices();
  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <i className="ri-search-line text-3xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">الخدمة غير موجودة</h2>
          <Link to="/services" className="bg-teal-600 text-white font-bold px-6 py-3 rounded-full hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer">
            العودة للخدمات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const accent = accentMap[service.accentColor] ?? accentMap.teal;
  const relatedServices = services.filter((s) => service.relatedServices.includes(s.id));

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className={`relative pt-28 pb-0 bg-gradient-to-br ${accent.gradient} overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <img
            src={service.heroImage}
            alt={service.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-xs mb-6">
            <Link to="/" className="hover:text-white transition-colors cursor-pointer">الرئيسية</Link>
            <i className="ri-arrow-left-s-line"></i>
            <Link to="/services" className="hover:text-white transition-colors cursor-pointer">الخدمات</Link>
            <i className="ri-arrow-left-s-line"></i>
            <span className="text-white font-semibold">{service.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-end">
            {/* Info */}
            <div className="flex-1">
              {/* Platform badge */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <i className="ri-microscope-line text-xs"></i>
                  منصة الطب الدقيق
                </div>
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                  {service.category}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <i className={`${service.icon} text-2xl text-white`}></i>
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{service.name}</h1>
                  <p className={`text-white/70 text-sm mt-0.5 italic`}>&ldquo;{service.tagline}&rdquo;</p>
                </div>
              </div>

              <p className="text-white/80 text-sm mb-6 max-w-xl leading-relaxed">{service.longDescription}</p>

              {/* Three depth badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: "ri-stethoscope-line", label: "عمق سريري" },
                  { icon: "ri-dna-line", label: "عمق تقني" },
                  { icon: "ri-global-line", label: "عمق دولي" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <i className={`${b.icon} text-xs`}></i>
                    {b.label}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {service.stats.map((stat, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Book Card */}
            <div className="w-full lg:w-72 bg-white rounded-2xl p-5 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                  <i className={`ri-calendar-check-line text-sm ${accent.text}`}></i>
                </div>
                <h3 className="font-black text-gray-900 text-sm">احجز موعدك الآن</h3>
              </div>
              <div className={`rounded-xl p-3 mb-4 ${accent.lightBg} border ${accent.border}`}>
                <p className="text-xs text-gray-500 mb-1">الأسعار تبدأ من</p>
                <p className={`text-2xl font-black ${accent.text}`}>
                  {Math.min(...service.prices.map((p) => p.price)).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 mr-1">ريال</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">جلسات 90–120 دقيقة</p>
              </div>
              <Link
                to="/booking"
                className={`block w-full text-center text-white font-bold py-3 rounded-xl transition-colors whitespace-nowrap cursor-pointer text-sm mb-2 ${accent.btn}`}
              >
                <i className="ri-calendar-check-line ml-2"></i>
                احجز موعداً
              </Link>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-green-700 font-bold py-2.5 rounded-xl border-2 border-green-200 hover:bg-green-50 transition-colors whitespace-nowrap cursor-pointer text-sm"
              >
                <i className="ri-whatsapp-line ml-2 text-green-600"></i>
                استفسر عبر واتساب
              </a>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {[
                  { icon: "ri-shield-check-line", text: "ضمان جودة الخدمة", color: "text-green-500" },
                  { icon: "ri-time-line", text: "جلسات 90–120 دقيقة", color: "text-teal-500" },
                  { icon: "ri-file-text-line", text: "تقرير إلكتروني مفصل", color: "text-amber-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${item.icon} ${item.color}`}></i>
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW WE WORK — منهجية التقييم العميق ─── */}
      <section className="py-20 bg-brand-cream-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-brand-forest-50 border border-brand-forest-100 text-brand-forest text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                <i className="ri-route-line text-xs"></i>
                منهجية ذا مديكال أفينيو
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                كيف نعمل — منهجية التقييم العميق
              </h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                لسنا عيادة تتعامل مع الشكوى فقط — نفكك الحالة ونقرأ ما وراء العرض، ونربط بين الحاضر الصحي والمخاطر المستقبلية
              </p>
            </div>
          </FadeIn>

          {/* Steps */}
          <div className="relative">
            <div className="hidden lg:block absolute top-10 right-10 left-10 h-0.5 bg-gradient-to-l from-brand-cream-200 via-brand-forest-200 to-brand-cream-200 z-0"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {methodologySteps.map((step, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="bg-white rounded-2xl border border-brand-cream-200 p-6 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-3 left-4 text-6xl font-black text-brand-cream-100 select-none pointer-events-none leading-none">
                      {step.step}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${accent.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                          <i className={`${step.icon} text-lg ${accent.text}`}></i>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-400">الخطوة {step.step}</span>
                          <div className={`text-xs font-semibold ${accent.text} mt-0.5`}>{step.tag}</div>
                        </div>
                      </div>

                      <h3 className="font-black text-gray-900 text-base mb-2">{step.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">{step.desc}</p>

                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-time-line text-gray-400 text-xs"></i>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Philosophy quote */}
          <FadeIn delay={200}>
            <div className={`mt-10 rounded-2xl p-6 bg-gradient-to-br ${accent.gradient} text-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <img
                  src="https://readdy.ai/api/search-image?query=abstract%20precision%20medicine%20molecular%20biology%20DNA%20strands%20dark%20background%20sophisticated%20scientific%20pattern%20minimal&width=1200&height=200&seq=detail-quote-bg&orientation=landscape"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <i className="ri-double-quotes-l text-3xl text-white/30 mb-2 block"></i>
                <p className="text-white font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  نفهم قبل أن نقرر — نحلل قبل أن نتدخل — نستبق قبل أن نطارد
                </p>
                <p className="text-white/60 text-xs mt-3">فلسفة ذا مديكال أفينيو في الطب الدقيق</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── THREE DIMENSIONS ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">ثلاثة أبعاد متكاملة للرعاية</h2>
              <p className="text-gray-500 text-sm">ما يميز ذا مديكال أفينيو عن أي عيادة تقليدية</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {threeDimensions.map((dim, i) => {
              const dimColors: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
                teal:   { bg: "bg-brand-forest-50",  text: "text-brand-forest",  iconBg: "bg-brand-forest-100",  border: "border-brand-forest-100" },
                violet: { bg: "bg-violet-50", text: "text-violet-700", iconBg: "bg-violet-100", border: "border-violet-100" },
                slate:  { bg: "bg-brand-cream-50",   text: "text-brand-brown",   iconBg: "bg-brand-cream-100",   border: "border-brand-cream-200" },
              };
              const dc = dimColors[dim.color] ?? dimColors.teal;
              return (
                <FadeIn key={i} delay={i * 100}>
                  <div className={`rounded-2xl border ${dc.border} ${dc.bg} p-6 h-full`}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${dc.iconBg} mb-4`}>
                      <i className={`${dim.icon} text-xl ${dc.text}`}></i>
                    </div>
                    <h3 className={`font-black text-lg mb-1 ${dc.text}`}>{dim.title}</h3>
                    <p className="text-gray-500 text-xs mb-4 leading-relaxed">{dim.desc}</p>
                    <ul className="space-y-2">
                      {dim.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-gray-700">
                          <div className={`w-4 h-4 flex items-center justify-center rounded-full ${dc.iconBg} flex-shrink-0`}>
                            <i className={`ri-check-line text-xs ${dc.text}`}></i>
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* About */}
            <FadeIn>
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-information-line text-base ${accent.text}`}></i>
                  </div>
                  عن هذه الخدمة
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{service.longDescription}</p>
              </section>
            </FadeIn>

            {/* Procedures */}
            <FadeIn delay={60}>
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-stethoscope-line text-base ${accent.text}`}></i>
                  </div>
                  الإجراءات والفحوصات المتاحة
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.procedures.map((proc, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${accent.lightBg} border ${accent.border}`}>
                      <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${accent.iconBg}`}>
                        <i className={`${proc.icon} text-base ${accent.text}`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{proc.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{proc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* Prices */}
            <FadeIn delay={80}>
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-price-tag-3-line text-base ${accent.text}`}></i>
                  </div>
                  الأسعار والتعرفة
                </h2>
                <div className="space-y-2">
                  {service.prices.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} border-gray-100`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {item.duration && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <i className="ri-time-line"></i>
                              {item.duration}
                            </span>
                          )}
                          {item.note && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <i className="ri-information-line"></i>
                              {item.note}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-left">
                          <p className={`text-base font-black ${accent.text}`}>{item.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">ريال</p>
                        </div>
                        <Link
                          to="/booking"
                          className={`text-xs font-bold text-white px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}
                        >
                          احجز
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-information-line text-amber-500 text-sm"></i>
                  </div>
                  <p className="text-xs text-amber-700">جميع الأسعار شاملة ضريبة القيمة المضافة. قد تختلف الأسعار حسب الحالة. تواصل معنا للاستفسار.</p>
                </div>
              </section>
            </FadeIn>

            {/* Doctors */}
            <FadeIn delay={100}>
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                    <i className={`ri-user-star-line text-base ${accent.text}`}></i>
                  </div>
                  الاستشاريون المتخصصون
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.doctors.map((doc, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${accent.border} ${accent.lightBg}`}>
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-900 text-sm">{doc.name}</h4>
                        <p className={`text-xs font-semibold mt-0.5 ${accent.text}`}>{doc.role}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.experience}</p>
                      </div>
                      <Link
                        to="/booking"
                        className={`text-xs font-bold text-white px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors flex-shrink-0 ${accent.btn}`}
                      >
                        احجز
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link to="/doctors" className={`text-sm font-bold ${accent.text} hover:underline cursor-pointer`}>
                    عرض جميع الاستشاريين
                    <i className="ri-arrow-left-line mr-1"></i>
                  </Link>
                </div>
              </section>
            </FadeIn>

            {/* FAQs */}
            {service.faqs.length > 0 && (
              <FadeIn delay={120}>
                <section className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                      <i className={`ri-question-answer-line text-base ${accent.text}`}></i>
                    </div>
                    الأسئلة الشائعة
                  </h2>
                  <div className="space-y-3">
                    {service.faqs.map((faq, i) => (
                      <FAQItem key={i} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {/* CTA Banner */}
            <FadeIn delay={140}>
              <section className={`rounded-2xl p-6 bg-gradient-to-br ${accent.gradient} text-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <img
                    src="https://readdy.ai/api/search-image?query=abstract%20precision%20medicine%20molecular%20pattern%20dark%20background%20sophisticated%20minimal%20scientific&width=800&height=200&seq=detail-cta-bg&orientation=landscape"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white/90 text-xs px-3 py-1 rounded-full mb-3">
                    <i className="ri-microscope-line text-xs"></i>
                    منصة الطب الدقيق
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">جاهز لتقييم عميق الحقيقي؟</h3>
                  <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
                    فريقنا من خبراء الطب الدقيق في {service.name} جاهز لمنح حالتك الوقت والعمق الذي تستحقه
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/booking"
                      className="bg-white font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer text-sm text-gray-800"
                    >
                      <i className="ri-calendar-check-line ml-2"></i>
                      احجز جلسة تقييم
                    </Link>
                    <Link
                      to="/packages"
                      className="border-2 border-white/50 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-sm"
                    >
                      <i className="ri-gift-line ml-2"></i>
                      تصفح الباقات
                    </Link>
                  </div>
                </div>
              </section>
            </FadeIn>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">

            {/* Sticky Book Card */}
            <div className={`bg-white rounded-2xl border ${accent.border} p-5 sticky top-24`}>
              <h3 className="font-black text-gray-900 text-sm mb-4">حجز سريع</h3>
              <div className={`rounded-xl p-3 mb-4 ${accent.lightBg}`}>
                <p className="text-xs text-gray-500 mb-1">الأسعار تبدأ من</p>
                <p className={`text-2xl font-black ${accent.text}`}>
                  {Math.min(...service.prices.map((p) => p.price)).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 mr-1">ريال</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">جلسات 90–120 دقيقة</p>
              </div>
              <Link
                to="/booking"
                className={`block w-full text-center text-white font-bold py-3 rounded-xl transition-colors whitespace-nowrap cursor-pointer text-sm mb-2 ${accent.btn}`}
              >
                <i className="ri-calendar-check-line ml-1.5"></i>
                احجز موعداً
              </Link>
              <Link
                to="/packages"
                className={`block w-full text-center font-bold py-2.5 rounded-xl border-2 ${accent.border} ${accent.text} hover:${accent.bg} transition-colors whitespace-nowrap cursor-pointer text-xs`}
              >
                <i className="ri-gift-line ml-1.5"></i>
                تصفح الباقات
              </Link>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-600 mb-2">تواصل معنا</p>
                <a href="tel:+966112345678" className="flex items-center gap-2 text-xs text-gray-600 hover:text-teal-600 transition-colors cursor-pointer mb-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-teal-50 rounded-lg">
                    <i className="ri-phone-line text-teal-600 text-xs"></i>
                  </div>
                  011 234 5678
                </a>
                <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-600 hover:text-green-600 transition-colors cursor-pointer">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-50 rounded-lg">
                    <i className="ri-whatsapp-line text-green-600 text-xs"></i>
                  </div>
                  واتساب
                </a>
              </div>
            </div>

            {/* Methodology mini card */}
            <div className="bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 flex items-center justify-center bg-brand-forest-100 rounded-lg">
                  <i className="ri-route-line text-brand-forest text-sm"></i>
                </div>
                <h3 className="font-black text-gray-900 text-sm">منهجيتنا</h3>
              </div>
              <div className="space-y-3">
                {methodologySteps.slice(0, 4).map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${accent.iconBg}`}>
                      <span className={`text-xs font-black ${accent.text}`}>{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{step.title}</p>
                      <p className="text-xs text-gray-400">{step.duration}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-1">
                  <a href="#methodology" className={`text-xs font-bold ${accent.text} hover:underline cursor-pointer`}>
                    عرض المنهجية الكاملة
                    <i className="ri-arrow-up-line mr-1"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-black text-gray-900 text-sm mb-4">خدمات ذات صلة</h3>
                <div className="space-y-3">
                  {relatedServices.map((rel) => {
                    const relAccent = accentMap[rel.accentColor] ?? accentMap.teal;
                    return (
                      <Link
                        key={rel.id}
                        to={`/services/${rel.id}`}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${relAccent.border} hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-white`}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${relAccent.iconBg}`}>
                          <i className={`${rel.icon} text-sm ${relAccent.text}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-xs truncate">{rel.name}</p>
                          <p className={`text-xs font-semibold mt-0.5 ${relAccent.text}`}>
                            من {Math.min(...rel.prices.map((p) => p.price)).toLocaleString()} ريال
                          </p>
                        </div>
                        <i className="ri-arrow-left-s-line text-gray-400 flex-shrink-0"></i>
                      </Link>
                    );
                  })}
                </div>
                <Link to="/services" className="block mt-4 text-center text-xs font-bold text-teal-600 hover:underline cursor-pointer">
                  عرض جميع الخدمات
                  <i className="ri-arrow-left-line mr-1"></i>
                </Link>
              </div>
            )}

            {/* Trust signals */}
            <div className={`rounded-2xl border ${accent.border} ${accent.lightBg} p-5`}>
              <h3 className="font-black text-gray-900 text-sm mb-4">لماذا ذا مديكال أفينيو؟</h3>
              <div className="space-y-3">
                {[
                  { icon: "ri-time-line", text: "جلسات 90–120 دقيقة — لأن بعض الملفات لا تُفهم في دقائق" },
                  { icon: "ri-dna-line", text: "تقنيات الطب الدقيق: DNA، عمر بيولوجي، تقييم أيضي" },
                  { icon: "ri-global-line", text: "شبكة دولية في USA وKorea للحالات المعقدة" },
                  { icon: "ri-user-heart-line", text: "خطة شخصية لكل مريض — لا بروتوكولات عامة" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5 ${accent.iconBg}`}>
                      <i className={`${item.icon} text-xs ${accent.text}`}></i>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
