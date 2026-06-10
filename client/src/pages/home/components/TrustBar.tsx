import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePublicHome } from "@/hooks/useCMSHome";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface StatItemProps {
  stat: { number: string; label: string; icon: string };
  index: number;
  isVisible: boolean;
}

function StatItem({ stat, index, isVisible }: StatItemProps) {
  const [itemVisible, setItemVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setItemVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [isVisible, index]);

  const animated = useCounterAnimation(stat.number, itemVisible, {
    duration: 1800,
    delay: 0,
    easing: "easeOut",
  });

  return (
    <div
      className={`relative bg-gradient-to-br from-brand-cream-50 to-white rounded-2xl p-6 text-center border border-brand-cream-200 transition-all duration-700 overflow-hidden group cursor-default ${
        itemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-forest-50/0 to-brand-forest-100/0 group-hover:from-brand-forest-50/60 group-hover:to-brand-forest-100/30 transition-all duration-500 rounded-2xl"></div>

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-forest-400 to-transparent transition-all duration-1000 ${
          itemVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: `${index * 150 + 400}ms` }}
      ></div>

      <div className="relative z-10">
        <div className="w-12 h-12 flex items-center justify-center bg-brand-forest-100 rounded-xl mx-auto mb-4 group-hover:bg-brand-forest-200 transition-colors duration-300">
          <i className={`${stat.icon} text-brand-forest-600 text-xl`}></i>
        </div>

        {/* Animated number */}
        <div
          className={`text-3xl md:text-4xl font-black text-brand-forest-800 mb-1.5 tabular-nums transition-all duration-500 ${
            itemVisible ? "scale-100" : "scale-75"
          }`}
          style={{ transitionDelay: `${index * 150 + 200}ms` }}
        >
          {animated}
        </div>

        <p className="text-sm text-gray-500 font-medium leading-snug relative z-10">{stat.label}</p>
      </div>

      {/* Corner decoration */}
      <div
        className={`absolute bottom-2 left-2 w-6 h-6 rounded-full border border-brand-forest-200/40 transition-all duration-700 ${
          itemVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ transitionDelay: `${index * 150 + 600}ms` }}
      ></div>
      <div
        className={`absolute bottom-4 left-4 w-2 h-2 rounded-full bg-brand-forest-300/40 transition-all duration-700 ${
          itemVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ transitionDelay: `${index * 150 + 700}ms` }}
      ></div>
    </div>
  );
}

export default function TrustBar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { content } = usePublicHome();
  // Map CMS trustBar items to the format expected by StatItem
  const trustStats = content.trustBar.items.map((item) => ({
    icon: item.icon,
    number: item.value,
    label: item.label,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section dir="auto" ref={ref} className="py-16 bg-white border-b border-brand-cream-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section label */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-block bg-brand-forest-50 text-brand-forest-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-brand-forest-100">
            {t("trust.label")}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustStats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} isVisible={visible} />
          ))}
        </div>

        <div
          className={`text-center mt-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-brand-forest-600">
              Integrated Precision Medicine &amp; Advanced Specialty Care
            </span>
            {" "}— {t("trust.tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
