import { useState } from "react";
import { ContactMethod } from "@/types/cms";

type MethodsData = ContactMethod[];
type Method = MethodsData[number];

interface Props { data: MethodsData; onChange: (d: MethodsData) => void; }

const iconOptions = [
  "ri-phone-fill", "ri-whatsapp-line", "ri-mail-fill", "ri-map-pin-fill",
  "ri-phone-line", "ri-mail-line", "ri-map-pin-line", "ri-customer-service-2-line",
  "ri-telegram-line", "ri-message-line", "ri-chat-1-line", "ri-phone-camera-line",
];

const colorOptions = [
  { label: "كريمي",   value: "bg-brand-cream-100 text-brand-forest-600" },
  { label: "أخضر",   value: "bg-green-100 text-green-600" },
  { label: "ذهبي",   value: "bg-amber-100 text-amber-600" },
  { label: "أحمر",   value: "bg-rose-100 text-rose-600" },
  { label: "سماوي",  value: "bg-sky-100 text-sky-600" },
  { label: "بنفسجي", value: "bg-violet-100 text-violet-600" },
];

export default function ContactMethodsEditor({ data, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [iconPickerId, setIconPickerId] = useState<string | null>(null);

  const updateMethod = (id: string, field: keyof Method, val: string | boolean) => {
    onChange(data.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  const toggleEnabled = (id: string) => {
    onChange(data.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  const addMethod = () => {
    const newId = `cm-${Date.now()}`;
    onChange([...data, { id: newId, icon: "ri-phone-line", title: "طريقة تواصل جديدة", value: "", sub: "", href: "", color: "bg-sky-100 text-sky-600", enabled: true }]);
    setExpandedId(newId);
  };

  const removeMethod = (id: string) => {
    onChange(data.filter((m) => m.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
          <i className="ri-contacts-line text-sky-600 text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">بطاقات التواصل</h3>
          <p className="text-xs text-gray-500">الهاتف، واتساب، البريد، العنوان — {data.filter(m => m.enabled).length} نشطة</p>
        </div>
        <button onClick={addMethod} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E4E45] text-white text-xs hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-add-line" /> إضافة بطاقة
        </button>
      </div>

      <div className="space-y-3">
        {data.map((method) => (
          <div key={method.id} className={`rounded-xl border overflow-hidden transition-all ${expandedId === method.id ? "border-[#2E4E45]/30" : "border-gray-200"} ${!method.enabled ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => setIconPickerId(iconPickerId === method.id ? null : method.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer ${method.color}`}
              >
                <i className={`${method.icon} text-lg`} />
              </button>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(expandedId === method.id ? null : method.id)}>
                <p className="text-sm font-semibold text-gray-700">{method.title}</p>
                <p className="text-xs text-gray-400 truncate">{method.value || "—"}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleEnabled(method.id)} className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${method.enabled ? "bg-[#2E4E45]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${method.enabled ? "right-0.5" : "left-0.5"}`} />
                </button>
                <button onClick={() => removeMethod(method.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
                  <i className="ri-delete-bin-line text-sm" />
                </button>
                <button onClick={() => setExpandedId(expandedId === method.id ? null : method.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer">
                  <i className={`text-sm ${expandedId === method.id ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
                </button>
              </div>
            </div>

            {iconPickerId === method.id && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">اختر أيقونة:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {iconOptions.map((icon) => (
                    <button key={icon} onClick={() => { updateMethod(method.id, "icon", icon); setIconPickerId(null); }} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${method.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      <i className={`${icon} text-sm`} />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mb-2">اختر لون:</p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button key={c.value} onClick={() => { updateMethod(method.id, "color", c.value); setIconPickerId(null); }} className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${method.color === c.value ? "border-[#2E4E45] font-semibold" : "border-gray-200 hover:border-gray-300"} ${c.value}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {expandedId === method.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">العنوان</label>
                    <input type="text" value={method.title} onChange={(e) => updateMethod(method.id, "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">القيمة (رقم / بريد / عنوان)</label>
                    <input type="text" value={method.value} onChange={(e) => updateMethod(method.id, "value", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">النص الثانوي</label>
                    <input type="text" value={method.sub} onChange={(e) => updateMethod(method.id, "sub", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">الرابط (href)</label>
                    <input type="text" value={method.href} onChange={(e) => updateMethod(method.id, "href", e.target.value)} dir="ltr" placeholder="tel: / mailto: / https://" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all font-mono text-xs" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <i className="ri-eye-line text-gray-400 text-sm" />
          <span className="text-xs font-medium text-gray-500">معاينة البطاقات</span>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.filter(m => m.enabled).map((m) => (
            <div key={m.id} className="rounded-xl border border-gray-100 p-3 text-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 ${m.color}`}>
                <i className={`${m.icon} text-base`} />
              </div>
              <p className="text-xs font-bold text-gray-800 truncate">{m.title}</p>
              <p className="text-xs text-gray-400 truncate">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
