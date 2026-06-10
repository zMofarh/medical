import { useState, useEffect } from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: number;
  changeType?: "up" | "down";
  color: string;
  bgColor: string;
  suffix?: string;
  onClick?: () => void;
}

function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const step = target / 40;
    let val = 0;
    const timer = setInterval(() => {
      val += step;
      if (val >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(Math.floor(val));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <>{current.toLocaleString("ar-SA")}</>;
}

function StatCard({ icon, label, value, change, changeType, color, bgColor, suffix, onClick }: StatCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/,/g, ""));
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 ${onClick ? "cursor-pointer hover:border-gray-200 hover:-translate-y-0.5" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center`}>
          <i className={`${icon} text-xl ${color}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${changeType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            <i className={changeType === "up" ? "ri-arrow-up-line" : "ri-arrow-down-line"} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-1 tabular-nums">
        {typeof value === "number" ? <AnimatedNumber target={numericValue} /> : value}
        {suffix && <span className="text-sm font-normal text-gray-400 mr-1">{suffix}</span>}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

interface StatsGridProps {
  stats: {
    todayBookings: number;
    totalPatients: number;
    revenueThisMonth: number;
    visitorsToday: number;
    revenueGrowth: number;
    visitorsGrowth: number;
    pendingBookings: number;
    satisfactionRate: number;
    newPatientsThisMonth: number;
    cancelledBookings: number;
  };
  onNavigate: (path: string) => void;
}

export default function StatsGrid({ stats, onNavigate }: StatsGridProps) {
  return (
    <div className="space-y-4">
      {/* Primary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="ri-calendar-check-line"
          label="حجوزات اليوم"
          value={stats.todayBookings}
          change={8.5}
          changeType="up"
          color="text-[#2E4E45]"
          bgColor="bg-[#2E4E45]/10"
          onClick={() => onNavigate("/admin/bookings")}
        />
        <StatCard
          icon="ri-user-heart-line"
          label="إجمالي المرضى"
          value={stats.totalPatients}
          change={12.3}
          changeType="up"
          color="text-[#C8A96E]"
          bgColor="bg-[#C8A96E]/10"
        />
        <StatCard
          icon="ri-money-dollar-circle-line"
          label="إيرادات الشهر"
          value={stats.revenueThisMonth}
          change={stats.revenueGrowth}
          changeType="up"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          suffix="ريال"
        />
        <StatCard
          icon="ri-eye-line"
          label="زوار اليوم"
          value={stats.visitorsToday}
          change={stats.visitorsGrowth}
          changeType="up"
          color="text-violet-600"
          bgColor="bg-violet-50"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: "ri-time-line",
            label: "حجوزات معلقة",
            value: stats.pendingBookings,
            color: "text-amber-600",
            bg: "bg-amber-50",
            alert: true,
            path: "/admin/bookings",
          },
          {
            icon: "ri-star-smile-line",
            label: "رضا المرضى",
            value: `${stats.satisfactionRate}%`,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            alert: false,
          },
          {
            icon: "ri-user-add-line",
            label: "مرضى جدد",
            value: stats.newPatientsThisMonth,
            color: "text-[#2E4E45]",
            bg: "bg-[#2E4E45]/10",
            alert: false,
          },
          {
            icon: "ri-close-circle-line",
            label: "حجوزات ملغاة",
            value: stats.cancelledBookings,
            color: "text-red-500",
            bg: "bg-red-50",
            alert: true,
          },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => item.path && onNavigate(item.path)}
            className={`bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 transition-all ${item.path ? "cursor-pointer hover:border-gray-200" : ""}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
              <i className={`${item.icon} text-base ${item.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
