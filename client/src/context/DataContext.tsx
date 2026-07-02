import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// API imports
import { getDoctors } from "@/api/doctors";
import { getServices } from "@/api/services";
import { getPackages } from "@/api/packages";
import { BlogPost, BlogCategory, getPosts, getCategories, adaptPost } from "@/api/blog";
import { getHomeContent, updateHomeContent } from "@/api/cms_home";
import { getFaqs, getFaqCategories, massSaveFaqs } from "@/api/faq";

// CMS API imports
import { getAboutCMS, updateAboutCMS } from "@/api/about";
import { getOffersPageConfig, updateOffersPageConfig } from "@/api/offers";
import { getContactCMS, updateContactCMS } from "@/api/contact_cms";
import { getSearchCMS, updateSearchCMS } from "@/api/search_cms";
import { getSettings, updateSettings } from "@/api/settings";

import { 
  AboutHeroData, AboutStoryData, AboutMission, AboutValue, AboutTimelineEvent, AboutTeamMember, AboutAward,
  OffersHeroData, SeasonalOffer, FlashDeal, HowToRedeemStep, OffersNotifyData,
  ContactHeroData, ContactMethod, ContactFormConfig, ContactMapConfig, ContactWorkingHours, ContactSocialLink, ContactCtaBanner, ContactFaqTeaser,
  SearchHeroData, PopularSearch, QuickLink, SearchCTAData, SearchResultsConfig,
  ClinicInfo, WorkingHours, SocialMedia, EmergencyContact,
  defaultAboutHero, defaultAboutStory, defaultOffersHero, defaultOffersNotify, defaultContactHero, defaultContactForm, defaultContactMap, defaultContactCta, defaultContactFaq, defaultSearchHero, defaultSearchCTA, defaultSearchResultsConfig, defaultClinicInfo, defaultWorkingHours, defaultSocialMedia, defaultEmergencyContact
} from "@/types/cms";

// Legacy Mocks imports for types
import { PackageCategory } from "@/mocks/packagesData";
export type { PackageCategory };
import { type FAQItem, type FAQCategory } from "@/mocks/faqData";
import { testimonialsData as initialTestimonials, testimonialsConfig as initialTestimonialsConfig, testimonialsStats as initialTestimonialsStats } from "@/mocks/testimonialsData";
import { cmsContent as initialCmsContent, type CMSContent } from "@/mocks/cmsData";

// --- Types ---
export interface Doctor {
  id: string;
  doctor_id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  rating: number;
  reviewsCount: number;
  title: string;
  education: string;
  bio: string;
  languages: string[];
  availableDays: string[];
  consultationFee: string;
  specializations: string[];
  achievements: string[];
  reviews: any[];
}

export interface ServiceDetail {
  id: string;
  service_id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  accentColor: string;
  image: string;
  heroImage: string;
  category: string;
  stats: any[];
  procedures: any[];
  prices: any[];
  doctors: any[];
  faqs: any[];
  relatedServices: string[];
  price: string;
  duration: string;
  status: string;
}

export interface MedicalPackage {
  id: string;
  package_id: string;
  name: string;
  category: PackageCategory;
  price: number;
  originalPrice: number;
  badge: string;
  icon: string;
  features: string[];
  accentColor: string;
  description: string;
  duration: string;
  targetAudience: string;
  preparation: string[];
  includes: { label: string; icon: string }[];
  faqs: any[];
  status: string;
  image: string;
}

// ----------------------------------------------------------------------
// LocalStorage helpers for legacy stuff like testimonials
// ----------------------------------------------------------------------
function readLS<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}
function writeLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* silent */ }
}

// ----------------------------------------------------------------------
// Context Interface
// ----------------------------------------------------------------------

interface DataContextType {
  doctors: Doctor[];
  doctorsLoading: boolean;
  doctorsError: string | null;
  reloadDoctors: () => Promise<void>;

  services: ServiceDetail[];
  servicesLoading: boolean;
  servicesError: string | null;
  reloadServices: () => Promise<void>;

