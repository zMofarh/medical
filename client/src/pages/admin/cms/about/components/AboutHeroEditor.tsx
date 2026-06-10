import { aboutHero } from "@/mocks/aboutData";
import { useState } from "react";

type HeroData = typeof aboutHero;

interface Props {
  data: HeroData;
  onChange: (d: HeroData) => void;
}

export default function AboutHeroEditor({ data, onChange }: Props) {
  const [newWord, setNewWord] = useState("");

  const handleChange = (field: keyof HeroData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addWord = () => {
    if (newWord.trim()) {
      onChange({ ...data, typewriterWords: [...data.typewriterWords, newWord.trim()] });
      setNewWord("");
    }
  };

  const removeWord = (i: number) => {
    onChange({ ...data, typewriterWords: data.typewriterWords.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
          <i className="ri-layout-top-line text-[#2E4E45] text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">قسم Hero (الرئيسي)</h3>
          <p className="text-xs text-gray-500">الصورة الكبيرة والعنوان الرئيسي في أعلى الصفحة</p>
        </div>
      </div>

      {/* Hero image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">صورة الخلفية</label>
        <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-3" style={{ height: "160px" }}>
          <img src={data.image} alt="Hero" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex items-end p-4">
            <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">معاينة الخلفية</span>
          </div>
        </div>
        <input
          type="url"
          value={data.image}
          onChange={(e) => handleChange("image", e.target.value)}
          dir="ltr"
          placeholder="رابط الصورة..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all font-mono text-xs"
        />
      </div>

      {/* Badge & Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">نص الشارة (Badge)</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => handleChange("badge", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان الرئيسي</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none"
        />
      </div>

      {/* Typewriter words */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <i className="ri-cursor-line ml-1.5 text-[#C8A96E]" />
          كلمات الـ Typewriter (تتغير تلقائياً)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.typewriterWords.map((word, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-medium">
              {word}
              <button onClick={() => removeWord(i)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-red-500 transition-colors cursor-pointer">
                <i className="ri-close-line text-xs" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWord()}
            placeholder="أضف كلمة جديدة..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
          />
          <button
            onClick={addWord}
            className="px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
          >
            إضافة
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">نص الزر الأول (CTA)</label>
          <input
            type="text"
            value={data.ctaPrimary}
            onChange={(e) => handleChange("ctaPrimary", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">نص الزر الثاني</label>
          <input
            type="text"
            value={data.ctaSecondary}
            onChange={(e) => handleChange("ctaSecondary", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
