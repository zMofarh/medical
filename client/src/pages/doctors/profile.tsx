import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import DoctorCalendar from "./components/DoctorCalendar";

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"about" | "specializations" | "reviews" | "calendar">("about");
  const { doctors } = usePublicDoctors();

  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" dir="rtl">
        <p className="text-gray-500 mb-4">لم يتم العثور على الطبيب</p>
        <Link to="/doctors" className="text-brand-forest-600 font-semibold cursor-pointer">العودة للأطباء</Link>
      </div>
    );
  }

  const tabs = [
    { key: "about", label: "نبذة عن الطبيب" },
    { key: "specializations", label: "التخصصات والإنجازات" },
    { key: "reviews", label: `آراء المرضى (${doctor.reviews.length})` },
    { key: "calendar", label: "المواعيد المتاحة" },
  ] as const;

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-brand-cream-50 border-b border-brand-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-brand-forest-600 transition-colors cursor-pointer">الرئيسية</Link>
            <i className="ri-arrow-left-s-line"></i>
            <Link to="/doctors" className="hover:text-brand-forest-600 transition-colors cursor-pointer">الأطباء</Link>
            <i className="ri-arrow-left-s-line"></i>
            <span className="text-gray-700 font-medium">{doctor.name}</span>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <section className="py-10 bg-brand-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl border border-brand-cream-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Image Column */}
              <div className="relative bg-gradient-to-br from-brand-cream-100 to-brand-cream-200 flex items-end justify-center" style={{ minHeight: "380px" }}>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/40 to-transparent"></div>
                {/* Rating */}
                <div className="relative z-10 mb-6 flex items-center gap-2 bg-white/95 px-4 py-2 rounded-full">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <i key={s} className={`ri-star-fill text-sm ${s <= Math.round(doctor.rating) ? "text-amber-400" : "text-gray-200"}`}></i>
                    ))}
                  </div>
                  <span className="font-black text-gray-800 text-sm">{doctor.rating}</span>
                  <span className="text-gray-400 text-xs">({doctor.reviewsCount} تقييم)</span>
                </div>
              </div>

              {/* Info Column */}
              <div className="lg:col-span-2 p-8 md:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{doctor.name}</h1>
                    <p className="text-brand-forest-600 font-semibold text-base mb-1">{doctor.title}</p>
                    <p className="text-gray-400 text-sm">{doctor.education}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("calendar")}
                    className="inline-flex items-center gap-2 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold px-6 py-3 rounded-full transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-calendar-check-line"></i>
                    احجز موعداً
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: "ri-time-line", label: "الخبرة", value: doctor.experience },
                    { icon: "ri-money-dollar-circle-line", label: "رسوم الاستشارة", value: `${doctor.consultationFee} ريال` },
                    { icon: "ri-translate-2", label: "اللغات", value: doctor.languages.join(" • ") },
                    { icon: "ri-calendar-line", label: "أيام العمل", value: `${doctor.availableDays.length} أيام/أسبوع` },
                  ].map((stat, i) => (
                    <div key={i} className="bg-brand-cream-50 rounded-2xl p-4 text-center">
                      <div className="w-9 h-9 flex items-center justify-center bg-brand-cream-200 rounded-xl mx-auto mb-2">
                        <i className={`${stat.icon} text-brand-forest-600 text-base`}></i>
                      </div>
                      <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
                      <p className="font-bold text-gray-800 text-xs">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Available Days */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">أيام الدوام:</p>
                  <div className="flex flex-wrap gap-2">
                    {["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"].map((day) => (
                      <span
                        key={day}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          doctor.availableDays.includes(day)
                            ? "bg-brand-cream-200 text-brand-forest-700"
                            : "bg-gray-100 text-gray-300"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Tab Nav */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-full w-fit mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-white text-brand-forest-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "about" && (
            <div className="max-w-3xl">
              <h2 className="text-xl font-black text-gray-900 mb-4">نبذة عن الطبيب</h2>
              <p className="text-gray-600 leading-relaxed text-base mb-6">{doctor.bio}</p>
              <div className="bg-brand-cream-50 rounded-2xl p-6 border border-brand-cream-200">
                <h3 className="font-bold text-brand-forest-800 mb-3 flex items-center gap-2">
                  <i className="ri-graduation-cap-line text-brand-forest-600"></i>
                  المؤهلات العلمية
                </h3>
                <p className="text-brand-forest-700 text-sm">{doctor.education}</p>
              </div>
            </div>
          )}

          {activeTab === "specializations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                  <i className="ri-stethoscope-line text-brand-forest-600"></i>
                  مجالات التخصص
                </h2>
                <div className="space-y-3">
                  {doctor.specializations.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 bg-brand-cream-50 rounded-xl">
                      <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-200 rounded-lg flex-shrink-0">
                        <i className="ri-check-line text-brand-forest-600 text-sm"></i>
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                  <i className="ri-trophy-line text-brand-forest-600"></i>
                  الإنجازات والشهادات
                </h2>
                <div className="space-y-3">
                  {doctor.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-lg flex-shrink-0 mt-0.5">
                        <i className="ri-medal-line text-amber-600 text-sm"></i>
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-1">المواعيد المتاحة</h2>
                <p className="text-gray-400 text-sm">اختر التاريخ والوقت المناسب لك للحجز مع {doctor.name}</p>
              </div>
              <DoctorCalendar
                doctorId={doctor.id}
                doctorName={doctor.name}
                availableDays={doctor.availableDays}
                consultationFee={doctor.consultationFee}
              />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl space-y-5">
              {/* Summary */}
              <div className="bg-brand-cream-50 rounded-2xl p-6 border border-brand-cream-200 flex items-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-5xl font-black text-brand-forest-700">{doctor.rating}</p>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[1,2,3,4,5].map((s) => (
                      <i key={s} className="ri-star-fill text-amber-400 text-sm"></i>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{doctor.reviewsCount} تقييم</p>
                </div>
                <div className="flex-1">
                  {[5,4,3].map((star) => (
                    <div key={star} className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-gray-500 w-4">{star}</span>
                      <i className="ri-star-fill text-amber-400 text-xs"></i>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full"
                          style={{ width: star === 5 ? "85%" : star === 4 ? "12%" : "3%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {doctor.reviews.map((review, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-100 rounded-full">
                        <i className="ri-user-line text-brand-forest-600"></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <i key={s} className={`ri-star-fill text-xs ${s <= review.rating ? "text-amber-400" : "text-gray-200"}`}></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other Doctors */}
      <section className="py-12 bg-brand-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900">أطباء آخرون قد يهمك</h2>
            <Link to="/doctors" className="text-brand-forest-600 text-sm font-semibold hover:underline cursor-pointer whitespace-nowrap">
              عرض الكل
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors
              .filter((d) => d.id !== doctor.id)
              .slice(0, 4)
              .map((d) => (
                <Link
                  key={d.id}
                  to={`/doctors/${d.id}`}
                  className="group bg-white rounded-2xl border border-brand-cream-200 overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-brand-cream-100" style={{ height: "160px" }}>
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-bold text-gray-900 text-xs mb-0.5">{d.name}</p>
                    <p className="text-brand-forest-600 text-xs">{d.specialty}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-12 bg-brand-forest-700">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            هل تريد حجز موعد مع {doctor.name}؟
          </h2>
          <p className="text-brand-cream-200 mb-6">احجز موعدك الآن وسنتواصل معك لتأكيد الموعد</p>
          <button
            onClick={() => {
              setActiveTab("calendar");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-brand-cream-300 text-brand-forest-900 font-bold px-8 py-4 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-calendar-check-line"></i>
            احجز موعداً الآن
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
