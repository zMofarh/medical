import { useState } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import { useCMSSearch } from "@/hooks/useCMSSearch";
import type {
  SearchHeroData, PopularSearch, QuickLink,
  SearchCTAData, SearchResultsConfig,
} from "@/mocks/searchPageData";

type TabId = "hero" | "popular" | "links" | "results" | "cta";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "hero",    label: "الهيرو",            icon: "ri-layout-top-line" },
  { id: "popular", label: "البحث الشائع",      icon: "ri-fire-line" },
  { id: "links",   label: "الروابط السريعة",   icon: "ri-links-line" },
  { id: "results", label: "إعدادات النتائج",   icon: "ri-settings-3-line" },
  { id: "cta",     label: "بانر CTA",          icon: "ri-megaphone-line" },
];

const LINK_ICONS = [
  "ri-calendar-check-line", "ri-gift-line", "ri-user-heart-line", "ri-phone-line",
  "ri-home-line", "ri-stethoscope-line", "ri-article-line", "ri-map-pin-line",
  "ri-star-line", "ri-heart-pulse-line", "ri-hospital-line", "ri-search-line",
  "ri-external-link-line", "ri-arrow-right-line", "ri-dna-line", "ri-microscope-line",
];

const LINK_COLORS: { id: string; label: string; preview: string }[] = [
  { id: "primary", label: "أخضر",   preview: "bg-[#2E4E45] text-white" },
  { id: "amber",   label: "ذهبي",   preview: "bg-amber-50 text-amber-700 border border-amber-200" },
  { id: "cream",   label: "كريمي",  preview: "bg-[#f5f0e8] text-[#2E4E45] border border-[#e8dfc8]" },
  { id: "gray",    label: "رمادي",  preview: "bg-gray-100 text-gray-700" },
  { id: "rose",    label: "وردي",   preview: "bg-rose-50 text-rose-700 border border-rose-200" },
];

