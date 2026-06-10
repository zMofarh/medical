import { useState } from "react";
import type { BlogPost, BlogCategory } from "@/api/blog";
import RichTextEditor from "@/components/base/RichTextEditor";
import { getSession } from "@/hooks/useRBAC";

interface CMSBlogPostEditorProps {
  post: BlogPost;
  categories: BlogCategory[];
  onChange: (post: BlogPost) => void;
  onClose: () => void;
  /** If true, locks the author to the current session user (doctor mode) */
  lockAuthor?: boolean;
}

const authorOptions = [
  { name: "د. فيصل الأحمد", role: "استشاري الطب الدقيق وتقييم المخاطر", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=100&height=100&seq=doc-ma1&orientation=squarish" },
  { name: "د. سارة المنصور", role: "استشارية الخلل الأيضي وMASLD", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=100&height=100&seq=doc-ma2&orientation=squarish" },
  { name: "د. خالد العمر", role: "استشاري الطب النفسي للبالغين", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20glasses%20clean%20white%20background%20confident%20smile%20portrait%20psychiatrist%20specialist%20senior&width=100&height=100&seq=doc-ma3&orientation=squarish" },
  { name: "د. نورة الزهراني", role: "استشارية الجينات والطب الدقيق", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=100&height=100&seq=doc-ma4&orientation=squarish" },
  { name: "د. محمد الراشد", role: "استشاري هشاشة العظام المكثفة", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20clean%20white%20background%20confident%20smile%20portrait%20orthopedic%20bone%20specialist%20senior&width=200&height=200&seq=doc-ma-m1&orientation=squarish" },
  { name: "د. ريم الحربي", role: "استشارية العلاجات الوريدية المتخصصة", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20IV%20therapy%20specialist%20medical%20professional&width=200&height=200&seq=doc-ma-r1&orientation=squarish" },
];

const readTimeOptions = ["3 دقائق", "4 دقائق", "5 دقائق", "6 دقائق", "7 دقائق", "8 دقائق", "10 دقائق", "12 دقائق", "15 دقائق"];

export default function CMSBlogPostEditor({ post, categories, onChange, onClose, lockAuthor = false }: CMSBlogPostEditorProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "seo">("basic");
  const [tagInput, setTagInput] = useState("");
  const [localPost, setLocalPost] = useState<BlogPost>(post);
  const session = getSession();

  const safeCategories = categories || [];

  const update = <K extends keyof BlogPost>(field: K, value: BlogPost[K]) => {
    setLocalPost({ ...localPost, [field]: value });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !localPost.tags.includes(trimmed)) {
      update("tags", [...localPost.tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    update("tags", localPost.tags.filter((t) => t !== tag));
  };

  const selectAuthor = (author: typeof authorOptions[0]) => {
    setLocalPost({ ...localPost, author: author.name, authorRole: author.role, authorImage: author.image });
  };

  const handleSave = () => {
    onChange(localPost);
    onClose();
  };

  const tabs = [
    { key: "basic" as const, label: "المعلومات الأساسية", icon: "ri-information-line" },
    { key: "content" as const, label: "المحتوى", icon: "ri-article-line" },
    { key: "seo" as const, label: "الصورة والوسوم", icon: "ri-image-line" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg">
              <i className="ri-article-line text-[#2E4E45] text-base" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{localPost.title || "مقال جديد"}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${localPost.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {localPost.status === "published" ? "منشور" : "مسودة"}
                </span>
                <span className="text-xs text-gray-400">{localPost.views.toLocaleString()} مشاهدة</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap
                ${activeTab === tab.key ? "bg-[#2E4E45] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <i className={`${tab.icon} text-xs`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">عنوان المقال</label>
                <input
                  value={localPost.title}
                  onChange={(e) => update("title", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] font-medium"
                  placeholder="عنوان المقال..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">المقتطف (Excerpt)</label>
                <textarea
                  value={localPost.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="وصف مختصر يظهر في قائمة المقالات..."
                />
                <p className="text-xs text-gray-400 mt-1 text-left">{localPost.excerpt.length}/300</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">التصنيف</label>
                  <select
                    value={localPost.categoryId}
                    onChange={(e) => {
                      const cat = safeCategories.find((c) => c.id === e.target.value);
                      update("categoryId", e.target.value);
                      update("category", cat?.label || localPost.category);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                  >
                    {safeCategories.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">وقت القراءة</label>
                  <select
                    value={localPost.readTime}
                    onChange={(e) => update("readTime", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                  >
                    {readTimeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">تاريخ النشر</label>
                  <input
                    value={localPost.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="15 أبريل 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الحالة</label>
                  <div className="flex gap-2 mt-1">
                    {(["published", "draft"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => update("status", s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all
                          ${localPost.status === s
                            ? s === "published" ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                      >
                        {s === "published" ? "منشور" : "مسودة"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-star-line text-amber-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">مقال مميز</p>
                    <p className="text-xs text-gray-400">يظهر في قسم المقالات المميزة</p>
                  </div>
                </div>
                <button
                  onClick={() => update("featured", !localPost.featured)}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer relative flex-shrink-0
                    ${localPost.featured ? "bg-amber-400" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                    ${localPost.featured ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              {/* Author Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">الكاتب</label>
                {lockAuthor ? (
                  /* Doctor mode: show locked author card */
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-teal-200 bg-teal-50">
                    <img
                      src={session?.avatar || localPost.authorImage}
                      alt={session?.name || localPost.author}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-teal-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{session?.name || localPost.author}</p>
                      <p className="text-xs text-teal-600">سيتم نشر المقال باسمك</p>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center bg-teal-100 rounded-full flex-shrink-0">
                      <i className="ri-lock-line text-teal-600 text-xs" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {authorOptions.map((author) => (
                      <button
                        key={author.name}
                        onClick={() => selectAuthor(author)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-right transition-all cursor-pointer
                          ${localPost.author === author.name
                            ? "border-[#2E4E45] bg-[#2E4E45]/5"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <img src={author.image} alt={author.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{author.name}</p>
                          <p className="text-xs text-gray-400 truncate">{author.role.split(" ")[0]}</p>
                        </div>
                        {localPost.author === author.name && (
                          <div className="w-4 h-4 flex items-center justify-center mr-auto flex-shrink-0">
                            <i className="ri-check-line text-[#2E4E45] text-xs" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">محتوى المقال</label>
                <RichTextEditor
                  value={localPost.content}
                  onChange={(html) => update("content", html)}
                  placeholder="اكتب محتوى المقال هنا..."
                  minHeight={380}
                  dir="rtl"
                />
              </div>
              <div className="bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-lightbulb-line text-[#2E4E45] text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2E4E45] mb-0.5">نصائح التنسيق</p>
                    <p className="text-xs text-[#2E4E45]/70 leading-relaxed">
                      استخدم <strong>H2</strong> للعناوين الرئيسية، <strong>H3</strong> للعناوين الفرعية، والاقتباس للنصوص المميزة. Ctrl+B للتغميق، Ctrl+I للمائل.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SEO / Image / Tags Tab */}
          {activeTab === "seo" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">رابط الصورة الرئيسية</label>
                <input
                  value={localPost.image}
                  onChange={(e) => update("image", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="https://..."
                />
                {localPost.image && (
                  <div className="mt-2 relative rounded-xl overflow-hidden" style={{ height: "160px" }}>
                    <img src={localPost.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute bottom-2 right-2 text-white text-xs bg-black/40 px-2 py-0.5 rounded-full">معاينة الصورة</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">الوسوم (Tags)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {localPost.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-[#2E4E45]/10 text-[#2E4E45] text-xs px-2.5 py-1 rounded-full">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="w-3 h-3 flex items-center justify-center cursor-pointer hover:text-red-500">
                        <i className="ri-close-line text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="أضف وسماً واضغط Enter..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-[#2E4E45] text-white text-xs rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    إضافة
                  </button>
                </div>
              </div>

              {/* Views */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">عدد المشاهدات</label>
                <input
                  type="number"
                  value={localPost.views}
                  onChange={(e) => update("views", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 cursor-pointer whitespace-nowrap"
          >
            إغلاق
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#2E4E45] text-white text-sm font-bold rounded-xl cursor-pointer whitespace-nowrap"
          >
            <i className="ri-check-line ml-1" />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
