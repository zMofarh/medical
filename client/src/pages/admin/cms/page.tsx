import { useState } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import CMSHeroEditor from "./components/CMSHeroEditor";
import CMSWhyUsEditor from "./components/CMSWhyUsEditor";
import CMSCTAEditor from "./components/CMSCTAEditor";
import CMSTrustBarEditor from "./components/CMSTrustBarEditor";
import CMSTestimonialsEditor from "./components/CMSTestimonialsEditor";
import CMSServicesEditor from "./components/CMSServicesEditor";
import CMSDoctorsEditor from "./components/CMSDoctorsEditor";
import CMSPackagesEditor from "./components/CMSPackagesEditor";
import { useCMSHome } from "@/hooks/useCMSHome";
import { useCMSServices } from "@/hooks/useCMSServices";
import { useCMSDoctors } from "@/hooks/useCMSDoctors";
import { useCMSPackages } from "@/hooks/useCMSPackages";
import { type CMSContent } from "@/mocks/cmsData";

type TabKey = "home" | "services" | "doctors" | "packages";
type HomeSectionKey = keyof Omit<CMSContent, "lastUpdated">;

const homeSectionIcons: Record<HomeSectionKey, string> = {
  hero: "ri-layout-top-line",
  whyUs: "ri-question-answer-line",
  cta: "ri-megaphone-line",
  trustBar: "ri-bar-chart-box-line",
  testimonials: "ri-chat-quote-line",
};

const homeSectionLabels: Record<HomeSectionKey, string> = {
  hero: "قسم الهيرو",
  whyUs: "لماذا نحن",
  cta: "قسم CTA",
  trustBar: "شريط الثقة",
  testimonials: "آراء المرضى",
};

const homeSectionDescriptions: Record<HomeSectionKey, string> = {
  hero: "الصورة الرئيسية، العنوان، الأزرار، الإحصائيات",
  whyUs: "مميزات العيادة والصورة الجانبية",
  cta: "قسم الدعوة للحجز والتواصل",
  trustBar: "شريط الأرقام والإحصائيات",
  testimonials: "آراء وتقييمات المرضى",
};

const homeSectionOrder: HomeSectionKey[] = ["hero", "whyUs", "cta", "trustBar", "testimonials"];

