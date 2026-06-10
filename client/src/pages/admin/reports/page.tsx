import { useState, useRef } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import ReportCard from "@/pages/admin/reports/components/ReportCard";
import BookingsReport from "@/pages/admin/reports/components/BookingsReport";
import RevenueReport from "@/pages/admin/reports/components/RevenueReport";
import DoctorsReport from "@/pages/admin/reports/components/DoctorsReport";
import MessagesReport from "@/pages/admin/reports/components/MessagesReport";
import { adminStats } from "@/mocks/adminData";

type ReportTab = "overview" | "bookings" | "revenue" | "doctors" | "messages";

const TABS: { id: ReportTab; label: string; icon: string }[] = [
  { id: "overview",  label: "نظرة عامة",  icon: "ri-dashboard-line" },
  { id: "bookings",  label: "الحجوزات",   icon: "ri-calendar-check-line" },
  { id: "revenue",   label: "الإيرادات",  icon: "ri-money-dollar-circle-line" },
  { id: "doctors",   label: "الأطباء",    icon: "ri-user-star-line" },
  { id: "messages",  label: "الرسائل",    icon: "ri-mail-line" },
];

const DATE_RANGES = [
  { value: "this_month", label: "هذا الشهر" },
  { value: "last_month", label: "الشهر الماضي" },
  { value: "this_quarter", label: "هذا الربع" },
  { value: "this_year", label: "هذا العام" },
];

