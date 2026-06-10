import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LotusShape, StarShape } from "@/components/base/BrandShapes";

export default function DNASimulatorBanner() {
  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const riskCategories = isAr
    ? [
        { icon: "ri-heart-pulse-line", label: "القلب والأوعية", color: "text-rose-500" },
        { icon: "ri-scales-line", label: "الأيض والسكري", color: "text-orange-500" },
        { icon: "ri-brain-line", label: "الجهاز العصبي", color: "text-violet-500" },
        { icon: "ri-body-scan-line", label: "العظام والمفاصل", color: "text-amber-500" },
        { icon: "ri-mental-health-line", label: "الصحة النفسية", color: "text-brand-forest-500" },
      ]
    : [
        { icon: "ri-heart-pulse-line", label: "Heart & Vessels", color: "text-rose-500" },
        { icon: "ri-scales-line", label: "Metabolism & Diabetes", color: "text-orange-500" },
        { icon: "ri-brain-line", label: "Nervous System", color: "text-violet-500" },
        { icon: "ri-body-scan-line", label: "Bones & Joints", color: "text-amber-500" },
        { icon: "ri-mental-health-line", label: "Mental Health", color: "text-brand-forest-500" },
      ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section dir={isAr ? "rtl" : "ltr"} ref={ref} className="py-16 bg-brand-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ background: "linear-gradient(135deg, #14231F 0%, #1C302B 50%, #253F38 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=DNA%20double%20helix%20glowing%20strands%20abstract%20dark%20background%20genetic%20code%20visualization%20precision%20medicine%20genomics%20scientific%20elegant&width=1200&height=400&seq=dna-banner-home-v1&orientation=landscape"
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="absolute top-4 left-8 opacity-[0.12] pointer-events-none">
            <LotusShape size={90} color="#e8dcc8" />
          </div>
          <div className="absolute bottom-4 right-12 opacity-[0.10] pointer-events-none">
            <StarShape size={70} color="#e8dcc8" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 md:p-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-right">
              <span className="inline-flex items-center gap-2 bg-white/15 text-brand-cream-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                <i className="ri-dna-line"></i>
                {t("dna_banner.badge")}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                {t("dna_banner.heading")}
                <span className="block text-brand-cream-300 text-xl md:text-2xl mt-1">
                  {t("dna_banner.subheading")}
                </span>
              </h2>
              <p className="text-brand-cream-200/80 text-sm leading-relaxed mb-6 max-w-lg">
                {t("dna_banner.desc")}
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-7">
                {riskCategories.map((cat) => (
                  <span key={cat.label} className="inline-flex items-center gap-1.5 bg-white/10 text-brand-cream-200 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <i className={`${cat.icon} ${cat.color} text-xs`}></i>
                    {cat.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/dna-simulator"
                  className="inline-flex items-center justify-center gap-2 bg-brand-cream-300 hover:bg-brand-cream-200 text-brand-forest-900 font-bold px-7 py-3.5 rounded-full transition-colors cursor-pointer text-sm whitespace-nowrap"
                >
                  <i className="ri-play-circle-line text-base"></i>
                  {t("dna_banner.btn_start")}
                </Link>
                <Link
                  to="/services/dna-risk"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-full transition-colors cursor-pointer text-sm whitespace-nowrap"
                >
                  <i className="ri-information-line"></i>
                  {t("dna_banner.btn_service")}
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="flex-shrink-0 w-full lg:w-72">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-300/20 rounded-lg">
                    <i className="ri-dna-line text-brand-cream-300 text-base"></i>
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">DNA Risk Score</p>
                    <p className="text-brand-cream-400 text-[10px]">{isAr ? "تقييم تقديري" : "Estimated Assessment"}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-brand-cream-400 mb-1">
                    <span>{isAr ? "مستوى المخاطر الإجمالي" : "Overall Risk Level"}</span>
                    <span className="text-amber-400 font-bold">{isAr ? "متوسط" : "Moderate"}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-full bg-gradient-to-l from-amber-400 to-brand-forest-400 rounded-full" style={{ width: "48%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  {riskCategories.map((cat, i) => {
                    const widths = [62, 38, 55, 28, 71];
                    const colors = ["bg-rose-400", "bg-orange-400", "bg-violet-400", "bg-amber-400", "bg-brand-forest-400"];
                    return (
                      <div key={cat.label} className="flex items-center gap-2">
                        <i className={`${cat.icon} text-[10px] ${cat.color} w-3 flex-shrink-0`}></i>
                        <span className="text-[10px] text-brand-cream-300 w-20 flex-shrink-0 truncate">{cat.label}</span>
                        <div className="flex-1 bg-white/10 rounded-full h-1.5">
                          <div className={`h-full rounded-full ${colors[i]}`} style={{ width: `${widths[i]}%` }} />
                        </div>
                        <span className="text-[10px] text-brand-cream-400 w-6 text-left flex-shrink-0">{widths[i]}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-brand-cream-400">{t("dna_banner.questions")}</span>
                  <span className="text-[10px] font-bold text-brand-cream-300 bg-white/10 px-2 py-0.5 rounded-full">{t("dna_banner.free")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
