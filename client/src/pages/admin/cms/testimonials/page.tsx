import { useState } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import TestimonialCard from "./components/TestimonialCard";
import TestimonialEditor from "./components/TestimonialEditor";
import TestimonialsSettings from "./components/TestimonialsSettings";
import { useCMSTestimonials } from "@/hooks/useCMSTestimonials";

interface Testimonial {
  id: string;
  name: string;
  specialty: string;
  text: string;
  rating: number;
  image: string;
  date: string;
  service: string;
  verified: boolean;
  published: boolean;
  featured: boolean;
}

type ActiveView = "list" | "settings";

const filterOptions = [
  { id: "all", label: "الكل" },
  { id: "published", label: "منشور" },
  { id: "hidden", label: "مخفي" },
  { id: "featured", label: "مميز" },
  { id: "verified", label: "موثق" },
];

export default function AdminCMSTestimonials() {
  const {
    testimonials: cmsTestimonials,
    config,
    saveStatus: hookSaveStatus,
    updateTestimonials,
    updateConfig,
    save,
  } = useCMSTestimonials();

  const [testimonials, syncTestimonialsLocal] = useState<Testimonial[]>(cmsTestimonials);
  const [selectedId, setSelectedId] = useState<string | null>(cmsTestimonials[0]?.id ?? null);
  const [activeView, setActiveView] = useState<ActiveView>("list");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const selected = testimonials.find((t) => t.id === selectedId) ?? null;

  const syncTestimonials = (data: Testimonial[] | ((prev: Testimonial[]) => Testimonial[])) => {
    const next = typeof data === "function" ? data(testimonials) : data;
    syncTestimonialsLocal(next);
    updateTestimonials(next);
  };

  const filtered = testimonials.filter((t) => {
    const matchSearch = t.name.includes(search) || t.text.includes(search) || t.service.includes(search);
    if (!matchSearch) return false;
    if (filter === "published") return t.published;
    if (filter === "hidden") return !t.published;
    if (filter === "featured") return t.featured;
    if (filter === "verified") return t.verified;
    return true;
  });

  const updateTestimonial = (updated: Testimonial) => {
    syncTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const togglePublish = (id: string) => {
    syncTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, published: !t.published } : t)));
  };

  const toggleFeatured = (id: string) => {
    syncTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)));
  };

  const deleteTestimonial = (id: string) => {
    syncTestimonials((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
    setShowDeleteConfirm(null);
  };

  const addTestimonial = () => {
    const newId = `t-${Date.now()}`;
    const newT: Testimonial = {
      id: newId,
      name: "مريض جديد",
      specialty: "مريض — الخدمة",
      text: "اكتب نص التقييم هنا...",
      rating: 5,
      image: "https://readdy.ai/api/search-image?query=arab%20professional%20person%20portrait%20confident%20friendly%20smile%20clean%20white%20background%20business%20casual%20attire&width=100&height=100&seq=test-new1&orientation=squarish",
      date: "أبريل 2026",
      service: "منصة الطب الدقيق",
      verified: false,
      published: false,
      featured: false,
    };
    syncTestimonials((prev) => [newT, ...prev]);
    setSelectedId(newId);
    setActiveView("list");
  };

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 800);
  };

  const publishedCount = testimonials.filter((t) => t.published).length;
  const featuredCount = testimonials.filter((t) => t.featured).length;
  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : "0";

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة التقييمات والشهادات</h2>
            <p className="text-sm text-gray-500 mt-1">تعديل نصوص التقييمات، أسماء المرضى، والتحكم في النشر</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <i className="ri-external-link-line" />
              معاينة الموقع
            </a>
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {saveStatus === "saving" ? (
                <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
              ) : saveStatus === "saved" ? (
                <><i className="ri-check-double-line" /> تم الحفظ!</>
              ) : (
                <><i className="ri-save-line" /> حفظ التغييرات</>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "إجمالي التقييمات", value: testimonials.length, icon: "ri-chat-quote-line", color: "text-[#2E4E45] bg-[#2E4E45]/10" },
            { label: "منشور", value: publishedCount, icon: "ri-eye-line", color: "text-emerald-600 bg-emerald-50" },
            { label: "مميز", value: featuredCount, icon: "ri-star-fill", color: "text-[#C8A96E] bg-amber-50" },
            { label: "متوسط التقييم", value: avgRating, icon: "ri-star-half-line", color: "text-violet-600 bg-violet-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <i className={`${stat.icon} text-lg`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveView("list")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeView === "list" ? "bg-white text-[#2E4E45] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <i className="ri-list-check ml-1.5" />
              إدارة التقييمات
            </button>
            <button
              onClick={() => setActiveView("settings")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeView === "settings" ? "bg-white text-[#2E4E45] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <i className="ri-settings-3-line ml-1.5" />
              إعدادات القسم
            </button>
          </div>
          {activeView === "list" && (
            <button
              onClick={addTestimonial}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A96E] text-white text-sm font-medium hover:bg-[#b8996e] transition-colors whitespace-nowrap cursor-pointer mr-auto"
            >
              <i className="ri-add-line" />
              إضافة تقييم
            </button>
          )}
        </div>

        {/* Settings view */}
        {activeView === "settings" && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <TestimonialsSettings />
          </div>
        )}

        {/* List view */}
        {activeView === "list" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search & filter */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="relative">
                  <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="بحث في التقييمات..."
                    className="w-full pr-9 pl-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFilter(opt.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        filter === opt.id
                          ? "bg-[#2E4E45] text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                      {opt.id === "all" && <span className="mr-1 opacity-70">({testimonials.length})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <i className="ri-chat-quote-line text-3xl text-gray-200 mb-2 block" />
                    <p className="text-sm text-gray-400">لا توجد تقييمات مطابقة</p>
                  </div>
                ) : (
                  filtered.map((t) => (
                    <TestimonialCard
                      key={t.id}
                      testimonial={t}
                      isSelected={selectedId === t.id}
                      onSelect={() => setSelectedId(t.id)}
                      onTogglePublish={() => togglePublish(t.id)}
                      onToggleFeatured={() => toggleFeatured(t.id)}
                      onDelete={() => setShowDeleteConfirm(t.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right: editor */}
            <div className="lg:col-span-3">
              {selected ? (
                <div className="bg-white rounded-xl border border-gray-100 sticky top-24">
                  {/* Editor header */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="w-9 h-9 rounded-full object-cover object-top border-2 border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{selected.name}</p>
                      <p className="text-xs text-gray-400 truncate">{selected.specialty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${selected.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {selected.published ? "منشور" : "مخفي"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <TestimonialEditor
                      testimonial={selected}
                      onChange={updateTestimonial}
                    />
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <button
                      onClick={() => setShowDeleteConfirm(selected.id)}
                      className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <i className="ri-delete-bin-line" />
                      حذف التقييم
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-save-line" />
                      حفظ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-chat-quote-line text-2xl text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">اختر تقييماً من القائمة لتعديله</p>
                  <p className="text-gray-400 text-xs">أو أضف تقييماً جديداً</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete confirm modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-500 text-xl" />
              </div>
              <h3 className="text-base font-bold text-gray-800 text-center mb-2">حذف التقييم</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => deleteTestimonial(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
