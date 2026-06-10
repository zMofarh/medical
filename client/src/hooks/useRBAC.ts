// ─── Role-Based Access Control (RBAC) System ─────────────────────────────────

export type Role = "super_admin" | "admin" | "editor" | "receptionist" | "viewer" | "doctor";

export interface Permission {
  key: string;
  label: string;
  description: string;
  group: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  permissions?: string[]; // custom overrides
}

// ─── All available permissions ────────────────────────────────────────────────
export const ALL_PERMISSIONS: Permission[] = [
  // Dashboard
  { key: "dashboard.view",       label: "عرض لوحة التحكم",       description: "الوصول للإحصائيات والرسوم البيانية",  group: "لوحة التحكم" },
  // Bookings
  { key: "bookings.view",        label: "عرض الحجوزات",           description: "رؤية قائمة الحجوزات",                group: "الحجوزات" },
  { key: "bookings.create",      label: "إنشاء حجز",              description: "إضافة حجوزات جديدة",                 group: "الحجوزات" },
  { key: "bookings.edit",        label: "تعديل الحجوزات",         description: "تعديل بيانات الحجوزات",              group: "الحجوزات" },
  { key: "bookings.delete",      label: "حذف الحجوزات",           description: "حذف الحجوزات",                       group: "الحجوزات" },
  { key: "bookings.confirm",     label: "تأكيد الحجوزات",         description: "تغيير حالة الحجز",                   group: "الحجوزات" },
  // Services
  { key: "services.view",        label: "عرض الخدمات",            description: "رؤية قائمة الخدمات",                 group: "الخدمات" },
  { key: "services.edit",        label: "تعديل الخدمات",          description: "إضافة وتعديل الخدمات",               group: "الخدمات" },
  { key: "services.delete",      label: "حذف الخدمات",            description: "حذف الخدمات",                        group: "الخدمات" },
  // Doctors
  { key: "doctors.view",         label: "عرض الأطباء",            description: "رؤية قائمة الأطباء",                 group: "الأطباء" },
  { key: "doctors.edit",         label: "تعديل الأطباء",          description: "إضافة وتعديل بيانات الأطباء",        group: "الأطباء" },
  { key: "doctors.delete",       label: "حذف الأطباء",            description: "حذف الأطباء",                        group: "الأطباء" },
  // Packages
  { key: "packages.view",        label: "عرض الباقات",            description: "رؤية قائمة الباقات",                 group: "الباقات" },
  { key: "packages.edit",        label: "تعديل الباقات",          description: "إضافة وتعديل الباقات",               group: "الباقات" },
  { key: "packages.delete",      label: "حذف الباقات",            description: "حذف الباقات",                        group: "الباقات" },
  // Blog
  { key: "blog.view",            label: "عرض المدونة",            description: "رؤية المقالات",                      group: "المدونة" },
  { key: "blog.create",          label: "كتابة مقالات",           description: "إنشاء مقالات جديدة",                 group: "المدونة" },
  { key: "blog.edit",            label: "تعديل المقالات",         description: "تعديل المقالات الموجودة",            group: "المدونة" },
  { key: "blog.delete",          label: "حذف المقالات",           description: "حذف المقالات",                       group: "المدونة" },
  { key: "blog.publish",         label: "نشر المقالات",           description: "تغيير حالة النشر",                   group: "المدونة" },
  // Messages
  { key: "messages.view",        label: "عرض الرسائل",            description: "رؤية رسائل التواصل",                 group: "الرسائل" },
  { key: "messages.reply",       label: "الرد على الرسائل",       description: "إرسال ردود على الرسائل",             group: "الرسائل" },
  { key: "messages.delete",      label: "حذف الرسائل",            description: "حذف الرسائل",                        group: "الرسائل" },
  // CMS
  { key: "cms.view",             label: "عرض إدارة المحتوى",      description: "الوصول لصفحات CMS",                  group: "إدارة المحتوى" },
  { key: "cms.edit",             label: "تعديل المحتوى",          description: "تعديل محتوى الصفحات",                group: "إدارة المحتوى" },
  { key: "cms.settings",         label: "إعدادات العيادة",        description: "تعديل إعدادات العيادة",              group: "إدارة المحتوى" },
  // Settings
  { key: "settings.view",        label: "عرض الإعدادات",          description: "رؤية إعدادات الموقع",                group: "الإعدادات" },
  { key: "settings.edit",        label: "تعديل الإعدادات",        description: "تعديل إعدادات الموقع",               group: "الإعدادات" },
  // Users
  { key: "users.view",           label: "عرض المستخدمين",         description: "رؤية قائمة المستخدمين",              group: "المستخدمون" },
  { key: "users.create",         label: "إضافة مستخدمين",         description: "إنشاء حسابات جديدة",                 group: "المستخدمون" },
  { key: "users.edit",           label: "تعديل المستخدمين",       description: "تعديل بيانات المستخدمين",            group: "المستخدمون" },
  { key: "users.delete",         label: "حذف المستخدمين",         description: "حذف الحسابات",                       group: "المستخدمون" },
  { key: "users.roles",          label: "إدارة الأدوار",          description: "تغيير أدوار المستخدمين",             group: "المستخدمون" },
];

