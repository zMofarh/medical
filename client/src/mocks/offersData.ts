export interface SeasonalOfferCMS {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  bgGradient: string;
  badgeColor: string;
  discountPercent: number;
  endDate: string; // ISO string
  description: string;
  packageIds: string[];
  active: boolean;
}

export interface FlashDealCMS {
  id: string;
  packageId: string;
  flashDiscount: number;
  endsIn: number; // hours
  label: string;
  active: boolean;
}

export interface OffersHeroCMS {
  badge: string;
  title: string;
  subtitle: string;
  maxDiscount: number;
}

export interface HowToRedeemStep {
  id: string;
  step: string;
  icon: string;
  title: string;
  desc: string;
}

export interface OffersNotifyCMS {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export const offersHeroData: OffersHeroCMS = {
  badge: "عروض وتخفيضات حصرية",
  title: "عروض موسمية لا تُفوَّت",
  subtitle: "خصومات حصرية تصل إلى 40% على أفضل باقاتنا الطبية. استثمر في صحتك بأقل تكلفة.",
  maxDiscount: 40,
};

export const seasonalOffersData: SeasonalOfferCMS[] = [
  {
    id: "ramadan",
    title: "عروض رمضان الصحية",
    subtitle: "استثمر شهر الخير في صحتك",
    badge: "عرض رمضان",
    icon: "ri-moon-line",
    bgGradient: "from-amber-600 via-orange-500 to-amber-700",
    badgeColor: "bg-amber-500",
    discountPercent: 30,
    endDate: "2026-04-30",
    description: "خصومات حصرية تصل إلى 30% على أبرز باقاتنا الطبية خلال شهر رمضان المبارك. فرصة ذهبية للاهتمام بصحتك وصحة عائلتك.",
    packageIds: ["check-standard", "check-premium", "cardio-standard", "family-standard"],
    active: true,
  },
  {
    id: "summer",
    title: "عروض الصيف الصحية",
    subtitle: "استعد لصيف مليء بالحيوية",
    badge: "عرض الصيف",
    icon: "ri-sun-line",
    bgGradient: "from-brand-forest-600 via-brand-forest-500 to-brand-forest-700",
    badgeColor: "bg-brand-forest-500",
    discountPercent: 25,
    endDate: "2026-08-31",
    description: "استعد للصيف بأفضل حال مع خصومات 25% على باقات الجلدية والعيون والعظام. ابدأ موسمك بصحة مثالية.",
    packageIds: ["derm-laser", "derm-antiaging", "derm-acne", "eye-comprehensive", "ortho-sports"],
    active: true,
  },
  {
    id: "national",
    title: "عروض اليوم الوطني",
    subtitle: "احتفل بصحتك في يومنا الوطني",
    badge: "اليوم الوطني",
    icon: "ri-flag-line",
    bgGradient: "from-green-700 via-green-600 to-emerald-700",
    badgeColor: "bg-green-600",
    discountPercent: 23,
    endDate: "2026-09-23",
    description: "بمناسبة اليوم الوطني، نقدم خصم 23% على باقاتنا المميزة. لأن صحة المواطن هي أساس الوطن.",
    packageIds: ["check-executive", "vip-basic", "family-premium", "cardio-premium"],
    active: true,
  },
  {
    id: "winter",
    title: "عروض الشتاء الوقائية",
    subtitle: "قوّ مناعتك قبل موسم البرد",
    badge: "عرض الشتاء",
    icon: "ri-snowy-line",
    bgGradient: "from-sky-600 via-indigo-500 to-sky-700",
    badgeColor: "bg-sky-500",
    discountPercent: 20,
    endDate: "2026-12-31",
    description: "استعد لموسم الشتاء بفحوصات وقائية بخصم 20%. حافظ على صحتك وصحة أطفالك من أمراض الشتاء.",
    packageIds: ["check-basic", "peds-allergy", "ent-allergy", "internal-basic", "diab-basic"],
    active: true,
  },
];

export const flashDealsData: FlashDealCMS[] = [
  { id: "fd-1", packageId: "check-executive", flashDiscount: 35, endsIn: 48, label: "عرض محدود", active: true },
  { id: "fd-2", packageId: "vip-executive", flashDiscount: 40, endsIn: 24, label: "فلاش سيل", active: true },
  { id: "fd-3", packageId: "family-standard", flashDiscount: 30, endsIn: 72, label: "عرض العائلة", active: true },
  { id: "fd-4", packageId: "cardio-premium", flashDiscount: 28, endsIn: 36, label: "عرض القلب", active: true },
];

export const howToRedeemSteps: HowToRedeemStep[] = [
  { id: "s1", step: "01", icon: "ri-search-eye-line", title: "اختر الباقة", desc: "تصفح العروض واختر الباقة المناسبة لك" },
  { id: "s2", step: "02", icon: "ri-calendar-check-line", title: "احجز موعدك", desc: "اضغط على زر الحجز وحدد الوقت المناسب" },
  { id: "s3", step: "03", icon: "ri-coupon-line", title: "السعر المخفض تلقائياً", desc: "يُطبَّق الخصم تلقائياً بدون كود" },
  { id: "s4", step: "04", icon: "ri-hospital-line", title: "احضر وتمتع", desc: "احضر في موعدك واستمتع بالخدمة بالسعر المخفض" },
];

export const offersNotifyData: OffersNotifyCMS = {
  title: "لا تفوّت أي عرض قادم!",
  subtitle: "سجّل رقمك وسنُرسل لك إشعاراً فور إطلاق أي عرض جديد أو تخفيض حصري",
  ctaPrimary: "احجز الآن بالسعر المخفض",
  ctaSecondary: "تواصل معنا",
};
