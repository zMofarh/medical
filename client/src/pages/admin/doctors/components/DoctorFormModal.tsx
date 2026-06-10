import { useState, useEffect } from "react";
import ImageUploader from "@/components/base/ImageUploader";

interface DoctorFormData {
  id?: string;
  name: string;
  specialty: string;
  title: string;
  experience: string;
  education: string;
  bio: string;
  languages: string[];
  availableDays: string[];
  consultationFee: string;
  rating: number;
  reviewsCount: number;
  image: string;
  specializations: string[];
  achievements: string[];
}

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const LANGS = ["العربية", "الإنجليزية", "الفرنسية", "الألمانية", "الإيطالية"];

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DoctorFormData) => void;
  initialData?: DoctorFormData | null;
}

const emptyForm: DoctorFormData = {
  name: "",
  specialty: "",
  title: "",
  experience: "",
  education: "",
  bio: "",
  languages: ["العربية"],
  availableDays: [],
  consultationFee: "",
  rating: 4.8,
  reviewsCount: 0,
  image: "",
  specializations: [],
  achievements: [],
};

export default function DoctorFormModal({ isOpen, onClose, onSave, initialData }: DoctorFormModalProps) {
  const [form, setForm] = useState<DoctorFormData>(emptyForm);
  const [specInput, setSpecInput] = useState("");
  const [achInput, setAchInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "schedule">("basic");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setActiveTab("basic");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEdit = !!initialData?.id;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "اسم الطبيب مطلوب";
    if (!form.specialty.trim()) errs.specialty = "التخصص مطلوب";
    if (!form.title.trim()) errs.title = "اللقب الوظيفي مطلوب";
    if (!form.experience.trim()) errs.experience = "سنوات الخبرة مطلوبة";
    if (!form.consultationFee.trim()) errs.consultationFee = "رسوم الاستشارة مطلوبة";
    if (form.availableDays.length === 0) errs.availableDays = "اختر يوم واحد على الأقل";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
    if (errors.availableDays) setErrors((e) => ({ ...e, availableDays: "" }));
  };

  const toggleLang = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const addSpec = () => {
    if (!specInput.trim()) return;
    setForm((prev) => ({ ...prev, specializations: [...prev.specializations, specInput.trim()] }));
    setSpecInput("");
  };

  const removeSpec = (idx: number) => {
    setForm((prev) => ({ ...prev, specializations: prev.specializations.filter((_, i) => i !== idx) }));
  };

  const addAch = () => {
    if (!achInput.trim()) return;
    setForm((prev) => ({ ...prev, achievements: [...prev.achievements, achInput.trim()] }));
    setAchInput("");
  };

  const removeAch = (idx: number) => {
    setForm((prev) => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
  };

  const updateField = (field: keyof DoctorFormData, value: unknown) => {
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
              <i className="ri-user-star-line text-[#2E4E45] text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">{isEdit ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}</h3>
              <p className="text-xs text-gray-400">{isEdit ? "تحديث معلومات الطبيب" : "أدخل بيانات الطبيب الجديد"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 flex-shrink-0">
          {[
            { key: "basic" as const, label: "المعلومات الأساسية", icon: "ri-user-line" },
            { key: "details" as const, label: "التفاصيل المهنية", icon: "ri-award-line" },
            { key: "schedule" as const, label: "الجدول واللغات", icon: "ri-calendar-line" },
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
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الاسم الكامل <span className="text-red-400">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: د. أحمد محمد"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">التخصص <span className="text-red-400">*</span></label>
                  <input
                    value={form.specialty}
                    onChange={(e) => updateField("specialty", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.specialty ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: الطب الدقيق"
                  />
                  {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">اللقب الوظيفي <span className="text-red-400">*</span></label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: استشاري الطب الدقيق"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">سنوات الخبرة <span className="text-red-400">*</span></label>
                  <input
                    value={form.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.experience ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: 15 سنة خبرة"
                  />
                  {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">رسوم الاستشارة (ريال) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={form.consultationFee}
                    onChange={(e) => updateField("consultationFee", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] ${errors.consultationFee ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    placeholder="مثال: 800"
                  />
                  {errors.consultationFee && <p className="text-xs text-red-500 mt-1">{errors.consultationFee}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">التقييم (1-5)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={form.rating}
                      onChange={(e) => updateField("rating", parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-[#C8A96E] w-10 text-center">{form.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <ImageUploader
                  label="صورة الطبيب"
                  value={form.image}
                  onChange={(val) => updateField("image", val)}
                  shape="circle"
                  placeholder="اختر صورة الطبيب"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">السيرة الذاتية</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="نبذة عن الطبيب وخبراته..."
                />
              </div>
            </div>
          )}

          {/* ── Details Tab ── */}
          {activeTab === "details" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">التعليم</label>
                <input
                  value={form.education}
                  onChange={(e) => updateField("education", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="مثال: دكتوراه من جامعة هارفارد"
                />
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">التخصصات الفرعية</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="أضف تخصص فرعي..."
                  />
                  <button
                    onClick={addSpec}
                    className="px-3 py-2 bg-[#2E4E45] text-white rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.specializations.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2E4E45]/10 text-[#2E4E45] text-xs rounded-full">
                      {s}
                      <button onClick={() => removeSpec(i)} className="w-4 h-4 flex items-center justify-center hover:bg-[#2E4E45]/20 rounded-full cursor-pointer">
                        <i className="ri-close-line text-xs" />
                      </button>
                    </span>
                  ))}
                  {form.specializations.length === 0 && <p className="text-xs text-gray-400">لا توجد تخصصات فرعية</p>}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">الإنجازات</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={achInput}
                    onChange={(e) => setAchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAch())}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="أضف إنجاز..."
                  />
                  <button
                    onClick={addAch}
                    className="px-3 py-2 bg-[#C8A96E] text-white rounded-lg text-sm cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {form.achievements.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className="ri-award-line text-[#C8A96E] text-sm" />
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{a}</span>
                      <button onClick={() => removeAch(i)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                        <i className="ri-close-line text-xs" />
                      </button>
                    </div>
                  ))}
                  {form.achievements.length === 0 && <p className="text-xs text-gray-400">لا توجد إنجازات</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── Schedule Tab ── */}
          {activeTab === "schedule" && (
            <div className="space-y-5">
              {/* Available Days */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">أيام العمل <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap
                        ${form.availableDays.includes(day)
                          ? "bg-[#2E4E45] text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {errors.availableDays && <p className="text-xs text-red-500 mt-1">{errors.availableDays}</p>}
              </div>

              {/* Languages */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">اللغات</label>
                <div className="flex flex-wrap gap-2">
                  {LANGS.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLang(lang)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border
                        ${form.languages.includes(lang)
                          ? "bg-[#C8A96E]/10 border-[#C8A96E] text-[#C8A96E]"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-3">معاينة البطاقة</p>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#2E4E45]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {form.image
                      ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                      : <i className="ri-user-star-line text-[#2E4E45] text-xl" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{form.name || "اسم الطبيب"}</p>
                    <p className="text-xs text-[#C8A96E]">{form.specialty || "التخصص"}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{form.experience || "—"}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E4E45]/10 text-[#2E4E45]">{form.consultationFee ? `${form.consultationFee} ريال` : "—"}</span>
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
            {isEdit ? "حفظ التغييرات" : "إضافة الطبيب"}
          </button>
        </div>
      </div>
    </div>
  );
}