// ─── Role definitions with default permissions ────────────────────────────────
export const ROLE_DEFINITIONS: Record<Role, { label: string; description: string; color: string; icon: string; permissions: string[] }> = {
  super_admin: {
    label: "مدير النظام",
    description: "صلاحيات كاملة وغير محدودة على جميع أقسام النظام",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: "ri-shield-star-line",
    permissions: ALL_PERMISSIONS.map((p) => p.key), // all permissions
  },
  admin: {
    label: "مدير",
    description: "صلاحيات واسعة باستثناء إدارة المستخدمين والأدوار",
    color: "text-[#2E4E45] bg-[#2E4E45]/10 border-[#2E4E45]/20",
    icon: "ri-admin-line",
    permissions: ALL_PERMISSIONS.filter((p) => !p.key.startsWith("users.roles") && !p.key.startsWith("users.delete")).map((p) => p.key),
  },
  editor: {
    label: "محرر محتوى",
    description: "تعديل المحتوى والمدونة والأسئلة الشائعة",
    color: "text-violet-600 bg-violet-50 border-violet-200",
    icon: "ri-edit-2-line",
    permissions: [
      "dashboard.view",
      "blog.view", "blog.create", "blog.edit", "blog.publish",
      "cms.view", "cms.edit",
      "messages.view",
    ],
  },
  receptionist: {
    label: "موظف استقبال",
    description: "إدارة الحجوزات والرسائل والتواصل مع المرضى",
    color: "text-[#C8A96E] bg-amber-50 border-amber-200",
    icon: "ri-customer-service-2-line",
    permissions: [
      "dashboard.view",
      "bookings.view", "bookings.create", "bookings.edit", "bookings.confirm",
      "messages.view", "messages.reply",
      "doctors.view",
      "services.view",
      "packages.view",
    ],
  },
  viewer: {
    label: "مشاهد",
    description: "صلاحية العرض فقط بدون أي تعديلات",
    color: "text-gray-600 bg-gray-100 border-gray-200",
    icon: "ri-eye-line",
    permissions: [
      "dashboard.view",
      "bookings.view",
      "services.view",
      "doctors.view",
      "packages.view",
      "blog.view",
      "messages.view",
    ],
  },
  doctor: {
    label: "طبيب",
    description: "يستطيع كتابة وتعديل مقالاته في المدونة ورؤية جدوله وحجوزاته",
    color: "text-teal-600 bg-teal-50 border-teal-200",
    icon: "ri-stethoscope-line",
    permissions: [
      "dashboard.view",
      "blog.view",
      "blog.create",
      "blog.edit",
      "blog.publish",
      "bookings.view",
      "doctors.view",
      "services.view",
      "packages.view",
    ],
  },
};

