import type { CMSTestimonialsSection, CMSTestimonialItem } from "@/mocks/cmsData";

interface Props {
  data: CMSTestimonialsSection;
  onChange: (data: CMSTestimonialsSection) => void;
}

export default function CMSTestimonialsEditor({ data, onChange }: Props) {
  const update = (field: keyof CMSTestimonialsSection, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (idx: number, field: keyof CMSTestimonialItem, value: string | number) => {
    const updated = data.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    update("items", updated);
  };

  const addItem = () => {
    update("items", [
      ...data.items,
      {
        name: "اسم المريض",
        role: "مريض جديد",
        text: "تجربة رائعة مع الفريق الطبي المتميز.",
        rating: 5,
        avatar: "https://readdy.ai/api/search-image?query=professional%20arab%20person%20portrait%20headshot%20neutral%20background%20confident%20smile%20clean%20modern%20style&width=80&height=80&seq=tnew&orientation=squarish",
      },
    ]);
  };

  const removeItem = (idx: number) => {
    update("items", data.items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      {/* Header Texts */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-5 flex items-center gap-2">
          <i className="ri-chat-quote-line text-base" />
          نصوص القسم
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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان</label>
            <input
              type="text"
              value={data.heading}
              onChange={(e) => update("heading", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الوصف</label>
            <input
              type="text"
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-[#2E4E45] flex items-center gap-2">
            <i className="ri-user-voice-line text-base" />
            آراء المرضى ({data.items.length})
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-semibold rounded-lg hover:bg-[#2E4E45]/15 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            إضافة رأي
          </button>
        </div>
        <div className="space-y-5">
          {data.items.map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C8A96E]/30"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">الاسم</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">الدور / الوصف</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateItem(idx, "role", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">نص الرأي</label>
                  <textarea
                    value={item.text}
                    onChange={(e) => updateItem(idx, "text", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">التقييم (1-5)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateItem(idx, "rating", star)}
                        className={`w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-colors ${
                          star <= item.rating ? "text-[#C8A96E]" : "text-gray-300"
                        }`}
                      >
                        <i className="ri-star-fill text-lg" />
                      </button>
                    ))}
                    <span className="text-xs text-gray-400 mr-1">{item.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">رابط الصورة</label>
                  <input
                    type="text"
                    value={item.avatar}
                    onChange={(e) => updateItem(idx, "avatar", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
