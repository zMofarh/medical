import { useState, useMemo } from "react";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingConfirmModal from "./BookingConfirmModal";

const MONTH_NAMES_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];
const DAY_NAMES_AR = ["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"];
const DAY_NAMES_SHORT = ["أح","اث","ثل","أر","خم","جم","سب"];

// Simulate unavailable slots per date (deterministic based on date)
function getUnavailableSlots(dateKey: string): Set<string> {
  const hash = dateKey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const allSlots = [
    "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30",
  ];
  const unavailable = new Set<string>();
  allSlots.forEach((slot, i) => {
    if ((hash + i * 7) % 5 === 0) unavailable.add(slot);
  });
  return unavailable;
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDateDisplay(d: Date): string {
  return `${d.getDate()} ${MONTH_NAMES_AR[d.getMonth()]} ${d.getFullYear()}`;
}

interface DoctorCalendarProps {
  doctorId: string;
  doctorName: string;
  availableDays: string[];
  consultationFee: string;
}

const DAY_MAP: Record<string, number> = {
  "الأحد": 0, "الاثنين": 1, "الثلاثاء": 2,
  "الأربعاء": 3, "الخميس": 4, "الجمعة": 5, "السبت": 6,
};

export default function DoctorCalendar({ doctorId, doctorName, availableDays, consultationFee }: DoctorCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const availableDayNums = useMemo(
    () => new Set(availableDays.map((d) => DAY_MAP[d]).filter((n) => n !== undefined)),
    [availableDays]
  );

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];

    // Fill leading nulls (week starts Sunday)
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

    return days;
  }, [currentMonth]);

  const isAvailable = (d: Date) => {
    if (d < today) return false;
    return availableDayNums.has(d.getDay());
  };

  const isSelected = (d: Date) =>
    selectedDate !== null &&
    d.getDate() === selectedDate.getDate() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getFullYear() === selectedDate.getFullYear();

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const handleDateClick = (d: Date) => {
    if (!isAvailable(d)) return;
    setSelectedDate(d);
    setSelectedTime(null);
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    if (next < maxMonth) setCurrentMonth(next);
  };

  const unavailableSlots = selectedDate ? getUnavailableSlots(formatDateKey(selectedDate)) : new Set<string>();

  const canBook = selectedDate !== null && selectedTime !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handlePrevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-cream-100 transition-colors cursor-pointer text-gray-600"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
          <h3 className="font-black text-gray-900 text-base">
            {MONTH_NAMES_AR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={handleNextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-brand-cream-100 transition-colors cursor-pointer text-gray-600"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES_SHORT.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} />;
            const avail = isAvailable(d);
            const sel = isSelected(d);
            const tod = isToday(d);

            return (
              <button
                key={d.toISOString()}
                onClick={() => handleDateClick(d)}
                disabled={!avail}
                className={`
                  relative flex flex-col items-center justify-center rounded-xl py-2 text-sm font-semibold transition-all duration-200
                  ${sel
                    ? "bg-brand-forest-600 text-white scale-105 shadow-sm cursor-pointer"
                    : avail
                    ? "hover:bg-brand-cream-100 text-gray-800 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                  }
                  ${tod && !sel ? "ring-2 ring-brand-forest-300 ring-offset-1" : ""}
                `}
              >
                <span>{d.getDate()}</span>
                {avail && !sel && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-forest-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-forest-600 inline-block"></span>
            <span className="text-xs text-gray-500">محدد</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-forest-400 inline-block"></span>
            <span className="text-xs text-gray-500">متاح</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-200 inline-block"></span>
            <span className="text-xs text-gray-500">غير متاح</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-brand-forest-300 inline-block"></span>
            <span className="text-xs text-gray-500">اليوم</span>
          </div>
        </div>

        {/* Available Days Info */}
        <div className="mt-4 bg-brand-cream-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">أيام الدوام:</p>
          <div className="flex flex-wrap gap-1.5">
            {["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map((day) => (
              <span
                key={day}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                  availableDays.includes(day)
                    ? "bg-brand-forest-100 text-brand-forest-700"
                    : "bg-gray-100 text-gray-300"
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slot Panel */}
      <div className="flex flex-col gap-4">
        {selectedDate ? (
          <>
            {/* Selected Date Header */}
            <div className="bg-brand-forest-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl flex-shrink-0">
                  <i className="ri-calendar-check-line text-white text-lg"></i>
                </div>
                <div>
                  <p className="text-xs text-brand-cream-200 mb-0.5">التاريخ المختار</p>
                  <p className="font-black text-base">
                    {DAY_NAMES_AR[selectedDate.getDay()]}، {formatDateDisplay(selectedDate)}
                  </p>
                </div>
              </div>
            </div>

            <TimeSlotPicker
              unavailableSlots={unavailableSlots}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />

            {/* Booking Summary */}
            {canBook && (
              <div className="bg-brand-cream-50 border border-brand-cream-200 rounded-2xl p-4 animate-fade-in">
                <p className="text-xs font-semibold text-gray-500 mb-3">ملخص الحجز</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <i className="ri-user-heart-line text-brand-forest-500"></i>
                      الطبيب
                    </span>
                    <span className="text-sm font-bold text-gray-800">{doctorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <i className="ri-calendar-line text-brand-forest-500"></i>
                      التاريخ
                    </span>
                    <span className="text-sm font-bold text-gray-800">{formatDateDisplay(selectedDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <i className="ri-time-line text-brand-forest-500"></i>
                      الوقت
                    </span>
                    <span className="text-sm font-bold text-gray-800">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-brand-cream-200">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <i className="ri-money-dollar-circle-line text-brand-forest-500"></i>
                      رسوم الاستشارة
                    </span>
                    <span className="text-sm font-black text-brand-forest-700">{consultationFee} ريال</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-calendar-check-line"></i>
                  تأكيد الحجز
                </button>
              </div>
            )}

            {!canBook && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-lg flex-shrink-0">
                  <i className="ri-time-line text-amber-600 text-sm"></i>
                </div>
                <p className="text-sm text-amber-700">اختر وقتاً مناسباً لإتمام الحجز</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-10 text-center min-h-[300px]">
            <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-100 rounded-2xl mb-4">
              <i className="ri-calendar-line text-brand-forest-500 text-2xl"></i>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">اختر تاريخاً</h4>
            <p className="text-sm text-gray-400 max-w-xs">
              اختر يوماً متاحاً من التقويم لعرض المواعيد المتاحة مع الطبيب
            </p>
          </div>
        )}
      </div>

      {/* Booking Confirm Modal */}
      {showModal && selectedDate && selectedTime && (
        <BookingConfirmModal
          doctorId={doctorId}
          doctorName={doctorName}
          date={formatDateDisplay(selectedDate)}
          time={selectedTime}
          fee={consultationFee}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
