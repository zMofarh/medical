import { useEffect, useRef, useState } from "react";
import { StarShape, SunShape, SwanShape, LotusShape, ShapeBadge } from "@/components/base/BrandShapes";
import DNAHelix from "@/components/base/DNAHelix";
import BrandAccentLine from "@/components/base/BrandAccentLine";
import { usePublicHome } from "@/hooks/useCMSHome";

const dimensionShapes = [
  {
    Shape: StarShape,
    label: "عمق سريري",
    sub: "وقت أطول · تقييم غير سريع",
    desc: "النجمة ترمز للخبرة الطبية والتوجيه نحو رعاية موثوقة",
  },
  {
    Shape: SunShape,
    label: "عمق تقني",
    sub: "DNA · عمر بيولوجي · أيضي",
    desc: "الشمس ترمز للحيوية والطاقة والنشاط الصحي المستمر",
  },
  {
    Shape: SwanShape,
    label: "توازن أيضي",
    sub: "السمنة · MASLD · الخلل الأيضي",
    desc: "البجعة ترمز للتوازن وإدارة الوزن الصحي بأناقة",
  },
  {
    Shape: LotusShape,
    label: "عمق دولي",
    sub: "Second Opinion · USA · Korea",
    desc: "اللوتس يرمز للتجدد والصحة الداخلية وانسجام الجسد والعقل",
  },
];

export default function WhyUs() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { content } = usePublicHome();
  const { whyUs } = content;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section dir="rtl" ref={ref} className="py-24 bg-white overflow-hidden relative">
      {/* DNA Helix decorative */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none hidden xl:block opacity-30">
        <DNAHelix width={50} height={500} color1="#C8A96E" color2="#2E4E45" rungs={12} speed={0.6} opacity={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── Brand Identity Section ── */}
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-forest-100 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            هويتنا البصرية
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
            أربعة رموز، فلسفة واحدة
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            تجتمع هذه الرموز لتشكّل لغة بصرية للعافية — حيث تتعايش العلم، الحيوية، التوازن، والجمال في انسجام تام
          </p>
        </div>

        {/* Four Shapes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {dimensionShapes.map(({ Shape, label, sub, desc }, i) => (
            <div
              key={label}
              className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex justify-center mb-5">
                <div className="relative group cursor-default">
                  <div className="absolute inset-0 rounded-full bg-brand-cream-300/20 scale-0 group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                  <ShapeBadge size={80} className="hover:bg-brand-forest-600 transition-all duration-300 animate-glow-forest group-hover:scale-110">
                    <div className="animate-brand-morph" style={{ animationDelay: `${i * 0.8}s` }}>
                      <Shape size={38} color="rgba(227,218,201,0.95)" />
                    </div>
                  </ShapeBadge>
                </div>
              </div>
              <h3 className="font-black text-brand-forest-800 text-sm mb-1">{label}</h3>
              <p className="text-brand-forest-600 text-xs font-medium mb-2">{sub}</p>
              <p className="text-gray-400 text-xs leading-relaxed px-2">{desc}</p>
            </div>
          ))}
        </div>

        {/* Animated brand accent divider */}
        <div className="flex items-center gap-4 mb-16">
          <BrandAccentLine className="flex-1" height={2} animated />
          <div className="animate-brand-morph">
            <StarShape size={20} color="#2E4E45" className="opacity-60" />
          </div>
          <BrandAccentLine className="flex-1" height={2} color1="#C8A96E" color2="#2E4E45" animated />
        </div>

        {/* ── Why Us Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-brand-cream-200" style={{ height: "500px" }}>
              <img
                src={whyUs.mainImage}
                alt="الطب الدقيق في ذا مديكال أفينيو"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/40 to-transparent"></div>
            </div>
            {/* Floating Card 1 */}
            <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-4 border border-brand-cream-200 w-52">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-100 rounded-xl">
                  <SunShape size={22} color="#2E4E45" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">90–120</p>
                  <p className="text-xs text-gray-400">دقيقة لكل جلسة</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">نمنح الحالة الوقت الذي تستحقه</p>
            </div>
            {/* Floating Card 2 */}
            <div className="absolute -top-5 -right-4 bg-brand-forest-800 rounded-2xl p-4 text-white w-44">
              <div className="mb-2">
                <LotusShape size={28} color="rgba(227,218,201,0.9)" />
              </div>
              <p className="text-sm font-black text-white">امتداد دولي</p>
              <p className="text-xs text-brand-cream-300/80 mt-1">USA · Korea · وأكثر</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block bg-brand-forest-100 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              {whyUs.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              {whyUs.heading}
              <span className="text-brand-forest-600"> {whyUs.subHeading}</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-3">
              {whyUs.description}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {whyUs.subDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.items.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-4 p-4 rounded-2xl border border-brand-cream-200 bg-brand-cream-50/50 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${(i + 4) * 100}ms` }}
                >
                  <div className="w-11 h-11 flex items-center justify-center bg-brand-cream-100 rounded-xl flex-shrink-0">
                    <i className={`${item.icon} text-brand-forest-600 text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Three dimensions */}
            <div className="mt-8 p-5 rounded-2xl bg-brand-cream-50 border border-brand-cream-200">
              <p className="text-xs font-bold text-brand-forest-700 uppercase tracking-wide mb-4">ثلاثة أبعاد متكاملة</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { Shape: StarShape, label: "عمق سريري", sub: "وقت أطول · تقييم غير سريع" },
                  { Shape: SunShape,  label: "عمق تقني",  sub: "DNA · عمر بيولوجي · أيضي" },
                  { Shape: LotusShape,label: "عمق دولي",  sub: "Second Opinion · USA · Korea" },
                ].map(({ Shape, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5 flex-1 min-w-[120px]">
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <Shape size={20} color="#2E4E45" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-forest-800">{label}</p>
                      <p className="text-xs text-brand-forest-600/70 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
