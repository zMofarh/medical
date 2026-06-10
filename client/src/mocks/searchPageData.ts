export interface SearchHeroData {
  badge: string;
  title: string;
  subtitle: string;
  placeholder: string;
}

export interface PopularSearch {
  id: string;
  label: string;
  active: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  path: string;
  icon: string;
  colorStyle: string;
  active: boolean;
}

export interface SearchCTAData {
  icon: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaPath: string;
  active: boolean;
}

export interface SearchResultsConfig {
  doctorsPreviewCount: number;
  servicesPreviewCount: number;
  packagesPreviewCount: number;
  blogPreviewCount: number;
  showDoctors: boolean;
  showServices: boolean;
  showPackages: boolean;
  showBlog: boolean;
}

export const searchHeroData: SearchHeroData = {
  badge: "بحث ذكي في كل محتوى العيادة",
  title: "ابحث في عيادة الطب الدقيق",
  subtitle: "أطباء متخصصون · خدمات متقدمة · باقات مخصصة · مقالات علمية",
  placeholder: "ابحث عن طبيب، خدمة، باقة، مقال...",
};

export const popularSearchesData: PopularSearch[] = [
  { id: "ps-1", label: "الطب الدقيق", active: true },
  { id: "ps-2", label: "تحليل DNA", active: true },
  { id: "ps-3", label: "Second Opinion", active: true },
  { id: "ps-4", label: "القلب", active: true },
  { id: "ps-5", label: "الجلدية", active: true },
  { id: "ps-6", label: "الأطفال", active: true },
  { id: "ps-7", label: "باقة شاملة", active: true },
  { id: "ps-8", label: "VIP", active: true },
];

export const quickLinksData: QuickLink[] = [
  { id: "ql-1", label: "احجز موعداً",  path: "/booking",  icon: "ri-calendar-check-line", colorStyle: "primary", active: true },
  { id: "ql-2", label: "تصفح الباقات", path: "/packages", icon: "ri-gift-line",            colorStyle: "amber",   active: true },
  { id: "ql-3", label: "أطباؤنا",      path: "/doctors",  icon: "ri-user-heart-line",      colorStyle: "cream",   active: true },
  { id: "ql-4", label: "تواصل معنا",   path: "/contact",  icon: "ri-phone-line",           colorStyle: "gray",    active: true },
];

export const searchCTAData: SearchCTAData = {
  icon: "ri-dna-line",
  title: "هل تبحث عن الطب الدقيق؟",
  subtitle: "تحليل DNA · Second Opinion دولي · خطط علاجية مخصصة",
  ctaLabel: "استكشف الخدمات",
  ctaPath: "/services",
  active: true,
};

export const searchResultsConfig: SearchResultsConfig = {
  doctorsPreviewCount: 3,
  servicesPreviewCount: 4,
  packagesPreviewCount: 4,
  blogPreviewCount: 3,
  showDoctors: true,
  showServices: true,
  showPackages: true,
  showBlog: true,
};
