import { useState } from "react";
import { quickLinksData, type QuickLink } from "@/mocks/searchPageData";

const ICON_OPTIONS = [
  "ri-calendar-check-line", "ri-gift-line", "ri-user-heart-line", "ri-phone-line",
  "ri-home-line", "ri-stethoscope-line", "ri-article-line", "ri-map-pin-line",
  "ri-star-line", "ri-heart-pulse-line", "ri-hospital-line", "ri-search-line",
];

const COLOR_STYLES: { id: string; label: string; preview: string }[] = [
  { id: "primary", label: "أخضر (رئيسي)", preview: "bg-[#2E4E45] text-white" },
  { id: "amber",   label: "ذهبي",          preview: "bg-amber-50 text-amber-700 border border-amber-200" },
  { id: "cream",   label: "كريمي",          preview: "bg-[#f5f0e8] text-[#2E4E45] border border-[#e8dfc8]" },
  { id: "gray",    label: "رمادي",          preview: "bg-gray-100 text-gray-700" },
  { id: "rose",    label: "وردي",           preview: "bg-rose-50 text-rose-700 border border-rose-200" },
];

interface LinkRowProps {
  link: QuickLink;
  onUpdate: (updated: QuickLink) => void;
  onDelete: () => void;
}

function LinkRow({ link, onUpdate, onDelete }: LinkRowProps) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<QuickLink>(link);

  const colorStyle = COLOR_STYLES.find((c) => c.id === link.colorStyle) ?? COLOR_STYLES[0];

  const handleSave = () => {
    onUpdate(local);
    setEditing(false);
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${link.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
      <div className="flex items-center gap-3 p-3">
        <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${colorStyle.preview}`}>
          <i className={`${link.icon} text-sm`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">{link.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${link.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {link.active ? "نشط" : "مخفي"}
            </span>
          </div>
          <span className="text-xs text-gray-400">{link.path}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onUpdate({ ...link, active: !link.active })}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              link.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            <i className={`${link.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`}></i>
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className={`${editing ? "ri-arrow-up-s-line" : "ri-pencil-line"} text-sm`}></i>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-line text-sm"></i>
          </button>
        </div>
      </div>

      {editing && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">النص</label>
              <input
                type="text"
                value={local.label}
                onChange={(e) => setLocal({ ...local, label: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">المسار (Path)</label>
              <input
                type="text"
                value={local.path}
                onChange={(e) => setLocal({ ...local, path: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
                placeholder="/booking"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setLocal({ ...local, icon })}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                    local.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <i className={`${icon} text-base text-gray-700`}></i>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">لون الزر</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_STYLES.map((cs) => (
                <button
                  key={cs.id}
                  onClick={() => setLocal({ ...local, colorStyle: cs.id })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    local.colorStyle === cs.id ? "border-[#2E4E45] ring-1 ring-[#2E4E45]" : "border-gray-200"
                  } ${cs.preview}`}
                >
                  {cs.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => { setLocal(link); setEditing(false); }}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#2E4E45] text-white hover:bg-[#243d36] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-save-line ml-1"></i>
              حفظ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuickLinksEditor() {
  const [links, setLinks] = useState<QuickLink[]>(quickLinksData);
  const [saved, setSaved] = useState(false);

  const handleUpdate = (index: number, updated: QuickLink) => {
    const next = [...links];
    next[index] = updated;
    setLinks(next);
  };

  const handleDelete = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newLink: QuickLink = {
      id: `ql-${Date.now()}`,
      label: "رابط جديد",
      path: "/",
      icon: "ri-external-link-line",
      colorStyle: "gray",
      active: true,
    };
    setLinks([...links, newLink]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-violet-50 rounded-lg">
            <i className="ri-links-line text-violet-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">الروابط السريعة</h3>
            <p className="text-xs text-gray-400">تظهر أسفل الصفحة عند عدم وجود بحث</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-[#2E4E45] text-[#2E4E45] hover:bg-[#2E4E45]/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            إضافة رابط
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              saved ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#243d36]"
            }`}
          >
            <i className={saved ? "ri-check-line" : "ri-save-line"}></i>
            {saved ? "تم الحفظ!" : "حفظ"}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {links.map((link, index) => (
          <LinkRow
            key={link.id}
            link={link}
            onUpdate={(updated) => handleUpdate(index, updated)}
            onDelete={() => handleDelete(index)}
          />
        ))}
        {links.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-2">
              <i className="ri-links-line text-lg"></i>
            </div>
            <p className="text-sm">لا توجد روابط. أضف رابطاً جديداً.</p>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-3">معاينة الروابط السريعة:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {links.filter((l) => l.active).map((link) => {
            const cs = COLOR_STYLES.find((c) => c.id === link.colorStyle) ?? COLOR_STYLES[0];
            return (
              <div
                key={link.id}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${cs.preview}`}
              >
                <i className={`${link.icon} text-sm`}></i>
                {link.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
