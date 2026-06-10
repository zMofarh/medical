import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, NOTIF_CONFIG, type AppNotification } from "@/hooks/useNotifications";

interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ open, onClose }: NotificationsDropdownProps) {
  const { notifs, unreadCount, markRead, markAllRead, deleteNotif, clearAll } = useNotifications();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleClick = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  if (!open) return null;

  const cfg = (type: string) => NOTIF_CONFIG[type as keyof typeof NOTIF_CONFIG] || NOTIF_CONFIG.system;

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden"
      dir="rtl"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">الإشعارات</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors cursor-pointer whitespace-nowrap"
            >
              تحديد الكل كمقروء
            </button>
          )}
          {notifs.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              مسح الكل
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <i className="ri-notification-off-line text-gray-400 text-2xl" />
            </div>
            <p className="text-sm font-medium text-gray-500">لا توجد إشعارات</p>
            <p className="text-xs text-gray-400 mt-1">ستظهر هنا الإشعارات الجديدة</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifs.map((notif) => {
              const c = cfg(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`group flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer relative
                    ${notif.isRead ? "hover:bg-gray-50/70" : "bg-[#2E4E45]/4 hover:bg-[#2E4E45]/8"}`}
                  onClick={() => handleClick(notif)}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${c.bg}`}>
                    <i className={`${c.icon} text-sm ${c.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-xs font-bold ${notif.isRead ? "text-gray-600" : "text-gray-800"}`}>
                        {notif.title}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.bg} ${c.color}`}>
                        {c.label}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${notif.isRead ? "text-gray-400" : "text-gray-600"}`}>
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <i className="ri-time-line" />
                      {notif.time}
                    </p>
                  </div>

                  {/* Unread dot + delete */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#C8A96E] mt-1" />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all cursor-pointer"
                    >
                      <i className="ri-close-line text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifs.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/40">
          <p className="text-xs text-gray-400 text-center">
            {notifs.length} إشعار · {unreadCount} غير مقروء
          </p>
        </div>
      )}
    </div>
  );
}
