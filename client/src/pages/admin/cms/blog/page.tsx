import { useState, useMemo } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import CMSBlogPostEditor from "@/pages/admin/cms/components/CMSBlogPostEditor";
import { useCMSBlog } from "@/hooks/useCMSBlog";
import { blogCategories as initialCategories, type BlogPost, type BlogCategory } from "@/mocks/blogData";

type FilterStatus = "all" | "published" | "draft";
type ActiveView = "posts" | "categories";

export default function AdminCMSBlog() {
  const blog = useCMSBlog();
  const [activeView, setActiveView] = useState<ActiveView>("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Category management
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("ri-article-line");
  const [editingCat, setEditingCat] = useState<BlogCategory | null>(null);
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return blog.posts.filter((p) => {
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchCat = filterCategory === "all" || p.categoryId === filterCategory;
      const matchSearch = !searchQuery || p.title.includes(searchQuery) || p.author.includes(searchQuery);
      return matchStatus && matchCat && matchSearch;
    });
  }, [blog.posts, filterStatus, filterCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: blog.posts.length,
    published: blog.posts.filter((p) => p.status === "published").length,
    draft: blog.posts.filter((p) => p.status === "draft").length,
    featured: blog.posts.filter((p) => p.featured).length,
    totalViews: blog.posts.reduce((sum, p) => sum + p.views, 0),
  }), [blog.posts]);

  const handleAddPost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: "مقال جديد",
      excerpt: "وصف مختصر للمقال...",
      content: "محتوى المقال هنا...",
      category: blog.categories[1]?.label || "",
      categoryId: blog.categories[1]?.id || "",
      author: "د. فيصل الأحمد",
      authorRole: "استشاري الطب الدقيق وتقييم المخاطر",
      authorImage: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=100&height=100&seq=doc-ma1&orientation=squarish",
      date: new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }),
      readTime: "5 دقائق",
      image: "https://readdy.ai/api/search-image?query=precision%20medicine%20medical%20concept%20modern%20clinical%20environment%20professional%20healthcare%20sophisticated%20technology%20clean%20minimal%20background&width=800&height=500&seq=blog-new1&orientation=landscape",
      tags: [],
      featured: false,
      views: 0,
      status: "draft",
    };
    blog.updatePosts([newPost, ...blog.posts]);
    setEditingPost(newPost);
  };

  const handleDeletePost = (id: string) => {
    blog.updatePosts(blog.posts.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    blog.updatePosts(blog.posts.map((p) =>
      p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p
    ));
  };

  const toggleFeatured = (id: string) => {
    blog.updatePosts(blog.posts.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  // Category handlers
  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const newCat: BlogCategory = {
      id: `cat-${Date.now()}`,
      label: newCatLabel.trim(),
      icon: newCatIcon,
      count: 0,
    };
    blog.updateCategories([...blog.categories, newCat]);
    setNewCatLabel("");
    setNewCatIcon("ri-article-line");
  };

  const handleUpdateCategory = (cat: BlogCategory) => {
    blog.updateCategories(blog.categories.map((c) => (c.id === cat.id ? cat : c)));
    setEditingCat(null);
  };

  const handleDeleteCategory = (catId: string) => {
    const postsInCat = blog.posts.filter((p) => p.categoryId === catId).length;
    if (postsInCat > 0) {
      setDeleteCatConfirm(catId);
      return;
    }
    blog.updateCategories(blog.categories.filter((c) => c.id !== catId && c.id !== "all"));
    setDeleteCatConfirm(null);
  };

  const iconOptions = [
    "ri-article-line", "ri-dna-line", "ri-heart-pulse-line", "ri-microscope-line",
    "ri-brain-line", "ri-leaf-line", "ri-flask-line", "ri-stethoscope-line",
    "ri-shield-check-line", "ri-award-line", "ri-global-line", "ri-user-star-line",
    "ri-hospital-line", "ri-capsule-line", "ri-mental-health-line", "ri-eye-line",
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto" dir="rtl">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2E4E45]">إدارة محتوى المدونة</h2>
            <p className="text-sm text-gray-400 mt-0.5">تحرير المقالات والتصنيفات والصور</p>
          </div>
          <div className="flex items-center gap-2">
            {blog.hasChanges && (
              <button
                onClick={() => blog.save(blog.posts)}
                disabled={blog.saveStatus === "saving"}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap
                  ${blog.saveStatus === "saved" ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90"}`}
              >
                {blog.saveStatus === "saving" ? (
                  <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
                ) : blog.saveStatus === "saved" ? (
                  <><i className="ri-check-line" /> تم الحفظ!</>
                ) : (
                  <><i className="ri-save-line" /> حفظ التغييرات</>
                )}
              </button>
            )}
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line" />
              معاينة المدونة
            </a>
            {activeView === "posts" && (
              <button
                onClick={handleAddPost}
                className="flex items-center gap-2 px-4 py-2 bg-[#C8A96E] text-white text-sm font-bold rounded-lg hover:bg-[#b8995e] transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" />
                مقال جديد
              </button>
            )}
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "إجمالي المقالات", value: stats.total, icon: "ri-article-line", color: "text-[#2E4E45]", bg: "bg-[#2E4E45]/8" },
            { label: "منشور", value: stats.published, icon: "ri-checkbox-circle-line", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "مسودة", value: stats.draft, icon: "ri-draft-line", color: "text-gray-500", bg: "bg-gray-100" },
            { label: "مميز", value: stats.featured, icon: "ri-star-fill", color: "text-amber-500", bg: "bg-amber-50" },
            { label: "إجمالي المشاهدات", value: stats.totalViews.toLocaleString(), icon: "ri-eye-line", color: "text-[#2E4E45]", bg: "bg-[#2E4E45]/8" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${stat.bg} mb-2`}>
                <i className={`${stat.icon} ${stat.color} text-sm`} />
              </div>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── View Toggle ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
          <button
            onClick={() => setActiveView("posts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
              ${activeView === "posts" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <i className="ri-article-line text-sm" />
            المقالات ({blog.posts.length})
          </button>
          <button
            onClick={() => setActiveView("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
              ${activeView === "categories" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <i className="ri-folders-line text-sm" />
            التصنيفات ({blog.categories.filter((c) => c.id !== "all").length})
          </button>
        </div>

        {/* ══════════════════════════════════════════
            POSTS VIEW
        ══════════════════════════════════════════ */}
        {activeView === "posts" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-48">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                    <i className="ri-search-line text-gray-400 text-sm" />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث في المقالات..."
                    className="w-full border border-gray-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  />
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {(["all", "published", "draft"] as FilterStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap
                        ${filterStatus === s ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {s === "all" ? "الكل" : s === "published" ? "منشور" : "مسودة"}
                    </button>
                  ))}
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                >
                  {blog.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
                    <i className="ri-article-line text-gray-400 text-2xl" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">لا توجد مقالات تطابق البحث</p>
                  <button
                    onClick={handleAddPost}
                    className="px-4 py-2 bg-[#2E4E45] text-white text-sm rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    إضافة مقال جديد
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                        <th className="text-right py-3 px-4 font-medium">المقال</th>
                        <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">التصنيف</th>
                        <th className="text-right py-3 px-4 font-medium hidden md:table-cell">الكاتب</th>
                        <th className="text-right py-3 px-4 font-medium hidden lg:table-cell">المشاهدات</th>
                        <th className="text-right py-3 px-4 font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 font-medium">مميز</th>
                        <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((post) => (
                        <tr key={post.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{post.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{post.date} · {post.readTime}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span className="text-xs bg-[#2E4E45]/10 text-[#2E4E45] px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <img src={post.authorImage} alt={post.author} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                              <span className="text-xs text-gray-600 whitespace-nowrap">{post.author}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <span className="text-sm text-gray-600 font-medium">{post.views.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStatus(post.id)}
                              className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all whitespace-nowrap
                                ${post.status === "published"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                                  : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                                }`}
                            >
                              {post.status === "published" ? "منشور" : "مسودة"}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleFeatured(post.id)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all
                                ${post.featured ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"}`}
                            >
                              <i className={`${post.featured ? "ri-star-fill" : "ri-star-line"} text-sm`} />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingPost(post)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                                title="تعديل"
                              >
                                <i className="ri-edit-line text-sm" />
                              </button>
                              <a
                                href={`/blog/${post.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                title="معاينة"
                              >
                                <i className="ri-eye-line text-sm" />
                              </a>
                              {deleteConfirm === post.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap"
                                  >
                                    تأكيد
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
                                  onClick={() => setDeleteConfirm(post.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="حذف"
                                >
                                  <i className="ri-delete-bin-line text-sm" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              عرض {filtered.length} من {blog.posts.length} مقال
            </p>
          </>
        )}

        {/* ══════════════════════════════════════════
            CATEGORIES VIEW
        ══════════════════════════════════════════ */}
        {activeView === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Add Category Form */}
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
                      placeholder="مثال: الطب الوقائي..."
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
                    التصنيفات الحالية ({blog.categories.filter((c) => c.id !== "all").length})
                  </h3>
                  <span className="text-xs text-gray-400">انقر للتعديل</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {blog.categories.filter((c) => c.id !== "all").map((cat) => {
                    const postCount = blog.posts.filter((p) => p.categoryId === cat.id).length;
                    return (
                      <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/8 rounded-xl flex-shrink-0">
                          <i className={`${cat.icon} text-[#2E4E45] text-base`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800">{cat.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {postCount} {postCount === 1 ? "مقال" : "مقالات"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingCat(cat)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <i className="ri-edit-line text-sm" />
                          </button>
                          {deleteCatConfirm === cat.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-500 whitespace-nowrap">
                                {postCount > 0 ? `${postCount} مقال سيتأثر!` : "تأكيد الحذف؟"}
                              </span>
                              <button
                                onClick={() => {
                                  blog.updateCategories(blog.categories.filter((c) => c.id !== cat.id && c.id !== "all"));
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
                  {blog.categories.filter((c) => c.id !== "all").length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
                        <i className="ri-folders-line text-gray-400 text-xl" />
                      </div>
                      <p className="text-sm text-gray-500">لا توجد تصنيفات بعد</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info box */}
              <div className="mt-4 bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-information-line text-[#2E4E45] text-sm" />
                  </div>
                  <p className="text-xs text-[#2E4E45]/80 leading-relaxed">
                    التصنيفات تظهر في صفحة المدونة كفلاتر للمقالات. حذف تصنيف لن يحذف المقالات المرتبطة به، لكنها ستفقد تصنيفها.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Editor Modal */}
      {editingPost && (
        <CMSBlogPostEditor
          post={editingPost}
          categories={blog.categories}
          onChange={(updated) => {
            blog.updatePosts(blog.posts.map((p) => (p.id === updated.id ? updated : p)));
            setEditingPost(updated);
          }}
          onClose={() => setEditingPost(null)}
        />
      )}
    </AdminLayout>
  );
}
