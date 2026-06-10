interface QuickActionsProps {
  onNavigate: (path: string) => void;
  hasPermission: (perm: string) => boolean;
}

const actions = [
  { icon: "ri-calendar-check-line",  label: "حجز جديد",        path: "/admin/bookings",     perm: "bookings.create",  color: "bg-[#2E4E45] text-white hover:bg-[#3a6358]" },
  { icon: "ri-user-add-line",       label: "إضافة طبيب",       path: "/admin/doctors",      perm: "doctors.edit",     color: "bg-[#C8A96E] text-white hover:bg-[#b8995e]" },
  { icon: "ri-article-line",        label: "مقال جديد",        path: "/admin/blog",         perm: "blog.create",      color: "bg-violet-500 text-white hover:bg-violet-600" },
  { icon: "ri-layout-masonry-line", label: "تعديل المحتوى",    path: "/admin/cms",          perm: "cms.edit",         color: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { icon: "ri-vip-crown-line",      label: "إضافة باقة",       path: "/admin/packages",     perm: "packages.edit",    color: "bg-amber-500 text-white hover:bg-amber-600" },
  { icon: "ri-stethoscope-line",    label: "إضافة خدمة",       path: "/admin/services",     perm: "services.edit",    color: "bg-rose-500 text-white hover:bg-rose-600" },
];

export default function QuickActions({ onNavigate, hasPermission }: QuickActionsProps) {
  const visible = actions.filter((a) => hasPermission(a.perm));
  if (visible.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-base">إجراءات سريعة</h3>
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2E4E45]/10">
          <i className="ri-flashlight-line text-[#2E4E45]" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visible.map((action) => (
          <button
            key={action.path}
            onClick={() => onNavigate(action.path)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${action.color}`}
          >
            <i className={`${action.icon} text-base flex-shrink-0`} />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
