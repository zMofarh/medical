import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import BookingProgress from "@/pages/booking/components/BookingProgress";
import StepService from "@/pages/booking/components/StepService";
import StepDoctor from "@/pages/booking/components/StepDoctor";
import StepDateTime from "@/pages/booking/components/StepDateTime";
import StepPatientInfo from "@/pages/booking/components/StepPatientInfo";
import { LotusShape, StarShape } from "@/components/base/BrandShapes";

type Step = 1 | 2 | 3 | 4;

interface SlideProps {
  children: React.ReactNode;
  direction: "left" | "right" | "none";
  active: boolean;
}

function StepSlide({ children, direction, active }: SlideProps) {
  const [mounted, setMounted] = useState(active);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!mounted) return null;

  const translateIn  = direction === "left"  ? "translate-x-8"  : direction === "right" ? "-translate-x-8" : "translate-x-0";
  const translateOut = direction === "left"  ? "-translate-x-8" : direction === "right" ? "translate-x-8"  : "translate-x-0";

  return (
    <div
      className={`transition-all duration-400 ease-out ${
        visible ? "opacity-100 translate-x-0" : `opacity-0 ${translateIn}`
      }`}
      style={{ transitionDuration: "380ms" }}
    >
      {children}
    </div>
  );
}

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") ?? "";
  const preselectedPackage = searchParams.get("package") ?? "";
  const containerRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [prevStep, setPrevStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState(preselectedService);
  const [doctorId, setDoctorId] = useState("");
  const [visitType, setVisitType] = useState("first");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const goTo = (next: Step) => {
    setPrevStep(step);
    setStep(next);
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const direction: "left" | "right" = step > prevStep ? "left" : "right";

  const infoCards = [
    { icon: "ri-phone-line",       title: "تأكيد فوري",    desc: "سيتصل بك فريقنا لتأكيد الموعد" },
    { icon: "ri-shield-check-line",title: "بيانات آمنة",   desc: "معلوماتك محمية ومشفرة بالكامل" },
    { icon: "ri-refresh-line",     title: "إلغاء مجاني",   desc: "يمكنك الإلغاء قبل 24 ساعة مجاناً" },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-50" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-brand-forest-800 to-brand-forest-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20medical%20pattern%20healthcare%20symbols%20minimal%20white%20lines%20on%20dark%20forest%20green%20background%20geometric%20pattern%20precision%20medicine&width=1440&height=300&seq=book-hero-v3&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-8 right-12 opacity-10 pointer-events-none hidden lg:block">
          <StarShape size={90} color="white" />
        </div>
        <div className="absolute bottom-6 left-10 opacity-8 pointer-events-none hidden lg:block" style={{ opacity: 0.08 }}>
          <LotusShape size={80} color="white" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/30 backdrop-blur-sm">
            <i className="ri-calendar-check-line text-brand-cream-300"></i>
            الحجز الإلكتروني
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">احجز موعدك في 4 خطوات</h1>
          <p className="text-brand-cream-200/80 text-base">اختر الخدمة، الطبيب، الموعد، وأدخل بياناتك — بسهولة وسرعة</p>

          {/* Mini step preview */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {["الخدمة","الطبيب","الموعد","بياناتك"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  step > i + 1
                    ? "bg-brand-cream-300/30 text-brand-cream-200"
                    : step === i + 1
                    ? "bg-white/25 text-white border border-white/40"
                    : "bg-white/10 text-white/50"
                }`}>
                  {step > i + 1 ? <i className="ri-check-line text-xs"></i> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && <i className="ri-arrow-left-s-line text-white/30 text-sm"></i>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 md:px-8" ref={containerRef}>

          {/* Progress */}
          <BookingProgress
            current={step}
            onStepClick={(s) => goTo(s as Step)}
          />

          {/* Step card */}
          <div className="bg-white rounded-3xl border border-brand-cream-200 overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 relative overflow-hidden">

              {/* Step 1 */}
              <StepSlide direction={step === 1 ? "none" : direction} active={step === 1}>
                <StepService
                  selected={serviceId}
                  onSelect={setServiceId}
                  onNext={() => goTo(2)}
                  packageId={preselectedPackage || undefined}
                />
              </StepSlide>

              {/* Step 2 */}
              <StepSlide direction={direction} active={step === 2}>
                <StepDoctor
                  serviceId={serviceId}
                  selectedDoctor={doctorId}
                  visitType={visitType}
                  onSelectDoctor={setDoctorId}
                  onSelectVisitType={setVisitType}
                  onNext={() => goTo(3)}
                  onBack={() => goTo(1)}
                />
              </StepSlide>

              {/* Step 3 */}
              <StepSlide direction={direction} active={step === 3}>
                <StepDateTime
                  doctorId={doctorId}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={setSelectedDate}
                  onSelectTime={setSelectedTime}
                  onNext={() => goTo(4)}
                  onBack={() => goTo(2)}
                />
              </StepSlide>

              {/* Step 4 */}
              <StepSlide direction={direction} active={step === 4}>
                <StepPatientInfo
                  serviceId={serviceId}
                  doctorId={doctorId}
                  visitType={visitType}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  packageId={preselectedPackage || undefined}
                  onBack={() => goTo(3)}
                  onSuccess={({ bookingRef, fullName, phone, email }) => {
                    navigate("/booking/confirmation", {
                      state: {
                        bookingRef,
                        doctorId,
                        packageId: preselectedPackage || undefined,
                        date: selectedDate,
                        time: selectedTime,
                        visitType,
                        fullName,
                        phone,
                        email,
                      },
                    });
                  }}
                />
              </StepSlide>
            </div>

            {/* Bottom progress bar */}
            <div className="h-1 bg-brand-cream-100">
              <div
                className="h-full bg-gradient-to-l from-brand-forest-400 to-brand-forest-700 transition-all duration-700 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {infoCards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-brand-cream-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-100 rounded-xl flex-shrink-0">
                  <i className={`${card.icon} text-brand-forest-600 text-lg`}></i>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{card.title}</p>
                  <p className="text-xs text-gray-400">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
