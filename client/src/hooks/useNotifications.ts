import { useState, useEffect, useCallback } from "react";

export type NotificationType = "booking" | "message" | "blog" | "cms" | "system" | "user";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  isRead: boolean;
  link?: string;
  avatar?: string;
}

const LS_KEY = "admin_notifications";
const EVENT  = "notifications-update";

// ─── Type config ──────────────────────────────────────────────────────────────
export const NOTIF_CONFIG: Record<NotificationType, { icon: string; color: string; bg: string; label: string }> = {
  booking: { icon: "ri-calendar-check-line", color: "text-[#2E4E45]",  bg: "bg-[#2E4E45]/10",  label: "حجز" },
  message: { icon: "ri-mail-line",           color: "text-[#C8A96E]",  bg: "bg-[#C8A96E]/10",  label: "رسالة" },
  blog:    { icon: "ri-quill-pen-line",       color: "text-teal-600",   bg: "bg-teal-50",        label: "مدونة" },
  cms:     { icon: "ri-layout-masonry-line",  color: "text-violet-600", bg: "bg-violet-50",      label: "محتوى" },
  system:  { icon: "ri-settings-4-line",      color: "text-gray-500",   bg: "bg-gray-100",       label: "نظام" },
  user:    { icon: "ri-user-line",            color: "text-amber-600",  bg: "bg-amber-50",       label: "مستخدم" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "الآن";
  if (mins < 60)  return `منذ ${mins} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
}

function readNotifs(): AppNotification[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDefaultNotifications();
    const parsed = JSON.parse(raw) as AppNotification[];
    // refresh relative times
    return parsed.map((n) => ({ ...n, time: timeAgo(n.timestamp) }));
  } catch { return getDefaultNotifications(); }
}

function writeNotifs(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch { /* silent */ }
}

function getDefaultNotifications(): AppNotification[] {
  const now = Date.now();
  const defaults: AppNotification[] = [
    {
      id: "n-001",
      type: "booking",
      title: "حجز جديد",
      message: "أحمد محمد حجز موعد — استشارة جلدية",
      time: "منذ 5 دقائق",
      timestamp: now - 5 * 60000,
      isRead: false,
      link: "/admin/bookings",
    },
    {
      id: "n-002",
      type: "message",
      title: "رسالة جديدة",
      message: "ليلى أحمد: استفسار عن باقة العائلة الشاملة",
      time: "منذ 12 دقيقة",
      timestamp: now - 12 * 60000,
      isRead: false,
      link: "/admin/messages",
    },
    {
      id: "n-003",
      type: "booking",
      title: "حجز ملغي",
      message: "تم إلغاء حجز ريم الحربي — تقشير كيميائي",
      time: "منذ 45 دقيقة",
      timestamp: now - 45 * 60000,
      isRead: false,
      link: "/admin/bookings",
    },
    {
      id: "n-004",
      type: "cms",
      title: "تحديث محتوى",
      message: "خالد العتيبي حدّث محتوى الصفحة الرئيسية",
      time: "منذ ساعة",
      timestamp: now - 60 * 60000,
      isRead: true,
      link: "/admin/cms",
    },
    {
      id: "n-005",
      type: "user",
      title: "مستخدم جديد",
      message: "تم إنشاء حساب جديد: د. ليلى القحطاني (طبيب)",
      time: "منذ ساعتين",
      timestamp: now - 2 * 3600000,
      isRead: true,
      link: "/admin/users",
    },
    {
      id: "n-006",
      type: "blog",
      title: "مقال جديد",
      message: "د. أحمد الزهراني نشر مقالاً: الوقاية من أمراض القلب",
      time: "منذ 3 ساعات",
      timestamp: now - 3 * 3600000,
      isRead: true,
      link: "/admin/cms/blog",
    },
    {
      id: "n-007",
      type: "system",
      title: "نسخة احتياطية",
      message: "تم إنشاء نسخة احتياطية تلقائية للبيانات بنجاح",
      time: "منذ 5 ساعات",
      timestamp: now - 5 * 3600000,
      isRead: true,
    },
  ];
  writeNotifs(defaults);
  return defaults;
}

// ─── Push a new notification (call from anywhere) ─────────────────────────────
export function pushNotification(notif: Omit<AppNotification, "id" | "time" | "timestamp" | "isRead">): void {
  const notifs = readNotifs();
  const newNotif: AppNotification = {
    ...notif,
    id: `n-${Date.now()}`,
    timestamp: Date.now(),
    time: "الآن",
    isRead: false,
  };
  writeNotifs([newNotif, ...notifs].slice(0, 50)); // keep max 50
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useNotifications() {
  const [notifs, setNotifs] = useState<AppNotification[]>(readNotifs);

  // Refresh relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifs((prev) => prev.map((n) => ({ ...n, time: timeAgo(n.timestamp) })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Listen for external updates
  useEffect(() => {
    const handler = () => setNotifs(readNotifs());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const markRead = useCallback((id: string) => {
    const updated = notifs.map((n) => n.id === id ? { ...n, isRead: true } : n);
    setNotifs(updated);
    writeNotifs(updated);
  }, [notifs]);

  const markAllRead = useCallback(() => {
    const updated = notifs.map((n) => ({ ...n, isRead: true }));
    setNotifs(updated);
    writeNotifs(updated);
  }, [notifs]);

  const deleteNotif = useCallback((id: string) => {
    const updated = notifs.filter((n) => n.id !== id);
    setNotifs(updated);
    writeNotifs(updated);
  }, [notifs]);

  const clearAll = useCallback(() => {
    setNotifs([]);
    writeNotifs([]);
  }, []);

  return { notifs, unreadCount, markRead, markAllRead, deleteNotif, clearAll };
}
