import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clinicInfo } from "@/mocks/clinicData";
import { usePublicSettings } from "@/hooks/useCMSSettings";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";

const precisionBadges = [
  { icon: "ri-dna-line",    label: "DNA Risk Score" },
  { icon: "ri-global-line", label: "Second Opinion" },
  { icon: "ri-time-line",   label: "90–120 min" },
];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar") || !i18n.language?.startsWith("en");
  const { social } = usePublicSettings();

  const socialPlatforms = [
    { id: "instagram", icon: "ri-instagram-line",  label: "Instagram" },
    { id: "twitter",   icon: "ri-twitter-x-line",  label: "X (Twitter)" },
    { id: "facebook",  icon: "ri-facebook-circle-line", label: "Facebook" },
    { id: "snapchat",  icon: "ri-snapchat-line",   label: "Snapchat" },
    { id: "tiktok",    icon: "ri-tiktok-line",     label: "TikTok" },
    { id: "youtube",   icon: "ri-youtube-line",    label: "YouTube" },
    { id: "linkedin",  icon: "ri-linkedin-box-line", label: "LinkedIn" },
  ];

  const activeSocial = socialPlatforms
    .map((p) => ({ ...p, url: (social as Record<string, string>)[p.id] }))
    .filter((p) => p.url && p.url.trim() !== "");

  const quickLinks = [
    { label: t("nav.home"),     path: "/" },
    { label: t("nav.about"),    path: "/about" },
    { label: t("nav.doctors"),  path: "/doctors" },
    { label: t("nav.packages"), path: "/packages" },
    { label: t("nav.offers"),   path: "/offers" },
    { label: t("nav.blog"),     path: "/blog" },
    { label: t("nav.faq"),      path: "/faq" },
  ];

  const servicesList = isAr
    ? ["تقييم المخاطر الصحية", "السمنة والخلل الأيضي", "Second Opinion الدولي", "DNA Risk Score", "الطب النفسي للبالغين", "هشاشة العظام المتقدمة"]
    : ["Health Risk Assessment", "Obesity & Metabolic Dysfunction", "International Second Opinion", "DNA Risk Score", "Adult Psychiatry", "Advanced Osteoporosis"];

  const shapeLabels = isAr
    ? ["الخبرة الطبية", "الحيوية والعافية", "التوازن الأيضي", "التجدد الداخلي"]
    : ["Medical Expertise", "Vitality & Wellness", "Metabolic Balance", "Inner Renewal"];

  return (
    <footer dir={isAr ? "rtl" : "ltr"} className="bg-brand-forest-900 pt-16 pb-0 relative overflow-hidden">

      {/* ── Decorative Brand Shapes ── */}
      <div className="absolute top-0 left-0 opacity-[0.05] pointer-events-none translate-x-[-20%] translate-y-[-20%]">
        <LotusShape size={260} color="#e8dcc8" />
      </div>
      <div className="absolute bottom-10 right-0 opacity-[0.04] pointer-events-none translate-x-[25%]">
        <StarShape size={200} color="#e8dcc8" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-1/4 opacity-[0.035] pointer-events-none">
        <SwanShape size={140} color="#e8dcc8" />
      </div>
      <div className="absolute top-8 right-1/3 opacity-[0.04] pointer-events-none">
        <SunShape size={100} color="#e8dcc8" />
      </div>

      <div className="h-0.5 bg-gradient-to-r from-transparent via-brand-cream-300/40 to-transparent mb-14 mx-8 relative z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img
              src="https://static.readdy.ai/image/8d67d4b5b60a62e7b1df4167f7b5245a/0d280bb6e2b005ae80d8003369a0b5aa.png"
              alt="The Medical Avenue"
              className="h-12 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-sm text-brand-cream-200/60 leading-relaxed mb-5">
              {t("footer.tagline")}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {precisionBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 bg-brand-cream-300/10 border border-brand-cream-300/20 text-brand-cream-200/80 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                >
                  <i className={`${b.icon} text-[10px]`}></i>
                  {b.label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              {activeSocial.length > 0 ? (
                activeSocial.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    title={s.label}
                    className="w-9 h-9 flex items-center justify-center bg-brand-cream-300/10 hover:bg-brand-forest-600 text-brand-cream-200/70 hover:text-white rounded-full transition-all duration-200 cursor-pointer border border-brand-cream-300/15"
                  >
                    <i className={`${s.icon} text-sm`}></i>
                  </a>
                ))
              ) : (
                <span className="text-xs text-brand-cream-200/40">لا توجد روابط سوشيال ميديا مضافة</span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-brand-cream-200 mb-5 text-xs uppercase tracking-widest">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-brand-cream-200/55 hover:text-brand-cream-200 transition-colors cursor-pointer group"
                  >
                    <div className="w-1 h-1 rounded-full bg-brand-cream-300/30 group-hover:bg-brand-cream-300 transition-colors flex-shrink-0"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-brand-cream-200 mb-5 text-xs uppercase tracking-widest">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2.5">
              {servicesList.map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="flex items-center gap-2 text-sm text-brand-cream-200/55 hover:text-brand-cream-200 transition-colors cursor-pointer group"
                  >
                    <div className="w-1 h-1 rounded-full bg-brand-cream-300/30 group-hover:bg-brand-cream-300 transition-colors flex-shrink-0"></div>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-brand-cream-200 mb-5 text-xs uppercase tracking-widest">
              {t("footer.contact_info")}
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-300/10 rounded-lg flex-shrink-0 mt-0.5">
                  <i className="ri-map-pin-line text-brand-cream-300 text-sm"></i>
                </div>
                <span className="text-sm text-brand-cream-200/55 leading-relaxed">{clinicInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-300/10 rounded-lg flex-shrink-0">
                  <i className="ri-phone-line text-brand-cream-300 text-sm"></i>
                </div>
                <a href={`tel:${clinicInfo.phone}`} className="text-sm text-brand-cream-200/55 hover:text-brand-cream-200 transition-colors cursor-pointer">
                  {clinicInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-300/10 rounded-lg flex-shrink-0">
                  <i className="ri-mail-line text-brand-cream-300 text-sm"></i>
                </div>
                <a href={`mailto:${clinicInfo.email}`} className="text-sm text-brand-cream-200/55 hover:text-brand-cream-200 transition-colors cursor-pointer">
                  {clinicInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-300/10 rounded-lg flex-shrink-0">
                  <i className="ri-time-line text-brand-cream-300 text-sm"></i>
                </div>
                <span className="text-sm text-brand-cream-200/55">{clinicInfo.workingHours}</span>
              </li>
            </ul>

            <Link
              to="/booking"
              className="mt-6 flex items-center justify-center gap-2 bg-brand-cream-300 hover:bg-brand-cream-200 text-brand-forest-900 text-sm font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-calendar-check-line text-sm"></i>
              {t("btn.book_now")}
            </Link>
          </div>
        </div>

        {/* ── Brand Shapes Row ── */}
        <div className="border-t border-brand-cream-300/10 pt-8 pb-6 mb-0">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {[StarShape, SunShape, SwanShape, LotusShape].map((Shape, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-30 hover:opacity-60 transition-opacity duration-300">
                <Shape size={22} color="#e8dcc8" />
                <span className="text-[10px] text-brand-cream-200/60 font-medium tracking-wide">{shapeLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-brand-cream-300/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-cream-200/35">
            © {new Date().getFullYear()} {isAr ? "ذا مديكال أفينيو — منصة الطب الدقيق." : "The Medical Avenue — Precision Medicine Platform."} {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/legal" className="text-xs text-brand-cream-200/35 hover:text-brand-cream-200/70 transition-colors cursor-pointer">
              {t("footer.privacy")}
            </Link>
            <span className="text-brand-cream-300/20">|</span>
            <Link to="/legal" className="text-xs text-brand-cream-200/35 hover:text-brand-cream-200/70 transition-colors cursor-pointer">
              {t("footer.terms")}
            </Link>
            <span className="text-brand-cream-300/20">|</span>
            <Link to="/contact" className="text-xs text-brand-cream-200/35 hover:text-brand-cream-200/70 transition-colors cursor-pointer">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
