import { Link } from "react-router-dom";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import ScrollReveal from "@/components/base/ScrollReveal";

export default function TeamPreview() {
  const { doctors } = usePublicDoctors();
  const featuredDoctors = doctors.slice(0, 4);

  return (
    <section dir="rtl" className="py-24 bg-brand-cream-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal variant="up" delay={0}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
            <div>
              <span className="inline-block bg-brand-forest-100 text-brand-forest text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
                الكادر الطبي المتخصص
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                خبراء الطب الدقيق
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md">
                نخبة من الاستشاريين المتخصصين في تخصصات دقيقة ونادرة نسبيًا
              </p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-brand-forest font-semibold text-sm hover:gap-3 transition-all duration-200 whitespace-nowrap cursor-pointer underline-draw"
            >
              عرض الفريق كاملًا
              <i className="ri-arrow-left-line"></i>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDoctors.map((doc, i) => (
            <ScrollReveal key={doc.id} variant="up" delay={i * 100}>
              <Link
                to={`/doctors/${doc.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-brand-cream-200 hover:-translate-y-1 transition-transform duration-300 cursor-pointer block"
              >
                <div className="relative overflow-hidden bg-brand-cream-100" style={{ height: "230px" }}>
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{doc.name}</h3>
                  <p className="text-brand-forest text-xs font-medium mb-1">{doc.specialty}</p>
                  <p className="text-gray-400 text-xs">{doc.experience}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fade" delay={300}>
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              جميع استشاريينا متخصصون في تخصصات دقيقة ونادرة — يجمعهم التزام واحد: فهم الحالة قبل القرار
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
