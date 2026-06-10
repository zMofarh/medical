import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";
import ScrollReveal from "@/components/base/ScrollReveal";
import { usePublicHome } from "@/hooks/useCMSHome";

export default function CTASection() {
  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");
  const { content } = usePublicHome();
  const { cta } = content;

  const pillars = isAr
    ? [
        { Shape: StarShape, text: "خبرة طبية موثوقة" },
        { Shape: SunShape,  text: "حيوية وطاقة صحية" },
        { Shape: SwanShape, text: "توازن أيضي دقيق" },
        { Shape: LotusShape,text: "تجدد وصحة داخلية" },
      ]
    : [
        { Shape: StarShape, text: "Trusted Medical Expertise" },
        { Shape: SunShape,  text: "Vitality & Health Energy" },
        { Shape: SwanShape, text: "Precise Metabolic Balance" },
        { Shape: LotusShape,text: "Renewal & Inner Health" },
      ];

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-24 bg-brand-forest-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20DNA%20genomics%20precision%20medicine%20pattern%20minimal%20white%20lines%20on%20dark%20teal%20background%20modern%20medical%20science&width=1440&height=400&seq=cta-ma1&orientation=landscape"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-cream-300/0 via-brand-cream-300/50 to-brand-cream-300/0"></div>

      <div className="absolute top-10 right-16 opacity-25 pointer-events-none hidden lg:block animate-float-slow">
        <StarShape size={80} color="rgba(227,218,201,0.8)" />
      </div>
      <div className="absolute bottom-10 left-16 opacity-20 pointer-events-none hidden lg:block animate-float-gentle">
        <SunShape size={100} color="rgba(227,218,201,0.7)" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-8 opacity-20 pointer-events-none hidden xl:block">
        <SwanShape size={70} color="rgba(227,218,201,0.6)" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-8 opacity-20 pointer-events-none hidden xl:block">
        <LotusShape size={70} color="rgba(227,218,201,0.6)" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        <ScrollReveal variant="up" delay={0}>
          <div className="inline-flex items-center gap-2 bg-white/10 text-brand-cream-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/15">
            <LotusShape size={14} color="rgba(212,201,176,0.9)" />
            {cta.badge || (isAr ? "ابدأ رحلتك نحو فهم حقيقي" : "Start Your Journey Toward Real Understanding")}
          </div>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={120}>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
            {cta.heading || t("cta.heading")}
          </h2>
          <p className="text-brand-cream-200/80 text-base md:text-lg mb-4 leading-relaxed max-w-2xl mx-auto">
            {cta.description || t("cta.desc")}
          </p>
          <p className="text-brand-cream-200/50 text-sm mb-10">
            {cta.subDescription || (isAr
              ? "نقدم طبًا أعمق · أكثر تخصيصًا · مدعومًا بالتقنيات الدقيقة والخبرة الدولية"
              : "Deeper medicine · More personalized · Backed by precision technologies and international expertise")}
          </p>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={240}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="magnetic-btn hover-lift inline-flex items-center justify-center gap-2 bg-brand-cream-300 text-brand-forest-900 font-bold px-8 py-4 rounded-full hover:bg-brand-cream-200 transition-colors duration-200 whitespace-nowrap cursor-pointer text-base"
            >
              <i className="ri-calendar-check-line"></i>
              {cta.btnBook || t("cta.btn_book")}
            </Link>
            <Link
              to="/contact"
              className="magnetic-btn inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors duration-200 whitespace-nowrap cursor-pointer text-base"
            >
              <i className="ri-phone-line"></i>
              {cta.btnContact || t("cta.btn_contact")}
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={360}>
          <div className="flex flex-wrap justify-center gap-6 mt-14">
            {pillars.map(({ Shape, text }) => (
              <div key={text} className="flex items-center gap-2 text-brand-cream-200/60 text-sm">
                <Shape size={16} color="rgba(212,201,176,0.7)" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
