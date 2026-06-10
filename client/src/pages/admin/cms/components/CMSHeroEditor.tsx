import { useState } from "react";
import type { CMSHeroSection } from "@/mocks/cmsData";

interface Props {
  data: CMSHeroSection;
  onChange: (data: CMSHeroSection) => void;
}

export default function CMSHeroEditor({ data, onChange }: Props) {
  const [newWord, setNewWord] = useState("");

  const update = (field: keyof CMSHeroSection, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const addWord = () => {
    if (!newWord.trim()) return;
    update("typewriterWords", [...data.typewriterWords, newWord.trim()]);
    setNewWord("");
  };

  const removeWord = (idx: number) => {
    update("typewriterWords", data.typewriterWords.filter((_, i) => i !== idx));
  };

  const updateStat = (idx: number, field: "value" | "label", val: string) => {
    const updated = data.stats.map((s, i) => (i === idx ? { ...s, [field]: val } : s));
    update("stats", updated);
  };

  const updatePillar = (idx: number, val: string) => {
    const updated = data.pillars.map((p, i) => (i === idx ? val : p));
    update("pillars", updated);
  };

  return (
    <div className="space-y-8">
      {/* Badge & Heading */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-text-wrap text-base" />
          النصوص الرئيسية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الشارة (Badge)</label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => update("badge", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان الرئيسي</label>
            <input
              type="text"
              value={data.heading1}
              onChange={(e) => update("heading1", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الوصف الرئيسي</label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#2E4E45] transition-colors resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الوصف الثانوي</label>
            <textarea
              value={data.subDescription}
              onChange={(e) => update("subDescription", e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#2E4E45] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">نص زر الحجز</label>
            <input
              type="text"
              value={data.btnBook}
              onChange={(e) => update("btnBook", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">نص زر الخدمات</label>
            <input
              type="text"
              value={data.btnServices}
              onChange={(e) => update("btnServices", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Typewriter Words */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-cursor-line text-base" />
          كلمات الكتابة المتحركة (Typewriter)
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.typewriterWords.map((word, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-[#2E4E45]/8 text-[#2E4E45] px-3 py-1.5 rounded-full text-sm font-medium">
              <span>{word}</span>
              <button
                onClick={() => removeWord(idx)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xs" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWord()}
            placeholder="أضف كلمة جديدة..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
          />
          <button
            onClick={addWord}
            className="px-4 py-2 bg-[#2E4E45] text-white text-sm rounded-lg hover:bg-[#2E4E45]/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line ml-1" />
            إضافة
          </button>
        </div>
      </div>

      {/* Pillars */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-layout-column-line text-base" />
          الركائز الثلاث
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {data.pillars.map((p, idx) => (
            <div key={idx}>
              <label className="block text-xs text-gray-400 mb-1">ركيزة {idx + 1}</label>
              <input
                type="text"
                value={p}
                onChange={(e) => updatePillar(idx, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-bar-chart-line text-base" />
          الإحصائيات
        </h3>
        <div className="space-y-3">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">القيمة</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, "value", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">التسمية</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(idx, "label", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Image */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-image-line text-base" />
          صورة الخلفية
        </h3>
        <div className="flex gap-4 items-start">
          <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <img src={data.backgroundImage} alt="bg" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">رابط الصورة</label>
            <input
              type="text"
              value={data.backgroundImage}
              onChange={(e) => update("backgroundImage", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5">يمكنك استخدام رابط صورة خارجي أو رابط Readdy AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
