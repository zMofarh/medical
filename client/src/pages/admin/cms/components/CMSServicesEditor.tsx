import { useState } from "react";
import { servicesData, type ServiceDetail } from "@/mocks/servicesData";

interface CMSServicesEditorProps {
  data: ServiceDetail[];
  onChange: (data: ServiceDetail[]) => void;
}

export default function CMSServicesEditor({ data, onChange }: CMSServicesEditorProps) {
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id || "");
  const [expandedSection, setExpandedSection] = useState<string>("basic");

  const selected = data.find((s) => s.id === selectedId);

  const updateService = (updated: ServiceDetail) => {
    onChange(data.map((s) => (s.id === updated.id ? updated : s)));
  };

  const updateField = <K extends keyof ServiceDetail>(field: K, value: ServiceDetail[K]) => {
    if (!selected) return;
    updateService({ ...selected, [field]: value });
  };

  const updateStat = (idx: number, key: "label" | "value", val: string) => {
    if (!selected) return;
    const stats = [...selected.stats];
    stats[idx] = { ...stats[idx], [key]: val };
    updateField("stats", stats);
  };

  const addStat = () => {
    if (!selected) return;
    updateField("stats", [...selected.stats, { label: "تسمية جديدة", value: "0" }]);
  };

  const removeStat = (idx: number) => {
    if (!selected) return;
    updateField("stats", selected.stats.filter((_, i) => i !== idx));
  };

  const updateProcedure = (idx: number, key: "icon" | "title" | "desc", val: string) => {
    if (!selected) return;
    const procedures = [...selected.procedures];
    procedures[idx] = { ...procedures[idx], [key]: val };
    updateField("procedures", procedures);
  };

  const addProcedure = () => {
    if (!selected) return;
    updateField("procedures", [...selected.procedures, { icon: "ri-add-line", title: "إجراء جديد", desc: "وصف الإجراء" }]);
  };

  const removeProcedure = (idx: number) => {
    if (!selected) return;
    updateField("procedures", selected.procedures.filter((_, i) => i !== idx));
  };

  const updatePrice = (idx: number, key: keyof ServiceDetail["prices"][0], val: string | number) => {
    if (!selected) return;
    const prices = [...selected.prices];
    prices[idx] = { ...prices[idx], [key]: val };
    updateField("prices", prices);
  };

  const addPrice = () => {
    if (!selected) return;
    updateField("prices", [...selected.prices, { name: "خدمة جديدة", price: 0, duration: "60 دقيقة" }]);
  };

  const removePrice = (idx: number) => {
    if (!selected) return;
    updateField("prices", selected.prices.filter((_, i) => i !== idx));
  };

  const updateFaq = (idx: number, key: "q" | "a", val: string) => {
    if (!selected) return;
    const faqs = [...selected.faqs];
    faqs[idx] = { ...faqs[idx], [key]: val };
    updateField("faqs", faqs);
  };

  const addFaq = () => {
    if (!selected) return;
    updateField("faqs", [...selected.faqs, { q: "سؤال جديد؟", a: "الإجابة هنا" }]);
  };

  const removeFaq = (idx: number) => {
    if (!selected) return;
    updateField("faqs", selected.faqs.filter((_, i) => i !== idx));
  };

  const sections = [
    { key: "basic", label: "المعلومات الأساسية", icon: "ri-information-line" },
    { key: "stats", label: "الإحصائيات", icon: "ri-bar-chart-box-line" },
    { key: "procedures", label: "الإجراءات", icon: "ri-list-check-2" },
    { key: "prices", label: "الأسعار", icon: "ri-price-tag-3-line" },
    { key: "faqs", label: "الأسئلة الشائعة", icon: "ri-question-answer-line" },
  ];

  if (!selected) return null;

  return (
    <div className="flex gap-4">
      {/* Services List */}
      <div className="w-48 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">الخدمات</p>
          </div>
          <div className="p-1.5 max-h-[500px] overflow-y-auto">
            {data.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedId(svc.id)}
                className={`w-full text-right px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer
                  ${selectedId === svc.id ? "bg-[#2E4E45] text-white font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <i className={`${svc.icon} text-xs`} />
                  </div>
                  <span className="truncate leading-tight">{svc.name.split("—")[0].trim()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Section Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setExpandedSection(sec.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap
                ${expandedSection === sec.key ? "bg-[#2E4E45] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              <i className={`${sec.icon} text-xs`} />
              {sec.label}
            </button>
          ))}
        </div>

        {/* Basic Info */}
        {expandedSection === "basic" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-700">المعلومات الأساسية</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">اسم الخدمة</label>
                <input
                  value={selected.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الشعار (Tagline)</label>
                <input
                  value={selected.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">التصنيف</label>
                <input
                  value={selected.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">أيقونة (Remix Icon)</label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg flex-shrink-0">
                    <i className={`${selected.icon} text-[#2E4E45] text-base`} />
                  </div>
                  <input
                    value={selected.icon}
                    onChange={(e) => updateField("icon", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="ri-icon-name"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">الوصف المختصر</label>
              <textarea
                value={selected.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">الوصف التفصيلي</label>
              <textarea
                value={selected.longDescription}
                onChange={(e) => updateField("longDescription", e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">رابط الصورة الرئيسية</label>
              <input
                value={selected.image}
                onChange={(e) => updateField("image", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
              />
              {selected.image && (
                <img src={selected.image} alt="" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        {expandedSection === "stats" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">الإحصائيات</h4>
              <button
                onClick={addStat}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">القيمة</label>
                    <input
                      value={stat.value}
                      onChange={(e) => updateStat(idx, "value", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">التسمية</label>
                    <input
                      value={stat.label}
                      onChange={(e) => updateStat(idx, "label", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeStat(idx)}
                  className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Procedures */}
        {expandedSection === "procedures" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">الإجراءات والخدمات</h4>
              <button
                onClick={addProcedure}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.procedures.map((proc, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg flex-shrink-0">
                    <i className={`${proc.icon} text-[#2E4E45] text-sm`} />
                  </div>
                  <input
                    value={proc.icon}
                    onChange={(e) => updateProcedure(idx, "icon", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]"
                    placeholder="ri-icon-name"
                  />
                  <button
                    onClick={() => removeProcedure(idx)}
                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
                <input
                  value={proc.title}
                  onChange={(e) => updateProcedure(idx, "title", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="عنوان الإجراء"
                />
                <textarea
                  value={proc.desc}
                  onChange={(e) => updateProcedure(idx, "desc", e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="وصف الإجراء"
                />
              </div>
            ))}
          </div>
        )}

        {/* Prices */}
        {expandedSection === "prices" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">الأسعار</h4>
              <button
                onClick={addPrice}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.prices.map((price, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    value={price.name}
                    onChange={(e) => updatePrice(idx, "name", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="اسم الخدمة"
                  />
                  <button
                    onClick={() => removePrice(idx)}
                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">السعر (ريال)</label>
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => updatePrice(idx, "price", Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">المدة</label>
                    <input
                      value={price.duration || ""}
                      onChange={(e) => updatePrice(idx, "duration", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                </div>
                <input
                  value={price.note || ""}
                  onChange={(e) => updatePrice(idx, "note", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]"
                  placeholder="ملاحظة (اختياري)"
                />
              </div>
            ))}
          </div>
        )}

        {/* FAQs */}
        {expandedSection === "faqs" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">الأسئلة الشائعة</h4>
              <button
                onClick={addFaq}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, "q", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:border-[#2E4E45]"
                      placeholder="السؤال"
                    />
                    <textarea
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, "a", e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                      placeholder="الإجابة"
                    />
                  </div>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0 mt-0.5"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
