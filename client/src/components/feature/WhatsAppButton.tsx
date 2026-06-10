import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "966112345678";
const WHATSAPP_MESSAGE = "مرحباً، أود الاستفسار عن خدمات عيادة الشفاء التخصصية";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    const pulseTimer = setTimeout(() => setPulse(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
    >
      {/* Tooltip bubble */}
      {showTooltip && (
        <div
          dir="rtl"
          className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-700 font-medium whitespace-nowrap border border-gray-100 animate-fade-in"
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            animation: "fadeSlideUp 0.25s ease",
          }}
        >
          <p className="font-bold text-gray-900 text-xs mb-0.5">تواصل معنا عبر واتساب</p>
          <p className="text-gray-400 text-xs">رد سريع خلال دقائق</p>
          <div
            className="absolute -bottom-2 right-5 w-4 h-4 bg-white border-b border-l border-gray-100 rotate-45"
            style={{ left: "20px", right: "auto" }}
          ></div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="تواصل عبر واتساب"
        className="relative w-14 h-14 flex items-center justify-center rounded-full cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.45)" }}
      >
        {/* Pulse rings */}
        {pulse && (
          <>
            <span
              className="absolute inset-0 rounded-full opacity-40"
              style={{
                background: "#25D366",
                animation: "whatsapp-ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
              }}
            ></span>
            <span
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: "#25D366",
                animation: "whatsapp-ping 1.8s cubic-bezier(0,0,0.2,1) 0.6s infinite",
              }}
            ></span>
          </>
        )}
        <i className="ri-whatsapp-line text-white text-2xl relative z-10"></i>
      </button>

      <style>{`
        @keyframes whatsapp-ping {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
