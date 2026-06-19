import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const STORAGE_KEY = "offers_banner_dismissed_v1";

// ── Top Strip Banner ──────────────────────────────────────────────────────────

export function OffersTopStrip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY + "_strip");
    if (!dismissed) setVisible(true);
  }, []);

  const endDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  }, []);
  const { hours, minutes, seconds } = useCountdown(endDate);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY + "_strip", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-[60] bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <i className="ri-flashlight-line text-yellow-200 text-sm"></i>
            <span className="text-xs font-black whitespace-nowrap">فلاش سيل</span>
          </div>
          <span className="text-xs text-white/90 truncate hidden sm:block">
            خصومات تصل إلى <strong>40%</strong> على الباقات الطبية — عرض محدود!
          </span>
          <span className="text-xs text-white/90 truncate sm:hidden">خصم 40% على الباقات</span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Countdown */}
          <div className="hidden sm:flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <i className="ri-time-line text-xs text-yellow-200"></i>
            <span className="text-xs font-black tabular-nums">
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <Link
            to="/offers"
            className="text-xs font-black bg-white text-orange-600 px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            اكتشف العروض
          </Link>

          <button
            onClick={dismiss}
            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors cursor-pointer flex-shrink-0"
            aria-label="إغلاق"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Popup Modal Banner ────────────────────────────────────────────────────────

export function OffersPopupBanner() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY + "_popup");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setVisible(true);
        setTimeout(() => setAnimateIn(true), 20);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const endDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  }, []);
  const { hours, minutes, seconds } = useCountdown(endDate);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY + "_popup", "1");
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300 ${animateIn ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"}`}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl overflow-hidden transition-all duration-300 ${animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <i className="ri-close-line text-gray-600 text-base"></i>
        </button>

        {/* Hero Image Area */}
        <div className="relative h-48 overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=vibrant%20festive%20sale%20promotion%20banner%20with%20golden%20confetti%20stars%20and%20sparkles%20on%20warm%20gradient%20background%20orange%20amber%20red%20colors%20celebration%20discount%20medical%20health%20packages%20special%20offer%20elegant%20modern%20design&width=600&height=300&seq=offer-popup-hero&orientation=landscape"
            alt="عروض حصرية"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
            <i className="ri-flashlight-line text-yellow-200"></i>
            عرض محدود
          </div>

          {/* Discount Circle */}
          <div className="absolute bottom-4 left-4 w-16 h-16 flex flex-col items-center justify-center bg-white rounded-full">
            <span className="text-xl font-black text-rose-600 leading-none">40%</span>
            <span className="text-[9px] font-bold text-gray-500 leading-none mt-0.5">خصم</span>
          </div>

          <div className="absolute bottom-4 right-4 text-white">
            <h2 className="text-xl font-black leading-tight">عروض موسمية</h2>
            <p className="text-white/80 text-xs">على أفضل الباقات الطبية</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Offers list */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { icon: "ri-moon-line", label: "عروض رمضان", discount: "30%", color: "bg-amber-50 text-amber-700 border-amber-200" },
              { icon: "ri-sun-line", label: "عروض الصيف", discount: "25%", color: "bg-teal-50 text-teal-700 border-teal-200" },
              { icon: "ri-flag-line", label: "اليوم الوطني", discount: "23%", color: "bg-green-50 text-green-700 border-green-200" },
              { icon: "ri-snowy-line", label: "عروض الشتاء", discount: "20%", color: "bg-sky-50 text-sky-700 border-sky-200" },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${item.color}`}>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-sm`}></i>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold truncate">{item.label}</div>
                  <div className="text-xs font-black">خصم {item.discount}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center bg-rose-100 rounded-full">
                <i className="ri-alarm-line text-rose-600 text-sm"></i>
              </div>
              <span className="text-xs font-semibold text-gray-600">ينتهي العرض خلال</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { val: hours, label: "س" },
                { val: minutes, label: "د" },
                { val: seconds, label: "ث" },
              ].map((unit, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white text-sm font-black rounded-lg tabular-nums">
                      {String(unit.val).padStart(2, "0")}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5">{unit.label}</span>
                  </div>
                  {i < 2 && <span className="text-gray-400 font-black text-sm mb-3">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2">
            <Link
              to="/offers"
              onClick={dismiss}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all text-sm whitespace-nowrap cursor-pointer"
            >
              <i className="ri-gift-line"></i>
              اكتشف جميع العروض
            </Link>
            <button
              onClick={dismiss}
              className="px-4 py-3 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              لاحقاً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
