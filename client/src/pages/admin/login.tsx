import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getSession, ROLE_DEFINITIONS, setSession } from "@/hooks/useRBAC";
import { login, getCurrentUser } from "@/api/auth";

const DEMO_ACCOUNTS = [
  { email: "admin@clinic.com",  password: "admin123",   role: "super_admin"  as const },
  { email: "sara@clinic.com",   password: "sara123",    role: "admin"        as const },
  { email: "khaled@clinic.com", password: "khaled123",  role: "editor"       as const },
  { email: "noura@clinic.com",  password: "noura123",   role: "receptionist" as const },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.classList.add("admin-page");
    // If already logged in, redirect
    const session = getSession();
    if (session) navigate("/admin");
    return () => document.body.classList.remove("admin-page");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tokenData = await login({ username: email, password });
      const user = await getCurrentUser(tokenData.access_token);
      
      const adminUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || "",
        isActive: user.is_active,
        lastLogin: user.last_login || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      setSession(adminUser);
      localStorage.setItem("access_token", tokenData.access_token);
      
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowDemoAccounts(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#EEF2F0] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#2E4E45] flex items-center justify-center mx-auto mb-4">
            <i className="ri-hospital-line text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-[#2E4E45] mb-1">لوحة تحكم العيادة</h1>
          <p className="text-sm text-gray-500">تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <i className="ri-error-warning-line" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-mail-line" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@clinic.com"
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-lock-line" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-10 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <><i className="ri-loader-4-line animate-spin" /> جاري التحقق...</>
              ) : (
                <><i className="ri-login-box-line" /> تسجيل الدخول</>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <i className="ri-user-settings-line" />
                حسابات تجريبية للاختبار
              </span>
              <i className={`text-xs transition-transform ${showDemoAccounts ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
            </button>

            {showDemoAccounts && (
              <div className="mt-3 space-y-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const def = ROLE_DEFINITIONS[acc.role];
                  return (
                    <button
                      key={acc.email}
                      onClick={() => fillDemo(acc)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#2E4E45]/20 hover:bg-[#2E4E45]/5 transition-all cursor-pointer text-right"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${def.color}`}>
                        <i className={`${def.icon} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700">{def.label}</p>
                        <p className="text-xs text-gray-400 font-mono">{acc.email}</p>
                      </div>
                      <i className="ri-arrow-left-line text-gray-300 text-sm" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            className="text-sm text-[#2E4E45] hover:text-[#C8A96E] transition-colors inline-flex items-center gap-1"
          >
            <i className="ri-arrow-right-line" />
            العودة إلى الموقع
          </a>
        </div>
      </div>
    </div>
  );
}
