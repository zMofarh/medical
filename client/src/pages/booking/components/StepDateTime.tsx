import { useState } from "react";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";

const DAY_NAMES    = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const MONTH_NAMES  = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

const MORNING_SLOTS = ["08:00 ص","08:30 ص","09:00 ص","09:30 ص","10:00 ص","10:30 ص","11:00 ص","11:30 ص"];
const AFTERNOON_SLOTS = ["12:00 م","12:30 م","01:00 م","01:30 م","02:00 م","02:30 م"];
const EVENING_SLOTS = ["04:00 م","04:30 م","05:00 م","05:30 م","06:00 م","06:30 م","07:00 م","07:30 م"];

// Simulate some unavailable slots
const UNAVAILABLE = new Set(["09:00 ص","10:30 ص","05:00 م","01:00 م"]);

interface StepDateTimeProps {
  doctorId: string;
  selectedDate: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDateTime({
  doctorId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onNext,
  onBack,
}: StepDateTimeProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const { doctors: doctorsDetailed } = usePublicDoctors();

  const doctor = doctorsDetailed.find((d) => d.id === doctorId || d.doctor_id === doctorId);

  // Generate 14 days starting from tomorrow, skip Fridays
  const allDates = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter((d) => d.getDay() !== 5);

  // Show 7 days per week
  const weekDates = allDates.slice(weekOffset * 7, weekOffset * 7 + 7);
  const maxWeek = Math.floor((allDates.length - 1) / 7);

  const handleDateSelect = (dateStr: string) => {
    onSelectDate(dateStr);
    onSelectTime("");
  };

  const SlotGroup = ({ label, icon, slots }: { label: string; icon: string; slots: string[] }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <i className={`${icon} text-brand-forest-500 text-sm`}></i>
        </div>
        <span className="text-xs font-semibold text-gray-500">{label}</span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {slots.map((slot) => {
          const isUnavailable = UNAVAILABLE.has(slot);
          const isSelected = selectedTime === slot;
          return (
            <button
              key={slot}
              onClick={() => !isUnavailable && onSelectTime(slot)}
              disabled={isUnavailable}
              className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isUnavailable
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                  : isSelected
                  ? "bg-brand-forest-600 text-white cursor-pointer scale-105"
                  : "bg-brand-cream-50 text-gray-700 hover:bg-brand-cream-100 hover:text-brand-forest-700 cursor-pointer border border-brand-cream-200"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {/* Doctor context */}
      {doctor && (
        <div className="flex items-center gap-3 bg-brand-cream-50 border border-brand-cream-200 rounded-xl px-4 py-2.5 mb-5">
          <img src={doctor.image} alt={doctor.name} className="w-9 h-9 rounded-lg object-cover object-top flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{doctor.name}</p>
            <p className="text-[10px] text-brand-forest-600">{doctor.specialty}</p>
          </div>
          <button onClick={onBack} className="text-xs text-brand-forest-500 font-semibold hover:underline cursor-pointer whitespace-nowrap">
            تغيير
          </button>
        </div>
      )}

      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900 mb-1">اختر التاريخ والوقت</h2>
        <p className="text-gray-400 text-sm">المواعيد المتاحة للأسبوعين القادمين</p>
      </div>

      {/* Date picker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">التاريخ</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
              disabled={weekOffset === 0}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                weekOffset === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-brand-cream-100"
              }`}
            >
              <i className="ri-arrow-right-s-line text-lg"></i>
            </button>
            <span className="text-xs text-gray-400 px-1">
              {weekOffset === 0 ? "هذا الأسبوع" : weekOffset === 1 ? "الأسبوع القادم" : `الأسبوع ${weekOffset + 1}`}
            </span>
            <button
              onClick={() => setWeekOffset((w) => Math.min(maxWeek, w + 1))}
              disabled={weekOffset >= maxWeek}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                weekOffset >= maxWeek ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-brand-cream-100"
              }`}
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((d) => {
            const dateStr = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
            const dayStr  = DAY_NAMES[d.getDay()].slice(0, 3);
            const isSelected = selectedDate === dateStr;
            const isToday = false;

            return (
              <button
                key={dateStr}
                onClick={() => handleDateSelect(dateStr)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-brand-forest-500 bg-brand-forest-600 text-white"
                    : "border-gray-100 bg-white hover:border-brand-cream-300 hover:bg-brand-cream-50"
                }`}
              >
                <span className={`text-[10px] font-medium ${isSelected ? "text-brand-cream-200" : "text-gray-400"}`}>{dayStr}</span>
                <span className={`text-base font-black mt-0.5 ${isSelected ? "text-white" : "text-gray-800"}`}>{d.getDate()}</span>
                <span className={`text-[9px] ${isSelected ? "text-brand-cream-200" : "text-gray-400"}`}>{MONTH_NAMES[d.getMonth()].slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate ? (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">الوقت المتاح</p>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-brand-forest-600 rounded-sm"></span>
                محدد
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-gray-100 rounded-sm border border-gray-200"></span>
                محجوز
              </span>
            </div>
          </div>
          <SlotGroup label="الصباح" icon="ri-sun-line" slots={MORNING_SLOTS} />
          <SlotGroup label="الظهيرة" icon="ri-sun-foggy-line" slots={AFTERNOON_SLOTS} />
          <SlotGroup label="المساء" icon="ri-moon-line" slots={EVENING_SLOTS} />
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-brand-cream-50 border border-brand-cream-200 rounded-xl p-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-200 rounded-lg flex-shrink-0">
            <i className="ri-calendar-line text-brand-forest-600 text-sm"></i>
          </div>
          <p className="text-sm text-gray-500">اختر تاريخاً لعرض المواعيد المتاحة</p>
        </div>
      )}

      {/* Selected summary */}
      {selectedDate && selectedTime && (
        <div className="flex items-center gap-3 bg-brand-forest-50 border border-brand-forest-200 rounded-xl p-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-forest-100 rounded-lg flex-shrink-0">
            <i className="ri-calendar-check-line text-brand-forest-600 text-sm"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-brand-forest-800">{selectedDate} — {selectedTime}</p>
            <p className="text-[10px] text-brand-forest-600">تم اختيار الموعد</p>
          </div>
          <i className="ri-check-double-line text-brand-forest-600 text-base mr-auto"></i>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-3.5 rounded-full hover:border-gray-300 transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-arrow-right-line"></i>
          السابق
        </button>
        <button
          onClick={() => selectedDate && selectedTime && onNext()}
          disabled={!selectedDate || !selectedTime}
          className={`inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
            selectedDate && selectedTime
              ? "bg-brand-forest-600 hover:bg-brand-forest-700 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          التالي — بياناتك
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
    </div>
  );
}
