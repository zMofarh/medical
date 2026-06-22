import { SearchHeroData } from "@/types/cms";

interface SearchHeroEditorProps {
  data: SearchHeroData;
  onChange: (d: SearchHeroData) => void;
}

export default function SearchHeroEditor({ data, onChange }: SearchHeroEditorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg">
            <i className="ri-search-eye-line text-[#2E4E45] text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">قسم الهيرو</h3>
            <p className="text-xs text-gray-400">العنوان الرئيسي وحقل البحث</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">نص الشارة</label>
          <input
            type="text"
            value={data.badge || ""}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان الرئيسي</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">النص التوضيحي (تحت العنوان)</label>
          <input
            type="text"
            value={data.subtitle || ""}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">نص placeholder لحقل البحث</label>
          <input
            type="text"
            value={data.placeholder}
            onChange={(e) => onChange({ ...data, placeholder: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-5 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a3530] via-[#2E4E45] to-[#3a6358] p-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
          <i className="ri-search-eye-line text-xs"></i>
          {data.badge}
        </div>
        <div className="text-xl font-black text-white mb-1">{data.title}</div>
        <div className="text-white/60 text-xs mb-4">{data.subtitle}</div>
        <div className="relative max-w-sm mx-auto">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-gray-400 text-sm"></i>
          </div>
          <div className="w-full bg-white text-gray-400 text-xs pr-9 pl-4 py-3 rounded-xl text-right">
            {data.placeholder}
          </div>
        </div>
      </div>
    </div>
  );
}
