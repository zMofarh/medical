// ─── CMS Mock Data — Home Page Content ───

export interface CMSHeroSection {
  badge: string;
  heading1: string;
  typewriterWords: string[];
  description: string;
  subDescription: string;
  btnBook: string;
  btnServices: string;
  pillars: string[];
  stats: { value: string; label: string }[];
  backgroundImage: string;
}

export interface CMSWhyUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface CMSWhyUsSection {
  badge: string;
  heading: string;
  subHeading: string;
  description: string;
  subDescription: string;
  mainImage: string;
  items: CMSWhyUsItem[];
}

export interface CMSCTASection {
  badge: string;
  heading: string;
  description: string;
  subDescription: string;
  btnBook: string;
  btnContact: string;
}

export interface CMSTrustBarItem {
  icon: string;
  value: string;
  label: string;
}

export interface CMSTrustBarSection {
  items: CMSTrustBarItem[];
}

export interface CMSTestimonialItem {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface CMSTestimonialsSection {
  badge: string;
  heading: string;
  description: string;
  items: CMSTestimonialItem[];
  config?: {
    sectionBadge?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
    displayStyle?: string;
    showRating?: boolean;
    showImage?: boolean;
  };
}

export interface CMSContent {
  hero: CMSHeroSection;
  whyUs: CMSWhyUsSection;
  cta: CMSCTASection;
  trustBar: CMSTrustBarSection;
  testimonials: CMSTestimonialsSection;
  lastUpdated: string;
}

export const cmsContent: CMSContent = {
  hero: {
    badge: "مركز الطب الدقيق والعافية المتكاملة",
    heading1: "صحتك تستحق",
    typewriterWords: ["فهماً أعمق", "رعاية أدق", "علماً حقيقياً", "مساراً مخصصاً"],
    description: "نقدم طبًا يقرأ ما وراء الأعراض — يربط بين الجينات، الأيض، والعمر البيولوجي لبناء خطة صحية حقيقية لك.",
    subDescription: "عيادة متخصصة في الطب الدقيق، الطب الوظيفي، وإدارة الأمراض المزمنة بأسلوب علمي متكامل.",
    btnBook: "احجز موعدك",
    btnServices: "استكشف خدماتنا",
    pillars: ["طب دقيق", "رعاية شاملة", "خبرة دولية"],
    stats: [
      { value: "+2,400", label: "مريض سنوياً" },
      { value: "98%", label: "نسبة الرضا" },
      { value: "6", label: "استشاريين" },
    ],
    backgroundImage: "https://readdy.ai/api/search-image?query=serene%20minimalist%20medical%20clinic%20interior%20soft%20natural%20light%20warm%20cream%20beige%20tones%20clean%20white%20walls%20subtle%20green%20plants%20calm%20peaceful%20healthcare%20environment%20elegant%20simple&width=1440&height=900&seq=hero-ma-calm2&orientation=landscape",
  },
  whyUs: {
    badge: "لماذا ذا مديكال أفينيو؟",
    heading: "طب أعمق، أكثر تخصيصًا،",
    subHeading: "ومدعوم بالدقة",
    description: "نحن لسنا عيادة أسرع — بل عيادة أعمق. نفكك الحالة ونقرأ ما وراء العرض، ونربط بين الحاضر الصحي والمخاطر المستقبلية.",
    subDescription: "كل مريض يملك بيولوجيا ومسارًا صحيًا مختلفًا. لذلك نصمم لكل حالة خطة مبنية على تقييمها الفعلي، لا على بروتوكول عام.",
    mainImage: "https://readdy.ai/api/search-image?query=precision%20medicine%20doctor%20reviewing%20advanced%20diagnostic%20data%20DNA%20genomics%20screens%20modern%20sophisticated%20clinical%20environment%20dark%20teal%20professional%20medical%20science&width=700&height=550&seq=whyus-ma1&orientation=landscape",
    items: [
      { icon: "ri-dna-line", title: "تحليل جيني متقدم", description: "نقرأ خريطتك الجينية لفهم استعداداتك الصحية وتخصيص العلاج." },
      { icon: "ri-heart-pulse-line", title: "تقييم العمر البيولوجي", description: "نقيس عمرك البيولوجي الحقيقي بعيداً عن العمر الزمني." },
      { icon: "ri-microscope-line", title: "طب وظيفي متكامل", description: "نعالج الأسباب الجذرية لا الأعراض فقط." },
      { icon: "ri-global-line", title: "خبرة دولية", description: "شراكات مع مراكز طبية في USA وكوريا وأوروبا." },
    ],
  },
  cta: {
    badge: "ابدأ رحلتك نحو فهم حقيقي",
    heading: "جسدك يستحق أن يُفهم، لا أن يُعالج فقط",
    description: "احجز استشارتك الأولى مع فريقنا المتخصص وابدأ رحلة صحية مبنية على العلم والدقة.",
    subDescription: "نقدم طبًا أعمق · أكثر تخصيصًا · مدعومًا بالتقنيات الدقيقة والخبرة الدولية",
    btnBook: "احجز موعدك الآن",
    btnContact: "تواصل معنا",
  },
  trustBar: {
    items: [
      { icon: "ri-award-line", value: "+2,400", label: "مريض سنوياً" },
      { icon: "ri-star-line", value: "98%", label: "نسبة رضا المرضى" },
      { icon: "ri-user-star-line", value: "6", label: "استشاريين متخصصين" },
      { icon: "ri-hospital-line", value: "12+", label: "سنة خبرة طبية" },
      { icon: "ri-global-line", value: "3", label: "شراكات دولية" },
    ],
  },
  testimonials: {
    badge: "آراء مرضانا",
    heading: "تجارب حقيقية، نتائج ملموسة",
    description: "ما يقوله مرضانا عن تجربتهم في ذا مديكال أفينيو",
    items: [
      {
        name: "أحمد الشمري",
        role: "مريض منذ 2023",
        text: "تجربة استثنائية. الفريق الطبي أخذ وقته الكافي لفهم حالتي بشكل كامل وقدم لي خطة علاجية مخصصة غيّرت حياتي.",
        rating: 5,
        avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=t1&orientation=squarish",
      },
      {
        name: "سارة المطيري",
        role: "مريضة منذ 2024",
        text: "أخيراً وجدت عيادة تتعامل مع الجسم كنظام متكامل. التحليل الجيني الذي أجريته غيّر فهمي لصحتي تماماً.",
        rating: 5,
        avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20woman%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style%20hijab&width=80&height=80&seq=t2&orientation=squarish",
      },
      {
        name: "خالد العتيبي",
        role: "مريض منذ 2022",
        text: "الدكاترة هنا يستمعون فعلاً. ليس مجرد وصفة طبية سريعة، بل تقييم شامل ومتابعة مستمرة. أنصح به بشدة.",
        rating: 5,
        avatar: "https://readdy.ai/api/search-image?query=professional%20saudi%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=t3&orientation=squarish",
      },
    ],
  },
  lastUpdated: "2026-04-23T08:30:00",
};

export const cmsSectionLabels: Record<string, string> = {
  hero: "قسم الهيرو (Hero)",
  whyUs: "لماذا نحن",
  cta: "قسم الدعوة للعمل (CTA)",
  trustBar: "شريط الثقة",
  testimonials: "آراء المرضى",
};
