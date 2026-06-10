import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublicServices } from "@/hooks/useCMSServices";
import ScrollReveal from "@/components/base/ScrollReveal";
import BrandAccentLine from "@/components/base/BrandAccentLine";
import { StarShape } from "@/components/base/BrandShapes";

export default function FeaturedServices() {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<string | null>(null);
  const { services } = usePublicServices();
  // Show only first 6 services as featured
  const featuredServices = services.slice(0, 6);

  return (
    <section dir="auto" className="py-24 bg-brand-cream-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal variant="up" delay={0}>
          <div className="text-center mb-14">
            <span className="inline-block bg-brand-forest-100 text-brand-forest text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              {t("services.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              {t("services.heading")}
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              {t("services.desc")}
            </p>
            {/* Animated accent line under heading */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <BrandAccentLine width={60} height={2} color1="#C8A96E" color2="#2E4E45" animated />
              <div className="animate-spin-slow opacity-40">
                <StarShape size={14} color="#2E4E45" />
              </div>
              <BrandAccentLine width={60} height={2} color1="#2E4E45" color2="#C8A96E" animated />
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredServices.map((service, i) => (
            <ScrollReveal key={service.id} variant="scale" delay={i * 100}>
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer group hover-lift"
                style={{ height: "300px" }}
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} to-transparent transition-opacity duration-300`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/80 via-brand-forest-900/25 to-transparent"></div>

                {/* Scan line on hover */}
                {hovered === service.id && (
                  <div className="animate-scan" />
                )}

                {/* Brand corner accent */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-cream-300/40 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-cream-300/40 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/15 backdrop-blur-sm rounded-xl border border-white/25 group-hover:bg-brand-cream-300/20 group-hover:border-brand-cream-300/40 transition-all duration-300">
                  <i className={`${service.icon} text-white text-lg`}></i>
                </div>

                <div className="absolute bottom-0 right-0 left-0 p-5">
                  <h3 className="text-white font-bold text-base mb-1.5">{service.name}</h3>
                  <p className={`text-white/80 text-sm leading-relaxed transition-all duration-300 ${hovered === service.id ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
                    {service.description}
                  </p>
                  <Link
                    to={`/services/${service.id}`}
                    className={`inline-flex items-center gap-1.5 mt-3 text-white text-xs font-semibold border border-white/35 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all duration-300 whitespace-nowrap ${hovered === service.id ? "opacity-100" : "opacity-0"}`}
                  >
                    {t("btn.learn_more")}
                    <i className="ri-arrow-left-line"></i>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="up" delay={200}>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-2 border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              {t("services.view_all")}
              <i className="ri-arrow-left-line"></i>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
