import { useState } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import { useCMSSearch } from "@/hooks/useCMSSearch";
import type {
  SearchHeroData, PopularSearch, QuickLink,
  SearchCTAData, SearchResultsConfig,
} from "@/types/cms";

import HeroEditor from "./components/SearchHeroEditor";
import PopularEditor from "./components/PopularSearchesEditor";
import LinksEditor from "./components/QuickLinksEditor";
import ResultsEditor from "./components/SearchResultsConfigEditor";
import CTAEditor from "./components/SearchCTAEditor";

type TabId = "hero" | "popular" | "links" | "results" | "cta";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "hero",    label: "الهيرو",            icon: "ri-layout-top-line" },
  { id: "popular", label: "البحث الشائع",      icon: "ri-fire-line" },
  { id: "links",   label: "الروابط السريعة",   icon: "ri-links-line" },
  { id: "results", label: "إعدادات النتائج",   icon: "ri-settings-3-line" },
  { id: "cta",     label: "بانر CTA",          icon: "ri-megaphone-line" },
];


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCMSSearch() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const { hero, popular, quickLinks, cta, resultsConfig, saveStatus, hasChanges,
    updateHero, updatePopular, updateQuickLinks, updateCta, updateResultsConfig,
    save, reset } = useCMSSearch();

  const activePopular = popular.filter((p) => p.active).length;
  const activeLinks   = quickLinks.filter((l) => l.active).length;
  const activeSections = [resultsConfig.showDoctors, resultsConfig.showServices, resultsConfig.showPackages, resultsConfig.showBlog].filter(Boolean).length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto" dir="rtl">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2E4E45]">إدارة صفحة البحث</h2>
            <p className="text-sm text-gray-400 mt-0.5">تحكم في محتوى صفحة البحث والفلاتر وإعدادات النتائج</p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button onClick={() => reset()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line" /> إعادة تعيين
              </button>
            )}
            <a href="/search" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              <i className="ri-external-link-line" /> معاينة
            </a>
            <button onClick={() => save({ hero, popular, quickLinks, cta, resultsConfig })}
              disabled={!hasChanges || saveStatus === "saving"}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap
                ${saveStatus === "saved" ? "bg-green-500 text-white"
                  : hasChanges ? "bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              {saveStatus === "saving" ? <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
                : saveStatus === "saved" ? <><i className="ri-check-line" /> تم الحفظ!</>
                : <><i className="ri-save-line" /> حفظ التغييرات</>}
            </button>
          </div>
        </div>

        {/* ── Changes Banner ── */}
        {hasChanges && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2.5 rounded-lg mb-5">
            <i className="ri-error-warning-line" />
            <span>لديك تغييرات غير محفوظة</span>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: "ri-fire-line",        bg: "bg-amber-50",      color: "text-amber-600",    value: String(activePopular),  label: "عبارات بحث شائعة",    sub: `من ${popular.length} إجمالي` },
            { icon: "ri-layout-grid-line", bg: "bg-[#2E4E45]/10",  color: "text-[#2E4E45]",    value: String(activeSections), label: "أقسام نتائج نشطة",    sub: "من 4 أقسام" },
            { icon: "ri-links-line",       bg: "bg-violet-50",     color: "text-violet-600",   value: String(activeLinks),    label: "روابط سريعة نشطة",    sub: `من ${quickLinks.length} إجمالي` },
            { icon: "ri-search-line",      bg: "bg-rose-50",       color: "text-rose-600",
              value: String(resultsConfig.doctorsPreviewCount + resultsConfig.servicesPreviewCount + resultsConfig.packagesPreviewCount + resultsConfig.blogPreviewCount),
              label: "إجمالي نتائج المعاينة", sub: "في تبويب الكل" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${s.bg} mb-2`}>
                <i className={`${s.icon} ${s.color} text-base`} />
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1.5 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-all
                ${activeTab === tab.id ? "bg-[#2E4E45] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {activeTab === "hero"    && <HeroEditor    data={hero}          onChange={updateHero} />}
        {activeTab === "popular" && <PopularEditor data={popular}       onChange={updatePopular} />}
        {activeTab === "links"   && <LinksEditor   data={quickLinks}    onChange={updateQuickLinks} />}
        {activeTab === "results" && <ResultsEditor data={resultsConfig} onChange={updateResultsConfig} />}
        {activeTab === "cta"     && <CTAEditor     data={cta}           onChange={updateCta} />}

        {/* ── Bottom Save Bar ── */}
        {hasChanges && (
          <div className="mt-6 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <i className="ri-error-warning-line" />
              <span>تغييرات غير محفوظة</span>
            </div>
            <button onClick={() => save({ hero, popular, quickLinks, cta, resultsConfig })}
              disabled={saveStatus === "saving"}
              className="px-5 py-2 text-sm font-bold bg-[#2E4E45] text-white rounded-lg hover:bg-[#2E4E45]/90 cursor-pointer whitespace-nowrap disabled:opacity-60">
              {saveStatus === "saving" ? "جاري الحفظ..." : <><i className="ri-save-line ml-1" />حفظ الآن</>}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
