import type { WorkingHours } from "@/hooks/useCMSSettings";

interface Props {
  data: WorkingHours;
  onChange: (d: WorkingHours) => void;
}

const timeOptions = [
  "06:00","06:30","07:00","07:30","08:00","08:30",
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30","20:00","20:30",
  "21:00","21:30","22:00","22:30","23:00","23:30",
];

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "م" : "ص";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function calculateDuration(from: string, to: string): string {
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  const totalMins = (th * 60 + tm) - (fh * 60 + fm);
  if (totalMins <= 0) return "—";
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `${h} س ${m} د` : `${h} ساعة`;
}

export default function WorkingHoursSection({ data, onChange }: Props) {
  const [globalFrom, setGlobalFrom] = useState("09:00");
  const [globalTo,   setGlobalTo]   = useState("21:00");

  const toggleDay = (index: number) => {
    const updated = data.map((d, i) => (i === index ? { ...d, isOpen: !d.isOpen } : d));
    onChange(updated);
  };

  const updateTime = (index: number, field: "from" | "to", value: string) => {
    const updated = data.map((d, i) => (i === index ? { ...d, [field]: value } : d));
    onChange(updated);
  };

  const applyGlobalHours = () => {
    const updated = data.map((d) => (d.isOpen ? { ...d, from: globalFrom, to: globalTo } : d));
    onChange(updated);
  };

  const openDays = data.filter((d) => d.isOpen).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <i className="ri-time-line text-emerald-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">ساعات العمل</h3>
          <p className="text-xs text-gray-500">حدد أوقات عمل العيادة لكل يوم</p>
        </div>
        <div className="mr-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <i className="ri-calendar-check-line" />
          {openDays} أيام مفتوحة
        </div>
      </div>

      {/* Quick apply */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">تطبيق سريع على جميع الأيام المفتوحة</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">من</label>
            <select
              value={globalFrom}
              onChange={(e) => setGlobalFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
            >
              {timeOptions.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">إلى</label>
            <select
              value={globalTo}
              onChange={(e) => setGlobalTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
            >
              {timeOptions.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
          </div>
          <button
            onClick={applyGlobalHours}
            className="px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
          >
            تطبيق على الكل
          </button>
        </div>
      </div>

      {/* Days list */}
      <div className="space-y-3">
        {data.map((day, index) => (
          <div
            key={day.dayEn}
            className={`rounded-xl border transition-all ${
              day.isOpen ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/50"
            }`}
          >
            <div className="flex items-center gap-4 p-4 flex-wrap">
              {/* Toggle */}
              <button
                onClick={() => toggleDay(index)}
                className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                  day.isOpen ? "bg-[#2E4E45]" : "bg-gray-200"
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                  day.isOpen ? "right-0.5" : "left-0.5"
                }`} />
              </button>

              {/* Day name */}
              <div className="w-24 flex-shrink-0">
                <p className={`text-sm font-semibold ${day.isOpen ? "text-gray-800" : "text-gray-400"}`}>{day.day}</p>
                <p className="text-xs text-gray-400">{day.dayEn}</p>
              </div>

              {/* Status badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                day.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"
              }`}>
                {day.isOpen ? "مفتوح" : "مغلق"}
              </span>

              {/* Time pickers */}
              {day.isOpen ? (
                <div className="flex items-center gap-3 mr-auto flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 whitespace-nowrap">من</label>
                    <select
                      value={day.from}
                      onChange={(e) => updateTime(index, "from", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                    >
                      {timeOptions.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                    </select>
                  </div>
                  <i className="ri-arrow-left-line text-gray-300 text-sm" />
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 whitespace-nowrap">إلى</label>
                    <select
                      value={day.to}
                      onChange={(e) => updateTime(index, "to", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                    >
                      {timeOptions.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                    </select>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    ({calculateDuration(day.from, day.to)})
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mr-auto">يوم إجازة</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl bg-[#2E4E45]/5 border border-[#2E4E45]/10">
        <p className="text-xs font-semibold text-[#2E4E45] mb-3 flex items-center gap-1.5">
          <i className="ri-eye-line" />
          معاينة ساعات العمل (كما تظهر للزوار)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.map((day) => (
            <div key={day.dayEn} className="flex items-center justify-between text-xs gap-2">
              <span className="text-gray-600 font-medium whitespace-nowrap">{day.day}</span>
              <span className={day.isOpen ? "text-emerald-600" : "text-red-400"}>
                {day.isOpen ? `${formatTime(day.from)} - ${formatTime(day.to)}` : "مغلق"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
