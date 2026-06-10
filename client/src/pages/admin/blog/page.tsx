import { useState, useMemo } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import CMSBlogPostEditor from "@/pages/admin/cms/components/CMSBlogPostEditor";
import { useCMSBlog } from "@/hooks/useCMSBlog";
import { type BlogPost } from "@/mocks/blogData";
import { getSession, hasPermission } from "@/hooks/useRBAC";
import { pushNotification } from "@/hooks/useNotifications";

type FilterStatus = "all" | "published" | "draft";

export default function DoctorBlogPage() {
  const blog = useCMSBlog();
  const session = getSession();

  const canCreate  = hasPermission(session, "blog.create");
  const canEdit    = hasPermission(session, "blog.edit");
  const canPublish = hasPermission(session, "blog.publish");
  const canDelete  = hasPermission(session, "blog.delete");

  // For doctor role: only show their own posts (matched by name)
  const isDoctor = session?.role === "doctor";

  const [editingPost, setEditingPost]     = useState<BlogPost | null>(null);
  const [filterStatus, setFilterStatus]   = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery]     = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast]                 = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter posts: doctors see only their own posts
  const myPosts = useMemo(() => {
    if (!isDoctor) return blog.posts;
    return blog.posts.filter((p) => p.author === session?.name);
  }, [blog.posts, isDoctor, session?.name]);

  const filtered = useMemo(() => {
    return myPosts.filter((p) => {
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchSearch = !searchQuery || p.title.includes(searchQuery) || p.excerpt.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [myPosts, filterStatus, searchQuery]);

  const stats = useMemo(() => ({
    total:     myPosts.length,
    published: myPosts.filter((p) => p.status === "published").length,
    draft:     myPosts.filter((p) => p.status === "draft").length,
    views:     myPosts.reduce((sum, p) => sum + p.views, 0),
  }), [myPosts]);

  const handleAddPost = () => {
    if (!canCreate) return;
    const newPost: BlogPost = {
      id:          `post-${Date.now()}`,
      title:       "مقال جديد",
      excerpt:     "وصف مختصر للمقال...",
      content:     "محتوى المقال هنا...",
      category:    blog.categories[1]?.label || "",
      categoryId:  blog.categories[1]?.id    || "",
      author:      session?.name || "طبيب",
      authorRole:  "طبيب متخصص",
      authorImage: session?.avatar || "https://readdy.ai/api/search-image?query=professional%20arab%20male%20doctor%20portrait%20headshot%20white%20coat%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=100&height=100&seq=doc-new1&orientation=squarish",
      date:        new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }),
      readTime:    "5 دقائق",
      image:       "https://readdy.ai/api/search-image?query=medical%20healthcare%20professional%20concept%20clean%20minimal%20background%20modern%20clinical%20environment%20sophisticated%20technology&width=800&height=500&seq=blog-doc1&orientation=landscape",
      tags:        [],
      featured:    false,
      views:       0,
      status:      "draft",
    };
    blog.updatePosts([newPost, ...blog.posts]);
    setEditingPost(newPost);
    showToast("تم إنشاء مسودة جديدة");
    pushNotification({
      type: "blog",
      title: "مسودة جديدة",
      message: `${session?.name || "طبيب"} بدأ كتابة مقال جديد`,
      link: "/admin/cms/blog",
    });
  };

  const handleDeletePost = (id: string) => {
    if (!canDelete) return;
    blog.updatePosts(blog.posts.filter((p) => p.id !== id));
    blog.save(blog.posts.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    showToast("تم حذف المقال");
  };

  const toggleStatus = (id: string) => {
    if (!canPublish) return;
    const target = blog.posts.find((p) => p.id === id);
    const newStatus = target?.status === "published" ? "draft" : "published";
    const updated = blog.posts.map((p) =>
      p.id === id ? { ...p, status: newStatus } : p
    ) as BlogPost[];
    blog.updatePosts(updated);
    blog.save(updated);
    showToast("تم تحديث حالة المقال");
    if (newStatus === "published" && target) {
      pushNotification({
        type: "blog",
        title: "مقال منشور",
        message: `${session?.name || "طبيب"} نشر مقالاً: ${target.title}`,
        link: "/admin/cms/blog",
      });
    }
  };

  const handleSavePost = (updated: BlogPost) => {
    const newPosts = blog.posts.map((p) => (p.id === updated.id ? updated : p));
    blog.updatePosts(newPosts);
    blog.save(newPosts);
    setEditingPost(updated);
    showToast("تم حفظ المقال");
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto" dir="rtl">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-[#2E4E45] text-white" : "bg-red-500 text-white"
          }`}>
            <i className={toast.type === "success" ? "ri-check-double-line" : "ri-error-warning-line"} />
            {toast.msg}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2E4E45]">مقالاتي في المدونة</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isDoctor
                ? "اكتب وانشر مقالاتك الطبية — تظهر مباشرة في مدونة العيادة"
                : "إدارة مقالات المدونة"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line" />
              معاينة المدونة
            </a>
            {canCreate && (
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

        {/* ── Doctor Info Banner ── */}
        {isDoctor && (
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6 flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-teal-100 rounded-xl flex-shrink-0">
              <i className="ri-stethoscope-line text-teal-600 text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-teal-800">مرحباً {session?.name}</p>
              <p className="text-xs text-teal-600 mt-0.5 leading-relaxed">
                يمكنك كتابة مقالات طبية ونشرها مباشرة في مدونة العيادة. المقالات المنشورة تظهر باسمك وتخصصك للزوار.
              </p>
            </div>
            <div className="flex items-center gap-3 text-center flex-shrink-0">
              <div>
                <p className="text-lg font-black text-teal-700">{stats.published}</p>
                <p className="text-xs text-teal-500">منشور</p>
              </div>
              <div className="w-px h-8 bg-teal-200" />
              <div>
                <p className="text-lg font-black text-teal-700">{stats.views.toLocaleString()}</p>
                <p className="text-xs text-teal-500">مشاهدة</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "إجمالي مقالاتي", value: stats.total,     icon: "ri-article-line",        color: "text-[#2E4E45]", bg: "bg-[#2E4E45]/8" },
            { label: "منشور",           value: stats.published, icon: "ri-checkbox-circle-line", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "مسودة",           value: stats.draft,     icon: "ri-draft-line",           color: "text-gray-500",   bg: "bg-gray-100" },
            { label: "إجمالي المشاهدات", value: stats.views.toLocaleString(), icon: "ri-eye-line", color: "text-[#C8A96E]", bg: "bg-amber-50" },
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

        {/* ── Filters ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-gray-400 text-sm" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في مقالاتك..."
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
            <span className="text-xs text-gray-400">{filtered.length} مقال</span>
          </div>
        </div>

        {/* ── Posts List ── */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 flex items-center justify-center bg-teal-50 rounded-2xl mx-auto mb-4">
                <i className="ri-quill-pen-line text-teal-400 text-2xl" />
              </div>
              <p className="text-base font-bold text-gray-700 mb-1">
                {myPosts.length === 0 ? "لم تكتب أي مقال بعد" : "لا توجد نتائج"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {myPosts.length === 0
                  ? "ابدأ بكتابة مقالك الطبي الأول وشاركه مع مرضى العيادة"
                  : "جرب تغيير فلتر البحث"}
              </p>
              {canCreate && myPosts.length === 0 && (
                <button
                  onClick={handleAddPost}
                  className="px-5 py-2.5 bg-[#2E4E45] text-white text-sm font-bold rounded-lg cursor-pointer whitespace-nowrap"
                >
                  اكتب مقالك الأول
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover object-top" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{post.title}</p>
                      {post.featured && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          <i className="ri-star-fill text-xs ml-0.5" />مميز
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-1.5">{post.excerpt}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs bg-[#2E4E45]/8 text-[#2E4E45] px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-400">{post.date}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <i className="ri-eye-line" />{post.views.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <i className="ri-time-line" />{post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Status toggle */}
                    {canPublish ? (
                      <button
                        onClick={() => toggleStatus(post.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all whitespace-nowrap border
                          ${post.status === "published"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                            : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                          }`}
                      >
                        {post.status === "published" ? "منشور" : "مسودة"}
                      </button>
                    ) : (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap
                        ${post.status === "published"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}
                      >
                        {post.status === "published" ? "منشور" : "مسودة"}
                      </span>
                    )}

                    {/* Edit */}
                    {canEdit && (
                      <button
                        onClick={() => setEditingPost(post)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <i className="ri-edit-line text-sm" />
                      </button>
                    )}

                    {/* Preview */}
                    <a
                      href={`/blog/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      title="معاينة"
                    >
                      <i className="ri-eye-line text-sm" />
                    </a>

                    {/* Delete */}
                    {canDelete && (
                      deleteConfirm === post.id ? (
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
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips for doctors */}
        {isDoctor && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "ri-lightbulb-line", title: "نصيحة الكتابة", desc: "اكتب بأسلوب بسيط يفهمه المريض، تجنب المصطلحات الطبية المعقدة قدر الإمكان" },
              { icon: "ri-image-line",     title: "الصور المناسبة", desc: "أضف صورة واضحة ومعبرة لكل مقال — تزيد من نسبة القراءة بشكل كبير" },
              { icon: "ri-time-line",      title: "وقت النشر",      desc: "المقالات المنشورة صباحاً (8-10 ص) تحصل على مشاهدات أعلى بنسبة 40%" },
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-[#2E4E45]/8 rounded-lg flex-shrink-0">
                  <i className={`${tip.icon} text-[#2E4E45] text-sm`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-0.5">{tip.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Editor Modal */}
      {editingPost && (
        <CMSBlogPostEditor
          post={editingPost}
          categories={blog.categories}
          onChange={handleSavePost}
          onClose={() => setEditingPost(null)}
          lockAuthor={isDoctor}
        />
      )}
    </AdminLayout>
  );
}
