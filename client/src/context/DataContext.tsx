import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// API imports
import { getDoctors } from "@/api/doctors";
import { getServices } from "@/api/services";
import { getPackages } from "@/api/packages";
import { BlogPost, BlogCategory, getPosts, getCategories, adaptPost } from "@/api/blog";
import { getHomeContent, updateHomeContent } from "@/api/cms_home";
import { getFaqs, getFaqCategories, massSaveFaqs } from "@/api/faq";

// Mocks imports
import { PackageCategory } from "@/mocks/packagesData";
import { faqs as initialFaqs, faqCategories as initialCategories, type FAQItem, type FAQCategory } from "@/mocks/faqData";
import { aboutHero, aboutStory, aboutMission, aboutValues, aboutTimeline, aboutTeam, aboutAwards } from "@/mocks/aboutData";
import { contactHero, contactMethods, contactFormConfig, contactMapConfig, contactWorkingHours, contactSocialLinks, contactCtaBanner, contactFaqTeaser } from "@/mocks/contactData";
import { offersHeroData, seasonalOffersData, flashDealsData, howToRedeemSteps, offersNotifyData } from "@/mocks/offersData";
import { clinicInfo as initialClinicInfo, workingHours as initialWorkingHours, socialMedia as initialSocialMedia, emergencyContact as initialEmergencyContact } from "@/mocks/clinicSettings";
import { testimonialsData as initialTestimonials, testimonialsConfig as initialTestimonialsConfig, testimonialsStats as initialTestimonialsStats } from "@/mocks/testimonialsData";
import { searchHeroData, popularSearchesData, quickLinksData, searchCTAData, searchResultsConfig as initialSearchResultsConfig } from "@/mocks/searchPageData";
import { cmsContent as initialCmsContent, type CMSContent } from "@/mocks/cmsData";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  doctor_id?: string;
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
  service_id?: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
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
  color?: string;
  price?: string;
  duration?: string;
  status?: "active" | "inactive";
}

export interface MedicalPackage {
  id: string;
  package_id?: string;
  name: string;
  category: PackageCategory;
  price: number;
  originalPrice?: number;
  badge?: string;
  icon: string;
  features: any[];
  accentColor: string;
  description?: string;
  duration?: string;
  targetAudience?: string;
  preparation?: string[];
  includes?: any[];
  faqs?: any[];
  status?: "active" | "inactive";
  image?: string;
}

// LocalStorage helpers
function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* silent */ }
}

// ─── Context Interface ──────────────────────────────────────────────────────────

interface DataContextType {
  // API Entities
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

  // LocalStorage Entities
  // FAQs
  faqs: FAQItem[];
  faqCategories: FAQCategory[];
  faqsLoading: boolean;
  faqsError: string | null;
  reloadFAQs: () => Promise<void>;
  saveFAQs: (newFaqs: FAQItem[], newCats: FAQCategory[]) => Promise<void>;
  resetFAQs: () => void;

  // About
  aboutHero: typeof aboutHero;
  aboutStory: typeof aboutStory;
  aboutMission: typeof aboutMission;
  aboutValues: typeof aboutValues;
  aboutTimeline: typeof aboutTimeline;
  aboutTeam: typeof aboutTeam;
  aboutAwards: typeof aboutAwards;
  saveAbout: (data: {
    hero: typeof aboutHero;
    story: typeof aboutStory;
    mission: typeof aboutMission;
    values: typeof aboutValues;
    timeline: typeof aboutTimeline;
    team: typeof aboutTeam;
    awards: typeof aboutAwards;
  }) => Promise<void>;
  resetAbout: () => void;

  // Contact
  contactHero: typeof contactHero;
  contactMethods: typeof contactMethods;
  contactFormConfig: typeof contactFormConfig;
  contactMapConfig: typeof contactMapConfig;
  contactWorkingHours: typeof contactWorkingHours;
  contactSocialLinks: typeof contactSocialLinks;
  contactCtaBanner: typeof contactCtaBanner;
  contactFaqTeaser: typeof contactFaqTeaser;
  saveContact: (data: {
    hero: typeof contactHero;
    methods: typeof contactMethods;
    form: typeof contactFormConfig;
    map: typeof contactMapConfig;
    hours: typeof contactWorkingHours;
    social: typeof contactSocialLinks;
    cta: typeof contactCtaBanner;
    faq: typeof contactFaqTeaser;
  }) => Promise<void>;
  resetContact: () => void;

