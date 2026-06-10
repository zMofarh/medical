import { useNotifications, NOTIF_CONFIG } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export default function NotificationsPanel() {
  const { notifs, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (notif: typeof notifs[0]) => {
    markRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-base">الإشعارات</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors cursor-pointer whitespace-nowrap"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {notifs.slice(0, 6).map((n) => {
          const cfg = NOTIF_CONFIG[n.type] || NOTIF_CONFIG.system;
          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${n.isRead ? "hover:bg-gray-50" : "bg-[#2E4E45]/5 border border-[#2E4E45]/10"}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                <i className={`${cfg.icon} text-sm ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${n.isRead ? "text-gray-500" : "text-gray-700 font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#C8A96E] flex-shrink-0 mt-1" />}
            </div>
          );
        })}
      </div>

      {notifs.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <i className="ri-notification-off-line text-gray-400 text-xl" />
          </div>
          <p className="text-sm text-gray-400">لا توجد إشعارات</p>
        </div>
      )}

      {notifs.length > 6 && (
        <button
          onClick={() => navigate("/admin")}
          className="w-full mt-3 py-2 text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors text-center cursor-pointer"
        >
          عرض كل الإشعارات
        </button>
      )}
    </div>
  );
}
