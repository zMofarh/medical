import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import StatsGrid from "./dashboard/components/StatsGrid";
import RevenueChart from "./dashboard/components/RevenueChart";
import ServicesChart from "./dashboard/components/ServicesChart";
import TodaySchedule from "./dashboard/components/TodaySchedule";
import TopDoctors from "./dashboard/components/TopDoctors";
import RecentActivity from "./dashboard/components/RecentActivity";
import QuickActions from "./dashboard/components/QuickActions";
import NotificationsPanel from "./dashboard/components/NotificationsPanel";
import VisitorsChart from "./dashboard/components/VisitorsChart";
import {
  adminStats,
  recentBookings,
  recentMessages,
  chartData,
  topDoctors,
  todaySchedule,
} from "@/mocks/adminData";
import { getSession, hasPermission, ROLE_DEFINITIONS, type AdminSession } from "@/hooks/useRBAC";

function WelcomeBanner({ session, roleDef }: { session: AdminSession; roleDef: { label: string; icon: string; color: string } }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 17 ? "مساء الخير" : "مساء النور";

  return (
    <div className="relative overflow-hidden bg-[#2E4E45] rounded-2xl p-6 text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[#C8A96E]/20 translate-x-1/4 translate-y-1/4" />

      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={session.avatar}
              alt={session.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#2E4E45]" />
          </div>
          <div>
            <p className="text-white/60 text-sm">{greeting}،</p>
            <h2 className="text-xl font-bold">{session.name}</h2>
            <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleDef.color}`}>
              <i className={`${roleDef.icon} text-xs`} />
              {roleDef.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick stats in banner */}
          <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
            <p className="text-xl font-bold">{adminStats.todayBookings}</p>
            <p className="text-[10px] text-white/60">حجز اليوم</p>
          </div>
          <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
            <p className="text-xl font-bold">{adminStats.pendingBookings}</p>
            <p className="text-[10px] text-white/60">معلق</p>
          </div>
          <div className="text-center px-4 py-2 bg-[#C8A96E]/30 rounded-xl">
            <p className="text-xl font-bold">{adminStats.unreadMessages}</p>
            <p className="text-[10px] text-white/60">رسائل جديدة</p>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="relative mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-white/50 text-xs">
          {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          النظام يعمل بشكل طبيعي
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { navigate("/admin/login"); return; }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  const roleDef = ROLE_DEFINITIONS[session.role];
  const perm = (p: string) => hasPermission(session, p);

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Welcome Banner */}
        <WelcomeBanner session={session} roleDef={roleDef} />

        {/* Quick Actions */}
        <QuickActions onNavigate={navigate} hasPermission={perm} />

        {/* Stats Grid */}
        <StatsGrid stats={adminStats} onNavigate={navigate} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RevenueChart bookingsByMonth={chartData.bookingsByMonth} />
          </div>
          <div>
            <ServicesChart data={chartData.bookingsByService} />
          </div>
        </div>

        {/* Middle Row: Schedule + Doctors + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <TodaySchedule schedule={todaySchedule} />
          </div>
          <div className="lg:col-span-1">
            <TopDoctors doctors={topDoctors} onNavigate={navigate} />
          </div>
          <div className="lg:col-span-1">
            <NotificationsPanel />
          </div>
        </div>

        {/* Bottom Row: Activity + Visitors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RecentActivity bookings={recentBookings} messages={recentMessages} />
          </div>
          <div className="lg:col-span-1">
            <VisitorsChart data={chartData.visitorsByDay} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