  // Offers
  offersHero: typeof offersHeroData;
  offersSeasonal: typeof seasonalOffersData;
  offersFlash: typeof flashDealsData;
  offersRedeem: typeof howToRedeemSteps;
  offersNotify: typeof offersNotifyData;
  saveOffers: (data: {
    hero: typeof offersHeroData;
    seasonal: typeof seasonalOffersData;
    flash: typeof flashDealsData;
    redeem: typeof howToRedeemSteps;
    notify: typeof offersNotifyData;
  }) => Promise<void>;
  resetOffers: () => void;

  // Clinic Settings
  clinicInfo: typeof initialClinicInfo;
  clinicHours: typeof initialWorkingHours;
  clinicSocial: typeof initialSocialMedia;
  clinicEmergency: typeof initialEmergencyContact;
  saveSettings: (data: {
    info: typeof initialClinicInfo;
    hours: typeof initialWorkingHours;
    social: typeof initialSocialMedia;
    emergency: typeof initialEmergencyContact;
  }) => Promise<void>;
  resetSettings: () => void;

  // Testimonials
  testimonials: typeof initialTestimonials;
  testimonialsConfig: typeof initialTestimonialsConfig;
  testimonialsStats: typeof initialTestimonialsStats;
  saveTestimonials: (data: typeof initialTestimonials, config: typeof initialTestimonialsConfig) => Promise<void>;
  resetTestimonials: () => void;

  // Search
  searchHero: typeof searchHeroData;
  searchPopular: typeof popularSearchesData;
  searchQuickLinks: typeof quickLinksData;
  searchCTA: typeof searchCTAData;
  searchResultsConfig: typeof initialSearchResultsConfig;
  saveSearch: (data: {
    hero: typeof searchHeroData;
    popular: typeof popularSearchesData;
    quickLinks: typeof quickLinksData;
    cta: typeof searchCTAData;
    resultsConfig: typeof initialSearchResultsConfig;
  }) => Promise<void>;
  resetSearch: () => void;

  // Homepage CMS Content
  homeContent: CMSContent;
  saveHomeContent: (data: CMSContent) => Promise<void>;
  resetHomeContent: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ─── API State ──────────────────────────────────────────────────────────────
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