// ─── Mock users store ─────────────────────────────────────────────────────────
const USERS_KEY = "cms_admin_users";
const SESSION_KEY = "admin_session";

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "u-001",
    name: "مدير النظام",
    email: "admin@clinic.com",
    role: "super_admin",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20business%20man%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=100&height=100&seq=admin1&orientation=squarish",
    isActive: true,
    lastLogin: "2026-04-24 08:30",
    createdAt: "2024-01-01",
  },
  {
    id: "u-002",
    name: "سارة المنصور",
    email: "sara@clinic.com",
    role: "admin",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20woman%20business%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style%20hijab&width=100&height=100&seq=admin2&orientation=squarish",
    isActive: true,
    lastLogin: "2026-04-23 14:20",
    createdAt: "2024-03-15",
  },
  {
    id: "u-003",
    name: "خالد العتيبي",
    email: "khaled@clinic.com",
    role: "editor",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20young%20man%20portrait%20headshot%20neutral%20background%20friendly%20smile%20clean%20modern%20style&width=100&height=100&seq=admin3&orientation=squarish",
    isActive: true,
    lastLogin: "2026-04-22 10:15",
    createdAt: "2024-06-01",
  },
  {
    id: "u-004",
    name: "نورة الشمري",
    email: "noura@clinic.com",
    role: "receptionist",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20woman%20receptionist%20portrait%20headshot%20neutral%20background%20warm%20smile%20clean%20modern%20style&width=100&height=100&seq=admin4&orientation=squarish",
    isActive: true,
    lastLogin: "2026-04-24 07:45",
    createdAt: "2024-09-10",
  },
  {
    id: "u-005",
    name: "فهد الدوسري",
    email: "fahad@clinic.com",
    role: "viewer",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20man%20portrait%20headshot%20neutral%20background%20calm%20expression%20clean%20modern%20style&width=100&height=100&seq=admin5&orientation=squarish",
    isActive: false,
    lastLogin: "2026-03-10 16:00",
    createdAt: "2025-01-20",
  },
  {
    id: "u-006",
    name: "د. أحمد الزهراني",
    email: "dr.ahmed@clinic.com",
    role: "doctor",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20male%20doctor%20portrait%20headshot%20white%20coat%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=100&height=100&seq=admin6&orientation=squarish",
    isActive: true,
    lastLogin: "2026-04-23 09:00",
    createdAt: "2025-02-10",
  },
  {
    id: "u-007",
    name: "د. ليلى القحطاني",
    email: "dr.layla@clinic.com",
    role: "doctor",
    avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20female%20doctor%20portrait%20headshot%20white%20coat%20neutral%20background%20warm%20smile%20clean%20modern%20style%20hijab&width=100&height=100&seq=admin7&orientation=squarish",
    isActive: true,
    lastLogin: "2026-04-24 11:30",
    createdAt: "2025-03-05",
  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────
function readUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return DEFAULT_USERS;
    return JSON.parse(raw) as AdminUser[];
  } catch { return DEFAULT_USERS; }
}

function writeUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent("rbac-update"));
  } catch { /* silent */ }
}

// ─── Session helpers ──────────────────────────────────────────────────────────
export interface AdminSession {
  userId: string;
  email: string;
  role: Role;
  name: string;
  avatar: string;
  loginAt: string;
}

export function getSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch { return null; }
}

export function setSession(user: AdminUser): void {
  const session: AdminSession = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // keep backward compat
  localStorage.setItem("admin_token", `token_${user.id}`);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("admin_token");
  localStorage.removeItem("access_token");
}

// ─── Permission checker ───────────────────────────────────────────────────────
export function hasPermission(session: AdminSession | null, permission: string): boolean {
  if (!session) return false;
  const roleDef = ROLE_DEFINITIONS[session.role];
  if (!roleDef) return false;
  return roleDef.permissions.includes(permission);
}

// ─── Auth functions ───────────────────────────────────────────────────────────
export function loginUser(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, error: "البريد الإلكتروني غير مسجل" };
  if (!user.isActive) return { success: false, error: "هذا الحساب معطّل. تواصل مع مدير النظام" };

  // Mock password check: password = "admin123" for all users in demo
  const validPasswords: Record<string, string> = {
    "admin@clinic.com":      "admin123",
    "sara@clinic.com":       "sara123",
    "khaled@clinic.com":     "khaled123",
    "noura@clinic.com":      "noura123",
    "fahad@clinic.com":      "fahad123",
    "dr.ahmed@clinic.com":   "ahmed123",
    "dr.layla@clinic.com":   "layla123",
  };
  if (validPasswords[email] !== password) {
    return { success: false, error: "كلمة المرور غير صحيحة" };
  }

  // Update last login
  const updated = users.map((u) =>
    u.id === user.id ? { ...u, lastLogin: new Date().toLocaleString("ar-SA") } : u
  );
  writeUsers(updated);
  setSession(user);
  return { success: true, user };
}

// ─── CRUD for users ───────────────────────────────────────────────────────────
export function getUsers(): AdminUser[] {
  return readUsers();
}

export function createUser(data: Omit<AdminUser, "id" | "createdAt" | "lastLogin">): AdminUser {
  const users = readUsers();
  const newUser: AdminUser = {
    ...data,
    id: `u-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    lastLogin: "—",
  };
  writeUsers([...users, newUser]);
  return newUser;
}

export function updateUser(id: string, data: Partial<AdminUser>): void {
  const users = readUsers();
  writeUsers(users.map((u) => (u.id === id ? { ...u, ...data } : u)));
}

export function deleteUser(id: string): void {
  const users = readUsers();
  writeUsers(users.filter((u) => u.id !== id));
}
