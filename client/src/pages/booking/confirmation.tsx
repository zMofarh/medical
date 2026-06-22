import { useDataContext } from "@/context/DataContext";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import AddToCalendar from "@/pages/booking/components/AddToCalendar";
import BookingRefCard from "@/pages/booking/components/BookingRefCard";

export interface BookingConfirmationState {
  bookingRef: string;
  doctorId: string;
  packageId?: string;
  date: string;
  time: string;
  visitType: string;
  fullName: string;
  phone: string;
  email?: string;
}

const visitTypeLabels: Record<string, string> = {
  first: "زيارة أولى",
  followup: "متابعة",
  consultation: "استشارة",
};

const accentMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  teal:   { bg: "bg-brand-cream-100", text: "text-brand-forest-700", border: "border-brand-cream-300", iconBg: "bg-brand-cream-200" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   iconBg: "bg-rose-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-100" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   iconBg: "bg-pink-100" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  iconBg: "bg-green-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", iconBg: "bg-violet-100" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   iconBg: "bg-cyan-100" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  iconBg: "bg-amber-100" },
};

export default function BookingConfirmationPage() {
  const { services: servicesData, packages: allPackages, posts: blogPosts } = useDataContext();

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BookingConfirmationState | null;
  const [confettiDone, setConfettiDone] = useState(false);
  const { doctors: doctorsDetailed } = usePublicDoctors();

  useEffect(() => {
    if (!state) {
      navigate("/booking", { replace: true });
      return;
    }
    const t = setTimeout(() => setConfettiDone(true), 2000);
    return () => clearTimeout(t);
  }, [state, navigate]);

  if (!state) return null;

  const doctor = doctorsDetailed.find((d) => d.id === state.doctorId || d.doctor_id === state.doctorId);
  const pkg = state.packageId ? allPackages.find((p) => p.id === state.packageId) : null;
  const accent = pkg ? (accentMap[pkg.accentColor] ?? accentMap.teal) : accentMap.teal;

  const calendarDescription = [
    `موعد طبي في ذا مديكال أفينيو`,
    `الطبيب: ${doctor?.name ?? ""}`,
    `نوع الزيارة: ${visitTypeLabels[state.visitType] ?? state.visitType}`,
    pkg ? `الباقة: ${pkg.name}` : "",
    `رقم الحجز: ${state.bookingRef}`,
    `للاستفسار: 011 234 5678`,
  ].filter(Boolean).join("\n");

  return (
    <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-brand-forest-700 to-brand-forest-900 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20medical%20pattern%20healthcare%20symbols%20minimal%20white%20lines%20on%20dark%20forest%20green%20background%20geometric%20pattern%20clean%20modern%20precision%20medicine&width=1440&height=320&seq=confirm-hero-v3&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-64 h-64 rounded-full border border-white/10 transition-all duration-1000 ${confettiDone ? "scale-150 opacity-0" : "scale-100 opacity-100"}`}></div>
          <div className={`absolute w-48 h-48 rounded-full border border-white/15 transition-all duration-700 delay-200 ${confettiDone ? "scale-125 opacity-0" : "scale-100 opacity-100"}`}></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
          {/* Success icon */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="w-20 h-20 flex items-center justify-center bg-white/15 backdrop-blur-sm rounded-full border-2 border-white/30">
              <i className="ri-checkbox-circle-fill text-white text-4xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-green-400 rounded-full border-2 border-white">
              <i className="ri-check-line text-white text-xs"></i>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            تم تأكيد حجزك!
          </h1>
          <p className="text-brand-cream-200 text-base mb-6">
            مرحباً <strong className="text-white">{state.fullName}</strong>، تم استلام طلب حجزك بنجاح
          </p>

          {/* Quick summary pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              <i className="ri-calendar-line text-brand-cream-300"></i>
              {state.date}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              <i className="ri-time-line text-brand-cream-300"></i>
              {state.time}
            </span>
            {doctor && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                <i className="ri-user-heart-line text-brand-cream-300"></i>
                {doctor.name}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-5">

        {/* ── Booking Reference Card ── */}
        <BookingRefCard
          bookingRef={state.bookingRef}
          phone={state.phone}
          patientName={state.fullName}
        />

        {/* ── Appointment Details + Add to Calendar ── */}
        <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                <i className="ri-calendar-check-line text-brand-forest-600 text-sm"></i>
              </div>
              تفاصيل الموعد
            </h2>
            {/* Add to Calendar — inline here */}
            <AddToCalendar
              title={`موعد طبي — ${doctor?.name ?? "ذا مديكال أفينيو"}`}
              date={state.date}
              time={state.time}
              location="شارع الملك فهد، حي العليا، الرياض"
              description={calendarDescription}
            />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { icon: "ri-calendar-line",    label: "التاريخ",      value: state.date,                                    color: "bg-brand-cream-100 text-brand-forest-600" },
              { icon: "ri-time-line",        label: "الوقت",        value: state.time,                                    color: "bg-brand-cream-100 text-brand-forest-600" },
              { icon: "ri-stethoscope-line", label: "نوع الزيارة", value: visitTypeLabels[state.visitType] ?? state.visitType, color: "bg-amber-100 text-amber-600" },
              { icon: "ri-map-pin-line",     label: "الموقع",       value: "العيادة الرئيسية",                            color: "bg-rose-100 text-rose-600" },
            ].map((item, i) => (
              <div key={i} className="bg-brand-cream-50 rounded-xl p-3 text-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg mx-auto mb-2 ${item.color}`}>
                  <i className={`${item.icon} text-sm`}></i>
                </div>
                <p className="text-[10px] text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Doctor card */}
          {doctor && (
            <div className="flex items-center gap-4 bg-brand-cream-50 rounded-xl p-4 border border-brand-cream-200">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm">{doctor.name}</p>
                <p className="text-brand-forest-600 text-xs font-semibold">{doctor.specialty}</p>
                <p className="text-gray-400 text-xs mt-0.5">{doctor.experience}</p>
              </div>
              <div className="text-left flex-shrink-0">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <i className="ri-star-fill text-amber-400 text-xs"></i>
                  <span className="text-xs font-bold text-gray-700">{doctor.rating}</span>
                </div>
                <p className="text-xs text-gray-400">رسوم الاستشارة</p>
                <p className="text-sm font-black text-brand-forest-700">{doctor.consultationFee} ريال</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Package Summary ── */}
        {pkg && (
          <div className={`bg-white rounded-2xl border ${accent.border} p-6`}>
            <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
              <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${accent.iconBg}`}>
                <i className={`ri-gift-line ${accent.text} text-sm`}></i>
              </div>
              الباقة المختارة
            </h2>
            <div className={`rounded-xl p-4 ${accent.bg} border ${accent.border} mb-4`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${accent.iconBg}`}>
                  <i className={`${pkg.icon} text-lg ${accent.text}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm">{pkg.name}</h3>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 bg-white ${accent.text}`}>
                        {pkg.category}
                      </span>
                    </div>
                    <div className="text-left flex-shrink-0">
                      {pkg.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">{pkg.originalPrice.toLocaleString()} ريال</p>
                      )}
                      <p className={`text-xl font-black ${accent.text}`}>
                        {pkg.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">ريال</span>
                      </p>
                      {pkg.originalPrice && (
                        <p className={`text-xs font-bold ${accent.text}`}>
                          وفرت {(pkg.originalPrice - pkg.price).toLocaleString()} ريال
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                    <i className={`ri-check-line text-[9px] ${accent.text}`}></i>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            {pkg.duration && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-time-line text-gray-400"></i>
                </div>
                مدة الفحص المتوقعة: <strong className="text-gray-700 mr-1">{pkg.duration}</strong>
              </div>
            )}
          </div>
        )}

        {/* ── Patient Info ── */}
        <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
          <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-brand-cream-100 rounded-lg">
              <i className="ri-user-line text-brand-forest-600 text-sm"></i>
            </div>
            بيانات المريض
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-brand-cream-50 rounded-xl p-3">
              <div className="w-7 h-7 flex items-center justify-center bg-white rounded-lg flex-shrink-0">
                <i className="ri-user-line text-gray-500 text-sm"></i>
              </div>
              <div>
                <p className="text-xs text-gray-400">الاسم</p>
                <p className="text-sm font-bold text-gray-800">{state.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-brand-cream-50 rounded-xl p-3">
              <div className="w-7 h-7 flex items-center justify-center bg-white rounded-lg flex-shrink-0">
                <i className="ri-phone-line text-gray-500 text-sm"></i>
              </div>
              <div>
                <p className="text-xs text-gray-400">رقم الجوال</p>
                <p className="text-sm font-bold text-gray-800">{state.phone}</p>
              </div>
            </div>
            {state.email && (
              <div className="flex items-center gap-3 bg-brand-cream-50 rounded-xl p-3 sm:col-span-2">
                <div className="w-7 h-7 flex items-center justify-center bg-white rounded-lg flex-shrink-0">
                  <i className="ri-mail-line text-gray-500 text-sm"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                  <p className="text-sm font-bold text-gray-800">{state.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Preparation Tips ── */}
        {pkg?.preparation && pkg.preparation.length > 0 && (
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center bg-amber-100 rounded-lg">
                <i className="ri-lightbulb-line text-amber-600 text-sm"></i>
              </div>
              تعليمات التحضير للفحص
            </h2>
            <div className="space-y-2.5">
              {pkg.preparation.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── What's Next ── */}
        <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
          <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-brand-cream-100 rounded-lg">
              <i className="ri-list-ordered text-brand-forest-600 text-sm"></i>
            </div>
            ماذا يحدث بعد ذلك؟
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-4 top-4 bottom-4 w-px bg-brand-cream-200 hidden sm:block"></div>
            <div className="space-y-4">
              {[
                { icon: "ri-phone-line",    color: "bg-brand-cream-100 text-brand-forest-600", title: "تأكيد هاتفي",    desc: "سيتصل بك فريقنا خلال ساعات قليلة لتأكيد الموعد" },
                { icon: "ri-message-2-line",color: "bg-amber-100 text-amber-600",              title: "رسالة تذكير",    desc: "ستصلك رسالة تذكير قبل موعدك بـ 24 ساعة" },
                { icon: "ri-map-pin-line",  color: "bg-rose-100 text-rose-600",                title: "الحضور للعيادة", desc: "احضر قبل موعدك بـ 15 دقيقة مع هويتك الشخصية" },
                { icon: "ri-file-text-line",color: "bg-violet-100 text-violet-600",            title: "استلام التقرير", desc: "ستحصل على تقريرك الطبي إلكترونياً في نفس اليوم" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 sm:pr-2">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 relative z-10 ${item.color}`}>
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-xs font-black text-gray-200 pt-1 flex-shrink-0">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Location ── */}
        <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
          <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-rose-100 rounded-lg">
              <i className="ri-map-pin-line text-rose-600 text-sm"></i>
            </div>
            موقع العيادة
          </h2>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">ذا مديكال أفينيو — منصة الطب الدقيق</p>
              <p className="text-xs text-gray-500 mt-1">شارع الملك فهد، حي العليا، الرياض 12345</p>
              <p className="text-xs text-gray-500">أوقات العمل: السبت - الخميس، 8 صباحاً - 10 مساءً</p>
            </div>
            <a
              href="https://maps.google.com/?q=24.6877,46.6753"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-forest-600 border border-brand-cream-300 px-3 py-2 rounded-lg hover:bg-brand-cream-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-navigation-line text-sm"></i>
              الاتجاهات
            </a>
          </div>
          <div className="rounded-xl overflow-hidden h-44 bg-brand-cream-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6!2d46.6753!3d24.6877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQxJzE1LjciTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع العيادة"
            ></iframe>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-3.5 rounded-full transition-colors whitespace-nowrap cursor-pointer text-sm"
          >
            <i className="ri-home-line"></i>
            الصفحة الرئيسية
          </Link>
          <Link
            to="/booking"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-forest-600 text-brand-forest-600 font-bold py-3.5 rounded-full hover:bg-brand-cream-50 transition-colors whitespace-nowrap cursor-pointer text-sm"
          >
            <i className="ri-calendar-2-line"></i>
            حجز موعد آخر
          </Link>
          <a
            href={`https://wa.me/966500000000?text=${encodeURIComponent(`مرحباً، رقم حجزي هو ${state.bookingRef}، أود الاستفسار عن موعدي`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-green-200 text-green-700 font-bold py-3.5 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap cursor-pointer text-sm"
          >
            <i className="ri-whatsapp-line text-green-600"></i>
            تواصل معنا
          </a>
        </div>

        {/* ── Cancel Note ── */}
        <div className="flex items-start gap-3 bg-brand-cream-50 rounded-xl p-4 border border-brand-cream-200">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-brand-forest-400 text-sm"></i>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            يمكنك إلغاء أو تعديل موعدك مجاناً قبل 24 ساعة من الموعد المحدد.
            للإلغاء، تواصل معنا عبر واتساب أو اتصل على{" "}
            <strong className="text-gray-700">011 234 5678</strong> مع ذكر رقم الحجز{" "}
            <strong className="text-brand-forest-700">{state.bookingRef}</strong>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
