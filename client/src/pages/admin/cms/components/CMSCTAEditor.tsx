import type { CMSCTASection } from "@/mocks/cmsData";

interface Props {
  data: CMSCTASection;
  onChange: (data: CMSCTASection) => void;
}

export default function CMSCTAEditor({ data, onChange }: Props) {
  const update = (field: keyof CMSCTASection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-megaphone-line text-base" />
          نصوص قسم الدعوة للعمل
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الشارة (Badge)</label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => update("badge", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان الرئيسي</label>
            <input
              type="text"
              value={data.heading}
              onChange={(e) => update("heading", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الوصف الرئيسي</label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الوصف الثانوي</label>
            <textarea
              value={data.subDescription}
              onChange={(e) => update("subDescription", e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">نص زر الحجز</label>
            <input
              type="text"
              value={data.btnBook}
              onChange={(e) => update("btnBook", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">نص زر التواصل</label>
            <input
              type="text"
              value={data.btnContact}
              onChange={(e) => update("btnContact", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#2E4E45] rounded-xl p-6 text-center">
        <p className="text-xs text-white/50 mb-3">معاينة مبسطة</p>
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full mb-3 border border-white/15">
          {data.badge}
        </div>
        <h4 className="text-lg font-black text-white mb-2">{data.heading}</h4>
        <p className="text-white/60 text-sm mb-4">{data.description}</p>
        <div className="flex gap-3 justify-center">
          <div className="px-5 py-2 bg-[#C8A96E] text-[#2E4E45] text-sm font-bold rounded-full whitespace-nowrap">
            {data.btnBook}
          </div>
          <div className="px-5 py-2 border border-white/30 text-white text-sm rounded-full whitespace-nowrap">
            {data.btnContact}
          </div>
        </div>
      </div>
    </div>
  );
}
