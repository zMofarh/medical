import { useState } from "react";
import { AboutTimelineEvent } from "@/types/cms";

type TimelineData = AboutTimelineEvent[];
type TimelineItem = TimelineData[number];

interface Props {
  data: TimelineData;
  onChange: (d: TimelineData) => void;
}

export default function AboutTimelineEditor({ data, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateItem = (id: string, field: keyof TimelineItem, val: string) => {
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  const addItem = () => {
    const newId = `t-${Date.now()}`;
    const newItem: TimelineItem = { id: newId, year: String(new Date().getFullYear()), title: "حدث جديد", desc: "وصف الحدث..." };
    onChange([...data, newItem]);
    setExpandedId(newId);
  };

  const removeItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const moveItem = (id: string, dir: "up" | "down") => {
    const idx = data.findIndex((item) => item.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === data.length - 1) return;
    const newData = [...data];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    [newData[idx], newData[swapIdx]] = [newData[swapIdx], newData[idx]];
    onChange(newData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#C8A96E]/15 flex items-center justify-center">
          <i className="ri-history-line text-[#C8A96E] text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">مسيرتنا (Timeline)</h3>
          <p className="text-xs text-gray-500">{data.length} محطات في رحلة العيادة</p>
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E4E45] text-white text-xs hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line" />
          إضافة محطة
        </button>
      </div>

      <div className="relative">
        <div className="absolute right-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2E4E45]/30 to-[#C8A96E]/30" />
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center flex-shrink-0 z-10">
                <div className="w-11 h-11 rounded-full bg-[#2E4E45] flex items-center justify-center border-4 border-white flex-shrink-0">
                  <span className="text-white text-xs font-bold">{idx + 1}</span>
                </div>
              </div>

              <div className="flex-1 mb-3">
                <div className={`rounded-xl border overflow-hidden transition-all ${expandedId === item.id ? "border-[#2E4E45]/30" : "border-gray-200"}`}>
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <span className="px-2.5 py-1 rounded-full bg-[#2E4E45] text-white text-xs font-bold flex-shrink-0">
                      {item.year}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 flex-1">{item.title}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveItem(item.id, "up"); }}
                        disabled={idx === 0}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="ri-arrow-up-s-line text-sm" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveItem(item.id, "down"); }}
                        disabled={idx === data.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 cursor-pointer"
                      >
                        <i className="ri-arrow-down-s-line text-sm" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-400 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                      <i className={`text-gray-400 text-sm ${expandedId === item.id ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
                    </div>
                  </div>

                  {expandedId === item.id && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3 bg-gray-50/50">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">السنة</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => updateItem(item.id, "year", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">العنوان</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(item.id, "title", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">الوصف</label>
                        <textarea
                          rows={3}
                          value={item.desc}
                          onChange={(e) => updateItem(item.id, "desc", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