function ExportSuccessToast({ type, onClose }: { type: "pdf" | "excel"; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 bg-[#2E4E45] text-white px-5 py-3.5 rounded-xl flex items-center gap-3 animate-fade-in">
      <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg">
        <i className={type === "pdf" ? "ri-file-pdf-line text-lg" : "ri-file-excel-line text-lg"} />
      </div>
      <div>
        <p className="text-sm font-semibold">تم التصدير بنجاح!</p>
        <p className="text-xs text-white/70">تم تنزيل ملف {type === "pdf" ? "PDF" : "Excel"}</p>
      </div>
      <button onClick={onClose} className="mr-2 w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer">
        <i className="ri-close-line text-sm" />
      </button>
    </div>
  );
}

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [dateRange, setDateRange] = useState("this_month");
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const [toast, setToast] = useState<"pdf" | "excel" | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const dateLabel = DATE_RANGES.find((d) => d.value === dateRange)?.label || "هذا الشهر";

  const handleExportPDF = async () => {
    setExporting("pdf");
    // Simulate export delay
    await new Promise((r) => setTimeout(r, 1800));

    // Build printable content
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>تقرير لوحة التحكم — ${dateLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; padding: 32px; color: #1a1a1a; }
          h1 { color: #2E4E45; font-size: 22px; margin-bottom: 4px; }
          .subtitle { color: #888; font-size: 13px; margin-bottom: 24px; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
          .card-value { font-size: 22px; font-weight: bold; color: #2E4E45; }
          .card-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #f9fafb; text-align: right; padding: 10px 14px; font-size: 12px; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
          td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
          .section-title { font-size: 15px; font-weight: bold; color: #2E4E45; margin: 20px 0 10px; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <h1>تقرير لوحة التحكم</h1>
        <p class="subtitle">الفترة: ${dateLabel} — تاريخ الإنشاء: ${new Date().toLocaleDateString("ar-SA")}</p>
        <div class="grid">
          <div class="card"><div class="card-value">${adminStats.monthBookings}</div><div class="card-label">حجوزات الشهر</div></div>
          <div class="card"><div class="card-value">${adminStats.revenueThisMonth.toLocaleString()} ر.س</div><div class="card-label">إيرادات الشهر</div></div>
          <div class="card"><div class="card-value">${adminStats.totalPatients.toLocaleString()}</div><div class="card-label">إجمالي المرضى</div></div>
          <div class="card"><div class="card-value">${adminStats.satisfactionRate}%</div><div class="card-label">معدل الرضا</div></div>
        </div>
        <p class="section-title">ملخص الحجوزات</p>
        <table>
          <thead><tr><th>الحالة</th><th>العدد</th><th>النسبة</th></tr></thead>
          <tbody>
            <tr><td>مؤكدة</td><td>${adminStats.completedBookings}</td><td>${Math.round((adminStats.completedBookings / adminStats.monthBookings) * 100)}%</td></tr>
            <tr><td>معلقة</td><td>${adminStats.pendingBookings}</td><td>${Math.round((adminStats.pendingBookings / adminStats.monthBookings) * 100)}%</td></tr>
            <tr><td>ملغية</td><td>${adminStats.cancelledBookings}</td><td>${Math.round((adminStats.cancelledBookings / adminStats.monthBookings) * 100)}%</td></tr>
          </tbody>
        </table>
        <div class="footer">تم إنشاء هذا التقرير تلقائياً من لوحة التحكم — ${new Date().toLocaleString("ar-SA")}</div>
      </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 500);
    }

    setExporting(null);
    setToast("pdf");
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    await new Promise((r) => setTimeout(r, 1500));

    // Build CSV content (Excel-compatible)
    const rows = [
      ["تقرير لوحة التحكم", dateLabel, "", "", ""],
      ["تاريخ الإنشاء", new Date().toLocaleDateString("ar-SA"), "", "", ""],
      ["", "", "", "", ""],
      ["الإحصائيات العامة", "", "", "", ""],
      ["المؤشر", "القيمة", "", "", ""],
      ["حجوزات الشهر", adminStats.monthBookings, "", "", ""],
      ["إيرادات الشهر (ر.س)", adminStats.revenueThisMonth, "", "", ""],
      ["إجمالي المرضى", adminStats.totalPatients, "", "", ""],
      ["معدل الرضا (%)", adminStats.satisfactionRate, "", "", ""],
      ["الأطباء النشطون", adminStats.totalDoctors, "", "", ""],
      ["الخدمات المتاحة", adminStats.totalServices, "", "", ""],
      ["", "", "", "", ""],
      ["الحجوزات حسب الحالة", "", "", "", ""],
      ["الحالة", "العدد", "النسبة (%)", "", ""],
      ["مكتملة", adminStats.completedBookings, Math.round((adminStats.completedBookings / adminStats.monthBookings) * 100), "", ""],
      ["معلقة", adminStats.pendingBookings, Math.round((adminStats.pendingBookings / adminStats.monthBookings) * 100), "", ""],
      ["ملغية", adminStats.cancelledBookings, Math.round((adminStats.cancelledBookings / adminStats.monthBookings) * 100), "", ""],
      ["", "", "", "", ""],
      ["الإيرادات الشهرية", "", "", "", ""],
      ["الشهر", "الإيراد (ر.س)", "الحجوزات", "المتوسط (ر.س)", ""],
      ["يناير", 98000, 245, 400, ""],
      ["فبراير", 112000, 278, 403, ""],
      ["مارس", 125000, 310, 403, ""],
      ["أبريل", 128500, 342, 376, ""],
    ];

    const csvContent = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `تقرير-لوحة-التحكم-${dateLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExporting(null);
    setToast("excel");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2E4E45]">التقارير والإحصائيات</h2>
            <p className="text-sm text-gray-500 mt-0.5">تحليل شامل لأداء العيادة</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4E45]/20 cursor-pointer"
            >
              {DATE_RANGES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {/* Export Excel */}
            <button
              onClick={handleExportExcel}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {exporting === "excel" ? (
                <i className="ri-loader-4-line animate-spin" />
              ) : (
                <i className="ri-file-excel-line" />
              )}
              تصدير Excel
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {exporting === "pdf" ? (
                <i className="ri-loader-4-line animate-spin" />
              ) : (
                <i className="ri-file-pdf-line" />
              )}
              تصدير PDF
            </button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportCard
            title="حجوزات الشهر"
            value={adminStats.monthBookings}
            subtitle="هذا الشهر"
            icon="ri-calendar-check-line"
            color="bg-[#2E4E45]"
            trend={{ value: 12.5, label: "مقارنة بالشهر الماضي" }}
          />
          <ReportCard
            title="الإيرادات"
            value={`${adminStats.revenueThisMonth.toLocaleString()} ر.س`}
            subtitle="هذا الشهر"
            icon="ri-money-dollar-circle-line"
            color="bg-[#C8A96E]"
            trend={{ value: adminStats.revenueGrowth, label: "نمو عن الشهر الماضي" }}
          />
          <ReportCard
            title="إجمالي المرضى"
            value={adminStats.totalPatients.toLocaleString()}
            subtitle="مسجلون في النظام"
            icon="ri-user-heart-line"
            color="bg-[#4A7C6F]"
            trend={{ value: 8.3, label: "مرضى جدد هذا الشهر" }}
          />
          <ReportCard
            title="معدل الرضا"
            value={`${adminStats.satisfactionRate}%`}
            subtitle="من تقييمات المرضى"
            icon="ri-star-line"
            color="bg-amber-500"
            trend={{ value: 2.1, label: "تحسن عن الشهر الماضي" }}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-1 p-1 border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#2E4E45] text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <i className={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>

          <div ref={reportRef} className="p-5">
            {activeTab === "overview" && <OverviewReport dateLabel={dateLabel} />}
            {activeTab === "bookings" && <BookingsReport dateRange={dateLabel} />}
            {activeTab === "revenue" && <RevenueReport />}
            {activeTab === "doctors" && <DoctorsReport />}
            {activeTab === "messages" && <MessagesReport />}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <ExportSuccessToast type={toast} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}

// ─── Overview Tab ───
function OverviewReport({ dateLabel }: { dateLabel: string }) {
  const monthlyTrend = [
    { month: "يناير", bookings: 245, revenue: 98000 },
    { month: "فبراير", bookings: 278, revenue: 112000 },
    { month: "مارس", bookings: 310, revenue: 125000 },
    { month: "أبريل", bookings: 342, revenue: 128500 },
  ];

  const maxBookings = Math.max(...monthlyTrend.map((m) => m.bookings));

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "مرضى جدد", value: adminStats.newPatientsThisMonth, icon: "ri-user-add-line", color: "text-[#2E4E45]" },
          { label: "مرضى عائدون", value: adminStats.returningPatients, icon: "ri-user-follow-line", color: "text-[#C8A96E]" },
          { label: "حجوزات ملغية", value: adminStats.cancelledBookings, icon: "ri-calendar-close-line", color: "text-red-500" },
          { label: "رسائل غير مقروءة", value: adminStats.unreadMessages, icon: "ri-mail-unread-line", color: "text-amber-600" },
          { label: "زوار اليوم", value: adminStats.visitorsToday, icon: "ri-eye-line", color: "text-[#4A7C6F]" },
          { label: "متوسط الجلسة", value: `${adminStats.avgSessionMin} دقيقة`, icon: "ri-time-line", color: "text-gray-600" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-100 flex-shrink-0">
              <i className={`${s.icon} text-lg ${s.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="font-semibold text-[#2E4E45] text-sm mb-5">اتجاه الحجوزات — {dateLabel}</h3>
        <div className="flex items-end gap-6 h-36">
          {monthlyTrend.map((m) => {
            const h = Math.round((m.bookings / maxBookings) * 100);
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[#2E4E45]">{m.bookings}</span>
                <div className="w-full group relative cursor-pointer">
                  <div
                    className="w-full bg-[#2E4E45] rounded-t-lg hover:bg-[#C8A96E] transition-colors duration-200"
                    style={{ height: `${h * 1.1}px` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2E4E45] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {m.revenue.toLocaleString()} ر.س
                  </div>
                </div>
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-[#2E4E45] text-sm mb-4">مؤشرات الأداء الرئيسية</h3>
          <div className="space-y-3">
            {[
              { label: "معدل إتمام الحجوزات", value: 96, color: "bg-emerald-500" },
              { label: "معدل رضا المرضى", value: 96.4, color: "bg-[#2E4E45]" },
              { label: "معدل الرد على الرسائل", value: 95, color: "bg-[#C8A96E]" },
              { label: "نمو الإيرادات", value: 12.5, color: "bg-amber-500" },
            ].map((kpi) => (
              <div key={kpi.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{kpi.label}</span>
                  <span className="text-xs font-semibold text-[#2E4E45]">{kpi.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${kpi.color}`} style={{ width: `${kpi.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-[#2E4E45] text-sm mb-4">ملخص سريع</h3>
          <div className="space-y-2.5">
            {[
              { label: "أعلى خدمة طلباً", value: "استشارة جلدية", icon: "ri-award-line" },
              { label: "أكثر طبيب حجزاً", value: "د. سارة العلي", icon: "ri-user-star-line" },
              { label: "أفضل يوم للحجز", value: "الثلاثاء", icon: "ri-calendar-line" },
              { label: "أعلى إيراد يومي", value: "8,400 ر.س", icon: "ri-money-dollar-circle-line" },
              { label: "متوسط وقت الانتظار", value: "12 دقيقة", icon: "ri-time-line" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-2">
                  <i className={`${item.icon} text-[#C8A96E] text-sm`} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-[#2E4E45]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
