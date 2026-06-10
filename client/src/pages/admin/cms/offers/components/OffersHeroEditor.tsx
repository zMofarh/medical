import { useState } from "react";
import { offersHeroData, type OffersHeroCMS } from "@/mocks/offersData";

export default function OffersHeroEditor() {
  const [data, setData] = useState<OffersHeroCMS>(offersHeroData);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-rose-50 rounded-lg">
            <i className="ri-layout-top-line text-rose-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">قسم الهيرو</h3>
            <p className="text-xs text-gray-400">العنوان الرئيسي وشعار الصفحة</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            saved ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#243d36]"
          }`}
        >
          <i className={saved ? "ri-check-line" : "ri-save-line"}></i>
          {saved ? "تم الحفظ!" : "حفظ"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">شارة الصفحة</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">أعلى نسبة خصم (%)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={data.maxDiscount}
            onChange={(e) => setData({ ...data, maxDiscount: Number(e.target.value) })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان الرئيسي</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">النص التوضيحي</label>
          <textarea
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="mt-5 rounded-xl overflow-hidden bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 p-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3">
          <i className="ri-flashlight-line text-yellow-300"></i>
          {data.badge}
        </div>
        <div className="text-xl font-black text-white mb-1">{data.title}</div>
        <div className="text-white/80 text-xs max-w-sm mx-auto">{data.subtitle}</div>
        <div className="mt-3 inline-block bg-white/20 text-white font-black text-2xl px-4 py-2 rounded-xl">
          {data.maxDiscount}%
        </div>
      </div>
    </div>
  );
}
