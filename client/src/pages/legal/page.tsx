import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/base/ScrollReveal";

export default function LegalPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar") || !i18n.language?.startsWith("en");
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

  const privacySections = isAr
    ? [
        {
          title: "1. مقدمة",
          content:
            "نحن في ذا مديكال أفينيو نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية. تُعد هذه السياسة بياناً شاملاً بكيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدامك لمنصتنا أو خدماتنا الطبية.",
        },
        {
          title: "2. البيانات التي نجمعها",
          content:
            "نجمع المعلومات الضرورية لتقديم خدمات طبية دقيقة، بما في ذلك: الاسم الكامل، تاريخ الميلاد، رقم الهاتف، البريد الإلكتروني، السجل الطبي، نتائج الفحوصات، والمعلومات الوراثية (DNA) عند استخدام محاكي الحمض النووي. جميع البيانات الطبية تُعامل بسرية تامة وفقاً للمعايير الدولية.",
        },
        {
          title: "3. كيف نستخدم بياناتك",
          content:
            "نستخدم بياناتك لتقديم خدمات الرعاية الصحية المخصصة، جدولة المواعيد، إرسال التذكيرات الطبية، تحليل المخاطر الصحية، وتقديم استشارات طبية دقيقة. لا نشارك بياناتك مع أي طرف ثالث دون موافقتك الصريحة، باستثناء ما يقتضيه القانون أو متطلبات الرعاية الطبية.",
        },
        {
          title: "4. حماية البيانات",
          content:
            "نستخدم تقنيات تشفير متقدمة (AES-256) لحماية بياناتك أثناء النقل والتخزين. خوادمنا مؤمنة بجدران حماية متعددة الطبقات، ونطبق بروتوكولات الوصول الصارمة. يتم مراجعة أنظمة الأمان بشكل دوري من قبل خبراء أمن المعلومات.",
        },
        {
          title: "5. حقوقك",
          content:
            "لديك الحق في: الوصول إلى بياناتك الشخصية، تصحيح أي معلومات غير دقيقة، طلب حذف بياناتك (باستثناء السجلات الطبية المطلوبة قانونياً)، الاعتراض على معالجة بياناتك لأغراض تسويقية، وطلب نسخة من بياناتك بتنسيق قابل للقراءة.",
        },
        {
          title: "6. ملفات تعريف الارتباط (Cookies)",
          content:
            "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة، بما في ذلك: تذكر تفضيلاتك اللغوية، تسهيل عملية الحجز، تحليل استخدام الموقع لتحسين الخدمات. يمكنك إدارة إعدادات ملفات تعريف الارتباط من خلال متصفحك في أي وقت.",
        },
        {
          title: "7. الاحتفاظ بالبيانات",
          content:
            "نحتفظ ببياناتك الشخصية طالما كان حسابك نشطاً أو حسب ما تقتضيه الحاجة لتقديم خدماتنا. السجلات الطبية تُحفظ لمدة 10 سنوات وفقاً للأنظمة الصحية السعودية. بعد انتهاء فترة الاحتفاظ، يتم حذف البيانات بشكل آمن ونهائي.",
        },
        {
          title: "8. التواصل معنا",
          content:
            "إذا كان لديك أي استفسار أو طلب بخصوص خصوصيتك، يمكنك التواصل مع مسؤول حماية البيانات عبر البريد الإلكتروني: privacy@themedicalavenue.com أو من خلال صفحة التواصل.",
        },
      ]
    : [
        {
          title: "1. Introduction",
          content:
            "At The Medical Avenue, we are committed to protecting your privacy and the security of your personal data. This policy is a comprehensive statement on how we collect, use, and protect your information when you use our platform or medical services.",
        },
        {
          title: "2. Data We Collect",
          content:
            "We collect information necessary to provide precise medical services, including: full name, date of birth, phone number, email address, medical history, test results, and genetic information (DNA) when using the DNA simulator. All medical data is treated with complete confidentiality in accordance with international standards.",
        },
        {
          title: "3. How We Use Your Data",
          content:
            "We use your data to provide personalized healthcare services, schedule appointments, send medical reminders, analyze health risks, and provide precise medical consultations. We do not share your data with any third party without your explicit consent, except as required by law or medical care requirements.",
        },
        {
          title: "4. Data Protection",
          content:
            "We use advanced encryption technologies (AES-256) to protect your data during transmission and storage. Our servers are secured with multi-layered firewalls, and we apply strict access protocols. Security systems are reviewed periodically by information security experts.",
        },
        {
          title: "5. Your Rights",
          content:
            "You have the right to: access your personal data, correct any inaccurate information, request deletion of your data (except medical records required by law), object to processing your data for marketing purposes, and request a copy of your data in a readable format.",
        },
        {
          title: "6. Cookies",
          content:
            "We use cookies to improve your experience on the platform, including: remembering your language preferences, facilitating the booking process, and analyzing site usage to improve services. You can manage cookie settings through your browser at any time.",
        },
        {
          title: "7. Data Retention",
          content:
            "We retain your personal data as long as your account is active or as needed to provide our services. Medical records are kept for 10 years in accordance with Saudi health regulations. After the retention period ends, data is securely and permanently deleted.",
        },
        {
          title: "8. Contact Us",
          content:
            "If you have any questions or requests regarding your privacy, you can contact our Data Protection Officer via email: privacy@themedicalavenue.com or through the contact page.",
        },
      ];

  const termsSections = isAr
    ? [
        {
          title: "1. قبول الشروط",
          content:
            "باستخدامك لمنصة ذا مديكال أفينيو، فإنك توافق على هذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام المنصة. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطارك بالتغييرات الجوهرية.",
        },
        {
          title: "2. الخدمات المقدمة",
          content:
            "تقدم المنصة خدمات استشارية طبية دقيقة، بما في ذلك: تقييم المخاطر الصحية، استشارات DNA، Second Opinion الدولي، حجز المواعيد مع الاستشاريين، والباقات الطبية المتخصصة. الخدمات الطبية تُقدم من قبل أطباء مرخصين ومعتمدين.",
        },
        {
          title: "3. حساب المستخدم",
          content:
            "أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور. يجب أن تكون المعلومات المقدمة أثناء التسجيل دقيقة وكاملة. نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تقدم معلومات مضللة أو تُسيء استخدام المنصة.",
        },
        {
          title: "4. الحجوزات والإلغاء",
          content:
            "يمكنك حجز موعد عبر المنصة مع دفع الرسوم المحددة. يُسمح بالإلغاء المجاني حتى 24 ساعة قبل الموعد المحدد. الإلغاء خلال 24 ساعة قد يخضع لرسوم إدارية. في حال تأخرك أكثر من 15 دقيقة عن الموعد، قد يُعاد جدولة موعدك.",
        },
        {
          title: "5. المسؤولية الطبية",
          content:
            "الاستشارات الطبية المقدمة عبر المنصة هي للتوجيه والإرشاد فقط ولا تُغني عن الفحص الطبي المباشر. نحن غير مسؤولين عن أي قرارات طبية تتخذها بناءً على المعلومات المقدمة دون استشارة طبيبك المعالج مباشرة. في حالات الطوارئ، يُرجى التوجه لأقرب مستشفى فوراً.",
        },
        {
          title: "6. الملكية الفكرية",
          content:
            "جميع المحتويات على المنصة — بما في ذلك النصوص، الصور، الشعارات، التصاميم، والبرمجيات — هي ملك لذا مديكال أفينيو ومحمية بموجب قوانين حقوق النشر والملكية الفكرية. لا يجوز نسخ أو إعادة نشر أي محتوى دون إذن كتابي مسبق.",
        },
        {
          title: "7. الدفع والأسعار",
          content:
            "جميع الأسعار معروضة بالريال السعودي (SAR) وتشمل الضريبة المضافة. الدفع يتم عبر بوابات دفع آمنة معتمدة. الأسعار قابلة للتغيير دون إشعار مسبق، لكن الحجوزات المؤكدة تُحتفظ بسعرها الأصلي.",
        },
        {
          title: "8. حل النزاعات",
          content:
            "في حال نشوء أي نزاع، يُفضل حله ودياً من خلال التواصل المباشر. إذا لم يتم التوصل لحل، فإن النزاعات تُحال للجهات المختصة في المملكة العربية السعودية وفقاً للأنظمة المعمول بها.",
        },
      ]
    : [
        {
          title: "1. Acceptance of Terms",
          content:
            "By using The Medical Avenue platform, you agree to these terms and conditions in full. If you do not agree to any part of these terms, please do not use the platform. We reserve the right to modify these terms at any time, and you will be notified of material changes.",
        },
        {
          title: "2. Services Provided",
          content:
            "The platform provides precise medical consulting services, including: health risk assessment, DNA consultations, international Second Opinion, appointment booking with consultants, and specialized medical packages. Medical services are provided by licensed and certified physicians.",
        },
        {
          title: "3. User Account",
          content:
            "You are responsible for maintaining the confidentiality of your account credentials and password. Information provided during registration must be accurate and complete. We reserve the right to suspend or terminate accounts that provide misleading information or misuse the platform.",
        },
        {
          title: "4. Bookings and Cancellation",
          content:
            "You can book an appointment through the platform with payment of the specified fees. Free cancellation is allowed up to 24 hours before the scheduled appointment. Cancellation within 24 hours may be subject to administrative fees. If you are more than 15 minutes late, your appointment may be rescheduled.",
        },
        {
          title: "5. Medical Liability",
          content:
            "Medical consultations provided through the platform are for guidance and direction only and do not replace direct medical examination. We are not responsible for any medical decisions you make based on the information provided without consulting your treating physician directly. In emergency cases, please go to the nearest hospital immediately.",
        },
        {
          title: "6. Intellectual Property",
          content:
            "All content on the platform — including text, images, logos, designs, and software — is the property of The Medical Avenue and protected under copyright and intellectual property laws. No content may be copied or republished without prior written permission.",
        },
        {
          title: "7. Payment and Pricing",
          content:
            "All prices are displayed in Saudi Riyals (SAR) and include value-added tax. Payment is made through approved secure payment gateways. Prices are subject to change without prior notice, but confirmed bookings retain their original price.",
        },
        {
          title: "8. Dispute Resolution",
          content:
            "In the event of any dispute, it is preferred to resolve it amicably through direct communication. If no resolution is reached, disputes are referred to the competent authorities in the Kingdom of Saudi Arabia in accordance with applicable regulations.",
        },
      ];

  const sections = activeTab === "privacy" ? privacySections : termsSections;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-brand-cream-50">
      {/* Hero */}
      <section className="relative bg-brand-forest-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-brand-cream-300/15 border border-brand-cream-300/25 text-brand-cream-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <i className="ri-shield-check-line"></i>
              {isAr ? "الموثوقية والشفافية" : "Trust & Transparency"}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-brand-cream-100 mb-4 leading-tight">
              {isAr ? "سياسة الخصوصية وشروط الاستخدام" : "Privacy Policy & Terms of Use"}
            </h1>
            <p className="text-brand-cream-200/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? "نلتزم بالشفافية الكاملة في كيفية تعاملنا مع بياناتك وحقوقك كمستخدم لمنصتنا."
                : "We are committed to complete transparency in how we handle your data and your rights as a user of our platform."}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-cream-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-1 py-3">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "privacy"
                  ? "bg-brand-forest-900 text-white shadow-md"
                  : "text-brand-forest-700 hover:bg-brand-cream-100"
              }`}
            >
              <i className="ri-shield-keyhole-line"></i>
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "terms"
                  ? "bg-brand-forest-900 text-white shadow-md"
                  : "text-brand-forest-700 hover:bg-brand-cream-100"
              }`}
            >
              <i className="ri-file-list-3-line"></i>
              {isAr ? "شروط الاستخدام" : "Terms of Use"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3 text-sm text-brand-forest-500">
          <Link to="/" className="hover:text-brand-forest-900 transition-colors cursor-pointer">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-brand-forest-900 font-medium">
            {activeTab === "privacy"
              ? isAr ? "سياسة الخصوصية" : "Privacy Policy"
              : isAr ? "شروط الاستخدام" : "Terms of Use"}
          </span>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <ScrollReveal key={section.title} delay={index * 0.08}>
              <div className="bg-white rounded-xl border border-brand-cream-200 p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold text-brand-forest-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-forest-900 text-brand-cream-100 rounded-lg text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  {section.title}
                </h2>
                <p className="text-brand-forest-600 leading-[1.8] text-sm md:text-base">
                  {section.content}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center">
          <p className="text-sm text-brand-forest-400">
            {isAr
              ? `آخر تحديث: أبريل 2026 — ذا مديكال أفينيو`
              : `Last Updated: April 2026 — The Medical Avenue`}
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-brand-forest-900 rounded-2xl p-8 md:p-10 text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-brand-cream-300/15 rounded-full mx-auto mb-4">
            <i className="ri-question-line text-brand-cream-200 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-brand-cream-100 mb-2">
            {isAr ? "هل لديك استفسار؟" : "Have a Question?"}
          </h3>
          <p className="text-brand-cream-200/60 text-sm mb-6 max-w-md mx-auto">
            {isAr
              ? "فريقنا جاهز للإجابة على أي استفسارات تتعلق بسياسة الخصوصية أو شروط الاستخدام."
              : "Our team is ready to answer any questions regarding our privacy policy or terms of use."}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-cream-300 hover:bg-brand-cream-200 text-brand-forest-900 text-sm font-bold px-6 py-3 rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-mail-send-line"></i>
            {isAr ? "تواصل معنا" : "Contact Us"}
          </Link>
        </div>
      </section>
    </div>
  );
}