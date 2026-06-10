import { useState, useMemo } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import { useCMSFAQ } from "@/hooks/useCMSFAQ";
import { type FAQItem, type FAQCategory } from "@/mocks/faqData";

type ActiveView = "faqs" | "categories";

const iconOptions = [
  "ri-question-line", "ri-calendar-line", "ri-price-tag-3-line", "ri-stethoscope-line",
  "ri-user-line", "ri-heart-pulse-line", "ri-dna-line", "ri-global-line",
  "ri-shield-line", "ri-file-list-line", "ri-phone-line", "ri-mail-line",
  "ri-hospital-line", "ri-capsule-line", "ri-brain-line", "ri-leaf-line",
];

export default function AdminCMSFAQ() {
  const faq = useCMSFAQ();
  const [activeView, setActiveView] = useState<ActiveView>("faqs");
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Category management
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("ri-question-line");
  const [editingCat, setEditingCat] = useState<FAQCategory | null>(null);
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return faq.faqs.filter((f) => {
      const matchCat = filterCategory === "all" || f.category === filterCategory;
      const matchSearch = !searchQuery || f.question.includes(searchQuery) || f.answer.includes(searchQuery);
      return matchCat && matchSearch;
    }).sort((a, b) => a.order - b.order);
  }, [faq.faqs, filterCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: faq.faqs.length,
    categories: faq.categories.length,
    byCat: faq.categories.map((c) => ({
      ...c,
      count: faq.faqs.filter((f) => f.category === c.id).length,
    })),
  }), [faq.faqs, faq.categories]);

  // ── FAQ handlers ──────────────────────────────────────────────────────────
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      category: faq.categories[0]?.id || "general",
      question: "سؤال جديد",
      answer: "الإجابة هنا...",
      order: faq.faqs.length + 1,
    };
    faq.updateFaqs([...faq.faqs, newFaq]);
    setEditingFaq(newFaq);
    setExpandedId(newFaq.id);
  };

  const handleUpdateFaq = (updated: FAQItem) => {
    faq.updateFaqs(faq.faqs.map((f) => (f.id === updated.id ? updated : f)));
    if (editingFaq?.id === updated.id) setEditingFaq(updated);
  };

  const handleDeleteFaq = (id: string) => {
    faq.updateFaqs(faq.faqs.filter((f) => f.id !== id));
    setDeleteConfirm(null);
    if (editingFaq?.id === id) setEditingFaq(null);
  };

  const handleMoveUp = (id: string) => {
    const arr = [...faq.faqs].sort((a, b) => a.order - b.order);
    const idx = arr.findIndex((f) => f.id === id);
    if (idx <= 0) return;
    const newArr = arr.map((f, i) => {
      if (i === idx) return { ...f, order: arr[idx - 1].order };
      if (i === idx - 1) return { ...f, order: arr[idx].order };
      return f;
    });
    faq.updateFaqs(newArr);
  };

  const handleMoveDown = (id: string) => {
    const arr = [...faq.faqs].sort((a, b) => a.order - b.order);
    const idx = arr.findIndex((f) => f.id === id);
    if (idx >= arr.length - 1) return;
    const newArr = arr.map((f, i) => {
      if (i === idx) return { ...f, order: arr[idx + 1].order };
      if (i === idx + 1) return { ...f, order: arr[idx].order };
      return f;
    });
    faq.updateFaqs(newArr);
  };

  // ── Category handlers ─────────────────────────────────────────────────────
  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const newCat: FAQCategory = {
      id: `cat-${Date.now()}`,
      label: newCatLabel.trim(),
      icon: newCatIcon,
    };
    faq.updateCategories([...faq.categories, newCat]);
    setNewCatLabel("");
    setNewCatIcon("ri-question-line");
  };

  const handleUpdateCategory = (cat: FAQCategory) => {
    faq.updateCategories(faq.categories.map((c) => (c.id === cat.id ? cat : c)));
    setEditingCat(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto" dir="rtl">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2E4E45]">إدارة الأسئلة الشائعة</h2>
            <p className="text-sm text-gray-400 mt-0.5">تحرير الأسئلة والأجوبة والتصنيفات</p>
          </div>
          <div className="flex items-center gap-2">
            {faq.hasChanges && (
              <button
                onClick={() => faq.save(faq.faqs, faq.categories)}
                disabled={faq.saveStatus === "saving"}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap
                  ${faq.saveStatus === "saved" ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90"}`}
              >
                {faq.saveStatus === "saving" ? (
                  <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
                ) : faq.saveStatus === "saved" ? (
                  <><i className="ri-check-line" /> تم الحفظ!</>
                ) : (
                  <><i className="ri-save-line" /> حفظ التغييرات</>
                )}
              </button>
            )}
            <a
              href="/faq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line" />
              معاينة FAQ
            </a>
            {activeView === "faqs" && (
              <button
                onClick={handleAddFaq}
                className="flex items-center gap-2 px-4 py-2 bg-[#C8A96E] text-white text-sm font-bold rounded-lg hover:bg-[#b8995e] transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" />
                سؤال جديد
              </button>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="w-8 h-8 flex items-center justify-center bg-[#2E4E45]/8 rounded-lg mb-2">
              <i className="ri-question-answer-line text-[#2E4E45] text-sm" />
            </div>
            <p className="text-2xl font-black text-[#2E4E45]">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-0.5">إجمالي الأسئلة</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="w-8 h-8 flex items-center justify-center bg-[#C8A96E]/10 rounded-lg mb-2">
              <i className="ri-folders-line text-[#C8A96E] text-sm" />
            </div>
            <p className="text-2xl font-black text-[#C8A96E]">{stats.categories}</p>
            <p className="text-xs text-gray-400 mt-0.5">التصنيفات</p>
          </div>
          {stats.byCat.slice(0, 2).map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mb-2">
                <i className={`${cat.icon} text-gray-500 text-sm`} />
              </div>
              <p className="text-2xl font-black text-gray-700">{cat.count}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.label}</p>
            </div>
          ))}
        </div>

        {/* ── View Toggle ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
          <button
            onClick={() => setActiveView("faqs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
              ${activeView === "faqs" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <i className="ri-question-answer-line text-sm" />
            الأسئلة ({faq.faqs.length})
          </button>
          <button
            onClick={() => setActiveView("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
              ${activeView === "categories" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <i className="ri-folders-line text-sm" />
            التصنيفات ({faq.categories.length})
          </button>
        </div>

        {/* ══════════════════════════════════════════
            FAQS VIEW
        ══════════════════════════════════════════ */}
        {activeView === "faqs" && (
          <div className="flex gap-5">

            {/* Sidebar: Category Filter */}
            <div className="w-48 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-20">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">التصنيفات</p>
                </div>
                <nav className="p-2 space-y-0.5">
                  <button
                    onClick={() => setFilterCategory("all")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                      ${filterCategory === "all" ? "bg-[#2E4E45] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span>الكل</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterCategory === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {faq.faqs.length}
                    </span>
                  </button>
                  {faq.categories.map((cat) => {
                    const count = faq.faqs.filter((f) => f.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                          ${filterCategory === cat.id ? "bg-[#2E4E45] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className={`${cat.icon} text-xs`} />
                          </div>
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${filterCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main: FAQ List */}
            <div className="flex-1 min-w-0">
              {/* Search */}
              <div className="relative mb-4">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-gray-400 text-sm" />
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الأسئلة والأجوبة..."
                  className="w-full bg-white border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>

              {/* FAQ Accordion List */}
              {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
                    <i className="ri-question-answer-line text-gray-400 text-2xl" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">لا توجد أسئلة تطابق البحث</p>
                  <button
                    onClick={handleAddFaq}
                    className="px-4 py-2 bg-[#2E4E45] text-white text-sm rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    إضافة سؤال جديد
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((item, idx) => {
                    const cat = faq.categories.find((c) => c.id === item.category);
                    const isExpanded = expandedId === item.id;
                    const isEditing = editingFaq?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border transition-all ${isExpanded ? "border-[#2E4E45]/30" : "border-gray-100"}`}
                      >
                        {/* Question Row */}
                        <div className="flex items-center gap-3 px-4 py-3.5">
                          {/* Order Controls */}
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              onClick={() => handleMoveUp(item.id)}
                              disabled={idx === 0}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <i className="ri-arrow-up-s-line text-xs" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(item.id)}
                              disabled={idx === filtered.length - 1}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <i className="ri-arrow-down-s-line text-xs" />
                            </button>
                          </div>

                          {/* Category Badge */}
                          <span className="text-xs bg-[#2E4E45]/8 text-[#2E4E45] px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0">
                            {cat?.label || item.category}
                          </span>

                          {/* Question Text */}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="flex-1 text-right text-sm font-bold text-gray-800 hover:text-[#2E4E45] transition-colors cursor-pointer text-right"
                          >
                            {item.question}
                          </button>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingFaq(isEditing ? null : item);
                                setExpandedId(item.id);
                              }}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer
                                ${isEditing ? "bg-[#2E4E45] text-white" : "hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45]"}`}
                              title="تعديل"
                            >
                              <i className="ri-edit-line text-xs" />
                            </button>
                            {deleteConfirm === item.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDeleteFaq(item.id)}
                                  className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap"
                                >
                                  حذف
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg cursor-pointer whitespace-nowrap"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(item.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                title="حذف"
                              >
                                <i className="ri-delete-bin-line text-xs" />
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"
                            >
                              <i className={`${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-sm`} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded: View or Edit */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 px-4 py-4">
                            {isEditing ? (
                              /* ── Edit Mode ── */
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">التصنيف</label>
                                  <select
                                    value={editingFaq!.category}
                                    onChange={(e) => {
                                      const updated = { ...editingFaq!, category: e.target.value };
                                      setEditingFaq(updated);
                                      handleUpdateFaq(updated);
                                    }}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                                  >
                                    {faq.categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">السؤال</label>
                                  <input
                                    value={editingFaq!.question}
                                    onChange={(e) => {
                                      const updated = { ...editingFaq!, question: e.target.value };
                                      setEditingFaq(updated);
                                      handleUpdateFaq(updated);
                                    }}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] font-medium"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الإجابة</label>
                                  <textarea
                                    value={editingFaq!.answer}
                                    onChange={(e) => {
                                      const updated = { ...editingFaq!, answer: e.target.value };
                                      setEditingFaq(updated);
                                      handleUpdateFaq(updated);
                                    }}
                                    rows={5}
                                    maxLength={500}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none leading-relaxed"
                                  />
                                  <p className="text-xs text-gray-400 mt-1 text-left">{editingFaq!.answer.length}/500</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingFaq(null)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap"
                                  >
                                    إغلاق التعديل
                                  </button>
                                  <button
                                    onClick={() => setEditingFaq(null)}
                                    className="px-4 py-2 bg-[#2E4E45] text-white text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap"
                                  >
                                    <i className="ri-check-line ml-1" />
                                    تم
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* ── View Mode ── */
                              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4 text-center">
                عرض {filtered.length} من {faq.faqs.length} سؤال
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            CATEGORIES VIEW
        ══════════════════════════════════════════ */}
        {activeView === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Add / Edit Category Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-folder-add-line text-[#2E4E45] text-base" />
                  </div>
                  {editingCat ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">اسم التصنيف</label>
                    <input
                      value={editingCat ? editingCat.label : newCatLabel}
                      onChange={(e) => editingCat
                        ? setEditingCat({ ...editingCat, label: e.target.value })
                        : setNewCatLabel(e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                      placeholder="مثال: الاستشارات..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">الأيقونة</label>
                    <div className="grid grid-cols-8 gap-1.5">
                      {iconOptions.map((icon) => {
                        const currentIcon = editingCat ? editingCat.icon : newCatIcon;
                        return (
                          <button
                            key={icon}
                            onClick={() => editingCat
                              ? setEditingCat({ ...editingCat, icon })
                              : setNewCatIcon(icon)
                            }
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer
                              ${currentIcon === icon
                                ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]"
                                : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                              }`}
                            title={icon}
                          >
                            <i className={`${icon} text-sm`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg">
                      <i className={`${editingCat ? editingCat.icon : newCatIcon} text-[#2E4E45] text-sm`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {editingCat ? editingCat.label || "اسم التصنيف" : newCatLabel || "اسم التصنيف"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {editingCat && (
                      <button
                        onClick={() => setEditingCat(null)}
                        className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap"
                      >
                        إلغاء
                      </button>
                    )}
                    <button
                      onClick={() => editingCat ? handleUpdateCategory(editingCat) : handleAddCategory()}
                      disabled={editingCat ? !editingCat.label.trim() : !newCatLabel.trim()}
                      className="flex-1 py-2 bg-[#2E4E45] text-white text-sm font-bold rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {editingCat ? "حفظ التعديل" : "إضافة التصنيف"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700">
                    التصنيفات الحالية ({faq.categories.length})
                  </h3>
                  <span className="text-xs text-gray-400">مرر على التصنيف للتعديل</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {faq.categories.map((cat) => {
                    const count = faq.faqs.filter((f) => f.category === cat.id).length;
                    return (
                      <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/8 rounded-xl flex-shrink-0">
                          <i className={`${cat.icon} text-[#2E4E45] text-base`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800">{cat.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {count} {count === 1 ? "سؤال" : "أسئلة"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingCat(cat); setActiveView("categories"); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <i className="ri-edit-line text-sm" />
                          </button>
                          {deleteCatConfirm === cat.id ? (
                            <div className="flex items-center gap-1">
                              {count > 0 && (
                                <span className="text-xs text-red-500 whitespace-nowrap">{count} سؤال سيتأثر</span>
                              )}
                              <button
                                onClick={() => {
                                  faq.updateCategories(faq.categories.filter((c) => c.id !== cat.id));
                                  setDeleteCatConfirm(null);
                                }}
                                className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap"
                              >
                                حذف
                              </button>
                              <button
                                onClick={() => setDeleteCatConfirm(null)}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg cursor-pointer whitespace-nowrap"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteCatConfirm(cat.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="حذف"
                            >
                              <i className="ri-delete-bin-line text-sm" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-information-line text-[#2E4E45] text-sm" />
                  </div>
                  <p className="text-xs text-[#2E4E45]/80 leading-relaxed">
                    التصنيفات تظهر كفلاتر في صفحة الأسئلة الشائعة. حذف تصنيف لن يحذف الأسئلة المرتبطة به، لكنها ستفقد تصنيفها.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
