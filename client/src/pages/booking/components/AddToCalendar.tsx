import { useState, useRef, useEffect } from "react";

interface AddToCalendarProps {
  title: string;
  date: string;        // e.g. "15 أبريل 2026"
  time: string;        // e.g. "10:00"
  location: string;
  description: string;
}

// Arabic month name → month index
const MONTH_MAP: Record<string, number> = {
  يناير: 0, فبراير: 1, مارس: 2, أبريل: 3, مايو: 4, يونيو: 5,
  يوليو: 6, أغسطس: 7, سبتمبر: 8, أكتوبر: 9, نوفمبر: 10, ديسمبر: 11,
};

function parseArabicDate(dateStr: string, timeStr: string): { start: Date; end: Date } | null {
  try {
    const parts = dateStr.trim().split(" ");
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = MONTH_MAP[parts[1]];
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || month === undefined || isNaN(year)) return null;

    const [h, m] = timeStr.split(":").map(Number);
    const start = new Date(year, month, day, h, m, 0);
    const end = new Date(year, month, day, h + 1, m, 0);
    return { start, end };
  } catch {
    return null;
  }
}

function toICSDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function buildGoogleUrl(title: string, start: Date, end: Date, location: string, description: string): string {
  const fmt = (d: Date) => toICSDate(d);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
    details: description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl(title: string, start: Date, end: Date, location: string, description: string): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    location,
    body: description,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function buildICSContent(title: string, start: Date, end: Date, location: string, description: string): string {
  const now = toICSDate(new Date());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Medical Avenue//Booking//AR",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@themedicalavenue.com`,
    `DTSTAMP:${now}Z`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:تذكير بموعدك الطبي",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface CalendarOption {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  bg: string;
  hoverBg: string;
}

const CALENDAR_OPTIONS: CalendarOption[] = [
  { id: "google",  label: "Google Calendar",  icon: "ri-google-line",   iconColor: "text-red-500",    bg: "bg-red-50",    hoverBg: "hover:bg-red-100" },
  { id: "outlook", label: "Outlook Calendar", icon: "ri-microsoft-line", iconColor: "text-sky-600",   bg: "bg-sky-50",    hoverBg: "hover:bg-sky-100" },
  { id: "apple",   label: "Apple Calendar",   icon: "ri-apple-line",    iconColor: "text-gray-700",   bg: "bg-gray-100",  hoverBg: "hover:bg-gray-200" },
  { id: "ics",     label: "تحميل ملف .ics",   icon: "ri-download-line", iconColor: "text-brand-forest-600", bg: "bg-brand-cream-100", hoverBg: "hover:bg-brand-cream-200" },
];

export default function AddToCalendar({ title, date, time, location, description }: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const parsed = parseArabicDate(date, time);

  const handleOption = (id: string) => {
    if (!parsed) return;
    const { start, end } = parsed;

    if (id === "google") {
      window.open(buildGoogleUrl(title, start, end, location, description), "_blank");
    } else if (id === "outlook") {
      window.open(buildOutlookUrl(title, start, end, location, description), "_blank");
    } else if (id === "apple" || id === "ics") {
      const ics = buildICSContent(title, start, end, location, description);
      downloadICS(ics, "medical-appointment.ics");
    }

    setAdded(id);
    setOpen(false);
    setTimeout(() => setAdded(null), 3000);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 font-bold px-5 py-3 rounded-xl border-2 transition-all duration-200 whitespace-nowrap cursor-pointer text-sm ${
          added
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-brand-forest-300 bg-brand-forest-50 text-brand-forest-700 hover:bg-brand-forest-100"
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className={added ? "ri-check-double-line" : "ri-calendar-2-line"}></i>
        </div>
        {added ? "تمت الإضافة!" : "أضف للتقويم"}
        {!added && (
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={open ? "ri-arrow-up-s-line text-xs" : "ri-arrow-down-s-line text-xs"}></i>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl border border-gray-100 overflow-hidden z-30 min-w-[220px]" style={{ boxShadow: "0 8px 32px rgba(46,78,69,0.14)" }}>
          <div className="p-2 space-y-1">
            {CALENDAR_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleOption(opt.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${opt.bg} ${opt.hoverBg}`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg flex-shrink-0">
                  <i className={`${opt.icon} ${opt.iconColor} text-base`}></i>
                </div>
                <span className="text-sm font-semibold text-gray-700">{opt.label}</span>
                <div className="w-4 h-4 flex items-center justify-center mr-auto">
                  <i className="ri-external-link-line text-gray-400 text-xs"></i>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 text-center">
              سيُضاف تذكير قبل الموعد بساعة تلقائياً
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
