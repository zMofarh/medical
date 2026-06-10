import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BookingConfirmModalProps {
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  fee: string;
  onClose: () => void;
}

type Step = "confirm" | "form" | "success";

export default function BookingConfirmModal({
  doctorId,
  doctorName,
  date,
  time,
  fee,
  onClose,
}: BookingConfirmModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("confirm");
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.phone.trim() || !/^05\d{8}$/.test(form.phone.trim()))
      errs.phone = "رقم الجوال غير صحيح (يبدأ بـ 05)";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep("success");
  };

  const handleGoToBooking = () => {
    onClose();
    navigate(`/booking?doctor=${doctorId}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-brand-forest-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-calendar-check-line text-white text-lg"></i>
              </div>
              <div>
                <h3 className="font-black text-base">
                  {step === "confirm" && "تأكيد الموعد"}
                  {step === "form" && "بياناتك الشخصية"}
                  {step === "success" && "تم الحجز!"}
                </h3>
                <p className="text-brand-cream-200 text-xs">{doctorName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-white text-lg"></i>
            </button>
          </div>

          {/* Progress */}
          {step !== "success" && (
            <div className="flex items-center gap-2 mt-4">
              {["confirm", "form"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s
                        ? "bg-white text-brand-forest-700"
                        : i < ["confirm", "form"].indexOf(step)
                        ? "bg-white/40 text-white"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 1 && <div className="flex-1 h-0.5 bg-white/20 w-8"></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Confirm */}
          {step === "confirm" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">تفاصيل موعدك المختار:</p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: "ri-user-heart-line", label: "الطبيب", value: doctorName },
                  { icon: "ri-calendar-line", label: "التاريخ", value: date },
                  { icon: "ri-time-line", label: "الوقت", value: time },
                  { icon: "ri-money-dollar-circle-line", label: "رسوم الاستشارة", value: `${fee} ريال` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between bg-brand-cream-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={`${item.icon} text-brand-forest-500 text-sm`}></i>
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  متابعة
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Form */}
          {step === "form" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">أدخل بياناتك لإتمام الحجز:</p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    الاسم الكامل <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      setErrors((er) => ({ ...er, name: "" }));
                    }}
                    placeholder="أدخل اسمك الكامل"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                      errors.name ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-forest-400"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    رقم الجوال <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      setErrors((er) => ({ ...er, phone: "" }));
                    }}
                    placeholder="05xxxxxxxx"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                      errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-forest-400"
                    }`}
                    dir="ltr"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="أي معلومات إضافية تريد إخبار الطبيب بها..."
                    rows={3}
                    maxLength={500}
                    className="w-full border-2 border-gray-200 focus:border-brand-forest-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                  />
                  <p className="text-[10px] text-gray-400 text-left mt-1">{form.notes.length}/500</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  رجوع
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  تأكيد الحجز
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
                <i className="ri-check-double-line text-green-600 text-3xl"></i>
              </div>
              <h4 className="font-black text-gray-900 text-lg mb-2">تم تسجيل طلب حجزك!</h4>
              <p className="text-sm text-gray-500 mb-1">
                سيتواصل معك فريقنا على رقم جوالك لتأكيد الموعد
              </p>
              <div className="bg-brand-cream-50 rounded-xl p-4 my-5 text-right space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الطبيب</span>
                  <span className="font-bold text-gray-800">{doctorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">التاريخ</span>
                  <span className="font-bold text-gray-800">{date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الوقت</span>
                  <span className="font-bold text-gray-800">{time}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  إغلاق
                </button>
                <button
                  onClick={handleGoToBooking}
                  className="flex-1 bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  صفحة الحجز الكاملة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
