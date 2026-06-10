import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { pushNotification } from "@/hooks/useNotifications";
import { getBookings, updateBookingStatus, createBooking } from "@/api/bookings";

const ALL_SERVICES = ["استشارة جلدية", "تجميل ليزر", "فحص شامل", "علاج بالخلايا", "استشارة تغذية", "تقشير كيميائي"];
const ALL_DOCTORS = ["د. سارة العلي", "د. خالد السالم", "د. نورة الفهد", "د. عمر الحسن"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    patientName: "",
    phone: "",
    service: ALL_SERVICES[0],
    doctor: ALL_DOCTORS[0],
    date: "",
    time: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const data = await getBookings(token);
      const mapped = data.map(b => ({
        id: b.booking_ref,
        originalId: b.id,
        patientName: b.full_name,
        phone: b.phone,
        service: b.service_id || "غير محدد",
        doctor: b.doctor_id || "غير محدد",
        date: b.selected_date,
        time: b.selected_time,
        status: b.status,
        avatar: "https://readdy.ai/api/search-image?query=professional%20person%20portrait%20headshot%20neutral%20background%20clean%20modern%20style&width=60&height=60&seq=" + b.booking_ref + "&orientation=squarish",
      }));
      setBookings(mapped);
    } catch (err) {
      showToast("فشل في جلب الحجوزات");
    } finally {
      setLoadingBookings(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = !searchQuery ||
      b.patientName.includes(searchQuery) ||
      b.id.includes(searchQuery) ||
      b.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesService = serviceFilter === "all" || b.service === serviceFilter;
    const matchesDate = !dateFilter || b.date === dateFilter;
    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const confirmBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      await updateBookingStatus(booking.originalId, "confirmed", token);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "confirmed" } : b));
      showToast("تم تأكيد الحجز بنجاح");
      pushNotification({
        type: "booking",
        title: "تم تأكيد الحجز",
        message: `تم تأكيد حجز ${booking.patientName} — ${booking.service}`,
        link: "/admin/bookings",
      });
    } catch (err) {
      showToast("فشل في تأكيد الحجز");
    }
  };

  const cancelBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      await updateBookingStatus(booking.originalId, "cancelled", token);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
      showToast("تم إلغاء الحجز");
      pushNotification({
        type: "booking",
        title: "حجز ملغي",
        message: `تم إلغاء حجز ${booking.patientName} — ${booking.service}`,
        link: "/admin/bookings",
      });
    } catch (err) {
      showToast("فشل في إلغاء الحجز");
    }
  };

  const handleNewBooking = async () => {
    if (!newBooking.patientName.trim() || !newBooking.date || !newBooking.time) {
      showToast("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    try {
      const bookingPayload = {
        full_name: newBooking.patientName,
        phone: newBooking.phone,
        service_id: newBooking.service,
        doctor_id: newBooking.doctor,
        visit_type: "consultation",
        selected_date: newBooking.date,
        selected_time: newBooking.time,
      };

      const res = await createBooking(bookingPayload);
      
      await fetchData();
      setShowNewModal(false);
      setNewBooking({ patientName: "", phone: "", service: ALL_SERVICES[0], doctor: ALL_DOCTORS[0], date: "", time: "" });
      showToast("تم إنشاء الحجز بنجاح");
      pushNotification({
        type: "booking",
        title: "حجز جديد",
        message: `حجز جديد من ${newBooking.patientName} — ${newBooking.service}`,
        link: "/admin/bookings",
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "فشل في إنشاء الحجز");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "pending": return "bg-amber-50 text-amber-600 border border-amber-100";
      case "cancelled": return "bg-red-50 text-red-600 border border-red-100";
      default: return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "مؤكد";
      case "pending": return "معلق";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة الحجوزات</h2>
            <p className="text-sm text-gray-500 mt-1">متابعة وإدارة جميع مواعيد العيادة</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            حجز جديد
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
              <i className="ri-search-line" />
            </div>
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الحجز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#2E4E45]"
          >
            <option value="all">كل الحالات</option>
            <option value="confirmed">مؤكد</option>
            <option value="pending">معلق</option>
            <option value="cancelled">ملغي</option>
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#2E4E45]"
          >
            <option value="all">كل الخدمات</option>
            {ALL_SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#2E4E45]"
          />
          {(searchQuery || statusFilter !== "all" || serviceFilter !== "all" || dateFilter) && (
            <button
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); setServiceFilter("all"); setDateFilter(""); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              مسح الفلاتر
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-xs text-gray-400">
          عرض {filteredBookings.length} من {bookings.length} حجز
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium bg-[#2E4E45] text-white">
            <i className="ri-check-double-line" />{toast}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                  <th className="text-right py-3 px-4 font-medium">رقم الحجز</th>
                  <th className="text-right py-3 px-4 font-medium">المريض</th>
                  <th className="text-right py-3 px-4 font-medium">الخدمة</th>
                  <th className="text-right py-3 px-4 font-medium">الطبيب</th>
                  <th className="text-right py-3 px-4 font-medium">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium">الوقت</th>
                  <th className="text-right py-3 px-4 font-medium">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{booking.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{booking.patientName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.service}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.doctor}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{booking.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{booking.time}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                          title="عرض التفاصيل"
                        >
                          <i className="ri-eye-line text-sm" />
                        </button>
                        {booking.status === "pending" && (
                          <button
                            onClick={() => confirmBooking(booking.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="تأكيد"
                          >
                            <i className="ri-check-line text-sm" />
                          </button>
                        )}
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="إلغاء"
                          >
                            <i className="ri-close-circle-line text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-line text-2xl text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">لا توجد حجوزات مطابقة للبحث</p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">عرض 1-{filteredBookings.length} من {filteredBookings.length} حجز</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors cursor-pointer">
                <i className="ri-arrow-right-s-line" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2E4E45] text-white text-sm font-medium cursor-pointer">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors text-sm cursor-pointer">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors cursor-pointer">
                <i className="ri-arrow-left-s-line" />
              </button>
            </div>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelectedBooking(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800">تفاصيل الحجز</h3>
                <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <i className="ri-close-line" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                <img src={selectedBooking.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-bold text-gray-800">{selectedBooking.patientName}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.phone}</p>
                </div>
                <span className={`mr-auto text-xs px-2.5 py-1 rounded-full ${getStatusBadge(selectedBooking.status)}`}>
                  {getStatusLabel(selectedBooking.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">رقم الحجز</span>
                  <span className="text-sm font-mono text-gray-700">{selectedBooking.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">الخدمة</span>
                  <span className="text-sm text-gray-700">{selectedBooking.service}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">الطبيب</span>
                  <span className="text-sm text-gray-700">{selectedBooking.doctor}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">التاريخ</span>
                  <span className="text-sm text-gray-700">{selectedBooking.date}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">الوقت</span>
                  <span className="text-sm text-gray-700">{selectedBooking.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                {selectedBooking.status === "pending" && (
                  <button
                    onClick={() => { confirmBooking(selectedBooking.id); setSelectedBooking(null); }}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-check-line ml-1" />
                    تأكيد الحجز
                  </button>
                )}
                {selectedBooking.status !== "cancelled" && (
                  <button
                    onClick={() => { cancelBooking(selectedBooking.id); setSelectedBooking(null); }}
                    className="flex-1 py-2.5 rounded-lg bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-close-circle-line ml-1" />
                    إلغاء الحجز
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Booking Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowNewModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800">حجز جديد</h3>
                <button onClick={() => setShowNewModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <i className="ri-close-line" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم المريض *</label>
                  <input
                    type="text"
                    value={newBooking.patientName}
                    onChange={(e) => setNewBooking((p) => ({ ...p, patientName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                    placeholder="أحمد محمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الجوال</label>
                  <input
                    type="tel"
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                    placeholder="+966 50 123 4567"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الخدمة</label>
                    <select
                      value={newBooking.service}
                      onChange={(e) => setNewBooking((p) => ({ ...p, service: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45]"
                    >
                      {ALL_SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الطبيب</label>
                    <select
                      value={newBooking.doctor}
                      onChange={(e) => setNewBooking((p) => ({ ...p, doctor: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45]"
                    >
                      {ALL_DOCTORS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">التاريخ *</label>
                    <input
                      type="date"
                      value={newBooking.date}
                      onChange={(e) => setNewBooking((p) => ({ ...p, date: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الوقت *</label>
                    <input
                      type="time"
                      value={newBooking.time}
                      onChange={(e) => setNewBooking((p) => ({ ...p, time: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={handleNewBooking}
                  className="flex-1 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-check-line ml-1" />
                  إنشاء الحجز
                </button>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}