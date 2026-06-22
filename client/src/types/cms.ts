// -- About Types --
export const defaultAboutHero: AboutHeroData = { badge: "", title: "", subtitle: "", description: "", typewriterWords: [], ctaPrimary: "", ctaSecondary: "", image: "" };
export const defaultAboutStory: AboutStoryData = { badge: "", title: "", paragraphs: [], tags: [], image: "", foundedYear: "", teamCount: "" };

export interface AboutHeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  typewriterWords: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
}

export interface AboutStoryData {
  badge: string;
  title: string;
  paragraphs: string[];
  tags: string[];
  image: string;
  foundedYear: string;
  teamCount: string;
}

export interface AboutMission {
  id: string;
  title: string;
  body: string;
  dark: boolean;
}

export interface AboutValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutTimelineEvent {
  id: string;
  year: string;
  title: string;
  desc: string;
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  image: string;
}

export interface AboutAward {
  id: string;
  icon: string;
  title: string;
  body: string;
}

// -- Offers Types --
export const defaultOffersHero: OffersHeroData = { title: "", subtitle: "", description: "", tags: [], image: "", badge: "", maxDiscount: 0 };
export const defaultOffersNotify: OffersNotifyData = { title: "", description: "", placeholder: "", buttonText: "", subtitle: "", ctaPrimary: { text: "", link: "" }, ctaSecondary: { text: "", link: "" } };

export interface OffersHeroData {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  badge?: string;
  maxDiscount?: number;
}

export interface SeasonalOffer {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  bgGradient: string;
  badgeColor: string;
  discountPercent: number;
  endDate: string;
  packageIds: string[];
  description: string;
  active?: boolean;
}

export interface FlashDeal {
  id: string;
  packageIds: string[];
  flashDiscount: number;
  endsIn: number;
  label: string;
  packageId?: string; // fallback
  active?: boolean;
}

export interface HowToRedeemStep {
  id: string;
  step: number | string;
  title: string;
  description?: string;
  icon: string;
  desc?: string; // fallback
}

export interface OffersNotifyData {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  subtitle?: string;
  ctaPrimary?: {
    text: string;
    link: string;
  };
  ctaSecondary?: {
    text: string;
    link: string;
  };
}

// -- Contact Types --
export const defaultContactHero: ContactHeroData = { 
  title: "", 
  description: "", 
  badge: "", 
  typewriterWords: [], 
  backgroundImage: "" 
};
export const defaultContactForm: ContactFormConfig = { 
  title: "", 
  subtitle: "", 
  topics: [], 
  submitText: "", 
  successMessage: "",
  successTitle: "",
  subjects: [],
  fields: {
    name: { label: "", placeholder: "", required: true },
    phone: { label: "", placeholder: "", required: true },
    email: { label: "", placeholder: "", required: false },
    subject: { label: "", required: true },
    message: { label: "", placeholder: "", required: true, maxLength: 500 }
  }
};
export const defaultContactMap: ContactMapConfig = { 
  title: "", 
  address: "", 
  coordinates: { lat: 0, lng: 0 }, 
  embedUrl: "",
  height: 240,
  mapsLink: "",
  mapsLinkText: ""
};
export const defaultContactCta: ContactCtaBanner = { title: "", description: "", buttonText: "", buttonLink: "", buttonUrl: "" };
export const defaultContactFaq: ContactFaqTeaser = { title: "", description: "", linkText: "", buttonLink: "", buttonText: "" };

export interface ContactHeroData {
  title: string;
  description: string;
  badge: string;
  typewriterWords: string[];
  backgroundImage: string;
}

export interface ContactMethod {
  id: string;
  icon: string;
  title: string;
  value: string;
  subValue?: string;
  action?: "call" | "email" | "chat" | "link";
  actionText?: string;
  href: string;
  color: string;
  sub?: string;
  enabled?: boolean;
}

export interface ContactFormConfig {
  title: string;
  subtitle: string;
  topics: string[];
  submitText: string;
  successMessage: string;
  successTitle: string;
  subjects: string[];
  fields: {
    name: { label: string; placeholder: string; required: boolean };
    phone: { label: string; placeholder: string; required: boolean };
    email: { label: string; placeholder: string; required: boolean };
    subject: { label: string; required: boolean };
    message: { label: string; placeholder: string; required: boolean; maxLength: number };
  };
}

export interface ContactMapConfig {
  title: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  embedUrl: string;
  height: number;
  mapsLink: string;
  mapsLinkText: string;
}

export interface ContactWorkingHoursItem {
  id: string;
  days: string;
  time: string;
  isOpen: boolean;
}
export type ContactWorkingHours = ContactWorkingHoursItem[];

export interface ContactSocialLink {
  id: string;
  platform: string;
  icon: string;
  url: string;
  enabled: boolean;
  label: string;
}

export interface ContactCtaBanner {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonUrl: string;
}

export interface ContactFaqTeaser {
  title: string;
  description: string;
  linkText: string;
  buttonLink: string;
  buttonText: string;
}

// -- Search Types --
export const defaultSearchHero: SearchHeroData = { title: "", description: "", placeholder: "", badge: "", subtitle: "" };
export const defaultSearchCTA: SearchCTAData = { title: "", description: "", buttonText: "", active: true, icon: "", subtitle: "", ctaPath: "", ctaLabel: "" };
export const defaultSearchResultsConfig: SearchResultsConfig = {
  showDoctors: true,
  showServices: true,
  showPackages: true,
  showBlog: true,
  doctorsPreviewCount: 3,
  servicesPreviewCount: 4,
  packagesPreviewCount: 4,
  blogPreviewCount: 3,
  showArticles: true,
  itemsPerPage: 10
};

export interface SearchHeroData {
  title: string;
  description: string;
  placeholder: string;
  badge?: string;
  subtitle?: string;
}

export interface PopularSearch {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  path?: string; // fallback
  colorStyle?: string; // fallback
  active?: boolean;
}

export interface SearchCTAData {
  title: string;
  description: string;
  buttonText: string;
  active?: boolean;
  icon?: string;
  subtitle?: string;
  ctaPath?: string;
  ctaLabel?: string;
}

export interface SearchResultsConfig {
  showDoctors: boolean;
  showServices: boolean;
  showPackages: boolean;
  showBlog: boolean;
  doctorsPreviewCount: number;
  servicesPreviewCount: number;
  packagesPreviewCount: number;
  blogPreviewCount: number;
  showArticles: boolean;
  itemsPerPage: number;
}

// -- Settings Types --
export const defaultClinicInfo: ClinicInfo = { name: "", logo: "", email: "", phone: "", address: "", mapEmbedUrl: "" };
export const defaultWorkingHours: WorkingHours = { regular: "", weekend: "", note: "" };
export const defaultSocialMedia: SocialMedia = { twitter: "", instagram: "", linkedin: "", snapchat: "" };
export const defaultEmergencyContact: EmergencyContact = { phone: "", text: "" };

export interface ClinicInfo {
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  nameEn?: string;
  tagline?: string;
  description?: string;
  addressEn?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  mapLat?: string | number;
  mapLng?: string | number;
  [key: string]: any;
}

export type WorkingHours = any;

export interface SocialMedia {
  twitter: string;
  instagram: string;
  linkedin: string;
  snapchat: string;
  [key: string]: any;
}

export interface EmergencyContact {
  phone: string;
  text: string;
  enabled?: boolean;
  note?: string;
  [key: string]: any;
}
