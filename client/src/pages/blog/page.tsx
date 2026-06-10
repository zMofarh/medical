import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { StarShape, SunShape, SwanShape, LotusShape } from "@/components/base/BrandShapes";
import TypewriterText from "@/components/base/TypewriterText";
import { usePublicBlog } from "@/hooks/useCMSBlog";

const categoryIcons: Record<string, string> = {
  all: "ri-apps-line",
  "risk-stratification": "ri-heart-pulse-line",
  "obesity-metabolic": "ri-scales-3-line",
  "second-opinion": "ri-global-line",
  "dna-risk": "ri-dna-line",
  psychiatry: "ri-mental-health-line",
};

export default function BlogPage() {
  const { posts: blogPosts, categories: blogCategories } = usePublicBlog();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogPosts.filter((post) => {
    const matchCat = activeCategory === "all" || post.categoryId === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      post.title.includes(searchQuery) ||
      post.excerpt.includes(searchQuery) ||
      post.category.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const featured = blogPosts.filter((p) => p.featured);
  const regular = filtered.filter(
    (p) => !p.featured || activeCategory !== "all" || searchQuery !== ""
  );

  const showFeatured = activeCategory === "all" && !searchQuery;

  return (
    <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-forest-900 via-brand-forest-800 to-brand-forest-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20precision%20medicine%20DNA%20genomics%20pattern%20minimal%20geometric%20shapes%20clean%20white%20lines%20on%20dark%20forest%20green%20background%20modern%20design%20scientific%20healthcare%20knowledge&width=1440&height=500&seq=blog-hero-v2&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Shapes — decorative */}
        <div className="absolute top-16 right-10 opacity-10 pointer-events-none">
          <StarShape size={120} color="white" />
        </div>
        <div className="absolute bottom-10 left-12 opacity-8 pointer-events-none" style={{ opacity: 0.08 }}>
          <LotusShape size={100} color="white" />
        </div>
        <div className="absolute top-20 left-1/4 opacity-5 pointer-events-none" style={{ opacity: 0.05 }}>
          <SwanShape size={80} color="white" />
        </div>
        <div className="absolute bottom-16 right-1/3 opacity-5 pointer-events-none" style={{ opacity: 0.05 }}>
          <SunShape size={70} color="white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/20">
              <StarShape size={12} color="white" />
              مدونة الطب الدقيق
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight min-h-[1.3em]">
              <TypewriterText
                words={["معرفة أعمق، قرار أدق", "علم يخدم قرارك الصحي", "محتوى من خبراء حقيقيين", "نكتب لنفهم، لا لنبهر"]}
                typeSpeed={65}
                deleteSpeed={38}
                pauseAfter={2600}
                startDelay={700}
                cursorChar="▌"
                cursorClassName="text-brand-cream-400/60 text-4xl md:text-5xl"
              />
            </h1>
            <p className="text-brand-cream-200 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              محتوى علمي متخصص من استشاريي ذا مديكال أفينيو — في الطب الدقيق، تحليل DNA، الخلل الأيضي، والرعاية التخصصية المتقدمة
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto mb-10">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                <i className="ri-search-line text-gray-400 text-lg"></i>
              </div>
              <input
                type="text"
                placeholder="ابحث في مقالات الطب الدقيق..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory("all");
                }}
                className="w-full bg-white rounded-full py-3.5 pr-12 pl-5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-cream-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-gray-400 text-lg"></i>
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {blogCategories.map((cat) => {
                const isActive = activeCategory === cat.id && !searchQuery;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-white text-brand-forest-700 font-bold"
                        : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20"
                    }`}
                  >
                    <i className={`${categoryIcons[cat.id] ?? "ri-article-line"} text-xs`}></i>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: "ri-article-line", value: `${blogPosts.length}+`, label: "مقال متخصص" },
              { icon: "ri-user-star-line", value: "4", label: "استشاري مؤلف" },
              { icon: "ri-eye-line", value: "12K+", label: "قراءة شهرياً" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${s.icon} text-brand-cream-300 text-xs`}></i>
                </div>
                <span className="text-white font-black text-sm">{s.value}</span>
                <span className="text-brand-cream-300 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Posts ────────────────────────────────────────────────── */}
      {showFeatured && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-brand-forest-600 rounded-full"></div>
              <h2 className="text-xl font-black text-gray-900">المقالات المميزة</h2>
              <span className="text-xs text-brand-forest-600 font-semibold bg-brand-cream-100 px-2.5 py-1 rounded-full">
                محتوى حصري
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-brand-cream-200 hover:border-brand-forest-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                  <div className="relative overflow-hidden" style={{ height: "260px" }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-brand-forest-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <i className="ri-star-fill text-[10px]"></i>
                        مميز
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                      <i className="ri-time-line text-xs"></i>
                      {post.readTime} قراءة
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black text-gray-900 text-lg mb-3 leading-tight group-hover:text-brand-forest-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-brand-cream-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-cream-100 flex-shrink-0">
                          <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{post.author}</p>
                          <p className="text-xs text-gray-400">{post.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <i className="ri-eye-line"></i>
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All / Filtered Posts ──────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {searchQuery ? (
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 bg-white rounded-xl border border-brand-cream-200 px-4 py-3">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-brand-forest-500"></i>
              </div>
              <span>
                نتائج البحث عن:{" "}
                <strong className="text-gray-800">{searchQuery}</strong>{" "}
                <span className="text-brand-forest-600 font-bold">({filtered.length} مقال)</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-brand-forest-600 rounded-full"></div>
              <h2 className="text-xl font-black text-gray-900">
                {activeCategory === "all"
                  ? "جميع المقالات"
                  : blogCategories.find((c) => c.id === activeCategory)?.label}
              </h2>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-brand-cream-200">
              <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-100 rounded-full mx-auto mb-4">
                <i className="ri-article-line text-3xl text-brand-forest-400"></i>
              </div>
              <h3 className="font-bold text-gray-700 mb-2">لا توجد مقالات</h3>
              <p className="text-gray-400 text-sm">جرب كلمات بحث مختلفة أو تصنيفاً آخر</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || activeCategory !== "all" ? filtered : regular).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-brand-cream-200 hover:border-brand-forest-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                  <div className="relative overflow-hidden" style={{ height: "200px" }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-900/30 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-brand-forest-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-black text-gray-900 text-base mb-2 leading-tight group-hover:text-brand-forest-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-brand-cream-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-brand-cream-100 flex-shrink-0">
                          <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <i className="ri-time-line"></i>
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Precision Medicine Pillars ────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-cream-100 text-brand-forest-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
              فلسفة المحتوى
            </span>
            <h2 className="text-2xl font-black text-gray-900 mb-2">نكتب لنفهم، لا لنبهر</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              كل مقال في مدونتنا يخدم هدفاً واحداً: مساعدتك على فهم حالتك الصحية بعمق أكبر
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Shape: StarShape,
                title: "عمق سريري",
                desc: "مقالات تفكك الحالة وتربط بين الحاضر الصحي والمخاطر المستقبلية — لا مجرد نصائح عامة",
              },
              {
                Shape: SunShape,
                title: "عمق تقني",
                desc: "محتوى يشرح تقنيات الطب الدقيق كـ DNA Risk Score والعمر البيولوجي بلغة واضحة وعلمية",
              },
              {
                Shape: LotusShape,
                title: "عمق دولي",
                desc: "رؤى مستمدة من شبكة خبراتنا في USA وكوريا الجنوبية وأبرز مراكز الطب الدقيق عالمياً",
              },
            ].map(({ Shape, title, desc }, i) => (
              <div key={i} className="bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-6 text-center">
                <div className="w-14 h-14 flex items-center justify-center bg-brand-forest-700 rounded-2xl mx-auto mb-4">
                  <Shape size={28} color="#d4c5a9" />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-forest-800 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-6 right-8 pointer-events-none" style={{ opacity: 0.12 }}>
          <SwanShape size={80} color="white" />
        </div>
        <div className="absolute bottom-6 left-8 pointer-events-none" style={{ opacity: 0.10 }}>
          <LotusShape size={70} color="white" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-white/15 rounded-2xl mx-auto mb-5">
            <StarShape size={28} color="white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            اشترك في نشرة الطب الدقيق
          </h2>
          <p className="text-brand-cream-200 text-sm mb-8 leading-relaxed">
            احصل على أحدث مقالات الطب الدقيق، تحليل DNA، وإدارة المخاطر الصحية — مباشرة في بريدك الإلكتروني
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-brand-cream-400 rounded-full px-5 py-3 text-sm outline-none focus:bg-white/25 focus:border-brand-cream-300"
            />
            <button className="bg-brand-cream-300 text-brand-forest-900 font-bold px-6 py-3 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer">
              اشترك الآن
            </button>
          </div>
          <p className="text-brand-cream-400 text-xs mt-4">لا رسائل مزعجة — يمكنك إلغاء الاشتراك في أي وقت</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
