import { useState } from "react";
import { seasonalOffersData, type SeasonalOfferCMS } from "@/mocks/offersData";

const GRADIENT_OPTIONS = [
  { label: "ذهبي (رمضان)", value: "from-amber-600 via-orange-500 to-amber-700" },
  { label: "أخضر (الصيف)", value: "from-brand-forest-600 via-brand-forest-500 to-brand-forest-700" },
  { label: "أخضر داكن (وطني)", value: "from-green-700 via-green-600 to-emerald-700" },
  { label: "أزرق (شتاء)", value: "from-sky-600 via-indigo-500 to-sky-700" },
  { label: "وردي", value: "from-rose-600 via-pink-500 to-rose-700" },
];

const ICON_OPTIONS = [
  "ri-moon-line", "ri-sun-line", "ri-flag-line", "ri-snowy-line",
  "ri-heart-line", "ri-star-line", "ri-gift-line", "ri-leaf-line",
];

interface OfferCardProps {
  offer: SeasonalOfferCMS;
  onUpdate: (updated: SeasonalOfferCMS) => void;
  onDelete: () => void;
}

function OfferCard({ offer, onUpdate, onDelete }: OfferCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal] = useState<SeasonalOfferCMS>(offer);

  const handleSave = () => {
    onUpdate(local);
    setExpanded(false);
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${offer.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br ${offer.bgGradient} flex-shrink-0`}>
          <i className={`${offer.icon} text-white text-lg`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-sm truncate">{offer.title}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${offer.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {offer.active ? "نشط" : "مخفي"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-500">خصم {offer.discountPercent}%</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{offer.packageIds.length} باقة</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">ينتهي: {offer.endDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onUpdate({ ...offer, active: !offer.active })}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              offer.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            title={offer.active ? "إخفاء" : "إظهار"}
          >
            <i className={offer.active ? "ri-eye-line text-sm" : "ri-eye-off-line text-sm"}></i>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className={`${expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-sm`}></i>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-line text-sm"></i>
          </button>
        </div>
      </div>

      {/* Expanded Editor */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">العنوان</label>
              <input
                type="text"
                value={local.title}
                onChange={(e) => setLocal({ ...local, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">الشارة</label>
              <input
                type="text"
                value={local.badge}
                onChange={(e) => setLocal({ ...local, badge: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">نسبة الخصم (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={local.discountPercent}
                onChange={(e) => setLocal({ ...local, discountPercent: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">تاريخ الانتهاء</label>
              <input
                type="date"
                value={local.endDate}
                onChange={(e) => setLocal({ ...local, endDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">الأيقونة</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setLocal({ ...local, icon })}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                      local.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <i className={`${icon} text-base text-gray-700`}></i>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">لون الخلفية</label>
              <select
                value={local.bgGradient}
                onChange={(e) => setLocal({ ...local, bgGradient: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              >
                {GRADIENT_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">الوصف</label>
              <textarea
                value={local.description}
                onChange={(e) => setLocal({ ...local, description: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45] resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                معرّفات الباقات المشمولة
                <span className="text-gray-400 font-normal mr-1">(مفصولة بفاصلة)</span>
              </label>
              <input
                type="text"
                value={local.packageIds.join(", ")}
                onChange={(e) => setLocal({ ...local, packageIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
                placeholder="check-standard, check-premium, ..."
              />
              <p className="text-[10px] text-gray-400 mt-1">عدد الباقات الحالية: {local.packageIds.length}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => { setLocal(offer); setExpanded(false); }}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#2E4E45] text-white hover:bg-[#243d36] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-save-line ml-1"></i>
              حفظ التغييرات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeasonalOffersEditor() {
  const [offers, setOffers] = useState<SeasonalOfferCMS[]>(seasonalOffersData);
  const [saved, setSaved] = useState(false);

  const handleUpdate = (index: number, updated: SeasonalOfferCMS) => {
    const next = [...offers];
    next[index] = updated;
    setOffers(next);
  };

  const handleDelete = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newOffer: SeasonalOfferCMS = {
      id: `offer-${Date.now()}`,
      title: "عرض جديد",
      subtitle: "وصف العرض",
      badge: "عرض جديد",
      icon: "ri-gift-line",
      bgGradient: "from-rose-600 via-pink-500 to-rose-700",
      badgeColor: "bg-rose-500",
      discountPercent: 20,
      endDate: "2026-12-31",
      description: "وصف تفصيلي للعرض الجديد",
      packageIds: [],
      active: true,
    };
    setOffers([...offers, newOffer]);
  };

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-amber-50 rounded-lg">
            <i className="ri-calendar-event-line text-amber-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">العروض الموسمية</h3>
            <p className="text-xs text-gray-400">{offers.length} عرض — {offers.filter((o) => o.active).length} نشط</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-[#2E4E45] text-[#2E4E45] hover:bg-[#2E4E45]/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            إضافة عرض
          </button>
          <button
            onClick={handleSaveAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              saved ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#243d36]"
            }`}
          >
            <i className={saved ? "ri-check-line" : "ri-save-line"}></i>
            {saved ? "تم الحفظ!" : "حفظ الكل"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {offers.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onUpdate={(updated) => handleUpdate(index, updated)}
            onDelete={() => handleDelete(index)}
          />
        ))}
        {offers.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-3">
              <i className="ri-calendar-event-line text-xl"></i>
            </div>
            <p className="text-sm">لا توجد عروض موسمية. أضف عرضاً جديداً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
