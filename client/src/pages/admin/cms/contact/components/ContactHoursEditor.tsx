import { contactWorkingHours } from "@/mocks/contactData";

type HoursData = typeof contactWorkingHours;
type HourRow = HoursData[number];

interface Props { data: HoursData; onChange: (d: HoursData) => void; }

export default function ContactHoursEditor({ data, onChange }: Props) {
  const updateRow = (id: string, field: keyof HourRow, val: string | boolean) => {
    onChange(data.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const addRow = () => {
    const newId = `wh-${Date.now()}`;
    onChange([...data, { id: newId, days: "يوم جديد", time: "9:00 ص - 5:00 م", isOpen: true }]);
  };

  const removeRow = (id: string) => {
    if (data.length > 1) onChange(data.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <i className="ri-time-line text-amber-600 text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">ساعات العمل</h3>
          <p className="text-xs text-gray-500">الجدول الذي يظهر في الشريط الجانبي لصفحة التواصل</p>
        </div>
        <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E4E45] text-white text-xs hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-add-line" /> إضافة صف
        </button>
      </div>

      <div className="space-y-3">
        {data.map((row) => (
          <div key={row.id} className={`rounded-xl border p-4 transition-all ${row.isOpen ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/50"}`}>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => updateRow(row.id, "isOpen", !row.isOpen)}
                className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${row.isOpen ? "bg-[#2E4E45]" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${row.isOpen ? "right-0.5" : "left-0.5"}`} />
              </button>
              <input
                type="text"
                value={row.days}
                onChange={(e) => updateRow(row.id, "days", e.target.value)}
                placeholder="الأيام..."
                className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
              />
              <input
                type="text"
                value={row.time}
                onChange={(e) => updateRow(row.id, "time", e.target.value)}
                placeholder={row.isOpen ? "9:00 ص - 9:00 م" : "مغلق"}
                disabled={!row.isOpen}
                className={`flex-1 min-w-[140px] px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#2E4E45] transition-all ${row.isOpen ? "border-gray-200" : "border-gray-100 bg-gray-50 text-gray-400"}`}
              />
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${row.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                {row.isOpen ? "مفتوح" : "مغلق"}
              </span>
              <button
                onClick={() => removeRow(row.id)}
                disabled={data.length <= 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30 cursor-pointer flex-shrink-0"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <i className="ri-eye-line text-gray-400 text-sm" />
          <span className="text-xs font-medium text-gray-500">معاينة جدول ساعات العمل</span>
        </div>
        <div className="p-4 space-y-2.5">
          {data.map((row) => (
            <div key={row.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600 font-medium">{row.days}</span>
              <span className={`text-sm font-bold ${row.isOpen ? "text-[#2E4E45]" : "text-red-400"}`}>
                {row.isOpen ? row.time : "مغلق"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
