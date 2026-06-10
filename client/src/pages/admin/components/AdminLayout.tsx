import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSession, clearSession, hasPermission, ROLE_DEFINITIONS, type AdminSession } from "@/hooks/useRBAC";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationsDropdown from "@/pages/admin/components/NotificationsDropdown";

function useAdminCursor() {
  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => { document.body.classList.remove("admin-page"); };
  }, []);
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  permission?: string;
  group?: string;
  divider?: boolean;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  { path: "/admin",              icon: "ri-dashboard-line",       label: "لوحة التحكم",       permission: "dashboard.view" },
  { path: "/admin/bookings",     icon: "ri-calendar-check-line",  label: "الحجوزات",           permission: "bookings.view",  divider: true },
  { path: "/admin/services",     icon: "ri-stethoscope-line",     label: "الخدمات",            permission: "services.view" },
  { path: "/admin/doctors",      icon: "ri-user-star-line",       label: "الأطباء",            permission: "doctors.view" },
  { path: "/admin/packages",     icon: "ri-vip-crown-line",       label: "الباقات",            permission: "packages.view" },
  { path: "/admin/messages",     icon: "ri-mail-line",            label: "الرسائل",            permission: "messages.view" },
  { path: "/admin/reports",      icon: "ri-bar-chart-2-line",     label: "التقارير",           permission: "messages.view" },
  { path: "/admin/dna-simulator", icon: "ri-dna-line",             label: "DNA Simulator",      permission: "dashboard.view", divider: true },
  // رابط مباشر للمدونة للطبيب (بدون اشتراط cms.view)
  { path: "/admin/blog",         icon: "ri-quill-pen-line",       label: "مقالاتي",              permission: "blog.create" },
  { path: "/admin/cms",          icon: "ri-layout-masonry-line",  label: "إدارة المحتوى",      permission: "cms.view" },
  { path: "/admin/cms/home",     icon: "ri-home-4-line",          label: "الصفحة الرئيسية",   permission: "cms.edit" },
  { path: "/admin/cms/blog",     icon: "ri-quill-pen-line",       label: "محتوى المدونة",      permission: "cms.edit" },
  { path: "/admin/cms/faq",      icon: "ri-question-answer-line", label: "الأسئلة الشائعة",   permission: "cms.edit" },
  { path: "/admin/cms/about",    icon: "ri-information-line",     label: "من نحن",             permission: "cms.edit" },
  { path: "/admin/cms/contact",  icon: "ri-phone-line",           label: "التواصل معنا",       permission: "cms.edit" },
  { path: "/admin/cms/testimonials", icon: "ri-chat-quote-line",  label: "التقييمات",          permission: "cms.edit" },
  { path: "/admin/cms/offers",   icon: "ri-price-tag-3-line",     label: "العروض والخصومات",  permission: "cms.edit" },
  { path: "/admin/cms/search",   icon: "ri-search-eye-line",      label: "صفحة البحث",         permission: "cms.edit" },
  { path: "/admin/cms/settings", icon: "ri-building-line",        label: "إعدادات العيادة",   permission: "cms.settings",  divider: true },
  { path: "/admin/users",        icon: "ri-shield-keyhole-line",  label: "المستخدمون والأدوار", permission: "users.view" },
  { path: "/admin/settings",     icon: "ri-settings-4-line",      label: "إعدادات الموقع",    permission: "settings.view" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [cmsExpanded, setCmsExpanded] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { unreadCount } = useNotifications();

  useAdminCursor();

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate("/admin/login");
    } else {
      setSession(s);
      // auto-expand CMS if on a CMS page
      if (location.pathname.startsWith("/admin/cms")) {
        setCmsExpanded(true);
      }
    }

    const handleAuthError = () => {
      clearSession();
      navigate("/admin/login");
    };
    window.addEventListener("auth-error", handleAuthError);
    
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    clearSession();
    navigate("/admin/login");
  };

  if (!session) return null;

  const roleDef = ROLE_DEFINITIONS[session.role];

  // Filter menu items by permission
  const visibleItems = ALL_MENU_ITEMS.filter((item) =>
    !item.permission || hasPermission(session, item.permission)
  );

  // Separate CMS sub-items
  const mainItems = visibleItems.filter((item) => !item.path.startsWith("/admin/cms/"));
  const cmsSubItems = visibleItems.filter((item) => item.path.startsWith("/admin/cms/"));
  const hasCMS = visibleItems.some((item) => item.path === "/admin/cms");
  const isOnCMS = location.pathname.startsWith("/admin/cms");

  const currentLabel = ALL_MENU_ITEMS.find((m) => m.path === location.pathname)?.label
    || (location.pathname === "/admin/reports" ? "التقارير" : location.pathname === "/admin/dna-simulator" ? "DNA Simulator" : "لوحة التحكم");

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex" dir="rtl">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 bg-[#2E4E45] text-white transition-all duration-300 flex flex-col
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        ${sidebarOpen ? "w-64" : "w-20"}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C8A96E] flex items-center justify-center flex-shrink-0">
              <i className="ri-hospital-line text-white text-lg" />
            </div>
            {sidebarOpen && <span className="font-bold text-sm whitespace-nowrap">لوحة التحكم</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <i className={sidebarOpen ? "ri-arrow-right-s-line text-sm" : "ri-arrow-left-s-line text-sm"} />
          </button>
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="px-4 py-2.5 border-b border-white/10 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleDef.color}`}>
              <i className={`${roleDef.icon} text-xs`} />
              {roleDef.label}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isCMSParent = item.path === "/admin/cms";

            return (
              <div key={item.path}>
                {item.divider && <div className="my-2 border-t border-white/10" />}
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isCMSParent && sidebarOpen) {
                      setCmsExpanded(!cmsExpanded);
                      navigate(item.path);
                    } else {
                      navigate(item.path);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer
                    ${isActive || (isCMSParent && isOnCMS)
                      ? "bg-[#C8A96E] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-base`} />
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>
                      {isCMSParent && cmsSubItems.length > 0 && (
                        <i className={`text-xs transition-transform ${cmsExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
                      )}
                      {isActive && !isCMSParent && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </>
                  )}
                </a>

                {/* CMS sub-items */}
                {isCMSParent && sidebarOpen && cmsExpanded && cmsSubItems.length > 0 && (
                  <div className="mr-4 mt-0.5 space-y-0.5 border-r border-white/10 pr-3">
                    {cmsSubItems.map((sub) => {
                      const subActive = location.pathname === sub.path;
                      return (
                        <a
                          key={sub.path}
                          href={sub.path}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(sub.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                            subActive
                              ? "bg-white/15 text-white"
                              : "text-white/55 hover:bg-white/8 hover:text-white/80"
                          }`}
                        >
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <i className={`${sub.icon} text-sm`} />
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">{sub.label}</span>
                          {subActive && <div className="mr-auto w-1 h-1 rounded-full bg-white/60" />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User area */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="relative flex-shrink-0">
              <img
                src={session.avatar}
                alt={session.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#C8A96E]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#2E4E45]" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.name}</p>
                <p className="text-xs text-white/50 truncate">{roleDef.label}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all w-full cursor-pointer ${sidebarOpen ? "" : "justify-center"}`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className="ri-logout-box-r-line text-base" />
            </div>
            {sidebarOpen && <span className="text-sm whitespace-nowrap">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-menu-line text-lg text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-[#2E4E45]">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Role badge in header */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleDef.color}`}>
              <i className={`${roleDef.icon} text-xs`} />
              {roleDef.label}
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-notification-3-line text-lg text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <NotificationsDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Back to site */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate("/"); }}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#2E4E45] hover:bg-[#2E4E45]/5 transition-colors"
            >
              <i className="ri-external-link-line" />
              <span className="whitespace-nowrap">الموقع</span>
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
