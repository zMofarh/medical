import { useRef, useState } from "react";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import { servicesData } from "@/mocks/servicesData";
import { allPackages } from "@/mocks/packagesData";
import { createBooking } from "@/api/bookings";

type SubmitStatus = "idle" | "loading" | "error";

interface BookingSummaryItem {
  icon: string;
  label: string;
  value: string;
}

interface StepPatientInfoProps {
  serviceId: string;
  doctorId: string;
  visitType: string;
  selectedDate: string;
  selectedTime: string;
  packageId?: string;
  onBack: () => void;
  onSuccess: (data: {
    bookingRef: string;
    fullName: string;
    phone: string;
    email?: string;
  }) => void;
}

const VISIT_LABELS: Record<string, string> = {
  first: "زيارة أولى",
  followup: "متابعة",
  consultation: "استشارة",
};

export default function StepPatientInfo({
  serviceId,
  doctorId,
  visitType,
  selectedDate,
  selectedTime,
  packageId,
  onBack,
  onSuccess,
}: StepPatientInfoProps) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { doctors: doctorsDetailed } = usePublicDoctors();

  const doctor  = doctorsDetailed.find((d) => d.id === doctorId || d.doctor_id === doctorId);
  const service = servicesData.find((s) => s.id === serviceId);
  const pkg     = packageId ? allPackages.find((p) => p.id === packageId) : null;

  const accentMap: Record<string, { bg: string; text: string; border: string; iconBg: string; badge: string }> = {
    teal:   { bg: "bg-brand-cream-100", text: "text-brand-forest-700", border: "border-brand-cream-300", iconBg: "bg-brand-cream-200", badge: "bg-brand-forest-600" },
    rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   iconBg: "bg-rose-100",   badge: "bg-rose-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-100", badge: "bg-orange-500" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", iconBg: "bg-violet-100", badge: "bg-violet-600" },
    cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   iconBg: "bg-cyan-100",   badge: "bg-cyan-600" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  iconBg: "bg-amber-100",  badge: "bg-amber-500" },
    pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   iconBg: "bg-pink-100",   badge: "bg-pink-600" },
    green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  iconBg: "bg-green-100",  badge: "bg-green-600" },
  };
  const pkgAccent = pkg ? (accentMap[pkg.accentColor] ?? accentMap.teal) : accentMap.teal;

  const summaryItems: BookingSummaryItem[] = [
    { icon: "ri-stethoscope-line",   label: "الخدمة",    value: service?.name.split("—")[0].trim() ?? "" },
    { icon: "ri-user-heart-line",    label: "الطبيب",    value: doctor?.name ?? "" },
    { icon: "ri-calendar-line",      label: "التاريخ",   value: selectedDate },
    { icon: "ri-time-line",          label: "الوقت",     value: selectedTime },
    { icon: "ri-refresh-line",       label: "نوع الزيارة", value: VISIT_LABELS[visitType] ?? visitType },
    { icon: "ri-money-dollar-circle-line", label: "رسوم الاستشارة", value: `${doctor?.consultationFee ?? ""} ريال` },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = new URLSearchParams();
    formData.forEach((val, key) => data.append(key, val.toString()));
    data.append("service",   service?.name ?? "");
    data.append("doctor",    doctor?.name ?? "");
    data.append("specialty", doctor?.specialty ?? "");
    data.append("date",      selectedDate);
    data.append("time",      selectedTime);
    data.append("visitType", VISIT_LABELS[visitType] ?? visitType);
    if (pkg) data.append("package", pkg.name);

    try {
      const bookingPayload = {
        full_name: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        email: (formData.get("email") as string) || undefined,
        age: formData.get("age") ? parseInt(formData.get("age") as string) : undefined,
        gender: (formData.get("gender") as string) || undefined,
        complaint: (formData.get("complaint") as string) || undefined,
        service_id: service?.id,
        doctor_id: doctor?.id,
        package_id: pkg?.id,
        visit_type: visitType,
        selected_date: selectedDate,
        selected_time: selectedTime,
      };

      const res = await createBooking(bookingPayload);

      onSuccess({
        bookingRef: res.booking_ref,
        fullName: bookingPayload.full_name,
        phone: bookingPayload.phone,
        email: bookingPayload.email,
      });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900 mb-1">بياناتك الشخصية</h2>
        <p className="text-gray-400 text-sm">خطوة أخيرة لإتمام الحجز</p>
      </div>

      {/* Package mini-card (if package selected) */}
      {pkg && (
        <div className={`rounded-xl border ${pkgAccent.border} ${pkgAccent.bg} p-4 mb-4 flex items-center gap-3`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${pkgAccent.iconBg}`}>
            <i className={`${pkg.icon} text-lg ${pkgAccent.text}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">{pkg.name}</p>
            <p className={`text-xs font-semibold ${pkgAccent.text}`}>{pkg.category}</p>
          </div>
          <div className="text-left flex-shrink-0">
            {pkg.originalPrice && (
              <p className="text-[10px] text-gray-400 line-through">{pkg.originalPrice.toLocaleString()} ر</p>
            )}
            <p className={`text-sm font-black ${pkgAccent.text}`}>{pkg.price.toLocaleString()} ريال</p>
          </div>
        </div>
      )}

      {/* Booking Summary */}
      <div className="bg-gradient-to-br from-brand-forest-800 to-brand-forest-900 rounded-2xl p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-brand-cream-300/40 to-transparent"></div>
        <p className="text-xs font-bold text-brand-cream-300/70 uppercase tracking-widest mb-4">ملخص الحجز</p>
        <div className="grid grid-cols-2 gap-3">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center bg-brand-cream-300/15 rounded-lg flex-shrink-0 mt-0.5">
                <i className={`${item.icon} text-brand-cream-200 text-xs`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-brand-cream-300/60">{item.label}</p>
                <p className="text-xs font-bold text-white leading-snug truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onBack}
          className="mt-4 text-xs text-brand-cream-300/70 hover:text-brand-cream-200 font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <i className="ri-edit-line text-xs"></i>
          تعديل الموعد
        </button>
      </div>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        data-readdy-form
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="أدخل اسمك الكامل"
              className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 focus:ring-2 focus:ring-brand-cream-200 transition-all placeholder-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              رقم الجوال <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="05xxxxxxxx"
              className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 focus:ring-2 focus:ring-brand-cream-200 transition-all placeholder-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 focus:ring-2 focus:ring-brand-cream-200 transition-all placeholder-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">العمر</label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              placeholder="بالسنوات"
              className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 focus:ring-2 focus:ring-brand-cream-200 transition-all placeholder-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الجنس</label>
            <select
              name="gender"
              className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 focus:ring-2 focus:ring-brand-cream-200 transition-all bg-white cursor-pointer"
            >
              <option value="">اختر...</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            الشكوى أو سبب الزيارة
            <span className="text-gray-400 font-normal mr-1 text-xs">(اختياري)</span>
          </label>
          <textarea
            name="complaint"
            rows={3}
            maxLength={500}
            placeholder="اذكر باختصار سبب زيارتك أو الأعراض التي تعاني منها..."
            onChange={(e) => setCharCount(e.target.value.length)}
            className="w-full border border-brand-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-forest-400 focus:ring-2 focus:ring-brand-cream-200 transition-all resize-none placeholder-gray-300"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-400">الحد الأقصى 500 حرف</p>
            <p className={`text-xs ${charCount > 450 ? "text-red-400" : "text-gray-400"}`}>{charCount}/500</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="agree"
            required
            className="mt-0.5 w-4 h-4 accent-brand-forest-600 cursor-pointer"
          />
          <label htmlFor="agree" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
            أوافق على{" "}
            <a href="#" className="text-brand-forest-600 font-semibold hover:underline">سياسة الخصوصية</a>
            {" "}و{" "}
            <a href="#" className="text-brand-forest-600 font-semibold hover:underline">شروط الاستخدام</a>
          </label>
        </div>

        {submitStatus === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            <i className="ri-error-warning-line"></i>
            حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-3.5 rounded-full hover:border-gray-300 transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-right-line"></i>
            السابق
          </button>
          <button
            type="submit"
            disabled={submitStatus === "loading"}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-3.5 rounded-full transition-all whitespace-nowrap cursor-pointer disabled:opacity-70"
          >
            {submitStatus === "loading" ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                جاري تأكيد الحجز...
              </>
            ) : (
              <>
                <i className="ri-calendar-check-line"></i>
                تأكيد الحجز
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
