import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  patientName: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
  avatar: string;
}

interface Message {
  id: string;
  name: string;
  subject: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar: string;
}

interface RecentActivityProps {
  bookings: Booking[];
  messages: Message[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  confirmed: { label: "مؤكد",  color: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  pending:   { label: "معلق",  color: "bg-amber-50 text-amber-600 border border-amber-100" },
  cancelled: { label: "ملغي",  color: "bg-red-50 text-red-500 border border-red-100" },
};

export default function RecentActivity({ bookings, messages }: RecentActivityProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookings" | "messages">("bookings");
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-5 pt-4">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 pb-3 px-1 ml-5 text-sm font-medium border-b-2 transition-all ${activeTab === "bookings" ? "border-[#2E4E45] text-[#2E4E45]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          <i className="ri-calendar-check-line" />
          آخر الحجوزات
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "bookings" ? "bg-[#2E4E45] text-white" : "bg-gray-100 text-gray-500"}`}>
            {bookings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-all ${activeTab === "messages" ? "border-[#2E4E45] text-[#2E4E45]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          <i className="ri-mail-line" />
          الرسائل الواردة
          {unread > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "messages" ? "bg-[#C8A96E] text-white" : "bg-amber-100 text-amber-600"}`}>
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "bookings" ? (
          <div className="space-y-2">
            {bookings.map((b) => {
              const cfg = statusConfig[b.status] || statusConfig.pending;
              return (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <img src={b.avatar} alt={b.patientName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{b.patientName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{b.service} — {b.doctor}</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-xs font-medium text-gray-600">{b.time}</p>
                    <p className="text-[10px] text-gray-400">{b.date}</p>
                  </div>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <i className="ri-more-2-line" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${msg.isRead ? "hover:bg-gray-50" : "bg-[#2E4E45]/5 border border-[#2E4E45]/10"}`}
              >
                <img src={msg.avatar} alt={msg.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-800">{msg.name}</span>
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-[#C8A96E] flex-shrink-0" />}
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-0.5">{msg.subject}</p>
                  <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{msg.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {activeTab === "bookings" ? `${bookings.length} حجز حديث` : `${messages.length} رسالة`}
        </span>
        <button
          onClick={() => navigate(activeTab === "bookings" ? "/admin/bookings" : "/admin/messages")}
          className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          عرض الكل
          <i className="ri-arrow-left-line" />
        </button>
      </div>
    </div>
  );
}
