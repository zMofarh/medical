import { useState } from "react";
import { contactMapConfig } from "@/mocks/contactData";

type MapData = typeof contactMapConfig;
interface Props { data: MapData; onChange: (d: MapData) => void; }

export default function ContactMapEditor({ data, onChange }: Props) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
          <i className="ri-map-2-line text-rose-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">الخريطة</h3>
          <p className="text-xs text-gray-500">إعدادات خريطة Google Maps المضمنة في صفحة التواصل</p>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان قسم الخريطة</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
        />
      </div>

      {/* Embed URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <i className="ri-code-line ml-1.5 text-[#C8A96E]" />
          رابط تضمين الخريطة (Google Maps Embed URL)
        </label>
        <textarea
          rows={4}
          value={data.embedUrl}
          onChange={(e) => onChange({ ...data, embedUrl: e.target.value })}
          dir="ltr"
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none"
        />
        <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-500 font-semibold mb-1">كيف تحصل على رابط التضمين؟</p>
          <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
            <li>افتح Google Maps وابحث عن موقع العيادة</li>
            <li>انقر على "مشاركة" ثم "تضمين خريطة"</li>
            <li>انسخ الرابط من داخل src="..."</li>
            <li>الصقه هنا</li>
          </ol>
        </div>
      </div>

      {/* Maps link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط فتح الخريطة</label>
          <input
            type="url"
            value={data.mapsLink}
            onChange={(e) => onChange({ ...data, mapsLink: e.target.value })}
            dir="ltr"
            placeholder="https://maps.google.com/?q=..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-mono text-xs focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">نص الرابط</label>
          <input
            type="text"
            value={data.mapsLinkText}
            onChange={(e) => onChange({ ...data, mapsLinkText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Height slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          ارتفاع الخريطة: <span className="text-[#2E4E45] font-bold">{data.height}px</span>
        </label>
        <input
          type="range"
          min={180}
          max={500}
          step={20}
          value={data.height}
          onChange={(e) => onChange({ ...data, height: Number(e.target.value) })}
          className="w-full accent-[#2E4E45]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>180px (صغير)</span>
          <span>500px (كبير)</span>
        </div>
      </div>

      {/* Map preview */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-eye-line text-gray-400 text-sm" />
            <span className="text-xs font-medium text-gray-500">معاينة الخريطة</span>
          </div>
          <button onClick={() => setShowPreview(!showPreview)} className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors cursor-pointer">
            {showPreview ? "إخفاء" : "إظهار"}
          </button>
        </div>
        {showPreview && data.embedUrl && (
          <iframe src={data.embedUrl} width="100%" height={data.height} style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="موقع العيادة" />
        )}
        {showPreview && !data.embedUrl && (
          <div className="flex items-center justify-center bg-gray-50 text-gray-400" style={{ height: data.height }}>
            <div className="text-center">
              <i className="ri-map-2-line text-3xl mb-2 block" />
              <p className="text-sm">أدخل رابط التضمين لمعاينة الخريطة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
