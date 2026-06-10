export const contactHero = {
  badge: "تواصل معنا",
  typewriterWords: ["كيف يمكننا مساعدتك؟", "نحن هنا لك", "تواصل معنا الآن", "فريقنا في خدمتك"],
  description: "نرد على جميع الرسائل خلال 24 ساعة في أيام العمل. فريقنا جاهز لمساعدتك في أي استفسار.",
  backgroundImage: "https://readdy.ai/api/search-image?query=abstract%20medical%20pattern%20healthcare%20symbols%20minimal%20white%20lines%20on%20dark%20forest%20green%20background%20geometric%20pattern%20precision%20medicine&width=1440&height=400&seq=contact-hero-v2&orientation=landscape",
};

export const contactMethods = [
  {
    id: "phone",
    icon: "ri-phone-fill",
    title: "اتصل بنا",
    value: "+966 11 234 5678",
    sub: "السبت - الخميس، 8ص - 10م",
    href: "tel:+966112345678",
    color: "bg-brand-cream-100 text-brand-forest-600",
    enabled: true,
  },
  {
    id: "whatsapp",
    icon: "ri-whatsapp-line",
    title: "WhatsApp",
    value: "+966 50 123 4567",
    sub: "رد سريع خلال دقائق",
    href: "https://wa.me/966501234567",
    color: "bg-green-100 text-green-600",
    enabled: true,
  },
  {
    id: "email",
    icon: "ri-mail-fill",
    title: "البريد الإلكتروني",
    value: "info@themedicalavenue.com",
    sub: "نرد خلال 24 ساعة",
    href: "mailto:info@themedicalavenue.com",
    color: "bg-amber-100 text-amber-600",
    enabled: true,
  },
  {
    id: "address",
    icon: "ri-map-pin-fill",
    title: "العنوان",
    value: "الرياض، حي العليا، شارع الملك فهد",
    sub: "انقر لفتح الخريطة",
    href: "https://maps.google.com/?q=الرياض+حي+العليا",
    color: "bg-rose-100 text-rose-600",
    enabled: true,
  },
];

export const contactFormConfig = {
  title: "كيف يمكننا مساعدتك؟",
  subtitle: "نرد على جميع الرسائل خلال 24 ساعة في أيام العمل",
  successTitle: "تم إرسال رسالتك بنجاح!",
  successMessage: "سيتواصل معك فريقنا في أقرب وقت ممكن، عادةً خلال 24 ساعة.",
  subjects: [
    "استفسار عام",
    "حجز موعد",
    "الباقات والعروض",
    "التأمين الطبي",
    "الرأي الطبي الدولي (Second Opinion)",
    "تحليل DNA والطب الدقيق",
    "شكوى أو اقتراح",
    "الانضمام للفريق الطبي",
  ],
  fields: {
    name: { label: "الاسم الكامل", placeholder: "أدخل اسمك الكامل", required: true },
    phone: { label: "رقم الهاتف", placeholder: "05xxxxxxxx", required: true },
    email: { label: "البريد الإلكتروني", placeholder: "example@email.com", required: false },
    subject: { label: "موضوع الرسالة", required: true },
    message: { label: "الرسالة", placeholder: "اكتب رسالتك هنا...", required: true, maxLength: 500 },
  },
};

export const contactMapConfig = {
  title: "موقعنا على الخريطة",
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6744!2d46.6752!3d24.6877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2z2K_ZitKp2YrYqSDYp9mE2LnZhNmK2KfYjA!5e0!3m2!1sar!2ssa!4v1680000000000!5m2!1sar!2ssa",
  mapsLink: "https://maps.google.com/?q=الرياض+حي+العليا+شارع+الملك+فهد",
  mapsLinkText: "فتح في خرائط جوجل",
  height: 240,
};

export const contactWorkingHours = [
  { id: "wh1", days: "السبت - الأربعاء", time: "8:00 ص - 10:00 م", isOpen: true },
  { id: "wh2", days: "الخميس", time: "8:00 ص - 8:00 م", isOpen: true },
  { id: "wh3", days: "الجمعة", time: "مغلق", isOpen: false },
];

export const contactSocialLinks = [
  { id: "twitter", icon: "ri-twitter-x-line", label: "Twitter", url: "https://twitter.com/themedicalavenue", enabled: true },
  { id: "instagram", icon: "ri-instagram-line", label: "Instagram", url: "https://instagram.com/themedicalavenue", enabled: true },
  { id: "snapchat", icon: "ri-snapchat-line", label: "Snapchat", url: "https://snapchat.com/add/themedicalavenue", enabled: true },
  { id: "youtube", icon: "ri-youtube-line", label: "YouTube", url: "https://youtube.com/@themedicalavenue", enabled: true },
  { id: "facebook", icon: "ri-facebook-circle-line", label: "Facebook", url: "https://facebook.com/themedicalavenue", enabled: false },
  { id: "tiktok", icon: "ri-tiktok-line", label: "TikTok", url: "https://tiktok.com/@themedicalavenue", enabled: false },
];

export const contactCtaBanner = {
  title: "هل تريد حجز جلسة تقييم؟",
  description: "احجز مباشرة مع أحد استشاريي الطب الدقيق لدينا",
  buttonText: "احجز الآن",
  buttonLink: "/booking",
};

export const contactFaqTeaser = {
  title: "هل لديك أسئلة؟",
  description: "تصفح قسم الأسئلة الشائعة للحصول على إجابات سريعة حول خدماتنا",
  buttonText: "الأسئلة الشائعة",
  buttonLink: "/faq",
};