const tabs: { key: TabKey; label: string; icon: string; desc: string }[] = [
  { key: "home", label: "الصفحة الرئيسية", icon: "ri-home-4-line", desc: "نصوص وصور الصفحة الرئيسية" },
  { key: "services", label: "الخدمات", icon: "ri-stethoscope-line", desc: "إدارة محتوى صفحات الخدمات" },
  { key: "doctors", label: "الأطباء", icon: "ri-user-star-line", desc: "إدارة ملفات الأطباء" },
  { key: "packages", label: "الباقات", icon: "ri-vip-crown-line", desc: "إدارة الباقات والأسعار" },
];

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [activeHomeSection, setActiveHomeSection] = useState<HomeSectionKey>("hero");

  const home = useCMSHome();
  const services = useCMSServices();
  const doctors = useCMSDoctors();
  const packages = useCMSPackages();

  const handleSave = async (tab: TabKey) => {
    if (tab === "home") await home.save(home.content);
    if (tab === "services") await services.save(services.services);
    if (tab === "doctors") await doctors.save(doctors.doctors);
    if (tab === "packages") await packages.save(packages.packages);
  };

  const handleReset = (tab: TabKey) => {
    if (tab === "home") home.reset();
    if (tab === "services") services.reset();
    if (tab === "doctors") doctors.reset();
    if (tab === "packages") packages.reset();
  };

  const currentHasChanges = {
    home: home.hasChanges,
    services: services.hasChanges,
    doctors: doctors.hasChanges,
    packages: packages.hasChanges,
  }[activeTab];

  const currentSaveStatus = {
    home: home.saveStatus,
    services: services.saveStatus,
    doctors: doctors.saveStatus,
    packages: packages.saveStatus,
  }[activeTab];

  const currentLoading = {
    home: home.loading,
    services: services.loading,
    doctors: doctors.loading,
    packages: packages.loading,
  }[activeTab];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto" dir="rtl">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2E4E45]">إدارة المحتوى (CMS)</h2>
            <p className="text-sm text-gray-400 mt-0.5">تحكم بكل محتوى الموقع من مكان واحد</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-eye-line" />
              معاينة الموقع
            </a>
            <button
              onClick={() => handleReset(activeTab)}
              disabled={!currentHasChanges}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="ri-refresh-line" />
              إعادة تعيين
            </button>
            <button
              onClick={() => handleSave(activeTab)}
              disabled={!currentHasChanges || currentSaveStatus === "saving"}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap
                ${currentSaveStatus === "saved"
                  ? "bg-green-500 text-white"
                  : currentHasChanges
                  ? "bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {currentSaveStatus === "saving" ? (
                <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
              ) : currentSaveStatus === "saved" ? (
                <><i className="ri-check-line" /> تم الحفظ!</>
              ) : (
                <><i className="ri-save-line" /> حفظ التغييرات</>
              )}
            </button>
          </div>
        </div>

        {/* ── Status Banners ── */}
        {currentHasChanges && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2.5 rounded-lg mb-5">
            <i className="ri-error-warning-line" />
            <span>لديك تغييرات غير محفوظة — تذكر الحفظ قبل مغادرة الصفحة</span>
          </div>
        )}
        {currentLoading && (
          <div className="flex items-center gap-2 bg-[#2E4E45]/5 border border-[#2E4E45]/20 text-[#2E4E45] text-sm px-4 py-2.5 rounded-lg mb-5">
            <i className="ri-loader-4-line animate-spin" />
            <span>جاري تحميل المحتوى...</span>
          </div>
        )}

        {/* ── Main Tabs ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => {
            const hasChanges = {
              home: home.hasChanges,
              services: services.hasChanges,
              doctors: doctors.hasChanges,
              packages: packages.hasChanges,
            }[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap relative
                  ${activeTab === tab.key
                    ? "bg-[#2E4E45] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${tab.icon} text-sm`} />
                </div>
                {tab.label}
                {hasChanges && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════
            HOME TAB
        ══════════════════════════════════════════ */}
        {activeTab === "home" && (
          <div className="flex gap-6">

            {/* Sidebar Navigation */}
            <div className="w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-20">
                <div className="px-4 py-3 border-b border-gray-100 bg-[#2E4E45]/3">
                  <p className="text-xs font-bold text-[#2E4E45] uppercase tracking-wide">أقسام الصفحة الرئيسية</p>
                </div>
                <nav className="p-2 space-y-0.5">
                  {homeSectionOrder.map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveHomeSection(key)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-sm transition-all cursor-pointer text-right
                        ${activeHomeSection === key
                          ? "bg-[#2E4E45] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`${homeSectionIcons[key]} text-base`} />
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold whitespace-nowrap ${activeHomeSection === key ? "text-white" : "text-gray-700"}`}>
                          {homeSectionLabels[key]}
                        </p>
                        <p className={`text-xs mt-0.5 leading-tight ${activeHomeSection === key ? "text-white/70" : "text-gray-400"}`}>
                          {homeSectionDescriptions[key]}
                        </p>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Last Updated */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-gray-400">آخر حفظ</p>
                  <p className="text-xs font-medium text-gray-600 mt-0.5">
                    {new Date(home.content.lastUpdated).toLocaleDateString("ar-SA", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(home.content.lastUpdated).toLocaleTimeString("ar-SA", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Quick Links */}
                <div className="px-3 py-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 mb-2 px-1">روابط سريعة</p>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-[#2E4E45] transition-colors"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-external-link-line text-sm" />
                    </div>
                    <span>معاينة الصفحة الرئيسية</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 min-w-0">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5 bg-white rounded-xl border border-gray-100 px-5 py-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl flex-shrink-0">
                  <i className={`${homeSectionIcons[activeHomeSection]} text-[#2E4E45] text-xl`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800">{homeSectionLabels[activeHomeSection]}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{homeSectionDescriptions[activeHomeSection]}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Section navigation arrows */}
                  <button
                    onClick={() => {
                      const idx = homeSectionOrder.indexOf(activeHomeSection);
                      if (idx > 0) setActiveHomeSection(homeSectionOrder[idx - 1]);
                    }}
                    disabled={homeSectionOrder.indexOf(activeHomeSection) === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-lg" />
                  </button>
                  <button
                    onClick={() => {
                      const idx = homeSectionOrder.indexOf(activeHomeSection);
                      if (idx < homeSectionOrder.length - 1) setActiveHomeSection(homeSectionOrder[idx + 1]);
                    }}
                    disabled={homeSectionOrder.indexOf(activeHomeSection) === homeSectionOrder.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-left-s-line text-lg" />
                  </button>
                </div>
              </div>

              {/* Editors */}
              {activeHomeSection === "hero" && (
                <CMSHeroEditor data={home.content.hero} onChange={(d) => home.updateSection("hero", d)} />
              )}
              {activeHomeSection === "whyUs" && (
                <CMSWhyUsEditor data={home.content.whyUs} onChange={(d) => home.updateSection("whyUs", d)} />
              )}
              {activeHomeSection === "cta" && (
                <CMSCTAEditor data={home.content.cta} onChange={(d) => home.updateSection("cta", d)} />
              )}
              {activeHomeSection === "trustBar" && (
                <CMSTrustBarEditor data={home.content.trustBar} onChange={(d) => home.updateSection("trustBar", d)} />
              )}
              {activeHomeSection === "testimonials" && (
                <CMSTestimonialsEditor data={home.content.testimonials} onChange={(d) => home.updateSection("testimonials", d)} />
              )}

              {/* Bottom Save Bar */}
              {home.hasChanges && (
                <div className="mt-6 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <i className="ri-error-warning-line" />
                    <span>تغييرات غير محفوظة في هذا القسم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => home.reset()}
                      className="px-4 py-2 text-sm text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      تجاهل
                    </button>
                    <button
                      onClick={() => handleSave("home")}
                      disabled={home.saveStatus === "saving"}
                      className="px-5 py-2 text-sm font-bold bg-[#2E4E45] text-white rounded-lg hover:bg-[#2E4E45]/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                    >
                      {home.saveStatus === "saving" ? (
                        <><i className="ri-loader-4-line animate-spin ml-1" />جاري الحفظ...</>
                      ) : (
                        <><i className="ri-save-line ml-1" />حفظ الآن</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            SERVICES TAB
        ══════════════════════════════════════════ */}
        {activeTab === "services" && (
          <div>
            <div className="flex items-center gap-3 mb-5 bg-white rounded-xl border border-gray-100 px-5 py-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl">
                <i className="ri-stethoscope-line text-[#2E4E45] text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">إدارة الخدمات</h3>
                <p className="text-xs text-gray-400 mt-0.5">تعديل محتوى صفحات الخدمات — {services.services.length} خدمة</p>
              </div>
              <a
                href="/services"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-external-link-line" />
                معاينة
              </a>
            </div>
            <CMSServicesEditor data={services.services} onChange={services.updateServices} />
          </div>
        )}

        {/* ══════════════════════════════════════════
            DOCTORS TAB
        ══════════════════════════════════════════ */}
        {activeTab === "doctors" && (
          <div>
            <div className="flex items-center gap-3 mb-5 bg-white rounded-xl border border-gray-100 px-5 py-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl">
                <i className="ri-user-star-line text-[#2E4E45] text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">إدارة الأطباء</h3>
                <p className="text-xs text-gray-400 mt-0.5">تعديل ملفات الأطباء — {doctors.doctors.length} طبيب</p>
              </div>
              <a
                href="/doctors"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-external-link-line" />
                معاينة
              </a>
            </div>
            <CMSDoctorsEditor data={doctors.doctors} onChange={doctors.updateDoctors} />
          </div>
        )}

        {/* ══════════════════════════════════════════
            PACKAGES TAB
        ══════════════════════════════════════════ */}
        {activeTab === "packages" && (
          <div>
            <div className="flex items-center gap-3 mb-5 bg-white rounded-xl border border-gray-100 px-5 py-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl">
                <i className="ri-vip-crown-line text-[#2E4E45] text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">إدارة الباقات</h3>
                <p className="text-xs text-gray-400 mt-0.5">تعديل الباقات والأسعار — {packages.packages.length} باقة</p>
              </div>
              <a
                href="/packages"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <i className="ri-external-link-line" />
                معاينة
              </a>
            </div>
            <CMSPackagesEditor data={packages.packages} onChange={packages.updatePackages} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
