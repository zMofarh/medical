import { useState } from "react";
import { AboutAward } from "@/types/cms";

type AwardsData = AboutAward[];
type Award = AwardsData[number];

interface Props {
  data: AwardsData;
  onChange: (d: AwardsData) => void;
}

const iconOptions = [
  "ri-trophy-line", "ri-global-line", "ri-dna-line", "ri-shield-star-line",
  "ri-award-line", "ri-medal-line", "ri-star-line", "ri-verified-badge-line",
  "ri-government-line", "ri-building-line", "ri-heart-line", "ri-check-double-line",
];

export default function AboutAwardsEditor({ data, onChange }: Props) {
  const [iconPickerId, setIconPickerId] = useState<string | null>(null);

  const updateAward = (id: string, field: keyof Award, val: string) => {
    onChange(data.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
  };

  const addAward = () => {
    const newId = `aw-${Date.now()}`;
    onChange([...data, { id: newId, icon: "ri-trophy-line", title: "إنجاز جديد", body: "وصف الإنجاز" }]);
  };

  const removeAward = (id: string) => {
    onChange(data.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#C8A96E]/15 flex items-center justify-center">
          <i className="ri-trophy-line text-[#C8A96E] text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">الاعتمادات والإنجازات</h3>
          <p className="text-xs text-gray-500">{data.length} إنجازات وشراكات</p>
        </div>
        <button
          onClick={addAward}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E4E45] text-white text-xs hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line" />
          إضافة إنجاز
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((award) => (
          <div key={award.id} className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setIconPickerId(iconPickerId === award.id ? null : award.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                  iconPickerId === award.id ? "border-[#C8A96E] bg-[#C8A96E]/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <i className={`${award.icon} text-[#C8A96E] text-lg`} />
              </button>
              <span className="text-xs text-gray-500 flex-1">انقر لتغيير الأيقونة</span>
              <button
                onClick={() => removeAward(award.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>

            {iconPickerId === award.id && (
              <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => { updateAward(award.id, "icon", icon); setIconPickerId(null); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                        award.icon === icon
                          ? "border-[#C8A96E] bg-[#C8A96E]/10 text-[#C8A96E]"
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
                  value={award.title}
                  onChange={(e) => updateAward(award.id, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">الوصف المختصر</label>
                <input
                  type="text"
                  value={award.body}
                  onChange={(e) => updateAward(award.id, "body", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
                />
              </div>
            </div>

            <div className="mx-4 mb-4 rounded-xl p-3 bg-white border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center mx-auto mb-2">
                <i className={`${award.icon} text-[#C8A96E] text-lg`} />
              </div>
              <p className="text-xs font-bold text-gray-800">{award.title}</p>
              <p className="text-xs text-gray-400">{award.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
