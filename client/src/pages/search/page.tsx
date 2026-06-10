import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import { servicesData } from "@/mocks/servicesData";
import { allPackages } from "@/mocks/packagesData";
import { blogPosts } from "@/mocks/clinicData";
import { usePublicSearch } from "@/hooks/useCMSSearch";

type Tab = "all" | "doctors" | "services" | "packages" | "blog";

const accentMap: Record<string, { bg: string; text: string; border: string; iconBg: string; btn: string }> = {
  rose:    { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   iconBg: "bg-rose-100",   btn: "bg-rose-600 hover:bg-rose-700" },
  orange:  { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-100", btn: "bg-orange-500 hover:bg-orange-600" },
  pink:    { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   iconBg: "bg-pink-100",   btn: "bg-pink-600 hover:bg-pink-700" },
  green:   { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  iconBg: "bg-green-100",  btn: "bg-green-600 hover:bg-green-700" },
  violet:  { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", iconBg: "bg-violet-100", btn: "bg-violet-600 hover:bg-violet-700" },
  cyan:    { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   iconBg: "bg-cyan-100",   btn: "bg-cyan-600 hover:bg-cyan-700" },
  amber:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  iconBg: "bg-amber-100",  btn: "bg-amber-500 hover:bg-amber-600" },
  teal:    { bg: "bg-brand-cream-50", text: "text-brand-forest-700", border: "border-brand-cream-200", iconBg: "bg-brand-cream-100", btn: "bg-brand-forest-600 hover:bg-brand-forest-700" },
  forest:  { bg: "bg-brand-cream-50", text: "text-brand-forest-700", border: "border-brand-cream-200", iconBg: "bg-brand-cream-100", btn: "bg-brand-forest-600 hover:bg-brand-forest-700" },
};

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-brand-cream-100 text-brand-forest-800 rounded px-0.5 not-italic font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const { hero, popular, quickLinks, cta, resultsConfig } = usePublicSearch();
  const { doctors: doctorsDetailed } = usePublicDoctors();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  const handleSearch = (val: string) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
    setActiveTab("all");
  };

  const q = query.toLowerCase().trim();

  const matchedDoctors = useMemo(() => {
    if (!q) return doctorsDetailed;
    return doctorsDetailed.filter(
      (d) =>
        d.name.includes(q) ||
        (d.specialty && d.specialty.toLowerCase().includes(q)) ||
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.specializations && d.specializations.some((s) => s.toLowerCase().includes(q)))
    );
  }, [q, doctorsDetailed]);

  const matchedServices = useMemo(() => {
    if (!q) return servicesData;
    return servicesData.filter(
      (s) =>
        s.name.includes(q) ||
        s.description.includes(q) ||
        s.category.includes(q) ||
        s.procedures.some((p) => p.title.includes(q))
    );
  }, [q]);

  const matchedPackages = useMemo(() => {
    if (!q) return allPackages;
    return allPackages.filter(
      (p) =>
        p.name.includes(q) ||
        p.category.includes(q) ||
        p.features.some((f) => f.includes(q))
    );
  }, [q]);

  const matchedBlog = useMemo(() => {
    if (!q) return blogPosts;
    return blogPosts.filter(
      (b) =>
        b.title.includes(q) ||
        b.excerpt.includes(q) ||
        b.category.includes(q) ||
        b.tags.some((t) => t.includes(q))
    );
  }, [q]);

  const totalResults =
    matchedDoctors.length + matchedServices.length + matchedPackages.length + matchedBlog.length;

  const tabs: { id: Tab; label: string; count: number; icon: string }[] = [
    { id: "all",      label: "الكل",      count: totalResults,          icon: "ri-search-line" },
    { id: "doctors",  label: "الأطباء",   count: matchedDoctors.length, icon: "ri-user-heart-line" },
    { id: "services", label: "الخدمات",   count: matchedServices.length,icon: "ri-stethoscope-line" },
    { id: "packages", label: "الباقات",   count: matchedPackages.length,icon: "ri-gift-line" },
    { id: "blog",     label: "المقالات",  count: matchedBlog.length,    icon: "ri-article-line" },
  ];

  const showDoctors  = activeTab === "all" || activeTab === "doctors";
  const showServices = activeTab === "all" || activeTab === "services";
  const showPackages = activeTab === "all" || activeTab === "packages";
  const showBlog     = activeTab === "all" || activeTab === "blog";

  const popularSearches = popular.map((p) => p.label);

  return (
    <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* ── Search Hero ── */}
      <section className="pt-28 pb-10 bg-gradient-to-br from-brand-forest-900 via-brand-forest-800 to-brand-forest-700 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20precision%20medicine%20DNA%20helix%20pattern%20minimal%20white%20lines%20on%20dark%20forest%20green%20background%20geometric%20modern%20clinic%20design%20scientific&width=1440&height=320&seq=search-hero-forest&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        {/* Subtle cream gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-cream-50/30 to-transparent"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-cream-300/20 border border-brand-cream-300/30 text-brand-cream-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <div className="w-3 h-3 flex items-center justify-center">
              <i className="ri-search-eye-line text-xs"></i>
            </div>
            {hero.badge}
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
            {hero.title}
          </h1>
          <p className="text-brand-cream-200 text-sm mb-7">
            {hero.subtitle}
          </p>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-brand-forest-400 text-lg"></i>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={hero.placeholder}
              className="w-full bg-white text-gray-800 text-base pr-12 pl-14 py-4 rounded-2xl outline-none placeholder-gray-400 border-2 border-transparent focus:border-brand-cream-300 transition-colors"
            />
            {query && (
              <button
                onClick={() => handleSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-brand-cream-100 rounded-full hover:bg-brand-cream-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-brand-forest-600 text-sm"></i>
              </button>
            )}
          </div>

          {/* Popular Searches */}
          {!query && (
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              <span className="text-brand-cream-300 text-xs ml-1 self-center">بحث شائع:</span>
              {popularSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="text-xs bg-white/15 text-white px-3 py-1.5 rounded-full hover:bg-white/25 transition-colors cursor-pointer border border-white/20 whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="bg-white border-b border-brand-cream-200 sticky top-16 md:top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto pb-0 flex-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-brand-forest-600 text-brand-forest-700"
                    : "border-transparent text-gray-500 hover:text-brand-forest-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${tab.icon} text-sm`}></i>
                </div>
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id
                    ? "bg-brand-cream-100 text-brand-forest-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {/* Summary */}
        {query && (
          <div className="mb-6 flex items-center gap-2 bg-white border border-brand-cream-200 rounded-xl px-4 py-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-brand-forest-600 text-sm"></i>
            </div>
            <p className="text-sm text-gray-600">
              نتائج البحث عن{" "}
              <strong className="text-brand-forest-800">&quot;{query}&quot;</strong>
              {" — "}
              <span className="text-brand-forest-600 font-bold">{totalResults}</span> نتيجة
            </p>
          </div>
        )}

        {/* Empty State */}
        {query && totalResults === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-brand-cream-200">
            <div className="w-16 h-16 flex items-center justify-center bg-brand-cream-100 rounded-full mx-auto mb-4">
              <i className="ri-search-line text-2xl text-brand-forest-400"></i>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500 text-sm mb-5">
              لم نجد نتائج لـ &quot;{query}&quot;. جرب كلمات مختلفة.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="text-sm bg-brand-cream-100 text-brand-forest-700 px-4 py-2 rounded-full hover:bg-brand-cream-200 transition-colors cursor-pointer font-semibold whitespace-nowrap border border-brand-cream-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No query — landing cards */}
        {!query && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "ri-user-heart-line",   label: "الأطباء",   count: doctorsDetailed.length,  path: "/doctors",  color: "bg-brand-cream-50 text-brand-forest-700 border-brand-cream-200 hover:bg-brand-cream-100" },
              { icon: "ri-stethoscope-line",   label: "الخدمات",   count: servicesData.length,     path: "/services", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
              { icon: "ri-gift-line",          label: "الباقات",   count: allPackages.length,      path: "/packages", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
              { icon: "ri-article-line",       label: "المقالات",  count: blogPosts.length,        path: "/blog",     color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${item.color}`}
              >
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <i className={`${item.icon} text-2xl`}></i>
                </div>
                <p className="font-black text-lg">{item.count}</p>
                <p className="text-xs font-semibold mt-0.5">{item.label}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="space-y-10">

          {/* ── Doctors ── */}
          {showDoctors && matchedDoctors.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                    <i className="ri-user-heart-line text-brand-forest-600 text-sm"></i>
                  </div>
                  الأطباء
                  <span className="text-xs bg-brand-cream-100 text-brand-forest-700 px-2 py-0.5 rounded-full font-bold">
                    {matchedDoctors.length}
                  </span>
                </h2>
                {activeTab === "all" && matchedDoctors.length > 3 && (
                  <button
                    onClick={() => setActiveTab("doctors")}
                    className="text-xs text-brand-forest-600 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    عرض الكل <i className="ri-arrow-left-line"></i>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === "all" ? matchedDoctors.slice(0, 3) : matchedDoctors).map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doctors/${doc.id}`}
                    className="bg-white rounded-2xl border border-brand-cream-200 p-4 flex items-start gap-4 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 text-sm group-hover:text-brand-forest-700 transition-colors">
                        <HighlightText text={doc.name} query={query} />
                      </h3>
                      <p className="text-brand-forest-600 text-xs font-semibold mt-0.5">
                        <HighlightText text={doc.specialty} query={query} />
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{doc.experience}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-amber-400 text-xs"></i>
                          <span className="text-xs font-bold text-gray-700">{doc.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">({doc.reviewsCount} تقييم)</span>
                        <span className="text-xs font-bold text-brand-forest-700 mr-auto">
                          {doc.consultationFee} ريال
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Services ── */}
          {showServices && matchedServices.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-rose-100 rounded-lg">
                    <i className="ri-stethoscope-line text-rose-600 text-sm"></i>
                  </div>
                  الخدمات الطبية
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    {matchedServices.length}
                  </span>
                </h2>
                {activeTab === "all" && matchedServices.length > 4 && (
                  <button
                    onClick={() => setActiveTab("services")}
                    className="text-xs text-brand-forest-600 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    عرض الكل <i className="ri-arrow-left-line"></i>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(activeTab === "all" ? matchedServices.slice(0, 4) : matchedServices).map((srv) => {
                  const accent = accentMap[srv.accentColor] ?? accentMap.forest;
                  const minPrice = Math.min(...srv.prices.map((p) => p.price));
                  return (
                    <Link
                      key={srv.id}
                      to={`/services/${srv.id}`}
                      className={`bg-white rounded-2xl border ${accent.border} p-4 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-3 ${accent.iconBg}`}>
                        <i className={`${srv.icon} text-lg ${accent.text}`}></i>
                      </div>
                      <h3 className={`font-black text-gray-900 text-sm mb-1 group-hover:${accent.text} transition-colors`}>
                        <HighlightText text={srv.name} query={query} />
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{srv.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400">من</p>
                          <p className={`text-sm font-black ${accent.text}`}>{minPrice.toLocaleString()} ريال</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                          {srv.category}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Packages ── */}
          {showPackages && matchedPackages.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-amber-100 rounded-lg">
                    <i className="ri-gift-line text-amber-600 text-sm"></i>
                  </div>
                  الباقات الطبية
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    {matchedPackages.length}
                  </span>
                </h2>
                {activeTab === "all" && matchedPackages.length > 4 && (
                  <button
                    onClick={() => setActiveTab("packages")}
                    className="text-xs text-brand-forest-600 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    عرض الكل <i className="ri-arrow-left-line"></i>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(activeTab === "all" ? matchedPackages.slice(0, 4) : matchedPackages).map((pkg) => {
                  const accent = accentMap[pkg.accentColor] ?? accentMap.forest;
                  const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
                  return (
                    <Link
                      key={pkg.id}
                      to={`/packages/${pkg.id}`}
                      className={`bg-white rounded-2xl border ${accent.border} p-4 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group relative`}
                    >
                      {pkg.badge && (
                        <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.btn.split(" ")[0]}`}>
                          {pkg.badge}
                        </span>
                      )}
                      <div className={`w-9 h-9 flex items-center justify-center rounded-xl mb-3 ${accent.iconBg}`}>
                        <i className={`${pkg.icon} text-base ${accent.text}`}></i>
                      </div>
                      <h3 className="font-black text-gray-900 text-sm mb-1">
                        <HighlightText text={pkg.name} query={query} />
                      </h3>
                      <p className={`text-[10px] font-semibold mb-2 ${accent.text}`}>{pkg.category}</p>
                      <ul className="space-y-1 mb-3">
                        {pkg.features.slice(0, 2).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <div className={`w-3 h-3 flex items-center justify-center rounded-full flex-shrink-0 ${accent.iconBg}`}>
                              <i className={`ri-check-line text-[8px] ${accent.text}`}></i>
                            </div>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between pt-2 border-t border-brand-cream-100">
                        <div>
                          {pkg.originalPrice && (
                            <p className="text-[10px] text-gray-400 line-through">{pkg.originalPrice.toLocaleString()} ر</p>
                          )}
                          <p className={`text-base font-black ${accent.text}`}>
                            {pkg.price.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-gray-400">ريال</span>
                          </p>
                        </div>
                        {savings > 0 && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
                            وفر {savings.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Blog ── */}
          {showBlog && matchedBlog.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-violet-100 rounded-lg">
                    <i className="ri-article-line text-violet-600 text-sm"></i>
                  </div>
                  المقالات الطبية
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">
                    {matchedBlog.length}
                  </span>
                </h2>
                {activeTab === "all" && matchedBlog.length > 3 && (
                  <button
                    onClick={() => setActiveTab("blog")}
                    className="text-xs text-brand-forest-600 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    عرض الكل <i className="ri-arrow-left-line"></i>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === "all" ? matchedBlog.slice(0, 3) : matchedBlog).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="bg-white rounded-2xl border border-brand-cream-200 overflow-hidden hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="h-36 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-brand-cream-100 text-brand-forest-700 px-2 py-0.5 rounded-full border border-brand-cream-200">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-gray-400">{post.readTime}</span>
                      </div>
                      <h3 className="font-black text-gray-900 text-sm leading-snug mb-1 group-hover:text-brand-forest-700 transition-colors line-clamp-2">
                        <HighlightText text={post.title} query={query} />
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-cream-100">
                        <img src={post.authorImage} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs text-gray-500">{post.author}</span>
                        <span className="text-xs text-gray-400 mr-auto">{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Quick Links when no query */}
        {!query && quickLinks.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl border border-brand-cream-200 p-6">
            <h3 className="font-black text-brand-forest-800 text-sm mb-4 flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-links-line text-brand-forest-600 text-sm"></i>
              </div>
              روابط سريعة
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-all hover:-translate-y-0.5 ${
                    item.colorStyle === "primary"
                      ? "bg-brand-forest-600 text-white hover:bg-brand-forest-700"
                      : item.colorStyle === "amber"
                      ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      : item.colorStyle === "cream"
                      ? "bg-brand-cream-100 text-brand-forest-700 border border-brand-cream-200 hover:bg-brand-cream-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA from CMS */}
        {!query && cta.active && (
          <div className="mt-6 bg-brand-forest-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-cream-300/20 rounded-xl flex-shrink-0">
                <i className={`${cta.icon} text-brand-cream-200 text-2xl`}></i>
              </div>
              <div>
                <h4 className="font-black text-white text-sm">{cta.title}</h4>
                <p className="text-brand-cream-300 text-xs mt-0.5">{cta.subtitle}</p>
              </div>
            </div>
            <Link
              to={cta.ctaPath}
              className="bg-brand-cream-300 text-brand-forest-900 text-sm font-black px-6 py-2.5 rounded-xl hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              {cta.ctaLabel}
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
