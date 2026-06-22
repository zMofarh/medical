import { useState } from "react";
import { PopularSearch } from "@/types/cms";

interface PopularSearchesEditorProps {
  data: PopularSearch[];
  onChange: (d: PopularSearch[]) => void;
}

export default function PopularSearchesEditor({ data, onChange }: PopularSearchesEditorProps) {
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
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-amber-50 rounded-lg">
            <i className="ri-fire-line text-amber-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">عبارات البحث الشائعة</h3>
            <p className="text-xs text-gray-400">{activeItems.length} نشط من {data.length} إجمالي</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 bg-[#2E4E45]/5 border border-[#2E4E45]/10 rounded-lg p-3 mb-4">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-information-line text-[#2E4E45] text-sm"></i>
        </div>
        <p className="text-xs text-[#2E4E45]/80 leading-relaxed">
          هذه العبارات تظهر أسفل حقل البحث عندما لا يكتب المستخدم شيئاً. تساعد في توجيه الزوار لأبرز المحتويات.
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-2 mb-4">
        {data.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              item.active ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className="ri-drag-move-line text-gray-300 text-sm"></i>
            </div>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateLabel(item.id, e.target.value)}
              className="flex-1 text-sm text-gray-800 bg-transparent border-none outline-none"
            />
            {/* Preview pill */}
            <div className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${
              item.active
                ? "bg-[#2E4E45]/10 text-[#2E4E45] border-[#2E4E45]/20"
                : "bg-gray-100 text-gray-400 border-gray-200"
            }`}>
              {item.label}
            </div>
            <button
              onClick={() => toggle(item.id)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer flex-shrink-0 ${
                item.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
              title={item.active ? "إخفاء" : "إظهار"}
            >
              <i className={`${item.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`}></i>
            </button>
            <button
              onClick={() => remove(item.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer flex-shrink-0"
            >
              <i className="ri-delete-bin-line text-sm"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="أضف عبارة بحث جديدة..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
        />
        <button
          onClick={add}
          disabled={!newLabel.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#2E4E45] text-white hover:bg-[#243d36] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          إضافة
        </button>
      </div>

      {/* Live Preview */}
      <div className="mt-5 p-4 rounded-xl bg-[#2E4E45]/5 border border-[#2E4E45]/10">
        <p className="text-xs font-semibold text-gray-500 mb-3">معاينة — كيف تظهر في الصفحة:</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-[#2E4E45]/60 text-xs self-center">بحث شائع:</span>
          {activeItems.map((item) => (
            <span
              key={item.id}
              className="text-xs bg-white text-[#2E4E45] px-3 py-1.5 rounded-full border border-[#2E4E45]/20 whitespace-nowrap"
            >
              {item.label}
            </span>
          ))}
          {activeItems.length === 0 && (
            <span className="text-xs text-gray-400 italic">لا توجد عبارات نشطة</span>
          )}
        </div>
      </div>
    </div>
  );
}
