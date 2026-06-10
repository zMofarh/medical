import { useState } from "react";
import { aboutValues } from "@/mocks/aboutData";

type ValuesData = typeof aboutValues;
type ValueItem = ValuesData[number];

interface Props {
  data: ValuesData;
  onChange: (d: ValuesData) => void;
}

const iconOptions = [
  "ri-search-eye-line", "ri-microscope-line", "ri-shield-flash-line", "ri-heart-pulse-line",
  "ri-star-line", "ri-trophy-line", "ri-lightbulb-line", "ri-focus-3-line",
  "ri-leaf-line", "ri-global-line", "ri-team-line", "ri-award-line",
  "ri-hand-heart-line", "ri-brain-line", "ri-dna-line", "ri-stethoscope-line",
];

export default function AboutValuesEditor({ data, onChange }: Props) {
  const [editingIcon, setEditingIcon] = useState<string | null>(null);

  const updateValue = (id: string, field: keyof ValueItem, val: string) => {
    onChange(data.map((v) => (v.id === id ? { ...v, [field]: val } : v)));
  };

  const addValue = () => {
    const newId = `val-${Date.now()}`;
    onChange([...data, { id: newId, icon: "ri-star-line", title: "قيمة جديدة", description: "وصف القيمة..." }]);
  };

  const removeValue = (id: string) => {
    if (data.length > 1) {
      onChange(data.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
          <i className="ri-heart-line text-violet-600 text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">قيمنا</h3>
          <p className="text-xs text-gray-500">المبادئ التي تحكم كل قرار — {data.length} قيم</p>
        </div>
        <button
          onClick={addValue}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E4E45] text-white text-xs hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line" />
          إضافة قيمة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((val) => (
          <div key={val.id} className="rounded-xl border border-gray-200 overflow-hidden">
            {/* Icon picker */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setEditingIcon(editingIcon === val.id ? null : val.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                  editingIcon === val.id ? "border-[#2E4E45] bg-[#2E4E45]/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <i className={`${val.icon} text-[#2E4E45] text-lg`} />
              </button>
              <span className="text-xs text-gray-500">انقر لتغيير الأيقونة</span>
              <button
                onClick={() => removeValue(val.id)}
                className="mr-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>

            {editingIcon === val.id && (
              <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => { updateValue(val.id, "icon", icon); setEditingIcon(null); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                        val.icon === icon
                          ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]"
                          : "border-gray-200 hover:border-gray-300 text-gray-500"
                      }`}
                    >
                      <i className={`${icon} text-sm`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">العنوان</label>
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => updateValue(val.id, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">الوصف</label>
                <textarea
                  rows={2}
                  value={val.description}
                  onChange={(e) => updateValue(val.id, "description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
