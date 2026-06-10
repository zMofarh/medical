import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { allPackages, type MedicalPackage } from "@/mocks/packagesData";
import { usePublicOffers } from "@/hooks/useCMSOffers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonalOffer {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  icon: string;
  endDate: Date;
  discountPercent: number;
  packageIds: string[];
  description: string;
  image: string;
}

interface FlashDeal {
  packageId: string;
  flashDiscount: number;
  endsIn: number;
  label: string;
}

// ─── Accent Map ───────────────────────────────────────────────────────────────

const accentMap: Record<string, { bg: string; text: string; border: string; btn: string; iconBg: string; badge: string }> = {
  teal:   { bg: "bg-brand-cream-100", text: "text-brand-forest-700", border: "border-brand-cream-300", btn: "bg-brand-forest-600 hover:bg-brand-forest-700", iconBg: "bg-brand-cream-200", badge: "bg-brand-forest-600" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",  btn: "bg-rose-600 hover:bg-rose-700",   iconBg: "bg-rose-100",   badge: "bg-rose-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200",btn: "bg-orange-500 hover:bg-orange-600",iconBg: "bg-orange-100", badge: "bg-orange-500" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",  btn: "bg-pink-600 hover:bg-pink-700",   iconBg: "bg-pink-100",   badge: "bg-pink-600" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200", btn: "bg-green-600 hover:bg-green-700",  iconBg: "bg-green-100",  badge: "bg-green-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200",btn: "bg-violet-600 hover:bg-violet-700",iconBg: "bg-violet-100", badge: "bg-violet-600" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",  btn: "bg-cyan-600 hover:bg-cyan-700",   iconBg: "bg-cyan-100",   badge: "bg-cyan-600" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200", btn: "bg-amber-500 hover:bg-amber-600",  iconBg: "bg-amber-100",  badge: "bg-amber-500" },
};

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ─── Countdown Display ────────────────────────────────────────────────────────

function CountdownUnit({ value, label, light = false }: { value: number; label: string; light?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl font-black text-xl md:text-2xl ${light ? "bg-white/20 text-white" : "bg-white text-gray-900"}`}>
        {String(value).padStart(2, "0")}
      </div>
      <span className={`text-[10px] mt-1 font-semibold ${light ? "text-white/70" : "text-gray-500"}`}>{label}</span>
    </div>
  );
}

function CountdownTimer({ targetDate, light = false }: { targetDate: Date; light?: boolean }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  return (
    <div className="flex items-end gap-2">
      <CountdownUnit value={days} label="يوم" light={light} />
      <span className={`text-xl font-black mb-3 ${light ? "text-white/60" : "text-gray-300"}`}>:</span>
      <CountdownUnit value={hours} label="ساعة" light={light} />
      <span className={`text-xl font-black mb-3 ${light ? "text-white/60" : "text-gray-300"}`}>:</span>
      <CountdownUnit value={minutes} label="دقيقة" light={light} />
      <span className={`text-xl font-black mb-3 ${light ? "text-white/60" : "text-gray-300"}`}>:</span>
      <CountdownUnit value={seconds} label="ثانية" light={light} />
    </div>
  );
}

// ─── Package Card (Offer Style) ───────────────────────────────────────────────

function OfferPackageCard({ pkg, discountPercent }: { pkg: MedicalPackage; discountPercent: number }) {
  const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
  const discountedPrice = Math.round(pkg.price * (1 - discountPercent / 100));
  const savings = pkg.price - discountedPrice;

  return (
    <div className={`relative bg-white rounded-xl border ${accent.border} flex flex-col overflow-hidden group hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="absolute top-0 left-0 z-10">
        <div className={`${accent.badge} text-white text-xs font-black px-3 py-1.5 rounded-br-xl`}>
          خصم {discountPercent}%
        </div>
      </div>
      <Link to={`/packages/${pkg.id}`} className="block p-4 pt-10">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${accent.iconBg}`}>
            <i className={`${pkg.icon} text-lg ${accent.text}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate">{pkg.name}</h4>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
              {pkg.category}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-xs text-gray-400 line-through">{pkg.price.toLocaleString()} ريال</div>
            <div className={`text-2xl font-black ${accent.text}`}>{discountedPrice.toLocaleString()}</div>
            <div className="text-xs text-gray-400">ريال</div>
          </div>
          <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${accent.bg} ${accent.text}`}>
            وفر {savings.toLocaleString()} ر
          </div>
        </div>
        <ul className="mt-3 space-y-1">
          {pkg.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className={`w-3.5 h-3.5 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                <i className={`ri-check-line text-[9px] ${accent.text}`}></i>
              </div>
              {f}
            </li>
          ))}
        </ul>
      </Link>
      <div className={`mt-auto px-4 py-3 border-t ${accent.border}`}>
        <Link
          to={`/booking?package=${pkg.id}`}
          className={`w-full flex items-center justify-center gap-2 text-sm font-bold text-white py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}
        >
          <i className="ri-calendar-check-line"></i>
          احجز بالسعر المخفض
        </Link>
      </div>
    </div>
  );
}

// ─── Flash Deal Card ──────────────────────────────────────────────────────────

function FlashDealCard({ deal }: { deal: FlashDeal }) {
  const endDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + deal.endsIn);
    return d;
  }, [deal.endsIn]);

  const { hours, minutes, seconds } = useCountdown(endDate);
  const pkg = allPackages.find((p) => p.id === deal.packageId);
  if (!pkg) return null;

  const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
  const discountedPrice = Math.round(pkg.price * (1 - deal.flashDiscount / 100));

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:-translate-y-0.5 transition-all duration-200">
      <div className={`bg-gradient-to-r ${pkg.accentColor === "amber" ? "from-amber-500 to-orange-500" : pkg.accentColor === "teal" ? "from-brand-forest-500 to-brand-forest-600" : pkg.accentColor === "rose" ? "from-rose-500 to-pink-500" : "from-brand-forest-500 to-brand-forest-600"} p-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full">
            <i className="ri-flashlight-line text-white text-xs"></i>
          </div>
          <span className="text-white text-xs font-black">{deal.label}</span>
        </div>
        <div className="flex items-center gap-1 text-white text-xs font-bold">
          <i className="ri-time-line text-xs"></i>
          <span>{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${accent.iconBg}`}>
            <i className={`${pkg.icon} text-base ${accent.text}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm truncate">{pkg.name}</h4>
            <span className={`text-[10px] font-semibold ${accent.text}`}>{pkg.category}</span>
          </div>
          <div className="text-left flex-shrink-0">
            <div className="text-[10px] text-gray-400 line-through">{pkg.price.toLocaleString()}</div>
            <div className={`text-lg font-black ${accent.text}`}>{discountedPrice.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">ريال</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex-1 text-center text-xs font-black text-rose-600 bg-rose-50 py-1 rounded-lg">
            خصم {deal.flashDiscount}%
          </span>
          <Link
            to={`/booking?package=${pkg.id}`}
            className={`flex-1 text-center text-xs font-bold text-white py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${accent.btn}`}
          >
            احجز الآن
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Seasonal Offer Section ───────────────────────────────────────────────────

function SeasonalOfferSection({ offer }: { offer: SeasonalOffer }) {
  const packages = offer.packageIds
    .map((id) => allPackages.find((p) => p.id === id))
    .filter(Boolean) as MedicalPackage[];

  return (
    <section className="mb-16">
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${offer.bgGradient} mb-6`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className={`inline-flex items-center gap-2 ${offer.badgeColor} text-white text-xs font-black px-3 py-1.5 rounded-full mb-3`}>
              <i className={`${offer.icon} text-sm`}></i>
              {offer.badge}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{offer.title}</h2>
            <p className="text-white/80 text-sm max-w-md leading-relaxed mb-4">{offer.description}</p>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm text-white text-2xl font-black px-4 py-2 rounded-xl">
                {offer.discountPercent}%
              </div>
              <div className="text-white/80 text-sm">
                <div className="font-bold text-white">خصم حصري</div>
                <div>على {packages.length} باقة مختارة</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="text-white/70 text-xs font-semibold mb-1">ينتهي العرض خلال</div>
            <CountdownTimer targetDate={offer.endDate} light />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <OfferPackageCard key={pkg.id} pkg={pkg} discountPercent={offer.discountPercent} />
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OffersPage() {
  const { hero, seasonal, flash, redeem, notify } = usePublicOffers();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Convert CMS seasonal offers to display format
  const seasonalOffers: SeasonalOffer[] = seasonal.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    badge: s.badge,
    badgeColor: s.badgeColor,
    bgGradient: s.bgGradient,
    textColor: "",
    accentColor: "amber",
    icon: s.icon,
    endDate: new Date(s.endDate),
    discountPercent: s.discountPercent,
    packageIds: s.packageIds,
    description: s.description,
    image: "",
  }));

  // Convert CMS flash deals to display format
  const flashDeals: FlashDeal[] = flash.map((f) => ({
    packageId: f.packageId,
    flashDiscount: f.flashDiscount,
    endsIn: f.endsIn,
    label: f.label,
  }));

  const filteredOffers = activeFilter === "all"
    ? seasonalOffers
    : seasonalOffers.filter((o) => o.id === activeFilter);

  const nearestOffer = seasonalOffers.length
    ? seasonalOffers.reduce((prev, curr) =>
        curr.endDate.getTime() < prev.endDate.getTime() ? curr : prev
      )
    : null;

  const totalSavings = useMemo(() => {
    const allOfferPackageIds = new Set(seasonalOffers.flatMap((o) => o.packageIds));
    return [...allOfferPackageIds].reduce((sum, id) => {
      const pkg = allPackages.find((p) => p.id === id);
      if (!pkg) return sum;
      const offer = seasonalOffers.find((o) => o.packageIds.includes(id));
      if (!offer) return sum;
      return sum + Math.round(pkg.price * offer.discountPercent / 100);
    }, 0);
  }, [seasonalOffers]);

  const filterTabs = [
    { id: "all", label: "جميع العروض", icon: "ri-apps-line" },
    ...seasonalOffers.map((o) => ({ id: o.id, label: o.badge, icon: o.icon })),
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500"></div>
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20celebration%20confetti%20and%20stars%20pattern%20on%20dark%20background%2C%20festive%20discount%20sale%20concept%2C%20colorful%20geometric%20shapes%20and%20sparkles%2C%20modern%20minimal%20design%20for%20medical%20offers%20and%20promotions&width=1440&height=600&seq=offers-hero-bg&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/30">
            <i className="ri-flashlight-line text-yellow-300"></i>
            {hero.badge}
            <i className="ri-flashlight-line text-yellow-300"></i>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {hero.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
            {[
              { icon: "ri-price-tag-3-line", value: `${seasonalOffers.length}`, label: "عروض موسمية نشطة" },
              { icon: "ri-gift-line", value: `${seasonalOffers.flatMap((o) => o.packageIds).length}+`, label: "باقة مشمولة بالعروض" },
              { icon: "ri-percent-line", value: `${hero.maxDiscount}%`, label: "أعلى نسبة خصم" },
              { icon: "ri-money-dollar-circle-line", value: `${(totalSavings / 1000).toFixed(0)}K+`, label: "ريال توفير إجمالي" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-2">
                  <i className={`${stat.icon} text-white text-sm`}></i>
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {nearestOffer && (
            <div className="inline-flex flex-col items-center bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl px-8 py-5">
              <div className="text-white/70 text-xs font-semibold mb-3 flex items-center gap-2">
                <i className="ri-alarm-line text-yellow-300"></i>
                أقرب عرض ينتهي خلال
              </div>
              <CountdownTimer targetDate={nearestOffer.endDate} light />
            </div>
          )}
        </div>

        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 48L60 40C120 32 240 16 360 12C480 8 600 16 720 20C840 24 960 24 1080 20C1200 16 1320 8 1380 4L1440 0V48H1380C1320 48 1200 48 1080 48C960 48 840 48 720 48C600 48 480 48 360 48C240 48 120 48 60 48H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* ── Flash Deals ──────────────────────────────────────────────────── */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 flex items-center justify-center bg-rose-100 rounded-full">
                  <i className="ri-flashlight-line text-rose-600 text-xs"></i>
                </div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">فلاش سيل</span>
              </div>
              <h2 className="text-xl font-black text-gray-900">عروض محدودة الوقت</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-rose-50 border border-rose-100 px-3 py-2 rounded-full">
              <i className="ri-time-line text-rose-500"></i>
              تنتهي قريباً — لا تفوّت الفرصة!
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashDeals.map((deal) => (
              <FlashDealCard key={deal.packageId} deal={deal} />
            ))}
          </div>
        </section>
      )}

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* ── Seasonal Offers ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 flex items-center justify-center bg-amber-100 rounded-full">
                <i className="ri-calendar-event-line text-amber-600 text-xs"></i>
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">عروض موسمية</span>
            </div>
            <h2 className="text-xl font-black text-gray-900">العروض الموسمية الحالية</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <i className={`${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {filteredOffers.map((offer) => (
          <SeasonalOfferSection key={offer.id} offer={offer} />
        ))}
      </section>

      {/* ── How to Redeem ─────────────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-2">كيف تستفيد من العروض؟</h2>
            <p className="text-gray-500 text-sm">خطوات بسيطة للحصول على خصمك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {redeem.map((item) => (
              <div key={item.id} className="text-center">
                <div className="relative inline-flex mb-4">
                  <div className="w-14 h-14 flex items-center justify-center bg-brand-cream-100 rounded-2xl">
                    <i className={`${item.icon} text-2xl text-brand-forest-600`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-brand-forest-600 text-white text-[10px] font-black rounded-full">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notify ───────────────────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-r from-brand-forest-700 to-brand-forest-600">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-2xl mx-auto mb-4">
            <i className="ri-notification-3-line text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{notify.title}</h2>
          <p className="text-brand-cream-200 text-sm mb-7 max-w-md mx-auto">
            {notify.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              to="/booking"
              className="flex-1 bg-white text-brand-forest-700 font-bold px-6 py-3 rounded-full hover:bg-brand-cream-50 transition-colors whitespace-nowrap cursor-pointer text-sm text-center"
            >
              <i className="ri-calendar-check-line ml-2"></i>
              {notify.ctaPrimary}
            </Link>
            <Link
              to="/contact"
              className="flex-1 border-2 border-white/50 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-sm text-center"
            >
              <i className="ri-phone-line ml-2"></i>
              {notify.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