  packages: MedicalPackage[];
  packagesLoading: boolean;
  packagesError: string | null;
  reloadPackages: () => Promise<void>;

  posts: BlogPost[];
  allPosts: BlogPost[];
  blogCategories: BlogCategory[];
  blogLoading: boolean;
  blogError: string | null;
  reloadBlog: () => Promise<void>;

  // FAQs
  faqs: FAQItem[];
  faqCategories: FAQCategory[];
  faqsLoading: boolean;
  faqsError: string | null;
  reloadFAQs: () => Promise<void>;
  saveFAQs: (newFaqs: FAQItem[], newCats: FAQCategory[]) => Promise<void>;
  resetFAQs: () => void;

  // About CMS
  aboutHero: AboutHeroData;
  aboutStory: AboutStoryData;
  aboutMission: AboutMission[];
  aboutValues: AboutValue[];
  aboutTimeline: AboutTimelineEvent[];
  aboutTeam: AboutTeamMember[];
  aboutAwards: AboutAward[];
  aboutLoading: boolean;
  reloadAbout: () => Promise<void>;
  saveAbout: (data: {
    hero: AboutHeroData;
    story: AboutStoryData;
    mission: AboutMission[];
    values: AboutValue[];
    timeline: AboutTimelineEvent[];
    team: AboutTeamMember[];
    awards: AboutAward[];
  }) => Promise<void>;

  // Contact CMS
  contactHero: ContactHeroData;
  contactMethods: ContactMethod[];
  contactFormConfig: ContactFormConfig;
  contactMapConfig: ContactMapConfig;
  contactWorkingHours: ContactWorkingHours;
  contactSocialLinks: ContactSocialLink[];
  contactCtaBanner: ContactCtaBanner;
  contactFaqTeaser: ContactFaqTeaser;
  contactLoading: boolean;
  reloadContact: () => Promise<void>;
  saveContact: (data: {
    hero: ContactHeroData;
    methods: ContactMethod[];
    form: ContactFormConfig;
    map: ContactMapConfig;
    hours: ContactWorkingHours;
    social: ContactSocialLink[];
    cta: ContactCtaBanner;
    faq: ContactFaqTeaser;
  }) => Promise<void>;

  // Offers CMS
  offersHero: OffersHeroData;
  offersSeasonal: SeasonalOffer[];
  offersFlash: FlashDeal[];
  offersRedeem: HowToRedeemStep[];
  offersNotify: OffersNotifyData;
  offersLoading: boolean;
  reloadOffers: () => Promise<void>;
  saveOffers: (data: {
    hero: OffersHeroData;
    seasonal: SeasonalOffer[];
    flash: FlashDeal[];
    redeem: HowToRedeemStep[];
    notify: OffersNotifyData;
  }) => Promise<void>;

  // Settings CMS
  clinicInfo: ClinicInfo;
  clinicHours: WorkingHours;
  clinicSocial: SocialMedia;
  clinicEmergency: EmergencyContact;
  settingsLoading: boolean;
  reloadSettings: () => Promise<void>;
  saveSettings: (data: {
    info: ClinicInfo;
    hours: WorkingHours;
    social: SocialMedia;
    emergency: EmergencyContact;
  }) => Promise<void>;

  // Testimonials
  testimonials: typeof initialTestimonials;
  testimonialsConfig: typeof initialTestimonialsConfig;
  testimonialsStats: typeof initialTestimonialsStats;
  saveTestimonials: (data: typeof initialTestimonials, config: typeof initialTestimonialsConfig) => Promise<void>;
  resetTestimonials: () => void;

  // Search CMS
  searchHero: SearchHeroData;
  searchPopular: PopularSearch[];
  searchQuickLinks: QuickLink[];
  searchCTA: SearchCTAData;
  searchResultsConfig: SearchResultsConfig;
  searchLoading: boolean;
  reloadSearch: () => Promise<void>;
  saveSearch: (data: {
    hero: SearchHeroData;
    popular: PopularSearch[];
    quickLinks: QuickLink[];
    cta: SearchCTAData;
    resultsConfig: SearchResultsConfig;
  }) => Promise<void>;

