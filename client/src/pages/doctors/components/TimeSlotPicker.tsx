interface TimeSlotPickerProps {
  unavailableSlots: Set<string>;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

interface SlotGroup {
  label: string;
  icon: string;
  color: string;
  slots: { time: string; display: string }[];
}

const SLOT_GROUPS: SlotGroup[] = [
  {
    label: "الصباح",
    icon: "ri-sun-line",
    color: "text-amber-500",
    slots: [
      { time: "08:00", display: "8:00 ص" },
      { time: "08:30", display: "8:30 ص" },
      { time: "09:00", display: "9:00 ص" },
      { time: "09:30", display: "9:30 ص" },
      { time: "10:00", display: "10:00 ص" },
      { time: "10:30", display: "10:30 ص" },
      { time: "11:00", display: "11:00 ص" },
      { time: "11:30", display: "11:30 ص" },
    ],
  },
  {
    label: "الظهيرة",
    icon: "ri-sun-foggy-line",
    color: "text-orange-500",
    slots: [
      { time: "12:00", display: "12:00 م" },
      { time: "12:30", display: "12:30 م" },
      { time: "13:00", display: "1:00 م" },
      { time: "13:30", display: "1:30 م" },
      { time: "14:00", display: "2:00 م" },
      { time: "14:30", display: "2:30 م" },
    ],
  },
  {
    label: "المساء",
    icon: "ri-moon-line",
    color: "text-indigo-400",
    slots: [
      { time: "16:00", display: "4:00 م" },
      { time: "16:30", display: "4:30 م" },
      { time: "17:00", display: "5:00 م" },
      { time: "17:30", display: "5:30 م" },
      { time: "18:00", display: "6:00 م" },
      { time: "18:30", display: "6:30 م" },
      { time: "19:00", display: "7:00 م" },
      { time: "19:30", display: "7:30 م" },
    ],
  },
];

export default function TimeSlotPicker({ unavailableSlots, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-800 text-sm">المواعيد المتاحة</h4>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 bg-brand-forest-600 rounded-sm"></span>
            محدد
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 bg-gray-100 rounded-sm border border-gray-200"></span>
            محجوز
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 bg-brand-cream-100 rounded-sm border border-brand-cream-200"></span>
            متاح
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {SLOT_GROUPS.map((group) => {
          const availableCount = group.slots.filter((s) => !unavailableSlots.has(s.time)).length;
          return (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${group.icon} ${group.color} text-sm`}></i>
                </div>
                <span className="text-xs font-semibold text-gray-600">{group.label}</span>
                <span className="text-[10px] text-gray-400 mr-auto">{availableCount} موعد متاح</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {group.slots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot.time);
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => !isUnavailable && onSelectTime(slot.time)}
                      disabled={isUnavailable}
                      className={`
                        py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap
                        ${isUnavailable
                          ? "bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-brand-forest-600 text-white cursor-pointer scale-105 shadow-sm"
                          : "bg-brand-cream-50 text-gray-700 hover:bg-brand-cream-100 hover:text-brand-forest-700 cursor-pointer border border-brand-cream-200"
                        }
                      `}
                    >
                      {slot.display}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
