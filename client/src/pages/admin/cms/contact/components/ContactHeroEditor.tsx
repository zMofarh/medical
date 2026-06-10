import { useState } from "react";
import { contactHero } from "@/mocks/contactData";

type HeroData = typeof contactHero;
interface Props { data: HeroData; onChange: (d: HeroData) => void; }

export default function ContactHeroEditor({ data, onChange }: Props) {
  const [newWord, setNewWord] = useState("");

  const addWord = () => {
    if (newWord.trim()) { onChange({ ...data, typewriterWords: [...data.typewriterWords, newWord.trim()] }); setNewWord(""); }
  };
  const removeWord = (i: number) => onChange({ ...data, typewriterWords: data.typewriterWords.filter((_, idx) => idx !== i) });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
          <i className="ri-layout-top-line text-[#2E4E45] text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">قسم Hero</h3>
          <p className="text-xs text-gray-500">الشريط العلوي الملوّن مع العنوان والوصف</p>
        </div>
      </div>

      {/* Background image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">صورة الخلفية</label>
        <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-3" style={{ height: "120px" }}>
          <img src={data.backgroundImage} alt="Hero BG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2E4E45]/80 to-[#1a3530]/90 flex items-center justify-center">
            <span className="text-white text-sm font-bold opacity-80">معاينة الخلفية</span>
          </div>
        </div>
        <input
          type="url"
          value={data.backgroundImage}
          onChange={(e) => onChange({ ...data, backgroundImage: e.target.value })}
          dir="ltr"
          placeholder="رابط صورة الخلفية..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
        />
      </div>

      {/* Badge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">نص الشارة (Badge)</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => onChange({ ...data, badge: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف</label>
        <textarea
          rows={2}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none"
        />
      </div>

      {/* Typewriter words */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <i className="ri-cursor-line ml-1.5 text-[#C8A96E]" />
          كلمات Typewriter المتغيرة
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.typewriterWords.map((w, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-medium">
              {w}
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
          <button onClick={addWord} className="px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer">
            إضافة
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <i className="ri-eye-line text-gray-400 text-sm" />
          <span className="text-xs font-medium text-gray-500">معاينة Hero</span>
        </div>
        <div className="relative py-8 px-6 text-center" style={{ background: "linear-gradient(135deg, #2E4E45 0%, #1a3530 100%)" }}>
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-3 border border-white/30">
            {data.badge}
          </span>
          <h2 className="text-xl font-black text-white mb-2">{data.typewriterWords[0] || "العنوان"}</h2>
          <p className="text-white/70 text-xs max-w-sm mx-auto">{data.description}</p>
        </div>
      </div>
    </div>
  );
}
