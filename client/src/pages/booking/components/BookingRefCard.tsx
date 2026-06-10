import { useState } from "react";

interface BookingRefCardProps {
  bookingRef: string;
  phone: string;
  patientName: string;
}

export default function BookingRefCard({ bookingRef, phone, patientName }: BookingRefCardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const text = `تم تأكيد حجزي في ذا مديكال أفينيو\nرقم الحجز: ${bookingRef}\nالاسم: ${patientName}`;
    if (navigator.share) {
      navigator.share({ title: "تأكيد الحجز — ذا مديكال أفينيو", text });
    } else {
      navigator.clipboard.writeText(text);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  // Split ref into groups for visual display
  const refGroups = bookingRef.match(/.{1,4}/g) ?? [bookingRef];

  return (
    <div className="bg-white rounded-2xl border border-brand-cream-200 overflow-hidden">
      {/* Top stripe */}
      <div className="h-1.5 bg-gradient-to-l from-brand-forest-400 via-brand-forest-600 to-brand-forest-800"></div>

      <div className="p-6">
        {/* Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-brand-cream-100 rounded-lg">
              <i className="ri-barcode-line text-brand-forest-600 text-sm"></i>
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">رقم الحجز</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
            مؤكد
          </span>
        </div>

        {/* Reference Number — big visual */}
        <div className="flex items-center justify-center gap-2 mb-5 py-4 bg-brand-cream-50 rounded-xl border border-brand-cream-200">
          {refGroups.map((group, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-widest font-mono">
                {group}
              </span>
              {i < refGroups.length - 1 && (
                <span className="text-gray-300 text-xl font-light">·</span>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              copied
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-brand-cream-300 bg-brand-cream-50 text-brand-forest-700 hover:bg-brand-cream-100"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={copied ? "ri-check-line" : "ri-file-copy-line"}></i>
            </div>
            {copied ? "تم النسخ!" : "نسخ الرقم"}
          </button>
          <button
            onClick={handleShare}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              shared
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={shared ? "ri-check-line" : "ri-share-forward-line"}></i>
            </div>
            {shared ? "تمت المشاركة!" : "مشاركة"}
          </button>
        </div>

        {/* Status note */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-phone-line text-amber-600 text-sm"></i>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            سيتواصل معك فريقنا على{" "}
            <strong className="font-black">{phone}</strong>{" "}
            لتأكيد الموعد خلال ساعات قليلة. احتفظ برقم الحجز للمراجعة.
          </p>
        </div>
      </div>
    </div>
  );
}