// ─── Hero Editor ──────────────────────────────────────────────────────────────
function HeroEditor({ data, onChange }: { data: SearchHeroData; onChange: (d: SearchHeroData) => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-4 flex items-center gap-2">
          <i className="ri-text-wrap text-base" /> نصوص الهيرو
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الشارة (Badge)</label>
            <input value={data.badge} onChange={(e) => onChange({ ...data, badge: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان الرئيسي</label>
            <input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">النص التوضيحي</label>
            <input value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">نص placeholder حقل البحث</label>
            <input value={data.placeholder} onChange={(e) => onChange({ ...data, placeholder: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#2E4E45] via-[#3a6358] to-[#2E4E45] p-8 text-center">
        <p className="text-xs text-white/40 mb-4">معاينة مباشرة</p>
        <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/20">
          <i className="ri-search-eye-line text-sm" />
          {data.badge}
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{data.title}</h2>
        <p className="text-white/60 text-sm mb-6">{data.subtitle}</p>
        <div className="relative max-w-md mx-auto">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
            <i className="ri-search-line text-gray-400 text-lg" />
          </div>
          <div className="w-full bg-white rounded-full py-3.5 pr-12 pl-5 text-sm text-gray-400 text-right">
            {data.placeholder}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Popular Searches Editor ──────────────────────────────────────────────────
function PopularEditor({ data, onChange }: { data: PopularSearch[]; onChange: (d: PopularSearch[]) => void }) {
  const [newLabel, setNewLabel] = useState("");

  const toggle = (id: string) => onChange(data.map((i) => i.id === id ? { ...i, active: !i.active } : i));
  const remove = (id: string) => onChange(data.filter((i) => i.id !== id));
  const updateLabel = (id: string, label: string) => onChange(data.map((i) => i.id === id ? { ...i, label } : i));

  const add = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    onChange([...data, { id: `ps-${Date.now()}`, label: trimmed, active: true }]);
    setNewLabel("");
  };

  const activeItems = data.filter((i) => i.active);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2E4E45]">عبارات البحث الشائعة</h3>
            <p className="text-xs text-gray-400 mt-0.5">{activeItems.length} نشط من {data.length} إجمالي</p>
          </div>
        </div>

        <div className="bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-lg p-3 mb-4 flex items-start gap-2">
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-[#2E4E45] text-sm" />
          </div>
          <p className="text-xs text-[#2E4E45]/80 leading-relaxed">
            هذه العبارات تظهر أسفل حقل البحث عندما لا يكتب المستخدم شيئاً. تساعد في توجيه الزوار لأبرز المحتويات.
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {data.map((item) => (
            <div key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.active ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className="ri-drag-move-line text-gray-300 text-sm" />
              </div>
              <input value={item.label} onChange={(e) => updateLabel(item.id, e.target.value)}
                className="flex-1 text-sm text-gray-800 bg-transparent border-none outline-none" />
              <span className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${item.active ? "bg-[#2E4E45]/8 text-[#2E4E45] border-[#2E4E45]/20" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                {item.label}
              </span>
              <button onClick={() => toggle(item.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors flex-shrink-0 ${item.active ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                <i className={`${item.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`} />
              </button>
              <button onClick={() => remove(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer flex-shrink-0">
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="أضف عبارة بحث جديدة..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          <button onClick={add} disabled={!newLabel.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" /> إضافة
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 mb-3">معاينة — كيف تظهر في الصفحة:</p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-[#2E4E45]/60">بحث شائع:</span>
          {activeItems.map((item) => (
            <span key={item.id} className="text-xs bg-white text-[#2E4E45] px-3 py-1.5 rounded-full border border-[#2E4E45]/20 whitespace-nowrap">
              {item.label}
            </span>
          ))}
          {activeItems.length === 0 && <span className="text-xs text-gray-400 italic">لا توجد عبارات نشطة</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Links Editor ───────────────────────────────────────────────────────
function LinksEditor({ data, onChange }: { data: QuickLink[]; onChange: (d: QuickLink[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<QuickLink>) => onChange(data.map((l) => l.id === id ? { ...l, ...patch } : l));
  const remove = (id: string) => { onChange(data.filter((l) => l.id !== id)); if (editingId === id) setEditingId(null); };

  const addLink = () => {
    const newLink: QuickLink = { id: `ql-${Date.now()}`, label: "رابط جديد", path: "/", icon: "ri-external-link-line", colorStyle: "gray", active: true };
    onChange([...data, newLink]);
    setEditingId(newLink.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">الروابط السريعة</p>
          <p className="text-xs text-gray-400 mt-0.5">{data.filter((l) => l.active).length} نشط من {data.length} إجمالي</p>
        </div>
        <button onClick={addLink}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A96E] text-white text-sm font-bold rounded-lg hover:bg-[#b8995e] cursor-pointer whitespace-nowrap">
          <i className="ri-add-line" /> إضافة رابط
        </button>
      </div>

      <div className="space-y-2">
        {data.map((link) => {
          const cs = LINK_COLORS.find((c) => c.id === link.colorStyle) ?? LINK_COLORS[0];
          const isEditing = editingId === link.id;
          return (
            <div key={link.id} className={`bg-white rounded-xl border transition-all ${isEditing ? "border-[#2E4E45]/30" : "border-gray-100"} ${!link.active ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 p-3.5">
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${cs.preview}`}>
                  <i className={`${link.icon} text-sm`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{link.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${link.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                      {link.active ? "نشط" : "مخفي"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{link.path}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => update(link.id, { active: !link.active })}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${link.active ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                    <i className={`${link.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`} />
                  </button>
                  <button onClick={() => setEditingId(isEditing ? null : link.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isEditing ? "bg-[#2E4E45] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    <i className={`${isEditing ? "ri-arrow-up-s-line" : "ri-pencil-line"} text-sm`} />
                  </button>
                  <button onClick={() => remove(link.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">النص</label>
                      <input value={link.label} onChange={(e) => update(link.id, { label: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">المسار (Path)</label>
                      <input value={link.path} onChange={(e) => update(link.id, { path: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
                        placeholder="/booking" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">الأيقونة</label>
                    <div className="flex flex-wrap gap-2">
                      {LINK_ICONS.map((icon) => (
                        <button key={icon} onClick={() => update(link.id, { icon })}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg border cursor-pointer transition-all
                            ${link.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                          <i className={`${icon} text-base`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">لون الزر</label>
                    <div className="flex flex-wrap gap-2">
                      {LINK_COLORS.map((c) => (
                        <button key={c.id} onClick={() => update(link.id, { colorStyle: c.id })}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all
                            ${link.colorStyle === c.id ? "ring-2 ring-[#2E4E45]" : ""} ${c.preview}`}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-12">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
              <i className="ri-links-line text-gray-400 text-xl" />
            </div>
            <p className="text-sm text-gray-500">لا توجد روابط. أضف رابطاً جديداً.</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {data.filter((l) => l.active).length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">معاينة الروابط السريعة:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {data.filter((l) => l.active).map((link) => {
              const cs = LINK_COLORS.find((c) => c.id === link.colorStyle) ?? LINK_COLORS[0];
              return (
                <div key={link.id} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${cs.preview}`}>
                  <i className={`${link.icon} text-sm`} />
                  {link.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Results Config Editor ────────────────────────────────────────────────────
function ResultsEditor({ data, onChange }: { data: SearchResultsConfig; onChange: (d: SearchResultsConfig) => void }) {
  const sections = [
    { key: "showDoctors",  countKey: "doctorsPreviewCount",  label: "الأطباء",   icon: "ri-user-star-line" },
    { key: "showServices", countKey: "servicesPreviewCount", label: "الخدمات",   icon: "ri-stethoscope-line" },
    { key: "showPackages", countKey: "packagesPreviewCount", label: "الباقات",   icon: "ri-vip-crown-line" },
    { key: "showBlog",     countKey: "blogPreviewCount",     label: "المدونة",   icon: "ri-article-line" },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-4 flex items-center gap-2">
          <i className="ri-settings-3-line text-base" /> إعدادات أقسام النتائج
        </h3>
        <div className="space-y-3">
          {sections.map((sec) => (
            <div key={sec.key} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${data[sec.key] ? "border-[#2E4E45]/20 bg-[#2E4E45]/3" : "border-gray-100 bg-gray-50 opacity-60"}`}>
              <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl flex-shrink-0">
                <i className={`${sec.icon} text-[#2E4E45] text-base`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{sec.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">عدد النتائج في المعاينة</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => onChange({ ...data, [sec.countKey]: Math.max(1, data[sec.countKey] - 1) })}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors">
                    <i className="ri-subtract-line text-xs" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-800">{data[sec.countKey]}</span>
                  <button onClick={() => onChange({ ...data, [sec.countKey]: Math.min(10, data[sec.countKey] + 1) })}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors">
                    <i className="ri-add-line text-xs" />
                  </button>
                </div>
                <button
                  onClick={() => onChange({ ...data, [sec.key]: !data[sec.key] })}
                  className={`w-11 h-6 rounded-full transition-all cursor-pointer relative flex-shrink-0 ${data[sec.key] ? "bg-[#2E4E45]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data[sec.key] ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-xl p-4">
        <p className="text-xs font-semibold text-[#2E4E45] mb-2">ملخص الإعدادات:</p>
        <div className="flex flex-wrap gap-3">
          {sections.filter((s) => data[s.key]).map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 bg-white border border-[#2E4E45]/15 rounded-lg px-3 py-1.5">
              <i className={`${s.icon} text-[#2E4E45] text-xs`} />
              <span className="text-xs font-medium text-gray-700">{s.label}</span>
              <span className="text-xs text-gray-400">({data[s.countKey]} نتائج)</span>
            </div>
          ))}
          {sections.every((s) => !data[s.key]) && (
            <p className="text-xs text-gray-400 italic">لا توجد أقسام نشطة</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CTA Editor ───────────────────────────────────────────────────────────────
function CTAEditor({ data, onChange }: { data: SearchCTAData; onChange: (d: SearchCTAData) => void }) {
  const CTA_ICONS = [
    "ri-dna-line", "ri-heart-pulse-line", "ri-microscope-line", "ri-stethoscope-line",
    "ri-hospital-line", "ri-star-line", "ri-award-line", "ri-shield-check-line",
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#2E4E45] flex items-center gap-2">
            <i className="ri-megaphone-line text-base" /> بانر CTA
          </h3>
          <button onClick={() => onChange({ ...data, active: !data.active })}
            className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${data.active ? "bg-[#2E4E45]" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.active ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">العنوان</label>
            <input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">النص التوضيحي</label>
            <input value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">نص الزر</label>
            <input value={data.ctaLabel} onChange={(e) => onChange({ ...data, ctaLabel: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">مسار الزر (Path)</label>
            <input value={data.ctaPath} onChange={(e) => onChange({ ...data, ctaPath: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
              placeholder="/services" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-2">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {CTA_ICONS.map((icon) => (
                <button key={icon} onClick={() => onChange({ ...data, icon })}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border cursor-pointer transition-all
                    ${data.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                  <i className={`${icon} text-base`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {data.active && (
        <div className="bg-[#2E4E45]/5 border border-[#2E4E45]/15 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl flex-shrink-0">
            <i className={`${data.icon} text-[#2E4E45] text-xl`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-800">{data.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{data.subtitle}</p>
          </div>
          <div className="bg-[#2E4E45] text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0">
            {data.ctaLabel}
          </div>
        </div>
      )}
    </div>
  );
}

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
