import type { CMSWhyUsSection, CMSWhyUsItem } from "@/mocks/cmsData";

interface Props {
  data: CMSWhyUsSection;
  onChange: (data: CMSWhyUsSection) => void;
}

const iconOptions = [
  "ri-dna-line", "ri-heart-pulse-line", "ri-microscope-line", "ri-global-line",
  "ri-stethoscope-line", "ri-hospital-line", "ri-user-star-line", "ri-flask-line",
  "ri-shield-check-line", "ri-award-line", "ri-brain-line", "ri-leaf-line",
];

export default function CMSWhyUsEditor({ data, onChange }: Props) {
  const update = (field: keyof CMSWhyUsSection, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (idx: number, field: keyof CMSWhyUsItem, value: string) => {
    const updated = data.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    update("items", updated);
  };

  const addItem = () => {
    update("items", [
      ...data.items,
      { icon: "ri-star-line", title: "ميزة جديدة", description: "وصف الميزة الجديدة" },
    ]);
  };

  const removeItem = (idx: number) => {
    update("items", data.items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      {/* Main Texts */}
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان الرئيسي</label>
            <input
              type="text"
              value={data.heading}
              onChange={(e) => update("heading", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان الفرعي (ملوّن)</label>
            <input
              type="text"
              value={data.subHeading}
              onChange={(e) => update("subHeading", e.target.value)}
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
        </div>
      </div>

      {/* Main Image */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-image-line text-base" />
          الصورة الرئيسية
        </h3>
        <div className="flex gap-4 items-start">
          <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <img src={data.mainImage} alt="why us" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">رابط الصورة</label>
            <input
              type="text"
              value={data.mainImage}
              onChange={(e) => update("mainImage", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Feature Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-[#2E4E45] flex items-center gap-2">
            <i className="ri-list-check text-base" />
            المميزات ({data.items.length})
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-semibold rounded-lg hover:bg-[#2E4E45]/15 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            إضافة ميزة
          </button>
        </div>
        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400">ميزة {idx + 1}</span>
                <button
                  onClick={() => removeItem(idx)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">الأيقونة</label>
                  <select
                    value={item.icon}
                    onChange={(e) => updateItem(idx, "icon", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors bg-white"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic} value={ic}>{ic.replace("ri-", "").replace("-line", "")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">العنوان</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">الوصف</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg">
                  <i className={`${item.icon} text-[#2E4E45] text-base`} />
                </div>
                <span className="text-xs text-gray-400">معاينة الأيقونة</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
