import { AboutMission } from "@/types/cms";

type MissionData = AboutMission[];
type MissionItem = MissionData[number];

interface Props {
  data: MissionData;
  onChange: (d: MissionData) => void;
}

const labels: Record<string, { icon: string; color: string }> = {
  mission:   { icon: "ri-flag-line",       color: "text-emerald-600 bg-emerald-50" },
  vision:    { icon: "ri-eye-line",         color: "text-[#2E4E45] bg-[#2E4E45]/10" },
  philosophy:{ icon: "ri-lightbulb-line",   color: "text-amber-600 bg-amber-50" },
};

export default function AboutMissionEditor({ data, onChange }: Props) {
  const updateItem = (id: string, field: keyof MissionItem, value: string | boolean) => {
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <i className="ri-flag-2-line text-emerald-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">الرسالة والرؤية والفلسفة</h3>
          <p className="text-xs text-gray-500">البطاقات الثلاث التي تظهر في قسم "ما يقودنا كل يوم"</p>
        </div>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const meta = labels[item.id] || { icon: "ri-star-line", color: "text-gray-500 bg-gray-50" };
          return (
            <div key={item.id} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                  <i className={`${meta.icon} text-sm`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                <div className="mr-auto flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.dark}
                      onChange={(e) => updateItem(item.id, "dark", e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-300"
                    />
                    خلفية داكنة
                  </label>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">العنوان</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">النص</label>
                  <textarea
                    rows={3}
                    value={item.body}
                    onChange={(e) => updateItem(item.id, "body", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all resize-none"
                  />
                </div>
              </div>

              <div className={`mx-4 mb-4 rounded-xl p-4 ${item.dark ? "bg-[#2E4E45] text-white" : "bg-gray-50 border border-gray-100"}`}>
                <p className="text-xs font-semibold mb-1 opacity-60">معاينة</p>
                <p className={`text-sm font-bold mb-1 ${item.dark ? "text-white" : "text-gray-800"}`}>{item.title}</p>
                <p className={`text-xs leading-relaxed ${item.dark ? "text-white/70" : "text-gray-500"}`}>{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
