import type { CMSTrustBarSection, CMSTrustBarItem } from "@/mocks/cmsData";

interface Props {
  data: CMSTrustBarSection;
  onChange: (data: CMSTrustBarSection) => void;
}

const iconOptions = [
  "ri-award-line", "ri-star-line", "ri-user-star-line", "ri-hospital-line",
  "ri-global-line", "ri-heart-pulse-line", "ri-shield-check-line", "ri-trophy-line",
  "ri-medal-line", "ri-thumb-up-line", "ri-verified-badge-line", "ri-bar-chart-line",
];

export default function CMSTrustBarEditor({ data, onChange }: Props) {
  const updateItem = (idx: number, field: keyof CMSTrustBarItem, value: string) => {
    const updated = data.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    onChange({ items: updated });
  };

  const addItem = () => {
    onChange({
      items: [...data.items, { icon: "ri-star-line", value: "0", label: "إحصائية جديدة" }],
    });
  };

  const removeItem = (idx: number) => {
    onChange({ items: data.items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-[#2E4E45] flex items-center gap-2">
            <i className="ri-bar-chart-box-line text-base" />
            عناصر شريط الثقة ({data.items.length})
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-semibold rounded-lg hover:bg-[#2E4E45]/15 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            إضافة عنصر
          </button>
        </div>
        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg flex-shrink-0">
                <i className={`${item.icon} text-[#2E4E45] text-lg`} />
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">الأيقونة</label>
                  <select
                    value={item.icon}
                    onChange={(e) => updateItem(idx, "icon", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45] bg-white"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic} value={ic}>{ic.replace("ri-", "").replace("-line", "")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">القيمة</label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateItem(idx, "value", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">التسمية</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateItem(idx, "label", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors cursor-pointer flex-shrink-0"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#2E4E45]/5 rounded-xl p-5 border border-[#2E4E45]/10">
        <p className="text-xs text-gray-400 mb-4 text-center">معاينة شريط الثقة</p>
        <div className="flex flex-wrap justify-center gap-6">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 text-center">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2E4E45]/10 rounded-xl">
                <i className={`${item.icon} text-[#2E4E45] text-lg`} />
              </div>
              <span className="text-base font-black text-[#2E4E45]">{item.value}</span>
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
