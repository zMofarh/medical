import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StarShape, LotusShape } from "@/components/base/BrandShapes";
import ScrollReveal from "@/components/base/ScrollReveal";
import ParallaxLayer from "@/components/base/ParallaxLayer";
import TypewriterText from "@/components/base/TypewriterText";
import DNAHelix from "@/components/base/DNAHelix";
import FloatingBrandOrbs from "@/components/base/FloatingBrandOrbs";
import BrandParticleField from "@/components/base/BrandParticleField";
import { usePublicHome } from "@/hooks/useCMSHome";

export default function HeroSection() {
  const { t } = useTranslation();
  const { content } = usePublicHome();
  const { hero } = content;

  // Use CMS words if available, fallback to i18n
  const words = hero.typewriterWords?.length
    ? hero.typewriterWords
    : t("hero.words").split("|");

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* ── Background Image with Parallax ── */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxLayer speed={-0.15} className="absolute inset-0 scale-110">
          <img
            src={hero.backgroundImage || "https://readdy.ai/api/search-image?query=serene%20minimalist%20medical%20clinic%20interior%20soft%20natural%20light%20warm%20cream%20beige%20tones%20clean%20white%20walls%20subtle%20green%20plants%20calm%20peaceful%20healthcare%20environment%20elegant%20simple&width=1440&height=900&seq=hero-ma-calm2&orientation=landscape"}
            alt="The Medical Avenue"
            className="w-full h-full object-cover object-top"
          />
        </ParallaxLayer>
        <div className="absolute inset-0 bg-gradient-to-l from-brand-forest-900/85 via-brand-forest-900/60 to-brand-forest-800/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/50 via-transparent to-transparent"></div>
      </div>

      {/* ── Particle Field ── */}
      <div className="absolute inset-0 z-[1]">
        <BrandParticleField
          particleCount={45}
          interactive={true}
          colors={["#C8A96E", "#D4C9B0", "#8FB5AC", "#E3DAC9", "#2E4E45"]}
        />
      </div>

      {/* ── Floating Brand Orbs ── */}
      <FloatingBrandOrbs className="z-[2]" count={8} />

      {/* ── DNA Helix — Left side ── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[2] hidden xl:block">
        <DNAHelix width={70} height={420} color1="#C8A96E" color2="#8FB5AC" rungs={13} speed={0.9} opacity={0.55} />
      </div>

      {/* ── DNA Helix — Right side ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[2] hidden xl:block">
        <DNAHelix width={70} height={320} color1="#8FB5AC" color2="#C8A96E" rungs={10} speed={1.2} opacity={0.40} />
      </div>

      {/* ── Ripple rings ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none hidden lg:block">
        <div className="relative w-0 h-0">
          <div className="absolute rounded-full border border-brand-cream-300/10 animate-ripple" style={{ width: 500, height: 500, top: -250, left: -250 }} />
          <div className="absolute rounded-full border border-brand-cream-300/8 animate-ripple-delay" style={{ width: 500, height: 500, top: -250, left: -250 }} />
          <div className="absolute rounded-full border border-white/5" style={{ width: 700, height: 700, top: -350, left: -350 }} />
        </div>
      </div>

      {/* ── Orbiting brand shapes ── */}
      <div className="absolute top-1/2 right-24 -translate-y-1/2 z-[2] pointer-events-none hidden xl:block">
        <div className="relative w-0 h-0">
          <div className="absolute rounded-full border border-brand-cream-300/10" style={{ width: 140, height: 140, top: -70, left: -70 }} />
          <div className="absolute" style={{ animation: "orbit 14s linear infinite", ["--orbit-r" as string]: "70px", top: -8, left: -8 }}>
            <StarShape size={16} color="rgba(200,169,110,0.7)" />
          </div>
          <div className="absolute" style={{ animation: "orbit 10s linear infinite reverse", ["--orbit-r" as string]: "70px", top: -5, left: -5 }}>
            <div className="w-2.5 h-2.5 rounded-full bg-brand-forest-200/60" />
          </div>
        </div>
      </div>

      {/* ── Scan line effect ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden hidden lg:block">
        <div className="animate-scan" />
      </div>

      {/* ── Corner accents ── */}
      <div className="absolute top-24 left-8 z-[3] pointer-events-none hidden lg:block">
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-brand-cream-300/20 rounded-full" style={{ width: 32 - i * 6, height: 2 }} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-24 right-8 z-[3] pointer-events-none hidden lg:block">
        <div className="flex flex-col gap-1.5 items-end">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-brand-cream-300/20 rounded-full" style={{ width: 32 - i * 6, height: 2 }} />
          ))}
        </div>
      </div>

      {/* ── Glow spot ── */}
      <div className="absolute z-[1] pointer-events-none hidden lg:block" style={{ right: "8%", top: "30%", width: 400, height: 400, background: "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-28 pb-20">
        <div className="max-w-2xl">

          {/* Badge */}
          <ScrollReveal variant="up" delay={100}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-8">
              <StarShape size={14} color="rgba(212,201,176,0.9)" />
              {hero.badge || t("hero.badge")}
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal variant="up" delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {hero.heading1 || t("hero.heading_1")}
              <span className="block text-brand-cream-300 min-h-[1.2em]">
                <TypewriterText
                  words={words}
                  typeSpeed={70}
                  deleteSpeed={40}
                  pauseAfter={2600}
                  startDelay={900}
                  cursorChar="▌"
                  cursorClassName="text-brand-cream-400/70 text-4xl md:text-5xl lg:text-6xl"
                />
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={320}>
            <p className="text-base md:text-lg text-white/75 leading-relaxed mb-4 max-w-xl">
              {hero.description || t("hero.desc")}
            </p>
            <p className="text-sm text-white/55 leading-relaxed mb-10 max-w-lg">
              {hero.subDescription || t("hero.sub")}
            </p>
          </ScrollReveal>

          {/* Buttons */}
          <ScrollReveal variant="up" delay={440}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="magnetic-btn group relative inline-flex items-center justify-center gap-2 bg-brand-cream-300 hover:bg-brand-cream-200 text-brand-forest-900 font-bold px-8 py-4 rounded-full transition-all duration-300 text-base whitespace-nowrap cursor-pointer hover-lift animate-glow-gold"
              >
                <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </span>
                <i className="ri-calendar-check-line relative z-10"></i>
                <span className="relative z-10">{hero.btnBook || t("hero.btn_book")}</span>
              </Link>
              <Link
                to="/services"
                className="magnetic-btn inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 text-base whitespace-nowrap cursor-pointer"
              >
                <i className="ri-flask-line"></i>
                {hero.btnServices || t("hero.btn_services")}
              </Link>
            </div>
          </ScrollReveal>

          {/* Three pillars */}
          <ScrollReveal variant="up" delay={560}>
            <div className="flex flex-wrap gap-4 mt-12">
              {(hero.pillars?.length ? hero.pillars : t("hero.pillar_1,hero.pillar_2,hero.pillar_3").split(",")).map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full hover:bg-white/12 transition-colors duration-200"
                >
                  <StarShape size={14} color="rgba(212,201,176,0.85)" />
                  <span className="text-white/80 text-xs font-medium">{p}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Live stats strip */}
          <ScrollReveal variant="up" delay={680}>
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {(hero.stats?.length
                ? hero.stats
                : [
                    { value: "+2,400", label: t("hero.stat_patients") ?? "مريض سنوياً" },
                    { value: "98%",    label: t("hero.stat_satisfaction") ?? "نسبة الرضا" },
                    { value: "6",      label: t("hero.stat_specialists") ?? "استشاريين" },
                  ]
              ).map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-cream-300">{stat.value}</span>
                  <span className="text-xs text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <span className="text-white/40 text-xs">{t("hero.scroll")}</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/50" style={{ animation: "float-slow 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
