import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";
import TypewriterText from "@/components/base/TypewriterText";
import { usePublicContact } from "@/hooks/useCMSContact";
import { submitContactMessage } from "@/api/contact";
import { useDataContext } from "@/context/DataContext";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isAr = !i18n.language?.startsWith("en");

  const { hero, methods, form, map, cta, faq } = usePublicContact();
  const { clinicHours, clinicSocial } = useDataContext();

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const heroWords = hero.typewriterWords.length > 0
    ? hero.typewriterWords
    : t("contact.hero.words").split("|");

  const activeMethods = methods.filter((m) => m.enabled);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus("loading");
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    
    try {
      await submitContactMessage({
        full_name: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        email: (formData.get("email") as string) || undefined,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      });
      
      setSubmitStatus("success"); 
      formEl.reset(); 
      setCharCount(0);
    } catch (err) {
      console.error(err);
      setSubmitStatus("error"); 
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-50" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-brand-forest-700 to-brand-forest-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={hero.backgroundImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-12 right-8 pointer-events-none" style={{ opacity: 0.12 }}><StarShape size={100} color="white" /></div>
        <div className="absolute bottom-6 left-10 pointer-events-none" style={{ opacity: 0.10 }}><LotusShape size={90} color="white" /></div>
        <div className="absolute top-20 left-1/3 pointer-events-none" style={{ opacity: 0.05 }}><SwanShape size={70} color="white" /></div>
        <div className="absolute bottom-14 right-1/4 pointer-events-none" style={{ opacity: 0.06 }}><SunShape size={65} color="white" /></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/30">
            <SwanShape size={12} color="white" />
            {hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 min-h-[1.3em]">
            <TypewriterText
              words={heroWords}
              typeSpeed={68}
              deleteSpeed={40}
              pauseAfter={2500}
              startDelay={600}
              cursorChar="▌"
              cursorClassName="text-brand-cream-400/60 text-4xl md:text-5xl"
            />
          </h1>
          <p className="text-brand-cream-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>

      {/* ── Contact Methods ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeMethods.map((method) => (
              <a
                key={method.id}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-brand-cream-200 p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:border-brand-cream-400"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${method.color}`}>
                  <i className={`${method.icon} text-xl`} />
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">{method.title}</p>
                <p className="text-gray-700 text-sm font-medium mb-1 group-hover:text-brand-forest-600 transition-colors">{method.value}</p>
                <p className="text-gray-400 text-xs">{method.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 bg-brand-cream-200 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
                  <StarShape size={12} color="#4a6741" />
                  {isAr ? "أرسل رسالة" : "Send a Message"}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">{form.title}</h2>
                <p className="text-gray-500 text-sm mt-2">{form.subtitle}</p>
              </div>

              {submitStatus === "success" ? (
                <div className="bg-brand-cream-50 border border-brand-cream-300 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-200 rounded-full mx-auto mb-4">
                    <LotusShape size={32} color="#4a6741" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{form.successTitle}</h3>
                  <p className="text-gray-500 text-sm mb-6">{form.successMessage}</p>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="inline-flex items-center gap-2 bg-brand-forest-600 text-white font-bold px-6 py-3 rounded-full hover:bg-brand-forest-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-refresh-line" />
                    {isAr ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} data-readdy-form className="space-y-4 bg-white rounded-2xl border border-brand-cream-200 p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {form.fields.name.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required={form.fields.name.required}
                        placeholder={form.fields.name.placeholder}
                        className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 transition-all placeholder-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {form.fields.phone.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required={form.fields.phone.required}
                        placeholder={form.fields.phone.placeholder}
                        className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 transition-all placeholder-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {form.fields.email.label}
                      {form.fields.email.required && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required={form.fields.email.required}
                      placeholder={form.fields.email.placeholder}
                      className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 transition-all placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {form.fields.subject.label} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      required={form.fields.subject.required}
                      className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 transition-all bg-white"
                    >
                      <option value="">{isAr ? "اختر موضوع الرسالة..." : "Select subject..."}</option>
                      {form.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {form.fields.message.label} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required={form.fields.message.required}
                      rows={5}
                      maxLength={form.fields.message.maxLength}
                      placeholder={form.fields.message.placeholder}
                      onChange={(e) => setCharCount(e.target.value.length)}
                      className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 transition-all resize-none placeholder-gray-300"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">{isAr ? `الحد الأقصى ${form.fields.message.maxLength} حرف` : `Max ${form.fields.message.maxLength} characters`}</p>
                      <p className={`text-xs ${charCount > (form.fields.message.maxLength - 50) ? "text-red-400" : "text-gray-400"}`}>{charCount}/{form.fields.message.maxLength}</p>
                    </div>
                  </div>
                  {submitStatus === "error" && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                      <i className="ri-error-warning-line" />
                      {isAr ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again."}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-4 rounded-full transition-all whitespace-nowrap cursor-pointer disabled:opacity-70"
                  >
                    {submitStatus === "loading" ? (
                      <><i className="ri-loader-4-line animate-spin" />{isAr ? "جاري الإرسال..." : "Sending..."}</>
                    ) : (
                      <><i className="ri-send-plane-line" />{t("contact.form.submit")}</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5">

              {/* Map */}
              <div className="bg-white rounded-2xl border border-brand-cream-200 p-5">
                <h3 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-rose-100 rounded-lg">
                    <i className="ri-map-pin-line text-rose-600 text-sm" />
                  </div>
                  {map.title}
                </h3>
                <div className="rounded-xl overflow-hidden border border-brand-cream-100" style={{ height: `${map.height}px` }}>
                  <iframe
                    title="The Medical Avenue"
                    src={map.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={map.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-forest-600 text-sm font-semibold mt-3 hover:underline cursor-pointer"
                >
                  <i className="ri-external-link-line" />
                  {map.mapsLinkText}
                </a>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-2xl p-5 border border-brand-cream-200">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                    <i className="ri-time-line text-brand-forest-600 text-base" />
                  </div>
                  {t("contact.info.hours")}
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between py-2.5 border-b border-brand-cream-100">
                    <span className="text-sm text-gray-600 font-medium">{isAr ? "السبت - الخميس" : "Saturday - Thursday"}</span>
                    <span className="text-sm font-bold text-brand-forest-600">{clinicHours.regular}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-brand-cream-100 last:border-0">
                    <span className="text-sm text-gray-600 font-medium">{isAr ? "الجمعة" : "Friday"}</span>
                    <span className="text-sm font-bold text-red-400">{clinicHours.weekend}</span>
                  </div>
                  {clinicHours.note && (
                    <p className="text-xs text-gray-400 mt-2 text-right">{clinicHours.note}</p>
                  )}
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl p-5 border border-brand-cream-200">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                    <i className="ri-share-line text-brand-forest-600 text-base" />
                  </div>
                  {isAr ? "تابعنا على" : "Follow Us"}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { id: "twitter", platform: "twitter", icon: "ri-twitter-x-line", url: clinicSocial.twitter },
                    { id: "instagram", platform: "instagram", icon: "ri-instagram-line", url: clinicSocial.instagram },
                    { id: "linkedin", platform: "linkedin", icon: "ri-linkedin-line", url: clinicSocial.linkedin },
                    { id: "snapchat", platform: "snapchat", icon: "ri-snapchat-line", url: clinicSocial.snapchat },
                  ].filter((s) => s.url).map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      title={s.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-brand-cream-50 border border-brand-cream-200 rounded-xl text-gray-600 hover:bg-brand-forest-600 hover:text-white hover:border-brand-forest-600 transition-all duration-200 cursor-pointer"
                    >
                      <i className={`${s.icon} text-base`} />
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA Banner */}
              <div className="bg-brand-forest-800 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-2 left-2 pointer-events-none" style={{ opacity: 0.12 }}>
                  <LotusShape size={50} color="white" />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/15 rounded-xl mx-auto mb-3">
                    <StarShape size={24} color="white" />
                  </div>
                  <h3 className="font-black text-white mb-1.5">{cta.title}</h3>
                  <p className="text-brand-cream-300 text-xs mb-4 leading-relaxed">{cta.description}</p>
                  <Link
                    to={cta.buttonLink}
                    className="inline-flex items-center gap-2 bg-brand-cream-300 text-brand-forest-900 font-bold px-5 py-2.5 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer text-sm"
                  >
                    {cta.buttonText}
                    <i className="ri-arrow-left-line" />
                  </Link>
                </div>
              </div>

              {/* DNA note */}
              <div className="bg-brand-cream-100 rounded-2xl p-5 border border-brand-cream-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center bg-brand-cream-200 rounded-xl flex-shrink-0">
                    <i className="ri-dna-line text-brand-forest-600 text-base" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-forest-800 text-sm mb-1">
                      {isAr ? "الطب الدقيق والـ DNA" : "Precision Medicine & DNA"}
                    </h4>
                    <p className="text-brand-forest-700 text-xs leading-relaxed">
                      {isAr
                        ? "للاستفسار عن تحليل DNA Risk Score أو تقييم العمر البيولوجي أو الرأي الطبي الدولي، يُرجى ذكر ذلك في موضوع رسالتك."
                        : "For inquiries about DNA Risk Score analysis, biological age assessment, or international second opinion, please mention it in your message subject."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Teaser ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-cream-200 rounded-xl flex-shrink-0">
                <i className="ri-question-answer-line text-brand-forest-600 text-xl" />
              </div>
              <div>
                <h3 className="font-black text-gray-900">{faq.title}</h3>
                <p className="text-gray-400 text-sm">{faq.description}</p>
              </div>
            </div>
            <Link
              to={faq.buttonLink}
              className="inline-flex items-center gap-2 border-2 border-brand-forest-600 text-brand-forest-600 hover:bg-brand-forest-600 hover:text-white font-semibold px-6 py-2.5 rounded-full transition-all whitespace-nowrap cursor-pointer text-sm"
            >
              {faq.buttonText}
              <i className="ri-arrow-left-line" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
