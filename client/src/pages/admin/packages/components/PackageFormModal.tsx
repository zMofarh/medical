import { useState, useEffect } from "react";
import ImageUploader from "@/components/base/ImageUploader";

interface PackageFormData {
  id?: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  badge: string;
  icon: string;
  description: string;
  duration: string;
  targetAudience: string;
  status: "active" | "inactive";
  features: string[];
  image: string;
}

const ICONS = [
  "ri-vip-crown-line", "ri-vip-diamond-line", "ri-award-line", "ri-focus-3-line",
  "ri-stack-line", "ri-group-line", "ri-dna-line", "ri-radar-line",
  "ri-scales-line", "ri-flask-line", "ri-heart-pulse-line", "ri-brain-line",
  "ri-shield-flash-line", "ri-drop-line", "ri-flashlight-line", "ri-scan-line",
  "ri-global-line", "ri-video-line", "ri-route-line", "ri-medal-line",
  "ri-building-line", "ri-hotel-line", "ri-home-heart-line", "ri-smartphone-line",
];

const CATEGORIES = [
  "التقييم العميق", "الطب الدقيق", "الخلل الأيضي", "Second Opinion",
  "الجينات والDNA", "الطب النفسي", "هشاشة العظام", "العلاجات الوريدية",
  "الوقاية العصبية", "الرعاية الدولية", "VIP",
];

const BADGES = [
  { label: "بدون", value: "" },
  { label: "الأكثر طلباً", value: "الأكثر طلباً" },
  { label: "مميز", value: "مميز" },
  { label: "حصري", value: "حصري" },
  { label: "الأرقى", value: "الأرقى" },
  { label: "للشركات", value: "للشركات" },
];

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PackageFormData) => void;
  initialData?: PackageFormData | null;
}

const emptyForm: PackageFormData = {
  name: "",
  category: "التقييم العميق",
  price: "",
  originalPrice: "",
  badge: "",
  icon: "ri-vip-crown-line",
  description: "",
  duration: "",
  targetAudience: "",
  status: "active",
  features: [],
  image: "",
};

export default function PackageFormModal({ isOpen, onClose, onSave, initialData }: PackageFormModalProps) {
  const [form, setForm] = useState<PackageFormData>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"basic" | "features" | "pricing">("basic");

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(emptyForm);
    setErrors({});
    setActiveTab("basic");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEdit = !!initialData?.id;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "اسم الباقة مطلوب";
    if (!form.price.trim()) errs.price = "السعر مطلوب";
    if (form.features.length === 0) errs.features = "أضف ميزة واحدة على الأقل";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    setFeatureInput("");
    if (errors.features) setErrors((e) => ({ ...e, features: "" }));
  };

  const removeFeature = (idx: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const updateField = (field: keyof PackageFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center">
              <i className="ri-vip-crown-line text-[#C8A96E] text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">{isEdit ? "تعديل الباقة" : "إضافة باقة جديدة"}</h3>
              <p className="text-xs text-gray-400">{isEdit ? "تحديث معلومات الباقة" : "أدخل بيانات الباقة الجديدة"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 flex-shrink-0">
          {[
            { key: "basic" as const, label: "المعلومات الأساسية", icon: "ri-information-line" },
            { key: "features" as const, label: "الميزات", icon: "ri-list-check" },
            { key: "pricing" as const, label: "الأسعار", icon: "ri-money-dollar-circle-line" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap
                ${activeTab === tab.key ? "border-[#2E4E45] text-[#2E4E45]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Basic Tab ── */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">اسم الباقة <span className="text-red-400">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: التقييم العميق الشامل"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الفئة</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">المدة</label>
                  <input
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="مثال: 120 دقيقة + متابعة شهر"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الشارة</label>
                  <select
                    value={form.badge}
                    onChange={(e) => updateField("badge", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
                  >
                    {BADGES.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="وصف الباقة..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">الجمهور المستهدف</label>
                <input
                  value={form.targetAudience}
                  onChange={(e) => updateField("targetAudience", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="مناسب ل..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">الحالة</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField("status", "active")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                      ${form.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-500"}`}
                  >
                    <i className="ri-check-line ml-1" />
                    نشطة
                  </button>
                  <button
                    onClick={() => updateField("status", "inactive")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                      ${form.status === "inactive" ? "bg-gray-200 text-gray-600 border border-gray-300" : "bg-gray-100 text-gray-500"}`}
                  >
                    <i className="ri-close-line ml-1" />
                    معطلة
                  </button>
                </div>
              </div>

              <ImageUploader
                label="صورة الباقة"
                value={form.image}
                onChange={(val) => updateField("image", val)}
                aspectRatio="16/9"
                placeholder="اختر صورة الباقة"
              />

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">الأيقونة</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updateField("icon", icon)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer
                        ${form.icon === icon
                          ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]"
                          : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                        }`}
                    >
                      <i className={`${icon} text-sm`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Features Tab ── */}
          {activeTab === "features" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">الميزات <span className="text-red-400">*</span></label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="أضف ميزة..."
                  />
                  <button
                    onClick={addFeature}
                    className="px-3 py-2 bg-[#2E4E45] text-white rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line" />
                  </button>
                </div>
                {errors.features && <p className="text-xs text-red-500 mb-2">{errors.features}</p>}

                <div className="space-y-1.5">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-emerald-500 text-sm" />
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{f}</span>
                      <button
                        onClick={() => removeFeature(i)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <i className="ri-close-line text-xs" />
                      </button>
                    </div>
                  ))}
                  {form.features.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-400">لا توجد ميزات بعد. أضف ميزة أولاً.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Pricing Tab ── */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">السعر الحالي (ريال) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.price ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: 1400"
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">السعر الأصلي (ريال) — اختياري</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => updateField("originalPrice", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="لعرض الخصم..."
                  />
                </div>
              </div>

              {/* Price preview */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-3">معاينة السعر</p>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center">
                      <i className={`${form.icon} text-[#C8A96E] text-lg`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{form.name || "اسم الباقة"}</p>
                      {form.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8A96E]/10 text-[#C8A96E] font-medium">{form.badge}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#2E4E45]">{form.price ? `${form.price} ريال` : "—"}</span>
                    {form.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{form.originalPrice} ريال</span>
                    )}
                  </div>
                  {form.originalPrice && form.price && (
                    <p className="text-xs text-emerald-600 mt-1">
                      وفّر {Math.round(((parseInt(form.originalPrice) - parseInt(form.price)) / parseInt(form.originalPrice)) * 100)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#2E4E45] text-white text-sm font-bold rounded-lg hover:bg-[#243d36] transition-colors cursor-pointer whitespace-nowrap"
          >
            {isEdit ? "حفظ التغييرات" : "إضافة الباقة"}
          </button>
        </div>
      </div>
    </div>
  );
}
