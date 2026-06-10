import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import {
  getUsers, createUser, updateUser, deleteUser,
  ROLE_DEFINITIONS, ALL_PERMISSIONS, getSession,
  type AdminUser, type Role,
} from "@/hooks/useRBAC";

const ROLE_OPTIONS: Role[] = ["super_admin", "admin", "editor", "receptionist", "viewer", "doctor"];

const PERMISSION_GROUPS = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.group)));

interface UserFormData {
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatar: string;
}

const EMPTY_FORM: UserFormData = {
  name: "",
  email: "",
  role: "viewer",
  isActive: true,
  avatar: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [session] = useState(getSession());
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("super_admin");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const loadUsers = useCallback(() => {
    setUsers(getUsers());
  }, []);

  useEffect(() => {
    loadUsers();
    const handler = () => loadUsers();
    window.addEventListener("rbac-update", handler);
    return () => window.removeEventListener("rbac-update", handler);
  }, [loadUsers]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, isActive: user.isActive, avatar: user.avatar });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }
    if (editingUser) {
      updateUser(editingUser.id, formData);
      showToast("تم تحديث بيانات المستخدم بنجاح");
    } else {
      createUser(formData);
      showToast("تم إنشاء الحساب بنجاح");
    }
    setShowModal(false);
    loadUsers();
  };

  const handleDelete = (id: string) => {
    if (id === session?.userId) {
      showToast("لا يمكنك حذف حسابك الخاص", "error");
      return;
    }
    deleteUser(id);
    setDeleteConfirm(null);
    showToast("تم حذف المستخدم");
    loadUsers();
  };

  const toggleActive = (user: AdminUser) => {
    if (user.id === session?.userId) {
      showToast("لا يمكنك تعطيل حسابك الخاص", "error");
      return;
    }
    updateUser(user.id, { isActive: !user.isActive });
    loadUsers();
    showToast(user.isActive ? "تم تعطيل الحساب" : "تم تفعيل الحساب");
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.includes(searchQuery) || u.email.includes(searchQuery);
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleDef = ROLE_DEFINITIONS[selectedRole];
  const rolePerms = new Set(roleDef.permissions);
  const groupedPerms = PERMISSION_GROUPS.map((group) => ({
    group,
    permissions: ALL_PERMISSIONS.filter((p) => p.group === group),
  }));

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    superAdmins: users.filter((u) => u.role === "super_admin").length,
    editors: users.filter((u) => u.role === "editor").length,
    doctors: users.filter((u) => u.role === "doctor").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
            toast.type === "success" ? "bg-[#2E4E45] text-white" : "bg-red-500 text-white"
          }`}>
            <i className={toast.type === "success" ? "ri-check-double-line" : "ri-error-warning-line"} />
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة المستخدمين والصلاحيات</h2>
            <p className="text-sm text-gray-500 mt-1">تحكم في حسابات الفريق وأدوارهم وصلاحياتهم</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-user-add-line" />
            إضافة مستخدم جديد
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
                    { label: "إجمالي المستخدمين", value: stats.total,       icon: "ri-team-line",            color: "text-[#2E4E45] bg-[#2E4E45]/10" },
            { label: "حسابات نشطة",       value: stats.active,      icon: "ri-user-follow-line",     color: "text-emerald-600 bg-emerald-50" },
            { label: "مديرو النظام",       value: stats.superAdmins, icon: "ri-shield-star-line",     color: "text-red-600 bg-red-50" },
            { label: "أطباء المدونة",      value: stats.doctors,     icon: "ri-stethoscope-line",     color: "text-teal-600 bg-teal-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <i className={`${s.icon} text-lg`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { id: "users", label: "المستخدمون", icon: "ri-team-line" },
            { id: "roles", label: "الأدوار والصلاحيات", icon: "ri-shield-keyhole-line" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "users" | "roles")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id ? "bg-white text-[#2E4E45] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
              <div className="relative flex-1 min-w-48">
                <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو البريد..."
                  className="w-full pr-9 pl-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as Role | "all")}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
              >
                <option value="all">جميع الأدوار</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{ROLE_DEFINITIONS[r].label}</option>
                ))}
              </select>
              <span className="text-xs text-gray-400">{filteredUsers.length} مستخدم</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-50 bg-gray-50/50">
                    <th className="text-right py-3 px-4 font-medium">المستخدم</th>
                    <th className="text-right py-3 px-4 font-medium">الدور</th>
                    <th className="text-right py-3 px-4 font-medium">الحالة</th>
                    <th className="text-right py-3 px-4 font-medium">آخر دخول</th>
                    <th className="text-right py-3 px-4 font-medium">تاريخ الإنشاء</th>
                    <th className="text-right py-3 px-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const role = ROLE_DEFINITIONS[user.role];
                    const isCurrentUser = user.id === session?.userId;
                    return (
                      <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                              />
                              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.isActive ? "bg-emerald-400" : "bg-gray-300"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                {user.name}
                                {isCurrentUser && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2E4E45]/10 text-[#2E4E45] font-medium">أنت</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${role.color}`}>
                            <i className={`${role.icon} text-xs`} />
                            {role.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleActive(user)}
                            className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${user.isActive ? "bg-emerald-400" : "bg-gray-200"}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${user.isActive ? "right-0.5" : "left-0.5"}`} />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-gray-500">{user.lastLogin}</td>
                        <td className="py-3.5 px-4 text-sm text-gray-400">{user.createdAt}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(user)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                              title="تعديل"
                            >
                              <i className="ri-edit-line text-sm" />
                            </button>
                            {!isCurrentUser && (
                              <button
                                onClick={() => setDeleteConfirm(user.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                title="حذف"
                              >
                                <i className="ri-delete-bin-line text-sm" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ROLES TAB ── */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Role selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">الأدوار المتاحة</p>
                </div>
                {ROLE_OPTIONS.map((role) => {
                  const def = ROLE_DEFINITIONS[role];
                  const count = users.filter((u) => u.role === role).length;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-right px-4 py-3.5 flex items-center gap-3 transition-all border-b border-gray-50 last:border-0 cursor-pointer ${
                        selectedRole === role
                          ? "bg-[#2E4E45]/5 border-r-2 border-r-[#2E4E45]"
                          : "hover:bg-gray-50/70"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${def.color}`}>
                        <i className={`${def.icon} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm font-semibold text-gray-800">{def.label}</p>
                        <p className="text-xs text-gray-400">{count} مستخدم</p>
                      </div>
                      {selectedRole === role && <i className="ri-arrow-left-s-line text-[#2E4E45]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permissions detail */}
            <div className="lg:col-span-2 space-y-4">
              {/* Role header */}
              <div className={`flex items-center gap-4 p-5 rounded-xl border ${roleDef.color}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${roleDef.color}`}>
                  <i className={`${roleDef.icon} text-xl`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800">{roleDef.label}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{roleDef.description}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-800">{roleDef.permissions.length}</p>
                  <p className="text-xs text-gray-400">صلاحية</p>
                </div>
              </div>

              {/* Permissions by group */}
              {groupedPerms.map(({ group, permissions }) => {
                const groupActive = permissions.filter((p) => rolePerms.has(p.key)).length;
                return (
                  <div key={group} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-700">{group}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        groupActive === permissions.length
                          ? "bg-emerald-50 text-emerald-600"
                          : groupActive === 0
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {groupActive}/{permissions.length}
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map((perm) => {
                        const active = rolePerms.has(perm.key);
                        return (
                          <div
                            key={perm.key}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              active
                                ? "border-emerald-100 bg-emerald-50/50"
                                : "border-gray-100 bg-gray-50/30 opacity-60"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                            }`}>
                              <i className={`${active ? "ri-check-line" : "ri-close-line"} text-xs`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-700">{perm.label}</p>
                              <p className="text-xs text-gray-400 truncate">{perm.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CREATE/EDIT MODAL ── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-800">
                  {editingUser ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
                </h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <i className="ri-close-line" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Avatar preview */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <i className="ri-user-line text-2xl text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">رابط الصورة الشخصية</label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData((p) => ({ ...p, avatar: e.target.value }))}
                      placeholder="https://..."
                      dir="ltr"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      الاسم الكامل <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="اسم المستخدم"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      البريد الإلكتروني <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="user@clinic.com"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدور والصلاحيات</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((role) => {
                      const def = ROLE_DEFINITIONS[role];
                      return (
                        <button
                          key={role}
                          onClick={() => setFormData((p) => ({ ...p, role }))}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-right ${
                            formData.role === role
                              ? `border-current ${def.color}`
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${def.color}`}>
                            <i className={`${def.icon} text-sm`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800">{def.label}</p>
                            <p className="text-xs text-gray-400 truncate">{def.permissions.length} صلاحية</p>
                          </div>
                          {formData.role === role && (
                            <i className="ri-check-line mr-auto text-current text-sm" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Role description */}
                <div className={`flex items-start gap-3 p-3 rounded-xl border ${ROLE_DEFINITIONS[formData.role].color}`}>
                  <i className={`${ROLE_DEFINITIONS[formData.role].icon} text-lg mt-0.5`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{ROLE_DEFINITIONS[formData.role].label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ROLE_DEFINITIONS[formData.role].description}</p>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">حالة الحساب</p>
                    <p className="text-xs text-gray-400">تفعيل أو تعطيل وصول المستخدم</p>
                  </div>
                  <button
                    onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
                    className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${formData.isActive ? "bg-emerald-400" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${formData.isActive ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                {formData.role === "doctor" && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100">
                    <i className="ri-stethoscope-line text-teal-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-teal-700 mb-0.5">صلاحيات دور الطبيب</p>
                      <p className="text-xs text-teal-600">
                        يستطيع الطبيب كتابة مقالات طبية في المدونة ونشرها وتعديلها، بالإضافة لرؤية الحجوزات والجدول الزمني.
                      </p>
                    </div>
                  </div>
                )}

                {!editingUser && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <i className="ri-information-line text-amber-500 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      كلمة المرور الافتراضية: <span className="font-mono font-bold">[اسم المستخدم]123</span> — يجب تغييرها عند أول دخول
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {editingUser ? "حفظ التغييرات" : "إنشاء الحساب"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM ── */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-500 text-2xl" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-gray-500 mb-6">هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
                >
                  حذف نهائياً
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