  // Homepage CMS
  homeContent: CMSContent;
  saveHomeContent: (data: CMSContent) => Promise<void>;
  resetHomeContent: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // API State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);

  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [packages, setPackages] = useState<MedicalPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState<string | null>(null);

  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);

  // About CMS State
  const [aboutLoading, setAboutLoading] = useState(true);
  const [aboutHeroState, setAboutHero] = useState<AboutHeroData>(defaultAboutHero);
  const [aboutStoryState, setAboutStory] = useState<AboutStoryData>(defaultAboutStory);
  const [aboutMissionState, setAboutMission] = useState<AboutMission[]>([]);
  const [aboutValuesState, setAboutValues] = useState<AboutValue[]>([]);
  const [aboutTimelineState, setAboutTimeline] = useState<AboutTimelineEvent[]>([]);
  const [aboutTeamState, setAboutTeam] = useState<AboutTeamMember[]>([]);
  const [aboutAwardsState, setAboutAwards] = useState<AboutAward[]>([]);

  // Contact CMS State
  const [contactLoading, setContactLoading] = useState(true);
  const [contactHeroState, setContactHero] = useState<ContactHeroData>(defaultContactHero);
  const [contactMethodsState, setContactMethods] = useState<ContactMethod[]>([]);
  const [contactFormConfigState, setContactFormConfig] = useState<ContactFormConfig>(defaultContactForm);
  const [contactMapConfigState, setContactMapConfig] = useState<ContactMapConfig>(defaultContactMap);
  const [contactWorkingHoursState, setContactWorkingHours] = useState<ContactWorkingHours>([]);
  const [contactSocialLinksState, setContactSocialLinks] = useState<ContactSocialLink[]>([]);
  const [contactCtaBannerState, setContactCtaBanner] = useState<ContactCtaBanner>(defaultContactCta);
  const [contactFaqTeaserState, setContactFaqTeaser] = useState<ContactFaqTeaser>(defaultContactFaq);

  // Offers CMS State
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersHeroState, setOffersHero] = useState<OffersHeroData>(defaultOffersHero);
  const [offersSeasonalState, setOffersSeasonal] = useState<SeasonalOffer[]>([]);
  const [offersFlashState, setOffersFlash] = useState<FlashDeal[]>([]);
  const [offersRedeemState, setOffersRedeem] = useState<HowToRedeemStep[]>([]);
  const [offersNotifyState, setOffersNotify] = useState<OffersNotifyData>(defaultOffersNotify);

  // Clinic Settings State
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [clinicInfoState, setClinicInfo] = useState<ClinicInfo>(defaultClinicInfo);
  const [clinicHoursState, setClinicHours] = useState<WorkingHours>(defaultWorkingHours);
  const [clinicSocialState, setClinicSocial] = useState<SocialMedia>(defaultSocialMedia);
  const [clinicEmergencyState, setClinicEmergency] = useState<EmergencyContact>(defaultEmergencyContact);

  // Testimonials
  const [testimonialsState, setTestimonials] = useState<any[]>(initialTestimonials);
  const [testimonialsConfigState, setTestimonialsConfig] = useState<any>(initialTestimonialsConfig);

  // Search CMS State
  const [searchLoading, setSearchLoading] = useState(true);
  const [searchHeroState, setSearchHero] = useState<SearchHeroData>(defaultSearchHero);
  const [searchPopularState, setSearchPopular] = useState<PopularSearch[]>([]);
  const [searchQuickLinksState, setSearchQuickLinks] = useState<QuickLink[]>([]);
  const [searchCTAState, setSearchCTA] = useState<SearchCTAData>(defaultSearchCTA);
  const [searchResultsConfigState, setSearchResultsConfig] = useState<SearchResultsConfig>(defaultSearchResultsConfig);

  // Home Page CMS
  const [homeContentState, setHomeContent] = useState<CMSContent>(() => readLS("cms_home_data", initialCmsContent));

  // --- Loaders ---
  const reloadDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    try {
      const data = await getDoctors();
      const mapped = data.map(d => ({
        id: d.id,
        doctor_id: d.doctor_id,
        name: d.name,
        specialty: d.specialty || "",
        experience: d.experience || "",
        image: d.image || "",
        rating: d.rating || 5.0,
        reviewsCount: d.reviews_count || 0,
        title: d.title || "",
        education: d.education || "",
        bio: d.bio || "",
        languages: d.languages || [],
        availableDays: d.available_days || [],
        consultationFee: d.consultation_fee || "",
        specializations: d.specializations || [],
        achievements: d.achievements || [],
        reviews: d.reviews || [],
      }));
      setDoctors(mapped);
    } catch (err) {
      setDoctorsError(err instanceof Error ? err.message : "فشل في تحميل الأطباء");
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  const reloadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const data = await getServices();
      const colorMap: Record<string, string> = {
        teal: "from-brand-forest-900/90",
        amber: "from-amber-950/90",
        violet: "from-violet-950/90",
        cyan: "from-cyan-950/90",
        rose: "from-rose-950/90",
        green: "from-emerald-950/90",
        orange: "from-orange-950/90",
      };
      const mapped = data.map(s => {
        const accent = s.accent_color || "teal";
        return {
          id: s.id,
          service_id: s.service_id,
          name: s.name,
          tagline: s.tagline || "",
          description: s.description || "",
          longDescription: s.long_description || "",
          icon: s.icon || "",
          accentColor: accent,
          image: s.image || "",
          heroImage: s.hero_image || "",
          category: s.category || "",
          stats: s.stats || [],
          procedures: s.procedures || [],
          prices: s.prices || [],
          doctors: s.doctors || [],
          faqs: s.faqs || [],
          relatedServices: s.related_services || [],
          color: colorMap[accent] || "from-brand-forest-900/90",
          price: s.prices?.[0]?.price?.toString() || "",
          duration: s.prices?.[0]?.duration || "",
          status: (s as any).status || "active",
        };
      });
      setServices(mapped);
    } catch (err) {
      setServicesError(err instanceof Error ? err.message : "فشل في تحميل الخدمات");
    } finally {
      setServicesLoading(false);
    }
  }, []);

  const reloadPackages = useCallback(async () => {
    setPackagesLoading(true);
    setPackagesError(null);
    try {
      const data = await getPackages();
      const mapped = data.map(p => ({
        id: p.id,
        package_id: p.package_id,
        name: p.name,
        category: p.category as PackageCategory,
        price: p.price,
        originalPrice: p.original_price,
        badge: p.badge || "",
        icon: p.icon || "",
        features: p.features || [],
        accentColor: p.accent_color || "teal",
        description: p.description || "",
        duration: p.duration || "",
        targetAudience: p.target_audience || "",
        preparation: p.preparation || [],
        includes: p.includes || [],
        faqs: p.faqs || [],
        status: (p as any).status || "active",
        image: (p as any).image || "",
      }));
      setPackages(mapped);
    } catch (err) {
      setPackagesError(err instanceof Error ? err.message : "فشل في تحميل الباقات");
    } finally {
      setPackagesLoading(false);
    }
  }, []);

  const reloadBlog = useCallback(async () => {
    setBlogLoading(true);
    setBlogError(null);
    try {
      const [cats, backendPosts] = await Promise.all([
        getCategories(),
        getPosts("all")
      ]);
      setBlogCategories(cats);
      const adapted = backendPosts.map(p => adaptPost(p, cats));
      setAllPosts(adapted);
    } catch (err) {
      setBlogError(err instanceof Error ? err.message : "فشل في تحميل المقالات");
    } finally {
      setBlogLoading(false);
    }
  }, []);

  const reloadHomeContent = useCallback(async () => {
    try {
      const data = await getHomeContent();
      if (data && data.hero && data.whyUs) {
        setHomeContent(data);
        if (data.testimonials) {
          const rawItems = Array.isArray(data.testimonials.items) 
            ? data.testimonials.items 
            : (Array.isArray(data.testimonials) ? data.testimonials : []);
          
          const mapped = rawItems.map((t: any, idx: number) => ({
            id: t.id || `t-${idx}`,
            name: t.name || "",
            specialty: t.specialty || t.role || "",
            text: t.text || "",
            rating: t.rating || 5,
            image: t.image || t.avatar || "",
            date: t.date || "",
            service: t.service || "",
            verified: t.verified ?? true,
            published: t.published ?? true,
            featured: t.featured ?? true,
          }));
          setTestimonials(mapped);

          const cfg = {
            sectionBadge: data.testimonials.badge || data.testimonials.config?.sectionBadge || "تجارب مرضانا",
            sectionTitle: data.testimonials.heading || data.testimonials.config?.sectionTitle || "ماذا يقول من اختاروا الفهم الحقيقي؟",
            sectionSubtitle: data.testimonials.description || data.testimonials.config?.sectionSubtitle || "مرضى لم تمنحهم الزيارات السريعة صورة واضحة — حتى جاؤوا إلى ذا مديكال أفينيو",
            displayStyle: data.testimonials.config?.displayStyle || "slider",
            showRating: data.testimonials.config?.showRating ?? true,
            showImage: data.testimonials.config?.showImage ?? true,
          };
          setTestimonialsConfig(cfg);
        }
      }
    } catch (err) {
      console.error("Failed to load CMS home content from API", err);
    }
  }, []);

  const reloadFAQs = useCallback(async () => {
    setFaqsLoading(true);
    try {
      const [fetchedFaqs, fetchedCategories] = await Promise.all([
        getFaqs(),
        getFaqCategories()
      ]);
      setFaqs(fetchedFaqs);
      setFaqCategories(fetchedCategories);
    } catch (err) {
      console.error(err);
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  const reloadAbout = useCallback(async () => {
    setAboutLoading(true);
    try {
      const data = await getAboutCMS();
      setAboutHero({ ...defaultAboutHero, ...data.hero });
      setAboutStory({ ...defaultAboutStory, ...data.story });
      setAboutMission(data.mission || []);
      setAboutValues(data.values || []);
      setAboutTimeline(data.timeline || []);
      setAboutTeam(data.team || []);
      setAboutAwards(data.awards || []);
    } catch (err) {
      console.error("Failed to fetch About CMS", err);
    } finally {
      setAboutLoading(false);
    }
  }, []);

  const reloadContact = useCallback(async () => {
    setContactLoading(true);
    try {
      const data = await getContactCMS();
      setContactHero({ ...defaultContactHero, ...data.hero });
      setContactMethods(data.methods || []);
      
      const formConfig = (data.form_config || {}) as any;
      setContactFormConfig({
        ...defaultContactForm,
        ...formConfig,
        fields: {
          name: { ...defaultContactForm.fields.name, ...formConfig.fields?.name },
          phone: { ...defaultContactForm.fields.phone, ...formConfig.fields?.phone },
          email: { ...defaultContactForm.fields.email, ...formConfig.fields?.email },
          subject: { ...defaultContactForm.fields.subject, ...formConfig.fields?.subject },
          message: { ...defaultContactForm.fields.message, ...formConfig.fields?.message },
        }
      });

      const mapConfig = (data.map_config || {}) as any;
      setContactMapConfig({
        ...defaultContactMap,
        ...mapConfig,
        coordinates: {
          ...defaultContactMap.coordinates,
          ...mapConfig.coordinates
        }
      });

      setContactCtaBanner({ ...defaultContactCta, ...data.cta_banner });
      setContactFaqTeaser({ ...defaultContactFaq, ...data.faq_teaser });
    } catch (err) {
      console.error("Failed to fetch Contact CMS", err);
    } finally {
      setContactLoading(false);
    }
  }, []);

  const reloadSearch = useCallback(async () => {
    setSearchLoading(true);
    try {
      const data = await getSearchCMS();
      setSearchHero({ ...defaultSearchHero, ...data.hero });
      setSearchPopular(data.popular_searches || []);
      setSearchQuickLinks(data.quick_links || []);
      setSearchCTA({ ...defaultSearchCTA, ...data.cta });
      setSearchResultsConfig({ ...defaultSearchResultsConfig, ...data.results_config });
    } catch (err) {
      console.error("Failed to fetch Search CMS", err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const reloadOffers = useCallback(async () => {
    setOffersLoading(true);
    try {
      const data = await getOffersPageConfig();
      setOffersHero({ ...defaultOffersHero, ...data.hero });
      setOffersRedeem(data.how_to_redeem || []);
      
      const notifyConfig = (data.notify || {}) as any;
      setOffersNotify({
        ...defaultOffersNotify,
        ...notifyConfig,
        ctaPrimary: {
          text: notifyConfig.ctaPrimary?.text ?? defaultOffersNotify.ctaPrimary?.text ?? "",
          link: notifyConfig.ctaPrimary?.link ?? defaultOffersNotify.ctaPrimary?.link ?? "",
        },
        ctaSecondary: {
          text: notifyConfig.ctaSecondary?.text ?? defaultOffersNotify.ctaSecondary?.text ?? "",
          link: notifyConfig.ctaSecondary?.link ?? defaultOffersNotify.ctaSecondary?.link ?? "",
        }
      });
    } catch (err) {
      console.error("Failed to fetch Offers CMS", err);
    } finally {
      setOffersLoading(false);
    }
  }, []);

  const reloadSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const data = await getSettings();
      setClinicInfo({ ...defaultClinicInfo, ...data.clinic_info });
      setClinicHours({ ...defaultWorkingHours, ...data.working_hours });
      setClinicSocial({ ...defaultSocialMedia, ...data.social_media });
      setClinicEmergency({ ...defaultEmergencyContact, ...data.emergency_contact });
    } catch (err) {
      console.error("Failed to fetch Settings CMS", err);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadDoctors();
    reloadServices();
    reloadPackages();
    reloadBlog();
    reloadHomeContent();
    reloadFAQs();
    reloadAbout();
    reloadContact();
    reloadSearch();
    reloadOffers();
    reloadSettings();
  }, [
    reloadDoctors, reloadServices, reloadPackages, reloadBlog, reloadHomeContent, 
    reloadFAQs, reloadAbout, reloadContact, reloadSearch, reloadOffers, reloadSettings
  ]);

  // Listen to custom updates
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const key = detail?.key;
      if (!key) return;

      if (key === "doctors") reloadDoctors();
      if (key === "services") reloadServices();
      if (key === "packages") reloadPackages();
      if (key === "blog") reloadBlog();
      if (key === "faqs") reloadFAQs();
      if (key === "cms_home_data" || key === "home") reloadHomeContent();
      
      // We can map keys to reloads or just reload everything
      if (key.startsWith("about_")) reloadAbout();
      if (key.startsWith("contact_")) reloadContact();
      if (key.startsWith("search_")) reloadSearch();
      if (key.startsWith("offers_")) reloadOffers();
      if (key.startsWith("cms_settings_")) reloadSettings();
    };
    window.addEventListener("cms-update", handler);
    return () => window.removeEventListener("cms-update", handler);
  }, [reloadDoctors, reloadServices, reloadPackages, reloadBlog, reloadHomeContent, reloadFAQs, reloadAbout, reloadContact, reloadSearch, reloadOffers, reloadSettings]);


  // --- Savers ---
  const saveFAQs = async (newFaqs: FAQItem[], newCats: FAQCategory[]) => {
    await massSaveFaqs(newFaqs, faqs, newCats, faqCategories);
    await reloadFAQs();
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "faqs" } }));
  };
  const resetFAQs = () => {};

  const saveAbout = async (data: any) => {
    const token = localStorage.getItem("access_token") || "";
    await updateAboutCMS(data, token);
    await reloadAbout();
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "about_hero" } }));
  };

  const saveContact = async (data: any) => {
    const token = localStorage.getItem("access_token") || "";
    await updateContactCMS({
      hero: data.hero,
      methods: data.methods,
      form_config: data.form,
      map_config: data.map,
      cta_banner: data.cta,
      faq_teaser: data.faq
    }, token);
    await reloadContact();
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "contact_hero" } }));
  };

  const saveSearch = async (data: any) => {
    const token = localStorage.getItem("access_token") || "";
    await updateSearchCMS({
      hero: data.hero,
      popular_searches: data.popular,
      quick_links: data.quickLinks,
      cta: data.cta,
      results_config: data.resultsConfig
    }, token);
    await reloadSearch();
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "search_hero" } }));
  };

  const saveOffers = async (data: any) => {
    const token = localStorage.getItem("access_token") || "";
    await updateOffersPageConfig({
      hero: data.hero,
      how_to_redeem: data.redeem,
      notify: data.notify
    }, token);
    await reloadOffers();
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "offers_hero" } }));
  };

  const saveSettings = async (data: any) => {
    const token = localStorage.getItem("access_token") || "";
    await updateSettings({
      clinic_info: data.info,
      working_hours: data.hours,
      social_media: data.social,
      emergency_contact: data.emergency
    }, token);
    await reloadSettings();
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_settings_info" } }));
  };

  const saveTestimonials = async (data: any, config: any) => {
    const updatedHomeContent = {
      ...homeContentState,
      testimonials: {
        ...homeContentState.testimonials,
        items: data,
        config: config
      }
    };
    const updated = await updateHomeContent(updatedHomeContent);
    setHomeContent(updated);
    setTestimonials(data);
    setTestimonialsConfig(config);
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_home_data" } }));
  };
  const resetTestimonials = () => {};

  const saveHomeContent = async (data: CMSContent) => {
    const updated = await updateHomeContent(data);
    setHomeContent(updated);
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_home_data" } }));
  };
  const resetHomeContent = () => {};

  const posts = allPosts.filter(p => p.status === "published");

  return (
    <DataContext.Provider
      value={{
        doctors, doctorsLoading, doctorsError, reloadDoctors,
        services, servicesLoading, servicesError, reloadServices,
        packages, packagesLoading, packagesError, reloadPackages,
        posts, allPosts, blogCategories, blogLoading, blogError, reloadBlog,
        faqs, faqCategories, faqsLoading, faqsError, reloadFAQs, saveFAQs, resetFAQs,
        
        aboutHero: aboutHeroState, aboutStory: aboutStoryState, aboutMission: aboutMissionState, aboutValues: aboutValuesState, aboutTimeline: aboutTimelineState, aboutTeam: aboutTeamState, aboutAwards: aboutAwardsState,
        aboutLoading, reloadAbout, saveAbout,

        contactHero: contactHeroState, contactMethods: contactMethodsState, contactFormConfig: contactFormConfigState, contactMapConfig: contactMapConfigState, contactWorkingHours: contactWorkingHoursState, contactSocialLinks: contactSocialLinksState, contactCtaBanner: contactCtaBannerState, contactFaqTeaser: contactFaqTeaserState,
        contactLoading, reloadContact, saveContact,

        offersHero: offersHeroState, offersSeasonal: offersSeasonalState, offersFlash: offersFlashState, offersRedeem: offersRedeemState, offersNotify: offersNotifyState,
        offersLoading, reloadOffers, saveOffers,

        clinicInfo: clinicInfoState, clinicHours: clinicHoursState, clinicSocial: clinicSocialState, clinicEmergency: clinicEmergencyState,
        settingsLoading, reloadSettings, saveSettings,

        testimonials: testimonialsState, testimonialsConfig: testimonialsConfigState, testimonialsStats: initialTestimonialsStats, saveTestimonials, resetTestimonials,

        searchHero: searchHeroState, searchPopular: searchPopularState, searchQuickLinks: searchQuickLinksState, searchCTA: searchCTAState, searchResultsConfig: searchResultsConfigState,
        searchLoading, reloadSearch, saveSearch,

        homeContent: homeContentState, saveHomeContent, resetHomeContent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