  // ─── LocalStorage State ──────────────────────────────────────────────────────
  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);

  // About
  const [aboutHeroState, setAboutHero] = useState(() => readLS("about_hero", aboutHero));
  const [aboutStoryState, setAboutStory] = useState(() => readLS("about_story", aboutStory));
  const [aboutMissionState, setAboutMission] = useState(() => readLS("about_mission", aboutMission));
  const [aboutValuesState, setAboutValues] = useState(() => readLS("about_values", aboutValues));
  const [aboutTimelineState, setAboutTimeline] = useState(() => readLS("about_timeline", aboutTimeline));
  const [aboutTeamState, setAboutTeam] = useState(() => readLS("about_team", aboutTeam));
  const [aboutAwardsState, setAboutAwards] = useState(() => readLS("about_awards", aboutAwards));

  // Contact
  const [contactHeroState, setContactHero] = useState(() => readLS("contact_hero", contactHero));
  const [contactMethodsState, setContactMethods] = useState(() => readLS("contact_methods", contactMethods));
  const [contactFormConfigState, setContactFormConfig] = useState(() => readLS("contact_form", contactFormConfig));
  const [contactMapConfigState, setContactMapConfig] = useState(() => readLS("contact_map", contactMapConfig));
  const [contactWorkingHoursState, setContactWorkingHours] = useState(() => readLS("contact_hours", contactWorkingHours));
  const [contactSocialLinksState, setContactSocialLinks] = useState(() => readLS("contact_social", contactSocialLinks));
  const [contactCtaBannerState, setContactCtaBanner] = useState(() => readLS("contact_cta", contactCtaBanner));
  const [contactFaqTeaserState, setContactFaqTeaser] = useState(() => readLS("contact_faq", contactFaqTeaser));

  // Offers
  const [offersHeroState, setOffersHero] = useState(() => readLS("offers_hero", offersHeroData));
  const [offersSeasonalState, setOffersSeasonal] = useState(() => readLS("offers_seasonal", seasonalOffersData));
  const [offersFlashState, setOffersFlash] = useState(() => readLS("offers_flash", flashDealsData));
  const [offersRedeemState, setOffersRedeem] = useState(() => readLS("offers_redeem", howToRedeemSteps));
  const [offersNotifyState, setOffersNotify] = useState(() => readLS("offers_notify", offersNotifyData));

  // Clinic Settings
  const [clinicInfoState, setClinicInfo] = useState(() => readLS("cms_settings_info", initialClinicInfo));
  const [clinicHoursState, setClinicHours] = useState(() => readLS("cms_settings_hours", initialWorkingHours));
  const [clinicSocialState, setClinicSocial] = useState(() => readLS("cms_settings_social", initialSocialMedia));
  const [clinicEmergencyState, setClinicEmergency] = useState(() => readLS("cms_settings_emergency", initialEmergencyContact));

  // Testimonials
  const [testimonialsState, setTestimonials] = useState(() => readLS("testimonials", initialTestimonials));
  const [testimonialsConfigState, setTestimonialsConfig] = useState(() => readLS("testimonialsConfig", initialTestimonialsConfig));

  // Search
  const [searchHeroState, setSearchHero] = useState(() => readLS("search_hero", searchHeroData));
  const [searchPopularState, setSearchPopular] = useState(() => readLS("search_popular", popularSearchesData));
  const [searchQuickLinksState, setSearchQuickLinks] = useState(() => readLS("search_quicklinks", quickLinksData));
  const [searchCTAState, setSearchCTA] = useState(() => readLS("search_cta", searchCTAData));
  const [searchResultsConfigState, setSearchResultsConfig] = useState(() => readLS("search_results_config", initialSearchResultsConfig));

  // Home Page CMS
  const [homeContentState, setHomeContent] = useState<CMSContent>(() => readLS("cms_home_data", initialCmsContent));

  // ─── API Loaders ─────────────────────────────────────────────────────────────

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
      }
    } catch (err) {
      console.error("Failed to load CMS home content from API, using default/localStorage:", err);
      setHomeContent(readLS("cms_home_data", initialCmsContent));
    }
  }, []);

  const reloadFAQs = useCallback(async () => {
    setFaqsLoading(true);
    setFaqsError(null);
    try {
      const [fetchedFaqs, fetchedCategories] = await Promise.all([
        getFaqs(),
        getFaqCategories()
      ]);
      setFaqs(fetchedFaqs);
      setFaqCategories(fetchedCategories);
    } catch (err) {
      setFaqsError(err instanceof Error ? err.message : "فشل في تحميل الأسئلة الشائعة");
      // Fallback
      setFaqs(readLS("cms_faq_items", initialFaqs));
      setFaqCategories(readLS("cms_faq_categories", initialCategories));
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  // Load all API entities on mount
  useEffect(() => {
    reloadDoctors();
    reloadServices();
    reloadPackages();
    reloadBlog();
    reloadHomeContent();
    reloadFAQs();
  }, [reloadDoctors, reloadServices, reloadPackages, reloadBlog, reloadHomeContent, reloadFAQs]);

  // Listen to cross-component updates via CustomEvents
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const key = detail?.key;
      if (!key) return;

      // Reload appropriate sections
      if (key === "doctors") reloadDoctors();
      if (key === "services") reloadServices();
      if (key === "packages") reloadPackages();
      if (key === "blog") reloadBlog();
      if (key === "faqs") reloadFAQs();

      // local storage syncing
      if (key === "cms_faq_items") setFaqs(readLS("cms_faq_items", initialFaqs));
      if (key === "cms_faq_categories") setFaqCategories(readLS("cms_faq_categories", initialCategories));
      if (key === "about_hero") setAboutHero(readLS("about_hero", aboutHero));
      if (key === "about_story") setAboutStory(readLS("about_story", aboutStory));
      if (key === "about_mission") setAboutMission(readLS("about_mission", aboutMission));
      if (key === "about_values") setAboutValues(readLS("about_values", aboutValues));
      if (key === "about_timeline") setAboutTimeline(readLS("about_timeline", aboutTimeline));
      if (key === "about_team") setAboutTeam(readLS("about_team", aboutTeam));
      if (key === "about_awards") setAboutAwards(readLS("about_awards", aboutAwards));
      if (key === "contact_hero") setContactHero(readLS("contact_hero", contactHero));
      if (key === "contact_methods") setContactMethods(readLS("contact_methods", contactMethods));
      if (key === "contact_form") setContactFormConfig(readLS("contact_form", contactFormConfig));
      if (key === "contact_map") setContactMapConfig(readLS("contact_map", contactMapConfig));
      if (key === "contact_hours") setContactWorkingHours(readLS("contact_hours", contactWorkingHours));
      if (key === "contact_social") setContactSocialLinks(readLS("contact_social", contactSocialLinks));
      if (key === "contact_cta") setContactCtaBanner(readLS("contact_cta", contactCtaBanner));
      if (key === "contact_faq") setContactFaqTeaser(readLS("contact_faq", contactFaqTeaser));
      if (key === "offers_hero") setOffersHero(readLS("offers_hero", offersHeroData));
      if (key === "offers_seasonal") setOffersSeasonal(readLS("offers_seasonal", seasonalOffersData));
      if (key === "offers_flash") setOffersFlash(readLS("offers_flash", flashDealsData));
      if (key === "offers_redeem") setOffersRedeem(readLS("offers_redeem", howToRedeemSteps));
      if (key === "offers_notify") setOffersNotify(readLS("offers_notify", offersNotifyData));
      if (key === "cms_settings_info") setClinicInfo(readLS("cms_settings_info", initialClinicInfo));
      if (key === "cms_settings_hours") setClinicHours(readLS("cms_settings_hours", initialWorkingHours));
      if (key === "cms_settings_social") setClinicSocial(readLS("cms_settings_social", initialSocialMedia));
      if (key === "cms_settings_emergency") setClinicEmergency(readLS("cms_settings_emergency", initialEmergencyContact));
      if (key === "testimonials") setTestimonials(readLS("testimonials", initialTestimonials));
      if (key === "testimonialsConfig") setTestimonialsConfig(readLS("testimonialsConfig", initialTestimonialsConfig));
      if (key === "search_hero") setSearchHero(readLS("search_hero", searchHeroData));
      if (key === "search_popular") setSearchPopular(readLS("search_popular", popularSearchesData));
      if (key === "search_quicklinks") setSearchQuickLinks(readLS("search_quicklinks", quickLinksData));
      if (key === "search_cta") setSearchCTA(readLS("search_cta", searchCTAData));
      if (key === "search_results_config") setSearchResultsConfig(readLS("search_results_config", initialSearchResultsConfig));
      if (key === "cms_home_data" || key === "home") reloadHomeContent();
    };

    window.addEventListener("cms-update", handler);
    return () => window.removeEventListener("cms-update", handler);
  }, [reloadDoctors, reloadServices, reloadPackages, reloadBlog, reloadHomeContent, reloadFAQs]);

  // ─── LocalStorage Savers & Resetters ──────────────────────────────────────────

  // FAQs
  const saveFAQs = async (newFaqs: FAQItem[], newCats: FAQCategory[]) => {
    try {
      await massSaveFaqs(newFaqs, faqs, newCats, faqCategories);
      await reloadFAQs();
      window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "faqs" } }));
    } catch (err) {
      console.error("Failed to mass save FAQs:", err);
      writeLS("cms_faq_items", newFaqs);
      writeLS("cms_faq_categories", newCats);
      setFaqs(newFaqs);
      setFaqCategories(newCats);
      window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_faq_items" } }));
      window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_faq_categories" } }));
      throw err;
    }
  };

  const resetFAQs = () => {
    saveFAQs(initialFaqs, initialCategories);
  };

  // About
  const saveAbout = async (data: {
    hero: typeof aboutHero;
    story: typeof aboutStory;
    mission: typeof aboutMission;
    values: typeof aboutValues;
    timeline: typeof aboutTimeline;
    team: typeof aboutTeam;
    awards: typeof aboutAwards;
  }) => {
    writeLS("about_hero", data.hero);
    writeLS("about_story", data.story);
    writeLS("about_mission", data.mission);
    writeLS("about_values", data.values);
    writeLS("about_timeline", data.timeline);
    writeLS("about_team", data.team);
    writeLS("about_awards", data.awards);

    setAboutHero(data.hero);
    setAboutStory(data.story);
    setAboutMission(data.mission);
    setAboutValues(data.values);
    setAboutTimeline(data.timeline);
    setAboutTeam(data.team);
    setAboutAwards(data.awards);

    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "about_hero" } }));
  };

  const resetAbout = () => {
    saveAbout({
      hero: aboutHero,
      story: aboutStory,
      mission: aboutMission,
      values: aboutValues,
      timeline: aboutTimeline,
      team: aboutTeam,
      awards: aboutAwards
    });
  };

  // Contact
  const saveContact = async (data: {
    hero: typeof contactHero;
    methods: typeof contactMethods;
    form: typeof contactFormConfig;
    map: typeof contactMapConfig;
    hours: typeof contactWorkingHours;
    social: typeof contactSocialLinks;
    cta: typeof contactCtaBanner;
    faq: typeof contactFaqTeaser;
  }) => {
    writeLS("contact_hero", data.hero);
    writeLS("contact_methods", data.methods);
    writeLS("contact_form", data.form);
    writeLS("contact_map", data.map);
    writeLS("contact_hours", data.hours);
    writeLS("contact_social", data.social);
    writeLS("contact_cta", data.cta);
    writeLS("contact_faq", data.faq);

    setContactHero(data.hero);
    setContactMethods(data.methods);
    setContactFormConfig(data.form);
    setContactMapConfig(data.map);
    setContactWorkingHours(data.hours);
    setContactSocialLinks(data.social);
    setContactCtaBanner(data.cta);
    setContactFaqTeaser(data.faq);

    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "contact_hero" } }));
  };

  const resetContact = () => {
    saveContact({
      hero: contactHero,
      methods: contactMethods,
      form: contactFormConfig,
      map: contactMapConfig,
      hours: contactWorkingHours,
      social: contactSocialLinks,
      cta: contactCtaBanner,
      faq: contactFaqTeaser
    });
  };

  // Offers
  const saveOffers = async (data: {
    hero: typeof offersHeroData;
    seasonal: typeof seasonalOffersData;
    flash: typeof flashDealsData;
    redeem: typeof howToRedeemSteps;
    notify: typeof offersNotifyData;
  }) => {
    writeLS("offers_hero", data.hero);
    writeLS("offers_seasonal", data.seasonal);
    writeLS("offers_flash", data.flash);
    writeLS("offers_redeem", data.redeem);
    writeLS("offers_notify", data.notify);

    setOffersHero(data.hero);
    setOffersSeasonal(data.seasonal);
    setOffersFlash(data.flash);
    setOffersRedeem(data.redeem);
    setOffersNotify(data.notify);

    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "offers_hero" } }));
  };

  const resetOffers = () => {
    saveOffers({
      hero: offersHeroData,
      seasonal: seasonalOffersData,
      flash: flashDealsData,
      redeem: howToRedeemSteps,
      notify: offersNotifyData
    });
  };

  // Settings
  const saveSettings = async (data: {
    info: typeof initialClinicInfo;
    hours: typeof initialWorkingHours;
    social: typeof initialSocialMedia;
    emergency: typeof initialEmergencyContact;
  }) => {
    writeLS("cms_settings_info", data.info);
    writeLS("cms_settings_hours", data.hours);
    writeLS("cms_settings_social", data.social);
    writeLS("cms_settings_emergency", data.emergency);

    setClinicInfo(data.info);
    setClinicHours(data.hours);
    setClinicSocial(data.social);
    setClinicEmergency(data.emergency);

    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_settings_info" } }));
  };

  const resetSettings = () => {
    saveSettings({
      info: initialClinicInfo,
      hours: initialWorkingHours,
      social: initialSocialMedia,
      emergency: initialEmergencyContact
    });
  };

  // Testimonials
  const saveTestimonials = async (data: typeof initialTestimonials, config: typeof initialTestimonialsConfig) => {
    writeLS("testimonials", data);
    writeLS("testimonialsConfig", config);

    setTestimonials(data);
    setTestimonialsConfig(config);

    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "testimonials" } }));
  };

  const resetTestimonials = () => {
    saveTestimonials(initialTestimonials, initialTestimonialsConfig);
  };

  // Search
  const saveSearch = async (data: {
    hero: typeof searchHeroData;
    popular: typeof popularSearchesData;
    quickLinks: typeof quickLinksData;
    cta: typeof searchCTAData;
    resultsConfig: typeof initialSearchResultsConfig;
  }) => {
    writeLS("search_hero", data.hero);
    writeLS("search_popular", data.popular);
    writeLS("search_quicklinks", data.quickLinks);
    writeLS("search_cta", data.cta);
    writeLS("search_results_config", data.resultsConfig);

    setSearchHero(data.hero);
    setSearchPopular(data.popular);
    setSearchQuickLinks(data.quickLinks);
    setSearchCTA(data.cta);
    setSearchResultsConfig(data.resultsConfig);

    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "search_hero" } }));
  };

  const resetSearch = () => {
    saveSearch({
      hero: searchHeroData,
      popular: popularSearchesData,
      quickLinks: quickLinksData,
      cta: searchCTAData,
      resultsConfig: initialSearchResultsConfig
    });
  };

  // Home Page
  const saveHomeContent = async (data: CMSContent) => {
    try {
      const updated = await updateHomeContent(data);
      setHomeContent(updated);
      writeLS("cms_home_data", updated);
    } catch (err) {
      console.error("Failed to save home content to API:", err);
      writeLS("cms_home_data", data);
      setHomeContent(data);
      throw err;
    }
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key: "cms_home_data" } }));
  };

  const resetHomeContent = () => {
    saveHomeContent({ ...initialCmsContent });
  };

  const posts = allPosts.filter(p => p.status === "published");

  return (
    <DataContext.Provider
      value={{
        doctors,
        doctorsLoading,
        doctorsError,
        reloadDoctors,

        services,
        servicesLoading,
        servicesError,
        reloadServices,

        packages,
        packagesLoading,
        packagesError,
        reloadPackages,

        posts,
        allPosts,
        blogCategories,
        blogLoading,
        blogError,
        reloadBlog,

        faqs,
        faqCategories,
        faqsLoading,
        faqsError,
        reloadFAQs,
        saveFAQs,
        resetFAQs,

        aboutHero: aboutHeroState,
        aboutStory: aboutStoryState,
        aboutMission: aboutMissionState,
        aboutValues: aboutValuesState,
        aboutTimeline: aboutTimelineState,
        aboutTeam: aboutTeamState,
        aboutAwards: aboutAwardsState,
        saveAbout,
        resetAbout,

        contactHero: contactHeroState,
        contactMethods: contactMethodsState,
        contactFormConfig: contactFormConfigState,
        contactMapConfig: contactMapConfigState,
        contactWorkingHours: contactWorkingHoursState,
        contactSocialLinks: contactSocialLinksState,
        contactCtaBanner: contactCtaBannerState,
        contactFaqTeaser: contactFaqTeaserState,
        saveContact,
        resetContact,

        offersHero: offersHeroState,
        offersSeasonal: offersSeasonalState,
        offersFlash: offersFlashState,
        offersRedeem: offersRedeemState,
        offersNotify: offersNotifyState,
        saveOffers,
        resetOffers,

        clinicInfo: clinicInfoState,
        clinicHours: clinicHoursState,
        clinicSocial: clinicSocialState,
        clinicEmergency: clinicEmergencyState,
        saveSettings,
        resetSettings,

        testimonials: testimonialsState,
        testimonialsConfig: testimonialsConfigState,
        testimonialsStats: initialTestimonialsStats,
        saveTestimonials,
        resetTestimonials,

        searchHero: searchHeroState,
        searchPopular: searchPopularState,
        searchQuickLinks: searchQuickLinksState,
        searchCTA: searchCTAState,
        searchResultsConfig: searchResultsConfigState,
        saveSearch,
        resetSearch,

        homeContent: homeContentState,
        saveHomeContent,
        resetHomeContent,
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
