import { useState } from "react";
import { contactFormConfig } from "@/mocks/contactData";

type FormData = typeof contactFormConfig;
interface Props { data: FormData; onChange: (d: FormData) => void; }

export default function ContactFormEditor({ data, onChange }: Props) {
  const [newSubject, setNewSubject] = useState("");

  const addSubject = () => {
    if (newSubject.trim()) { onChange({ ...data, subjects: [...data.subjects, newSubject.trim()] }); setNewSubject(""); }
  };

  const removeSubject = (i: number) => onChange({ ...data, subjects: data.subjects.filter((_, idx) => idx !== i) });

  const moveSubject = (i: number, dir: "up" | "down") => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === data.subjects.length - 1) return;
    const arr = [...data.subjects];
    const swapIdx = dir === "up" ? i - 1 : i + 1;
    [arr[i], arr[swapIdx]] = [arr[swapIdx], arr[i]];
    onChange({ ...data, subjects: arr });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <i className="ri-mail-send-line text-emerald-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">نموذج التواصل</h3>
          <p className="text-xs text-gray-500">عنوان النموذج، موضوعات الرسائل، رسالة النجاح</p>
        </div>
      </div>

      {/* Form title & subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان النموذج</label>
          <input type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">النص الثانوي</label>
          <input type="text" value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all" />
        </div>
      </div>

      {/* Success messages */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-3">
        <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <i className="ri-checkbox-circle-line" />
          رسالة النجاح (بعد الإرسال)
        </p>
        <div>
          <label className="text-xs text-emerald-700 mb-1 block">العنوان</label>
          <input type="text" value={data.successTitle} onChange={(e) => onChange({ ...data, successTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:border-emerald-400 bg-white transition-all" />
        </div>
        <div>
          <label className="text-xs text-emerald-700 mb-1 block">النص</label>
          <textarea rows={2} value={data.successMessage} onChange={(e) => onChange({ ...data, successMessage: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:border-emerald-400 bg-white transition-all resize-none" />
        </div>
      </div>

      {/* Subjects list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            موضوعات الرسائل
            <span className="mr-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-normal">{data.subjects.length}</span>
          </label>
        </div>
        <div className="space-y-2 mb-3">
          {data.subjects.map((subject, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-white group hover:border-gray-300 transition-colors">
              <i className="ri-drag-move-line text-gray-300 text-sm flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-700">{subject}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveSubject(i, "up")} disabled={i === 0} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 cursor-pointer">
                  <i className="ri-arrow-up-s-line text-sm" />
                </button>
                <button onClick={() => moveSubject(i, "down")} disabled={i === data.subjects.length - 1} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 cursor-pointer">
                  <i className="ri-arrow-down-s-line text-sm" />
                </button>
                <button onClick={() => removeSubject(i)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-400 cursor-pointer">
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSubject()} placeholder="أضف موضوعاً جديداً..." className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          <button onClick={addSubject} className="px-4 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer">إضافة</button>
        </div>
      </div>

      {/* Fields config */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">حقول النموذج</label>
        <div className="space-y-2">
          {[
            { key: "name",    label: "الاسم الكامل",       icon: "ri-user-line" },
            { key: "phone",   label: "رقم الهاتف",         icon: "ri-phone-line" },
            { key: "email",   label: "البريد الإلكتروني",  icon: "ri-mail-line" },
            { key: "subject", label: "موضوع الرسالة",      icon: "ri-list-unordered" },
            { key: "message", label: "الرسالة",            icon: "ri-message-2-line" },
          ].map((field) => {
            const fieldData = data.fields[field.key as keyof typeof data.fields];
            return (
              <div key={field.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <i className={`${field.icon} text-gray-500 text-sm`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{field.label}</p>
                  <p className="text-xs text-gray-400">{fieldData.required ? "إلزامي" : "اختياري"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${fieldData.required ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"}`}>
                    {fieldData.required ? "مطلوب" : "اختياري"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-600 font-medium">نشط</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <i className="ri-information-line text-amber-500 text-lg mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          النموذج مرتبط بـ Readdy Forms — الرسائل تُحفظ تلقائياً ويمكن الاطلاع عليها من لوحة التحكم.
        </p>
      </div>
    </div>
  );
}
