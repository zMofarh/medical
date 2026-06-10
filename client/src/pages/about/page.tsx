import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { StarShape, SunShape, LotusShape, ShapeBadge } from "@/components/base/BrandShapes";
import TypewriterText from "@/components/base/TypewriterText";
import { usePublicAbout } from "@/hooks/useCMSAbout";

/* ─────────────────────────────────────────────
   Intersection hook
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─────────────────────────────────────────────
   Animation primitives
───────────────────────────────────────────── */
type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  duration?: number;
  className?: string;
}

function Reveal({ children, delay = 0, direction = "up", duration = 700, className = "" }: RevealProps) {
  const { ref, visible } = useInView();

  const getTransform = (dir: Direction, show: boolean) => {
    if (show) return "translate(0,0) scale(1)";
    switch (dir) {
      case "up":    return "translateY(36px) scale(1)";
      case "down":  return "translateY(-36px) scale(1)";
      case "left":  return "translateX(40px) scale(1)";
      case "right": return "translateX(-40px) scale(1)";
      case "scale": return "translateY(16px) scale(0.92)";
      default:      return "translate(0,0) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(direction, visible),
        transition: `opacity ${duration}ms cubic-bezier(.22,.68,0,1.2), transform ${duration}ms cubic-bezier(.22,.68,0,1.2)`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* Section heading with animated underline */
function SectionHeading({ badge, title, subtitle }: {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  const { ref, visible } = useInView(0.2);
  return (
    <div ref={ref} className="text-center mb-14">
      <span
        className="inline-block bg-brand-forest-100 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
        {badge}
      </span>
      <h2
        className="text-3xl md:text-4xl font-black text-gray-900 mb-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 600ms ease 80ms, transform 600ms ease 80ms",
        }}
      >
        {title}
      </h2>
      <div
        className="mx-auto h-0.5 bg-gradient-to-r from-transparent via-brand-forest-400 to-transparent mb-4"
        style={{
          width: visible ? "80px" : "0px",
          transition: "width 700ms cubic-bezier(.22,.68,0,1.2) 200ms",
        }}
      />
      {subtitle && (
        <p
          className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 600ms ease 300ms, transform 600ms ease 300ms",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* Wave divider between sections */
function WaveDivider({ flip = false, fromColor = "#ffffff", toColor = "#f5f0e8" }: {
  flip?: boolean;
  fromColor?: string;
  toColor?: string;
}) {
  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ height: "48px", background: toColor, transform: flip ? "scaleY(-1)" : "none" }}
    >
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full" style={{ display: "block" }}>
        <path d="M0,24 C360,48 1080,0 1440,24 L1440,0 L0,0 Z" fill={fromColor} />
      </svg>
    </div>
  );
}

/* Animated vertical timeline line */
function TimelineLine({ count }: { count: number }) {
  const { ref, visible } = useInView(0.05);
  return (
    <div ref={ref} className="absolute right-1/2 top-0 bottom-0 hidden md:block" style={{ width: "2px" }}>
      <div
        className="w-full bg-gradient-to-b from-brand-forest-300 via-brand-cream-300 to-brand-cream-200"
        style={{
          height: visible ? "100%" : "0%",
          transition: `height ${count * 120 + 400}ms cubic-bezier(.22,.68,0,1.2) 100ms`,
        }}
      />
    </div>
  );
}

/* Timeline item */
function TimelineItem({ m, i }: { m: { year: string; title: string; desc: string }; i: number }) {
  const { ref, visible } = useInView(0.15);
  const isEven = i % 2 === 0;
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-6 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 650ms ease ${i * 70}ms, transform 650ms cubic-bezier(.22,.68,0,1.2) ${i * 70}ms`,
      }}
    >
      <div className={`flex-1 ${isEven ? "md:text-left" : "md:text-right"}`}>
        <div className={`bg-brand-cream-50 rounded-2xl p-6 border border-brand-cream-200 hover:border-brand-forest-300 transition-all duration-300 hover:-translate-y-1 ${isEven ? "md:ml-8" : "md:mr-8"}`}>
          <span className="inline-block bg-brand-forest-800 text-brand-cream-200 text-xs font-bold px-3 py-1 rounded-full mb-3">{m.year}</span>
          <h3 className="font-black text-gray-900 mb-2">{m.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
        </div>
      </div>
      <div
        className="relative z-10 w-10 h-10 flex items-center justify-center bg-brand-forest-700 rounded-full flex-shrink-0 border-4 border-white"
        style={{
          transform: visible ? "scale(1)" : "scale(0)",
          transition: `transform 500ms cubic-bezier(.34,1.56,.64,1) ${i * 70 + 200}ms`,
        }}
      >
        <StarShape size={14} color="rgba(227,218,201,0.9)" />
      </div>
      <div className="flex-1 hidden md:block" />
    </div>
  );
}

/* CTA section */
function CTASection() {
  const { ref, visible } = useInView(0.2);
  return (
    <section ref={ref} className="py-20 bg-brand-forest-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-cream-300/30 to-transparent" />
      <div
        className="absolute top-8 right-16 opacity-10 pointer-events-none hidden lg:block"
        style={{ transform: visible ? "rotate(0deg) scale(1)" : "rotate(-20deg) scale(0.7)", transition: "transform 1s ease", opacity: visible ? 0.1 : 0 }}
      >
        <StarShape size={120} color="rgba(227,218,201,0.6)" />
      </div>
      <div
        className="absolute bottom-8 left-16 opacity-10 pointer-events-none hidden lg:block"
        style={{ transform: visible ? "rotate(0deg) scale(1)" : "rotate(20deg) scale(0.7)", transition: "transform 1s ease 200ms", opacity: visible ? 0.1 : 0 }}
      >
        <LotusShape size={100} color="rgba(227,218,201,0.6)" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)", transition: "opacity 600ms ease 100ms, transform 600ms cubic-bezier(.34,1.56,.64,1) 100ms" }}>
          <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-300/15 rounded-2xl mx-auto mb-6">
            <LotusShape size={34} color="rgba(227,218,201,0.95)" />
          </div>
        </div>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 600ms ease 250ms, transform 600ms ease 250ms" }}>
          <h2 className="text-3xl font-black text-white mb-4">هل أنت مستعد للفهم الحقيقي؟</h2>
          <p className="text-brand-cream-200/70 mb-8 text-base leading-relaxed max-w-xl mx-auto">
            احجز جلسة تقييم اليوم وتعرف على الفرق الذي يصنعه الطب الدقيق في حالتك
          </p>
        </div>
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease 400ms, transform 600ms ease 400ms" }}
        >
          <Link to="/booking" className="inline-flex items-center justify-center gap-2 bg-brand-cream-300 text-brand-forest-900 font-bold px-8 py-4 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-calendar-check-line" />
            احجز جلسة تقييم
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-brand-cream-300/30 text-brand-cream-200 font-semibold px-8 py-4 rounded-full hover:bg-brand-cream-300/10 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-phone-line" />
            تواصل معنا
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function About() {
  const { hero, story, mission, values, timeline, team, awards } = usePublicAbout();

  const dimensions = [
    { Shape: StarShape, title: "العمق السريري", items: ["جلسات 90–120 دقيقة", "تقييم غير سريع", "فهم متعدد التخصصات", "قراءة ما وراء العرض"], bg: "bg-brand-forest-800" },
    { Shape: SunShape,  title: "العمق التقني",  items: ["DNA Risk Score", "العمر البيولوجي", "التقييم الأيضي الوظيفي", "مخاطر مستقبلية"],       bg: "bg-brand-forest-900" },
    { Shape: LotusShape,title: "العمق الدولي", items: ["Second Opinion منظم", "مراكز في USA وKorea", "شبكة خبرات دولية", "متابعة عابرة للحدود"], bg: "bg-brand-forest-700" },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "680px" }}>
        <div className="absolute inset-0">
          <img
            src={hero.image}
            alt="ذا مديكال أفينيو"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-forest-900/85 via-brand-forest-800/55 to-brand-forest-700/25" />
        </div>
        <div className="absolute top-32 left-20 opacity-20 pointer-events-none hidden lg:block">
          <StarShape size={100} color="rgba(227,218,201,0.4)" />
        </div>
        <div className="absolute bottom-16 right-24 opacity-20 pointer-events-none hidden lg:block">
          <LotusShape size={140} color="rgba(227,218,201,0.35)" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-cream-300/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex items-center" style={{ minHeight: "680px" }}>
          <HeroContent hero={hero} />
        </div>
      </section>

      <WaveDivider fromColor="#1a3530" toColor="#ffffff" />

      {/* ── 2. Story ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="right" duration={800}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-brand-cream-200" style={{ height: "500px" }}>
                  <img src={story.image} alt="قصتنا" className="w-full h-full object-cover object-top" />
                </div>
                <Reveal direction="up" delay={300}>
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 border border-brand-cream-200 w-52">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-100 rounded-xl">
                        <SunShape size={22} color="#2E4E45" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-xl">{story.foundedYear}</p>
                        <p className="text-xs text-gray-400">سنة التأسيس</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal direction="down" delay={400}>
                  <div className="absolute -top-5 -right-5 bg-brand-forest-800 rounded-2xl p-4 text-white text-center w-36">
                    <p className="text-2xl font-black text-brand-cream-200">{story.teamCount}</p>
                    <p className="text-xs text-brand-cream-300/70">استشاري متخصص</p>
                  </div>
                </Reveal>
              </div>
            </Reveal>

            <Reveal direction="left" delay={150} duration={800}>
              <div>
                <span className="inline-block bg-brand-forest-100 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">{story.badge}</span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                  {story.title.split("إلى")[0]}
                  <span className="text-brand-forest-600">إلى {story.title.split("إلى")[1]}</span>
                </h2>
                {story.paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-500 text-base leading-relaxed mb-4">{p}</p>
                ))}
                <div className="flex flex-wrap gap-3 mt-4">
                  {story.tags.map((tag, i) => {
                    const shapes = [StarShape, LotusShape, SunShape];
                    const Shape = shapes[i % shapes.length];
                    return (
                      <Reveal key={i} direction="scale" delay={300 + i * 80}>
                        <div className="flex items-center gap-2 bg-brand-cream-100 border border-brand-cream-200 px-4 py-2 rounded-full">
                          <Shape size={16} color="#2E4E45" />
                          <span className="text-sm text-brand-forest-800 font-medium">{tag}</span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#ffffff" toColor="#f5f0e8" />

      {/* ── 3. Mission & Vision ── */}
      <section className="py-20 bg-brand-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading badge="رسالتنا ورؤيتنا" title="ما يقودنا كل يوم" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mission.map((item, i) => {
              const shapes = [StarShape, SunShape, LotusShape];
              const Shape = shapes[i % shapes.length];
              return (
                <Reveal key={item.id} direction="scale" delay={i * 120} duration={700}>
                  <div className={`rounded-3xl p-8 h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${item.dark ? "bg-brand-forest-800" : "bg-white border border-brand-cream-200 hover:border-brand-forest-200"}`}>
                    {item.dark && <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-brand-cream-300/40 to-transparent" />}
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-5 ${item.dark ? "bg-brand-cream-300/15" : "bg-brand-cream-100"}`}>
                      <Shape size={30} color={item.dark ? "rgba(227,218,201,0.95)" : "#2E4E45"} />
                    </div>
                    <h3 className={`text-xl font-black mb-3 ${item.dark ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
                    <p className={`leading-relaxed text-sm ${item.dark ? "text-brand-cream-200/75" : "text-gray-500"}`}>{item.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#f5f0e8" toColor="#ffffff" flip />

      {/* ── 4. Three Dimensions ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading
            badge="التموضع والتميز"
            title="ثلاثة أبعاد متكاملة"
            subtitle="قوتنا التنافسية لا تقوم على الشكل، بل على البنية المتكاملة للرعاية — عمق سريري، عمق تقني، وعمق دولي"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dimensions.map((dim, i) => (
              <Reveal key={i} direction="up" delay={i * 130} duration={750}>
                <div className={`${dim.bg} rounded-3xl p-8 text-white h-full relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300`}>
                  <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-brand-cream-300/40 to-transparent" />
                  <ShapeBadge size={60} className="mb-5 bg-brand-cream-300/15">
                    <dim.Shape size={28} color="rgba(227,218,201,0.95)" />
                  </ShapeBadge>
                  <h3 className="text-xl font-black mb-5 text-white">{dim.title}</h3>
                  <ul className="space-y-3">
                    {dim.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-brand-cream-200/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-cream-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#ffffff" toColor="#f5f0e8" />

      {/* ── 5. Values ── */}
      <section className="py-20 bg-brand-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading badge="قيمنا" title="المبادئ التي تحكم كل قرار" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, i) => (
              <Reveal key={val.id} direction="scale" delay={i * 90} duration={650}>
                <div className="group text-center p-7 rounded-2xl border border-brand-cream-200 hover:border-brand-forest-200 hover:bg-white hover:-translate-y-1 transition-all duration-300 h-full cursor-default bg-white">
                  <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-100 rounded-2xl mx-auto mb-5 group-hover:bg-brand-forest-100 transition-colors">
                    <i className={`${val.icon} text-brand-forest-600 text-2xl`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{val.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{val.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#f5f0e8" toColor="#ffffff" flip />

      {/* ── 6. Timeline ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <SectionHeading badge="مسيرتنا" title="رحلة بناء منصة الطب الدقيق" />
          <div className="relative">
            <TimelineLine count={timeline.length} />
            <div className="space-y-8">
              {timeline.map((m, i) => (
                <TimelineItem key={m.id} m={m} i={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#ffffff" toColor="#f5f0e8" />

      {/* ── 7. Awards ── */}
      <section className="py-20 bg-brand-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading badge="إنجازاتنا" title="الاعتمادات والشراكات" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {awards.map((award, i) => (
              <Reveal key={award.id} direction="up" delay={i * 100} duration={650}>
                <div className="bg-white rounded-2xl p-6 border border-brand-cream-200 text-center hover:border-brand-forest-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 flex items-center justify-center bg-brand-cream-100 rounded-2xl mx-auto mb-4">
                    <i className={`${award.icon} text-brand-forest-600 text-2xl`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{award.title}</h3>
                  <p className="text-gray-400 text-xs">{award.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#f5f0e8" toColor="#ffffff" flip />

      {/* ── 8. Team ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Reveal direction="up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
              <div>
                <span className="inline-block bg-brand-forest-100 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">الكادر الطبي</span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">خبراء الطب الدقيق</h2>
                <p className="text-gray-500 text-sm mt-2">متخصصون في تخصصات دقيقة ونادرة نسبيًا</p>
              </div>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 border-2 border-brand-forest-600 text-brand-forest-600 hover:bg-brand-forest-600 hover:text-white font-semibold px-6 py-2.5 rounded-full transition-all whitespace-nowrap cursor-pointer"
              >
                عرض جميع الاستشاريين <i className="ri-arrow-left-line" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((member, i) => (
              <Reveal key={member.id} direction="up" delay={i * 70} duration={600}>
                <div className="group text-center">
                  <div className="relative rounded-2xl overflow-hidden mb-4 bg-brand-cream-100 border border-brand-cream-200" style={{ height: "200px" }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-brand-forest-900/0 group-hover:bg-brand-forest-900/50 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer hover:bg-brand-cream-100 transition-colors">
                          <i className="ri-twitter-x-line text-brand-forest-700 text-sm" />
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer hover:bg-brand-cream-100 transition-colors">
                          <i className="ri-linkedin-line text-brand-forest-700 text-sm" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{member.name}</h3>
                  <p className="text-brand-forest-600 text-xs font-medium mb-0.5">{member.role}</p>
                  <p className="text-gray-400 text-xs">{member.experience} خبرة</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA ── */}
      <CTASection />

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hero sub-component
───────────────────────────────────────────── */
function HeroContent({ hero }: { hero: ReturnType<typeof usePublicAbout>["hero"] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="max-w-2xl pt-28 pb-16">
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "opacity 700ms ease 200ms, transform 700ms ease 200ms" }}>
        <span className="inline-flex items-center gap-2 bg-brand-cream-300/15 backdrop-blur-sm text-brand-cream-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-cream-300/25">
          <StarShape size={12} color="rgba(212,201,176,0.9)" />
          {hero.badge}
        </span>
      </div>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "opacity 750ms ease 350ms, transform 750ms ease 350ms" }}>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
          {hero.title}
          <span className="block text-brand-cream-300 mt-1 text-3xl md:text-4xl min-h-[1.3em]">
            <TypewriterText
              words={hero.typewriterWords}
              typeSpeed={65}
              deleteSpeed={38}
              pauseAfter={2500}
              startDelay={1200}
              cursorChar="▌"
              cursorClassName="text-brand-cream-400/60 text-3xl md:text-4xl"
            />
          </span>
        </h1>
      </div>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "opacity 700ms ease 500ms, transform 700ms ease 500ms" }}>
        <p className="text-white/75 text-base md:text-lg leading-relaxed mb-3 max-w-xl">
          {hero.description}
        </p>
        <p className="text-brand-cream-300/60 text-sm leading-relaxed mb-8 font-light tracking-wide">
          Integrated Precision Medicine &amp; Advanced Specialty Care
        </p>
      </div>
      <div
        className="flex flex-wrap gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)", transition: "opacity 700ms ease 650ms, transform 700ms ease 650ms" }}
      >
        <Link to="/booking" className="inline-flex items-center gap-2 bg-brand-cream-300 text-brand-forest-900 font-bold px-7 py-3.5 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-calendar-check-line" />
          {hero.ctaPrimary}
        </Link>
        <Link to="/doctors" className="inline-flex items-center gap-2 border-2 border-brand-cream-300/40 text-brand-cream-200 font-semibold px-7 py-3.5 rounded-full hover:bg-brand-cream-300/10 transition-colors whitespace-nowrap cursor-pointer">
          {hero.ctaSecondary}
          <i className="ri-arrow-left-line" />
        </Link>
      </div>
    </div>
  );
}
