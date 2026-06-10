import { useState } from "react";
import type { ClinicInfo } from "@/hooks/useCMSSettings";

interface Props {
  data: ClinicInfo;
  onChange: (d: ClinicInfo) => void;
}

const SPECIALTIES_DEFAULT = ["الجلدية والتجميل", "العلاج بالخلايا الجذعية", "الليزر الطبي", "الطب التجديدي", "الحقن التجميلية"];

export default function ClinicInfoSection({ data, onChange }: Props) {
  const [newSpec, setNewSpec] = useState("");
  const [specialties, setSpecialties] = useState<string[]>(SPECIALTIES_DEFAULT);

  const handleChange = (field: keyof ClinicInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addSpec = () => {
    if (newSpec.trim()) {
      setSpecialties((prev) => [...prev, newSpec.trim()]);
      setNewSpec("");
    }
  };

  const removeSpec = (i: number) => {
    setSpecialties((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
          <i className="ri-hospital-line text-[#2E4E45] text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">معلومات العيادة</h3>
          <p className="text-xs text-gray-500">البيانات الأساسية التي تظهر في الموقع</p>
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">شعار العيادة</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 flex-shrink-0 overflow-hidden">
            {data.logo ? (
              <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <i className="ri-image-line text-2xl text-gray-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer">
                <i className="ri-upload-2-line" />
                رفع شعار جديد
              </button>
              {data.logo && (
                <button
                  onClick={() => handleChange("logo", "")}
                  className="px-3 py-2 rounded-lg border border-red-100 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">PNG أو SVG، شفاف، حتى 2MB</p>
            <input
              type="url"
              value={data.logo}
              onChange={(e) => handleChange("logo", e.target.value)}
              placeholder="أو أدخل رابط الشعار مباشرة..."
              dir="ltr"
              className="mt-2 w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#2E4E45] transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            اسم العيادة (عربي) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم العيادة (إنجليزي)</label>
          <input
            type="text"
            value={data.nameEn}
            onChange={(e) => handleChange("nameEn", e.target.value)}
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">الشعار التسويقي (Tagline)</label>
        <input
          type="text"
          value={data.tagline}
          onChange={(e) => handleChange("tagline", e.target.value)}
          placeholder="جملة قصيرة تصف العيادة..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">وصف العيادة</label>
        <textarea
          rows={4}
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="وصف تفصيلي عن العيادة وخدماتها..."
          maxLength={500}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{data.description.length}/500 حرف</p>
      </div>

      {/* Specialty tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">التخصصات الرئيسية</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {specialties.map((spec, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2E4E45]/8 text-[#2E4E45] text-xs font-medium"
            >
              {spec}
              <button
                onClick={() => removeSpec(i)}
                className="w-3.5 h-3.5 flex items-center justify-center hover:text-red-500 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xs" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSpec}
            onChange={(e) => setNewSpec(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSpec()}
            placeholder="أضف تخصصاً جديداً..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all"
          />
          <button
            onClick={addSpec}
            className="px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
          >
            إضافة
          </button>
        </div>
      </div>

      {/* Founded & License */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">سنة التأسيس</label>
          <input
            type="number"
            defaultValue="2015"
            min="1900"
            max="2030"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الترخيص</label>
          <input
            type="text"
            defaultValue="MOH-2015-12345"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">الجهة المرخصة</label>
          <input
            type="text"
            defaultValue="وزارة الصحة السعودية"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Preview card */}
      <div className="p-4 rounded-xl bg-[#2E4E45]/5 border border-[#2E4E45]/10">
        <p className="text-xs font-semibold text-[#2E4E45] mb-3 flex items-center gap-1.5">
          <i className="ri-eye-line" />
          معاينة بطاقة العيادة
        </p>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
          <div className="w-14 h-14 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center flex-shrink-0">
            {data.logo ? (
              <img src={data.logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <i className="ri-hospital-line text-[#2E4E45] text-2xl" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800">{data.name || "اسم العيادة"}</p>
            <p className="text-xs text-gray-500">{data.tagline || "الشعار التسويقي"}</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{data.description || "وصف العيادة..."}</p>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <i className="ri-information-line text-amber-500 text-lg mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          هذه المعلومات تظهر في الصفحة الرئيسية، صفحة "من نحن"، وفي نتائج محركات البحث. تأكد من دقتها.
        </p>
      </div>
    </div>
  );
}
