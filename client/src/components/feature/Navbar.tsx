import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import { servicesData } from "@/mocks/servicesData";
import { allPackages } from "@/mocks/packagesData";
import i18n from "@/i18n";

const navLinks = [
  { label: "الرئيسية",        path: "/" },
  { label: "من نحن",          path: "/about" },
  { label: "خدماتنا",         path: "/services" },
  { label: "الاستشاريون",     path: "/doctors" },
  { label: "مستويات الرعاية", path: "/packages" },
  { label: "DNA Simulator",   path: "/dna-simulator" },
  { label: "العروض",          path: "/offers" },
  { label: "المدونة",         path: "/blog" },
  { label: "الأسئلة الشائعة", path: "/faq" },
  { label: "تواصل معنا",      path: "/contact" },
];

function QuickSearchDropdown({ query, onClose, doctorsDetailed }: { query: string; onClose: () => void; doctorsDetailed: any[] }) {
  const navigate = useNavigate();
  const q = query.toLowerCase().trim();

  const doctors = doctorsDetailed
    .filter((d) => d.name.includes(q) || d.specialty.toLowerCase().includes(q))
    .slice(0, 3);

  const services = servicesData
    .filter((s) => s.name.includes(q) || s.category.includes(q))
    .slice(0, 2);

  const packages = allPackages
    .filter((p) => p.name.includes(q) || p.category.includes(q))
    .slice(0, 2);

  const hasResults = doctors.length > 0 || services.length > 0 || packages.length > 0;

  const handleFullSearch = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  if (!q) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-cream-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
      style={{ boxShadow: "0 12px 40px rgba(46,78,69,0.14)" }}
    >
      {!hasResults ? (
        <div className="p-5 text-center">
          <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-100 rounded-full mx-auto mb-2">
            <i className="ri-search-line text-brand-forest-400 text-base"></i>
          </div>
          <p className="text-sm text-gray-500 mb-2">لا توجد نتائج لـ &quot;{query}&quot;</p>
          <button
            onClick={handleFullSearch}
            className="text-xs text-brand-forest-600 font-semibold hover:underline cursor-pointer"
          >
            بحث متقدم
          </button>
        </div>
      ) : (
        <div>
          {doctors.length > 0 && (
            <div className="p-3 border-b border-brand-cream-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">الأطباء</p>
              {doctors.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/doctors/${doc.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-brand-cream-50 transition-colors cursor-pointer"
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-8 h-8 rounded-lg object-cover object-top flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-brand-forest-600">{doc.specialty}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{doc.consultationFee} ريال</span>
                </Link>
              ))}
            </div>
          )}

          {services.length > 0 && (
            <div className="p-3 border-b border-brand-cream-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">الخدمات</p>
              {services.map((srv) => (
                <Link
                  key={srv.id}
                  to={`/services/${srv.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-brand-cream-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-100 rounded-lg flex-shrink-0">
                    <i className={`${srv.icon} text-brand-forest-600 text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{srv.name}</p>
                    <p className="text-xs text-gray-400">{srv.category}</p>
                  </div>
                  <span className="text-xs text-brand-forest-600 font-semibold flex-shrink-0">
                    من {Math.min(...srv.prices.map((p) => p.price)).toLocaleString()} ر
                  </span>
                </Link>
              ))}
            </div>
          )}

          {packages.length > 0 && (
            <div className="p-3 border-b border-brand-cream-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">الباقات</p>
              {packages.map((pkg) => (
                <Link
                  key={pkg.id}
                  to={`/packages/${pkg.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-brand-cream-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-100 rounded-lg flex-shrink-0">
                    <i className={`${pkg.icon} text-brand-forest-600 text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{pkg.name}</p>
                    <p className="text-xs text-gray-400">{pkg.category}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-forest-700 flex-shrink-0">
                    {pkg.price.toLocaleString()} ريال
                  </span>
                </Link>
              ))}
            </div>
          )}

          <button
            onClick={handleFullSearch}
            className="w-full flex items-center justify-center gap-2 p-3.5 text-sm font-bold text-brand-forest-700 hover:bg-brand-cream-50 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm"></i>
            </div>
            عرض جميع نتائج &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ hasTopStrip = false }: { hasTopStrip?: boolean }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLang, setCurrentLang] = useState<"ar" | "en">(
    (i18n.language?.startsWith("en") ? "en" : "ar") as "ar" | "en"
  );
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { doctors: doctorsDetailed } = usePublicDoctors();

  const toggleLanguage = () => {
    const next = currentLang === "ar" ? "en" : "ar";
    setCurrentLang(next);
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  const navLinks = [
    { label: t("nav.home"),          path: "/" },
    { label: t("nav.about"),         path: "/about" },
    { label: t("nav.services"),      path: "/services" },
    { label: t("nav.doctors"),       path: "/doctors" },
    { label: t("nav.packages"),      path: "/packages" },
    { label: t("nav.dna_simulator"), path: "/dna-simulator" },
    { label: t("nav.offers"),        path: "/offers" },
    { label: t("nav.blog"),          path: "/blog" },
    { label: t("nav.faq"),           path: "/faq" },
    { label: t("nav.contact"),       path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header
      dir={currentLang === "ar" ? "rtl" : "ltr"}
      className={`fixed right-0 left-0 z-50 transition-all duration-300 ${
        hasTopStrip ? "top-10" : "top-0"
      } ${
        scrolled
          ? "bg-white/97 backdrop-blur-md border-b border-brand-cream-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20 gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <img
            src="https://static.readdy.ai/image/8d67d4b5b60a62e7b1df4167f7b5245a/0d280bb6e2b005ae80d8003369a0b5aa.png"
            alt="شعار العيادة"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer py-1 ${
                isActive(link.path)
                  ? scrolled
                    ? "text-brand-forest-700 font-semibold"
                    : "text-white font-semibold"
                  : scrolled
                  ? "text-gray-600 hover:text-brand-forest-700"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
              {/* Active underline indicator */}
              {isActive(link.path) && (
                <span
                  className={`absolute bottom-0 right-0 left-0 h-0.5 rounded-full ${
                    scrolled ? "bg-brand-forest-600" : "bg-brand-cream-300"
                  }`}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap ${
              scrolled
                ? "border-brand-cream-300 text-brand-forest-700 hover:bg-brand-cream-100"
                : "border-white/30 text-white hover:bg-white/15"
            }`}
            aria-label="تغيير اللغة"
          >
            <i className="ri-translate-2 text-sm"></i>
            {t("nav.lang_switch")}
          </button>

          {/* Search */}
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                    <i className="ri-search-line text-sm text-brand-forest-400"></i>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("nav.search")}
                    className="w-52 bg-white text-gray-800 text-sm pr-9 pl-3 py-2 rounded-full border border-brand-cream-200 outline-none focus:border-brand-forest-400 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className={`mr-1 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                    scrolled
                      ? "hover:bg-brand-cream-100 text-gray-500"
                      : "hover:bg-white/20 text-white"
                  }`}
                >
                  <i className="ri-close-line text-base"></i>
                </button>
                {searchQuery.trim() && (
                  <QuickSearchDropdown
                    query={searchQuery}
                    onClose={() => { setSearchOpen(false); setSearchQuery(""); }}
                    doctorsDetailed={doctorsDetailed}
                  />
                )}
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  scrolled
                    ? "hover:bg-brand-cream-100 text-brand-forest-600"
                    : "hover:bg-white/15 text-white"
                }`}
                aria-label="بحث"
              >
                <i className="ri-search-line text-lg"></i>
              </button>
            )}
          </div>

          {/* Book CTA */}
          <Link
            to="/booking"
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
              scrolled
                ? "bg-brand-forest-700 hover:bg-brand-forest-800 text-white"
                : "bg-brand-cream-300 hover:bg-brand-cream-200 text-brand-forest-900"
            }`}
          >
            <i className="ri-calendar-check-line text-base"></i>
            {t("nav.book")}
          </Link>
        </div>

        {/* ── Mobile Actions ── */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            to="/search"
            className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
              scrolled ? "text-brand-forest-700 hover:bg-brand-cream-100" : "text-white hover:bg-white/15"
            }`}
          >
            <i className="ri-search-line text-xl"></i>
          </Link>
          <button
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full transition-colors ${
              scrolled ? "hover:bg-brand-cream-100" : "hover:bg-white/15"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            <i
              className={`text-2xl transition-all ${
                scrolled ? "text-brand-forest-800" : "text-white"
              } ${menuOpen ? "ri-close-line" : "ri-menu-line"}`}
            ></i>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-brand-cream-200 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center justify-between text-sm font-medium py-2.5 px-3 rounded-xl cursor-pointer transition-colors ${
                isActive(link.path)
                  ? "bg-brand-cream-100 text-brand-forest-700 font-semibold"
                  : "text-gray-700 hover:bg-brand-cream-50"
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 flex-shrink-0"></div>
              )}
            </Link>
          ))}
          <Link
            to="/search"
            className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-gray-700 hover:bg-brand-cream-50 cursor-pointer transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-sm"></i>
            </div>
            {t("search.advanced")}
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-brand-forest-700 hover:bg-brand-cream-50 cursor-pointer transition-colors border border-brand-cream-200 w-full"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-translate-2 text-brand-forest-600 text-sm"></i>
            </div>
            {currentLang === "ar" ? "Switch to English" : "التبديل للعربية"}
          </button>
          <Link
            to="/booking"
            className="mt-2 bg-brand-forest-700 hover:bg-brand-forest-800 text-white text-sm font-semibold px-5 py-3 rounded-full text-center cursor-pointer whitespace-nowrap transition-colors"
          >
            {t("nav.book")}
          </Link>
        </div>
      )}
    </header>
  );
}
