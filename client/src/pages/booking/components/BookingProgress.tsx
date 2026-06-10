interface Step {
  num: number;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { num: 1, label: "الخدمة",  icon: "ri-stethoscope-line" },
  { num: 2, label: "الطبيب",  icon: "ri-user-heart-line" },
  { num: 3, label: "الموعد",  icon: "ri-calendar-line" },
  { num: 4, label: "بياناتك", icon: "ri-file-user-line" },
];

interface BookingProgressProps {
  current: number;
  onStepClick?: (step: number) => void;
}

export default function BookingProgress({ current, onStepClick }: BookingProgressProps) {
  const progressPct = ((current - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mb-10">
      {/* Progress bar track */}
      <div className="relative mb-6">
        {/* Background track */}
        <div className="absolute top-5 right-0 left-0 h-0.5 bg-brand-cream-200 z-0"></div>
        {/* Animated fill */}
        <div
          className="absolute top-5 right-0 h-0.5 bg-gradient-to-l from-brand-forest-400 to-brand-forest-700 z-0 transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        ></div>

        {/* Steps */}
        <div className="relative z-10 flex items-start justify-between">
          {STEPS.map((step) => {
            const isDone    = current > step.num;
            const isActive  = current === step.num;
            const canClick  = onStepClick && step.num < current;

            return (
              <div
                key={step.num}
                className="flex flex-col items-center gap-2"
                style={{ width: `${100 / STEPS.length}%` }}
              >
                <button
                  onClick={() => canClick && onStepClick(step.num)}
                  disabled={!canClick}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 font-bold text-sm
                    ${isDone
                      ? "bg-brand-forest-600 border-brand-forest-600 text-white cursor-pointer hover:bg-brand-forest-700 scale-100"
                      : isActive
                      ? "bg-white border-brand-forest-600 text-brand-forest-700 ring-4 ring-brand-forest-100 scale-110"
                      : "bg-white border-brand-cream-300 text-gray-400 cursor-default"
                    }`}
                >
                  {isDone ? (
                    <i className="ri-check-line text-base"></i>
                  ) : (
                    <i className={`${step.icon} text-base`}></i>
                  )}
                </button>
                <span
                  className={`text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                    isActive ? "text-brand-forest-700" : isDone ? "text-brand-forest-500" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step label */}
      <div className="text-center">
        <span className="text-xs text-gray-400 font-medium">
          الخطوة {current} من {STEPS.length}
        </span>
        <div className="w-24 h-0.5 bg-brand-cream-200 mx-auto mt-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-forest-500 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${(current / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
