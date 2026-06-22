import { useState } from "react";
import { AboutStoryData } from "@/types/cms";

type StoryData = AboutStoryData;

interface Props {
  data: StoryData;
  onChange: (d: StoryData) => void;
}

export default function AboutStoryEditor({ data, onChange }: Props) {
  const [newTag, setNewTag] = useState("");

  const updateParagraph = (i: number, val: string) => {
    const updated = data.paragraphs.map((p, idx) => (idx === i ? val : p));
    onChange({ ...data, paragraphs: updated });
  };

  const addParagraph = () => {
    onChange({ ...data, paragraphs: [...data.paragraphs, ""] });
  };

  const removeParagraph = (i: number) => {
    if (data.paragraphs.length > 1) {
      onChange({ ...data, paragraphs: data.paragraphs.filter((_, idx) => idx !== i) });
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      onChange({ ...data, tags: [...data.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (i: number) => {
    onChange({ ...data, tags: data.tags.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <i className="ri-book-open-line text-amber-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">قسم القصة (Story)</h3>
          <p className="text-xs text-gray-500">قصة تأسيس العيادة والصورة الجانبية</p>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">صورة القصة</label>
        <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-3" style={{ height: "140px" }}>
          <img src={data.image} alt="Story" className="w-full h-full object-cover object-top" />
        </div>
        <input
          type="url"
          value={data.image}
          onChange={(e) => onChange({ ...data, image: e.target.value })}
          dir="ltr"
          placeholder="رابط الصورة..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all font-mono text-xs"
        />
      </div>

      {/* Badge & Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">نص الشارة</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Stats badges */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">سنة التأسيس</label>
          <input
            type="text"
            value={data.foundedYear}
            onChange={(e) => onChange({ ...data, foundedYear: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">عدد الاستشاريين</label>
          <input
            type="text"
            value={data.teamCount}
            onChange={(e) => onChange({ ...data, teamCount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Paragraphs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">فقرات النص</label>
          <button
            onClick={addParagraph}
            className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <i className="ri-add-line" />
            إضافة فقرة
          </button>
        </div>
        <div className="space-y-3">
          {data.paragraphs.map((p, i) => (
            <div key={i} className="relative">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                placeholder={`الفقرة ${i + 1}...`}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none pl-10"
              />
              {data.paragraphs.length > 1 && (
                <button
                  onClick={() => removeParagraph(i)}
                  className="absolute top-2.5 left-2.5 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">وسوم مميزة (Tags)</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.tags.map((tag, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-medium">
              {tag}
              <button onClick={() => removeTag(i)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-red-500 transition-colors cursor-pointer">
                <i className="ri-close-line text-xs" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="أضف وسماً..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
          >
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
}
