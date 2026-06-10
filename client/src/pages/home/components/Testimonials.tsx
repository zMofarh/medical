import { useState } from "react";
import { usePublicTestimonials } from "@/hooks/useCMSTestimonials";

export default function Testimonials() {
  const { testimonials, config } = usePublicTestimonials();
  const [active, setActive] = useState(0);

  if (!testimonials.length) return null;

  const safeActive = Math.min(active, testimonials.length - 1);
  const t = testimonials[safeActive];

  return (
    <section dir="rtl" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-brand-forest-100 text-brand-forest text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            {config.sectionBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">{config.sectionTitle}</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            {config.sectionSubtitle}
          </p>
        </div>
        <div className="max-w-3xl mx-auto bg-brand-cream-50 rounded-3xl p-8 md:p-12 border border-brand-cream-200">
          {config.showRating && (
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, s) => (
                <i key={s} className="ri-star-fill text-amber-400 text-lg"></i>
              ))}
              {Array.from({ length: 5 - t.rating }).map((_, s) => (
                <i key={s} className="ri-star-line text-amber-200 text-lg"></i>
              ))}
            </div>
          )}
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 font-medium">
            «{t.text}»
          </p>
          <div className="flex items-center gap-4">
            {config.showImage && (
              <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover object-top" />
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm">{t.name}</p>
              <p className="text-brand-forest text-xs">{t.specialty}</p>
              {t.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] text-brand-forest-600 font-semibold mt-0.5">
                  <i className="ri-verified-badge-line text-xs"></i> موثق
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === safeActive ? "bg-brand-forest w-8" : "bg-brand-cream-300 w-2"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
