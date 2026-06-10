interface ScheduleItem {
  time: string;
  patient: string;
  service: string;
  doctor: string;
  status: string;
}

interface TodayScheduleProps {
  schedule: ScheduleItem[];
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  completed:   { label: "مكتمل",    color: "bg-emerald-50 text-emerald-600",  dot: "bg-emerald-400" },
  in_progress: { label: "جارٍ الآن", color: "bg-[#2E4E45]/10 text-[#2E4E45]", dot: "bg-[#2E4E45] animate-pulse" },
  upcoming:    { label: "قادم",      color: "bg-gray-100 text-gray-500",       dot: "bg-gray-300" },
  cancelled:   { label: "ملغي",      color: "bg-red-50 text-red-500",          dot: "bg-red-400" },
};

export default function TodaySchedule({ schedule }: TodayScheduleProps) {
  const completed = schedule.filter((s) => s.status === "completed").length;
  const total = schedule.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-base">جدول اليوم</h3>
          <p className="text-xs text-gray-400 mt-0.5">{completed} من {total} مواعيد مكتملة</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2E4E45] rounded-full transition-all duration-700"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{Math.round((completed / total) * 100)}%</span>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute right-[5.5rem] top-0 bottom-0 w-px bg-gray-100" />

        <div className="space-y-1">
          {schedule.map((item, i) => {
            const cfg = statusConfig[item.status] || statusConfig.upcoming;
            return (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${item.status === "in_progress" ? "bg-[#2E4E45]/5 border border-[#2E4E45]/10" : "hover:bg-gray-50"}`}>
                {/* Time */}
                <div className="w-16 flex-shrink-0 text-left">
                  <span className="text-xs font-medium text-gray-500">{item.time}</span>
                </div>

                {/* Dot */}
                <div className="flex-shrink-0 mt-1.5 relative z-10">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">{item.patient}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.service} — {item.doctor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
