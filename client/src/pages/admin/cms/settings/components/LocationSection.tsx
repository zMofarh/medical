import { useState } from "react";
import type { ClinicInfo } from "@/hooks/useCMSSettings";

interface Props {
  data: ClinicInfo;
  onChange: (d: ClinicInfo) => void;
}

export default function LocationSection({ data, onChange }: Props) {
  const [mapPreview, setMapPreview] = useState(true);

  const handleChange = (field: keyof ClinicInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
          <i className="ri-map-pin-line text-violet-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">الموقع الجغرافي</h3>
          <p className="text-xs text-gray-500">عنوان العيادة وإعدادات الخريطة</p>
        </div>
      </div>

      {/* Address fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (عربي)</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (إنجليزي)</label>
            <input
              type="text"
              value={data.addressEn}
              onChange={(e) => handleChange("addressEn", e.target.value)}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الدولة</label>
            <input
              type="text"
              value={data.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الرمز البريدي</label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <i className="ri-crosshair-line ml-1.5 text-violet-500" />
          الإحداثيات الجغرافية
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">خط العرض (Latitude)</label>
            <input
              type="text"
              value={data.mapLat}
              onChange={(e) => handleChange("mapLat", e.target.value)}
              dir="ltr"
              placeholder="24.7136"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">خط الطول (Longitude)</label>
            <input
              type="text"
              value={data.mapLng}
              onChange={(e) => handleChange("mapLng", e.target.value)}
              dir="ltr"
              placeholder="46.6753"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all font-mono"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <i className="ri-information-line" />
          يمكنك الحصول على الإحداثيات من Google Maps بالنقر بزر الماوس الأيمن على الموقع
        </p>
      </div>

      {/* Map embed URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <i className="ri-map-2-line ml-1.5 text-violet-500" />
          رابط تضمين الخريطة (Google Maps Embed)
        </label>
        <textarea
          rows={3}
          value={data.mapEmbedUrl}
          onChange={(e) => handleChange("mapEmbedUrl", e.target.value)}
          dir="ltr"
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none font-mono text-xs"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            من Google Maps: مشاركة &rarr; تضمين خريطة &rarr; نسخ الرابط
          </p>
          <button
            onClick={() => setMapPreview(!mapPreview)}
            className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <i className={mapPreview ? "ri-eye-off-line" : "ri-eye-line"} />
            {mapPreview ? "إخفاء المعاينة" : "معاينة الخريطة"}
          </button>
        </div>
      </div>

      {/* Map preview */}
      {mapPreview && data.mapEmbedUrl && (
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <i className="ri-map-pin-2-line text-violet-500 text-sm" />
            <span className="text-xs font-medium text-gray-600">معاينة الخريطة</span>
          </div>
          <iframe
            src={data.mapEmbedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع العيادة"
          />
        </div>
      )}

      {/* Branches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            <i className="ri-building-2-line ml-1.5 text-violet-500" />
            الفروع
          </label>
          <button className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors flex items-center gap-1 cursor-pointer">
            <i className="ri-add-line" />
            إضافة فرع
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: "الفرع الرئيسي - العليا", address: "شارع الملك فهد، حي العليا، الرياض", isMain: true },
            { name: "فرع النخيل", address: "طريق الملك عبدالله، حي النخيل، الرياض", isMain: false },
          ].map((branch) => (
            <div key={branch.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                branch.isMain ? "bg-[#2E4E45]/10 text-[#2E4E45]" : "bg-gray-100 text-gray-500"
              }`}>
                <i className="ri-building-line text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {branch.name}
                  {branch.isMain && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-[#2E4E45]/10 text-[#2E4E45]">رئيسي</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 truncate">{branch.address}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <i className="ri-edit-line text-sm" />
                </button>
                {!branch.isMain && (
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directions note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">تعليمات الوصول</label>
        <textarea
          rows={3}
          defaultValue="نقع في شارع الملك فهد، بجانب برج المملكة. يمكن الوصول إلينا عبر مترو الرياض محطة العليا. يتوفر موقف سيارات مجاني للمرضى."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none"
        />
      </div>
    </div>
  );
}
