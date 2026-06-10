import { useState, useEffect } from "react";
import ImageUploader from "@/components/base/ImageUploader";

interface ServiceFormData {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string;
  accentColor: string;
  price: string;
  duration: string;
  image: string;
  heroImage: string;
  status: "active" | "inactive";
}

const ICONS = [
  "ri-stethoscope-line", "ri-dna-line", "ri-heart-pulse-line", "ri-microscope-line",
  "ri-brain-line", "ri-leaf-line", "ri-flask-line", "ri-radar-line",
  "ri-shield-check-line", "ri-award-line", "ri-global-line", "ri-user-star-line",
  "ri-hospital-line", "ri-capsule-line", "ri-mental-health-line", "ri-eye-line",
  "ri-drop-line", "ri-body-scan-line", "ri-scan-line", "ri-scales-line",
];

const COLORS = [
  { label: "أخضر داكن", value: "teal" },
  { label: "ذهبي", value: "amber" },
  { label: "بنفسجي", value: "violet" },
  { label: "أزرق سماوي", value: "cyan" },
  { label: "وردي", value: "rose" },
  { label: "أخضر", value: "green" },
  { label: "برتقالي", value: "orange" },
];

const CATEGORIES = [
  "الطب الدقيق", "الطب الأيضي", "الخبرة الدولية", "الجينات والطب الدقيق",
  "العلاجات المتخصصة", "الطب النفسي", "العظام والأيض", "الطب العصبي الوقائي",
  "الطب الخلوي",
];

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
  initialData?: ServiceFormData | null;
}

const emptyForm: ServiceFormData = {
  name: "",
  tagline: "",
  description: "",
  longDescription: "",
  category: "الطب الدقيق",
  icon: "ri-stethoscope-line",
  accentColor: "teal",
  price: "",
  duration: "",
  image: "",
  heroImage: "",
  status: "active",
};

export default function ServiceFormModal({ isOpen, onClose, onSave, initialData }: ServiceFormModalProps) {
  const [form, setForm] = useState<ServiceFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "media">("basic");

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
    if (!form.name.trim()) errs.name = "اسم الخدمة مطلوب";
    if (!form.tagline.trim()) errs.tagline = "الشعار مطلوب";
    if (!form.description.trim()) errs.description = "الوصف مطلوب";
    if (!form.price.trim()) errs.price = "السعر مطلوب";
    if (!form.duration.trim()) errs.duration = "المدة مطلوبة";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  const updateField = (field: keyof ServiceFormData, value: unknown) => {
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
            <div className="w-10 h-10 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
              <i className="ri-stethoscope-line text-[#2E4E45] text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">{isEdit ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</h3>
              <p className="text-xs text-gray-400">{isEdit ? "تحديث معلومات الخدمة" : "أدخل بيانات الخدمة الجديدة"}</p>
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
            { key: "content" as const, label: "المحتوى", icon: "ri-article-line" },
            { key: "media" as const, label: "الصور والألوان", icon: "ri-image-line" },
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
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">اسم الخدمة <span className="text-red-400">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: تقييم المخاطر الصحية"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الشعار <span className="text-red-400">*</span></label>
                  <input
                    value={form.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.tagline ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: نستبق قبل أن نطارد"
                  />
                  {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الحالة</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateField("status", "active")}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                        ${form.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-500"}`}
                    >
                      <i className="ri-check-line ml-1" />
                      نشط
                    </button>
                    <button
                      onClick={() => updateField("status", "inactive")}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                        ${form.status === "inactive" ? "bg-gray-200 text-gray-600 border border-gray-300" : "bg-gray-100 text-gray-500"}`}
                    >
                      <i className="ri-close-line ml-1" />
                      معطل
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">السعر (ريال) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.price ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: 800"
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">المدة <span className="text-red-400">*</span></label>
                  <input
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.duration ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: 90 دقيقة"
                  />
                  {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── Content Tab ── */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">الوصف المختصر <span className="text-red-400">*</span></label>
                <input
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.description ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  placeholder="وصف مختصر يظهر في القوائم..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">الوصف الطويل</label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => updateField("longDescription", e.target.value)}
                  rows={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="وصف تفصيلي للخدمة..."
                />
              </div>
            </div>
          )}

          {/* ── Media Tab ── */}
          {activeTab === "media" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">الأيقونة</label>
                <div className="grid grid-cols-10 gap-1.5">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updateField("icon", icon)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer
                        ${form.icon === icon
                          ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]"
                          : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                        }`}
                      title={icon}
                    >
                      <i className={`${icon} text-sm`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">لون التمييز</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => updateField("accentColor", c.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap
                        ${form.accentColor === c.value
                          ? "border-[#2E4E45] bg-[#2E4E45]/5 text-[#2E4E45]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${
                        c.value === "teal" ? "bg-teal-600" :
                        c.value === "amber" ? "bg-amber-500" :
                        c.value === "violet" ? "bg-violet-500" :
                        c.value === "cyan" ? "bg-cyan-500" :
                        c.value === "rose" ? "bg-rose-500" :
                        c.value === "green" ? "bg-green-500" :
                        "bg-orange-500"
                      }`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploader
                label="صورة الخدمة"
                value={form.image}
                onChange={(val) => updateField("image", val)}
                aspectRatio="16/9"
                placeholder="اختر صورة الخدمة"
              />

              <ImageUploader
                label="صورة الهيرو"
                value={form.heroImage}
                onChange={(val) => updateField("heroImage", val)}
                aspectRatio="21/9"
                placeholder="اختر صورة الهيرو"
              />

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-3">معاينة البطاقة</p>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center flex-shrink-0">
                    <i className={`${form.icon} text-[#2E4E45] text-xl`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{form.name || "اسم الخدمة"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{form.tagline || "الشعار"}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E4E45]/10 text-[#2E4E45]">{form.price ? `${form.price} ريال` : "—"}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{form.duration || "—"}</span>
                    </div>
                  </div>
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
            {isEdit ? "حفظ التغييرات" : "إضافة الخدمة"}
          </button>
        </div>
      </div>
    </div>
  );
}
