import { useState } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import { useCMSOffers } from "@/hooks/useCMSOffers";
import type {
  OffersHeroData, SeasonalOffer, FlashDeal,
  HowToRedeemStep, OffersNotifyData,
} from "@/types/cms";

type OffersHeroCMS = OffersHeroData;
type SeasonalOfferCMS = SeasonalOffer;
type FlashDealCMS = FlashDeal;
type OffersNotifyCMS = OffersNotifyData;

type TabId = "hero" | "seasonal" | "flash" | "redeem";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "hero",     label: "الهيرو",            icon: "ri-layout-top-line" },
  { id: "seasonal", label: "العروض الموسمية",   icon: "ri-calendar-event-line" },
  { id: "flash",    label: "فلاش سيل",          icon: "ri-flashlight-line" },
  { id: "redeem",   label: "كيفية الاستفادة",   icon: "ri-route-line" },
];

const GRADIENT_OPTIONS = [
  { label: "ذهبي (رمضان)",   value: "from-amber-600 via-orange-500 to-amber-700" },
  { label: "أخضر (الصيف)",   value: "from-emerald-600 via-emerald-500 to-emerald-700" },
  { label: "أخضر داكن",      value: "from-green-700 via-green-600 to-emerald-700" },
  { label: "سماوي (شتاء)",   value: "from-sky-600 via-indigo-500 to-sky-700" },
  { label: "وردي",            value: "from-rose-600 via-pink-500 to-rose-700" },
  { label: "بنفسجي",          value: "from-violet-600 via-purple-500 to-violet-700" },
];

const SEASONAL_ICONS = [
  "ri-moon-line", "ri-sun-line", "ri-flag-line", "ri-snowy-line",
  "ri-heart-line", "ri-star-line", "ri-gift-line", "ri-leaf-line",
  "ri-flower-line", "ri-fire-line", "ri-trophy-line", "ri-medal-line",
];

const REDEEM_ICONS = [
  "ri-search-eye-line", "ri-calendar-check-line", "ri-coupon-line", "ri-hospital-line",
  "ri-phone-line", "ri-map-pin-line", "ri-user-line", "ri-shield-check-line",
  "ri-star-line", "ri-heart-pulse-line", "ri-check-double-line", "ri-arrow-right-line",
];

// ─── Hero Editor ──────────────────────────────────────────────────────────────
function HeroEditor({ data, onChange }: { data: OffersHeroCMS; onChange: (d: OffersHeroCMS) => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-[#2E4E45] mb-4 flex items-center gap-2">
          <i className="ri-text-wrap text-base" /> النصوص الرئيسية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الشارة (Badge)</label>
            <input value={data.badge} onChange={(e) => onChange({ ...data, badge: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">أعلى نسبة خصم (%)</label>
            <input type="number" min={1} max={100} value={data.maxDiscount}
              onChange={(e) => onChange({ ...data, maxDiscount: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان الرئيسي</label>
            <input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">النص التوضيحي</label>
            <textarea value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none" />
          </div>
        </div>
      </div>
      {/* Live Preview */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 p-8 text-center">
        <p className="text-xs text-white/50 mb-3">معاينة مباشرة</p>
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-white/20">
          <i className="ri-flashlight-line text-yellow-300" />
          {data.badge}
        </div>
        <div className="text-2xl font-black text-white mb-2">{data.title}</div>
        <div className="text-white/80 text-sm max-w-sm mx-auto mb-4">{data.subtitle}</div>
        <div className="inline-block bg-white/20 text-white font-black text-3xl px-6 py-3 rounded-2xl border border-white/30">
          {data.maxDiscount}%
        </div>
      </div>
    </div>
  );
}

// ─── Seasonal Offers Editor ───────────────────────────────────────────────────
function SeasonalEditor({ data, onChange }: { data: SeasonalOfferCMS[]; onChange: (d: SeasonalOfferCMS[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<SeasonalOfferCMS>) => {
    onChange(data.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const addOffer = () => {
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
    onChange([...data, newOffer]);
    setExpandedId(newOffer.id);
  };

  const deleteOffer = (id: string) => {
    onChange(data.filter((o) => o.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">العروض الموسمية</p>
          <p className="text-xs text-gray-400 mt-0.5">{data.length} عرض — {data.filter((o) => o.active).length} نشط</p>
        </div>
        <button onClick={addOffer}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A96E] text-white text-sm font-bold rounded-lg hover:bg-[#b8995e] transition-colors cursor-pointer whitespace-nowrap">
          <i className="ri-add-line" /> إضافة عرض
        </button>
      </div>

      {data.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-14">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
            <i className="ri-calendar-event-line text-gray-400 text-xl" />
          </div>
          <p className="text-sm text-gray-500">لا توجد عروض موسمية. أضف عرضاً جديداً.</p>
        </div>
      )}

      {data.map((offer) => {
        const isOpen = expandedId === offer.id;
        return (
          <div key={offer.id} className={`bg-white rounded-xl border transition-all ${isOpen ? "border-[#2E4E45]/30" : "border-gray-100"} ${!offer.active ? "opacity-60" : ""}`}>
            {/* Row */}
            <div className="flex items-center gap-3 p-4">
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br ${offer.bgGradient} flex-shrink-0`}>
                <i className={`${offer.icon} text-white text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">{offer.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${offer.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    {offer.active ? "نشط" : "مخفي"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-500">خصم {offer.discountPercent}%</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{offer.packageIds.length} باقة</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">ينتهي: {offer.endDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => update(offer.id, { active: !offer.active })}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${offer.active ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                  <i className={`${offer.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`} />
                </button>
                <button onClick={() => setExpandedId(isOpen ? null : offer.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isOpen ? "bg-[#2E4E45] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  <i className={`${isOpen ? "ri-arrow-up-s-line" : "ri-pencil-line"} text-sm`} />
                </button>
                <button onClick={() => deleteOffer(offer.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer transition-colors">
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>

            {/* Expanded Editor */}
            {isOpen && (
              <div className="border-t border-gray-100 p-5 bg-gray-50/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">العنوان</label>
                    <input value={offer.title} onChange={(e) => update(offer.id, { title: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">الشارة</label>
                    <input value={offer.badge} onChange={(e) => update(offer.id, { badge: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">نسبة الخصم (%)</label>
                    <input type="number" min={1} max={100} value={offer.discountPercent}
                      onChange={(e) => update(offer.id, { discountPercent: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">تاريخ الانتهاء</label>
                    <input type="date" value={offer.endDate} onChange={(e) => update(offer.id, { endDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">الوصف</label>
                    <textarea value={offer.description} onChange={(e) => update(offer.id, { description: e.target.value })}
                      rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45] resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      معرّفات الباقات <span className="text-gray-400 font-normal">(مفصولة بفاصلة)</span>
                    </label>
                    <input value={offer.packageIds.join(", ")}
                      onChange={(e) => update(offer.id, { packageIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
                      placeholder="check-standard, check-premium, ..." />
                    <p className="text-xs text-gray-400 mt-1">{offer.packageIds.length} باقة مشمولة</p>
                  </div>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">الأيقونة</label>
                  <div className="flex flex-wrap gap-2">
                    {SEASONAL_ICONS.map((icon) => (
                      <button key={icon} onClick={() => update(offer.id, { icon })}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border cursor-pointer transition-all
                          ${offer.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                        <i className={`${icon} text-base`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient Picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">لون الخلفية</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADIENT_OPTIONS.map((g) => (
                      <button key={g.value} onClick={() => update(offer.id, { bgGradient: g.value })}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all
                          ${offer.bgGradient === g.value ? "border-[#2E4E45] ring-1 ring-[#2E4E45]" : "border-gray-200"}`}>
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${g.value}`} />
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini Preview */}
                <div className={`rounded-xl p-4 bg-gradient-to-br ${offer.bgGradient} flex items-center gap-3`}>
                  <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl flex-shrink-0">
                    <i className={`${offer.icon} text-white text-lg`} />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{offer.title}</p>
                    <p className="text-white/70 text-xs">خصم {offer.discountPercent}% · ينتهي {offer.endDate}</p>
                  </div>
                  <div className="mr-auto bg-white/20 text-white font-black text-lg px-3 py-1 rounded-lg border border-white/30">
                    {offer.discountPercent}%
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Flash Deals Editor ───────────────────────────────────────────────────────
function FlashEditor({ data, onChange }: { data: FlashDealCMS[]; onChange: (d: FlashDealCMS[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<FlashDealCMS>) => {
    onChange(data.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const addDeal = () => {
    const newDeal: FlashDealCMS = {
      id: `fd-${Date.now()}`,
      packageId: "",
      packageIds: [],
      flashDiscount: 25,
      endsIn: 48,
      label: "عرض جديد",
      active: true,
    };
    onChange([...data, newDeal]);
    setEditingId(newDeal.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">عروض الفلاش سيل</p>
          <p className="text-xs text-gray-400 mt-0.5">{data.length} عرض — {data.filter((d) => d.active).length} نشط</p>
        </div>
        <button onClick={addDeal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A96E] text-white text-sm font-bold rounded-lg hover:bg-[#b8995e] transition-colors cursor-pointer whitespace-nowrap">
          <i className="ri-add-line" /> إضافة عرض
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-information-line text-amber-600 text-sm" />
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          عروض الفلاش سيل تعتمد على معرّف الباقة (Package ID). تأكد من إدخال المعرّف الصحيح كما هو موجود في قاعدة البيانات.
        </p>
      </div>

      {data.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-14">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
            <i className="ri-flashlight-line text-gray-400 text-xl" />
          </div>
          <p className="text-sm text-gray-500">لا توجد عروض فلاش. أضف عرضاً جديداً.</p>
        </div>
      )}

      <div className="space-y-2">
        {data.map((deal) => {
          const isEditing = editingId === deal.id;
          return (
            <div key={deal.id} className={`bg-white rounded-xl border transition-all ${isEditing ? "border-[#2E4E45]/30" : "border-gray-100"} ${!deal.active ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 flex items-center justify-center bg-rose-50 rounded-xl flex-shrink-0">
                  <i className="ri-flashlight-line text-rose-500 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{deal.label}</span>
                    <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">خصم {deal.flashDiscount}%</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${deal.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                      {deal.active ? "نشط" : "مخفي"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">الباقة: <code className="bg-gray-100 px-1 rounded text-xs">{deal.packageId || "—"}</code></span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">ينتهي خلال {deal.endsIn} ساعة</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => update(deal.id, { active: !deal.active })}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${deal.active ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                    <i className={`${deal.active ? "ri-eye-line" : "ri-eye-off-line"} text-sm`} />
                  </button>
                  <button onClick={() => setEditingId(isEditing ? null : deal.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isEditing ? "bg-[#2E4E45] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    <i className={`${isEditing ? "ri-arrow-up-s-line" : "ri-pencil-line"} text-sm`} />
                  </button>
                  <button onClick={() => onChange(data.filter((d) => d.id !== deal.id))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer transition-colors">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">التسمية</label>
                      <input value={deal.label} onChange={(e) => update(deal.id, { label: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">معرّف الباقة</label>
                      <input value={deal.packageId} onChange={(e) => update(deal.id, { packageId: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
                        placeholder="check-executive" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">نسبة الخصم (%)</label>
                      <input type="number" min={1} max={100} value={deal.flashDiscount}
                        onChange={(e) => update(deal.id, { flashDiscount: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">ينتهي خلال (ساعة)</label>
                      <input type="number" min={1} value={deal.endsIn}
                        onChange={(e) => update(deal.id, { endsIn: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]" />
                    </div>
                  </div>
                  {/* Countdown preview */}
                  <div className="mt-3 flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2.5">
                    <i className="ri-timer-line text-rose-500 text-sm" />
                    <span className="text-xs text-rose-700 font-medium">
                      العرض ينتهي خلال <strong>{deal.endsIn}</strong> ساعة · خصم <strong>{deal.flashDiscount}%</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Redeem Steps Editor ──────────────────────────────────────────────────────
function RedeemEditor({
  steps, notify,
  onStepsChange, onNotifyChange,
}: {
  steps: HowToRedeemStep[];
  notify: OffersNotifyCMS;
  onStepsChange: (d: HowToRedeemStep[]) => void;
  onNotifyChange: (d: OffersNotifyCMS) => void;
}) {
  const [subTab, setSubTab] = useState<"steps" | "notify">("steps");

  const updateStep = (id: string, patch: Partial<HowToRedeemStep>) => {
    onStepsChange(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addStep = () => {
    onStepsChange([...steps, {
      id: `s-${Date.now()}`,
      step: String(steps.length + 1).padStart(2, "0"),
      icon: "ri-star-line",
      title: "خطوة جديدة",
      desc: "وصف الخطوة",
    }]);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ id: "steps", label: "خطوات الاستفادة", icon: "ri-list-ordered" },
          { id: "notify", label: "قسم الإشعارات", icon: "ri-notification-3-line" }].map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id as typeof subTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap
              ${subTab === t.id ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <i className={`${t.icon} text-xs`} />
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "steps" && (
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div key={step.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-start">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">رقم الخطوة</label>
                  <input value={step.step} onChange={(e) => updateStep(step.id, { step: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" maxLength={2} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">العنوان</label>
                  <input value={step.title} onChange={(e) => updateStep(step.id, { title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الوصف</label>
                  <div className="flex gap-2">
                    <input value={step.desc} onChange={(e) => updateStep(step.id, { desc: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
                    <button onClick={() => onStepsChange(steps.filter((_, i) => i !== idx))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer flex-shrink-0">
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2 md:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">الأيقونة</label>
                  <div className="flex flex-wrap gap-2">
                    {REDEEM_ICONS.map((icon) => (
                      <button key={icon} onClick={() => updateStep(step.id, { icon })}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border cursor-pointer transition-all
                          ${step.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                        <i className={`${icon} text-base`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addStep}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#2E4E45] hover:text-[#2E4E45] transition-colors cursor-pointer">
            <i className="ri-add-line ml-1" /> إضافة خطوة
          </button>
        </div>
      )}

      {subTab === "notify" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">العنوان الرئيسي</label>
              <input value={notify.title} onChange={(e) => onNotifyChange({ ...notify, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">النص التوضيحي</label>
              <textarea value={notify.subtitle} onChange={(e) => onNotifyChange({ ...notify, subtitle: e.target.value })}
                rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-3 space-y-2.5">
                <label className="block text-xs font-bold text-[#2E4E45]">الزر الأول (الرئيسي)</label>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-0.5">النص</label>
                  <input value={notify.ctaPrimary?.text || ""} onChange={(e) => onNotifyChange({ ...notify, ctaPrimary: { text: e.target.value, link: notify.ctaPrimary?.link || "" } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-0.5">الرابط</label>
                  <input value={notify.ctaPrimary?.link || ""} onChange={(e) => onNotifyChange({ ...notify, ctaPrimary: { text: notify.ctaPrimary?.text || "", link: e.target.value } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]" />
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 space-y-2.5">
                <label className="block text-xs font-bold text-[#2E4E45]">الزر الثاني (الفرعي)</label>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-0.5">النص</label>
                  <input value={notify.ctaSecondary?.text || ""} onChange={(e) => onNotifyChange({ ...notify, ctaSecondary: { text: e.target.value, link: notify.ctaSecondary?.link || "" } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-0.5">الرابط</label>
                  <input value={notify.ctaSecondary?.link || ""} onChange={(e) => onNotifyChange({ ...notify, ctaSecondary: { text: notify.ctaSecondary?.text || "", link: e.target.value } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2E4E45]" />
                </div>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="rounded-xl bg-gradient-to-r from-[#2E4E45] to-[#3a6358] p-6 text-center">
            <p className="text-xs text-white/40 mb-3">معاينة مباشرة</p>
            <div className="text-xl font-black text-white mb-2">{notify.title}</div>
            <div className="text-white/70 text-sm mb-4 max-w-xs mx-auto">{notify.subtitle}</div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="bg-white text-[#2E4E45] font-bold px-5 py-2 rounded-full text-sm whitespace-nowrap">{notify.ctaPrimary?.text || ""}</div>
              <div className="border-2 border-white/50 text-white font-bold px-5 py-2 rounded-full text-sm whitespace-nowrap">{notify.ctaSecondary?.text || ""}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCMSOffers() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const { hero, seasonal, flash, redeem, notify, saveStatus, hasChanges,
    updateHero, updateSeasonal, updateFlash, updateRedeem, updateNotify, save, reset } = useCMSOffers();

  const activeSeasonalCount = seasonal.filter((o) => o.active).length;
  const activeFlashCount    = flash.filter((d) => d.active).length;
  const maxDiscount = Math.max(0, ...seasonal.map((o) => o.discountPercent), ...flash.map((d) => d.flashDiscount));

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto" dir="rtl">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#2E4E45]">إدارة صفحة العروض</h2>
            <p className="text-sm text-gray-400 mt-0.5">تحكم في العروض الموسمية والفلاش سيل وكيفية الاستفادة</p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button onClick={() => reset()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line" /> إعادة تعيين
              </button>
            )}
            <a href="/offers" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              <i className="ri-external-link-line" /> معاينة
            </a>
            <button onClick={() => save({ hero, seasonal, flash, redeem, notify })}
              disabled={!hasChanges || saveStatus === "saving"}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap
                ${saveStatus === "saved" ? "bg-green-500 text-white"
                  : hasChanges ? "bg-[#2E4E45] text-white hover:bg-[#2E4E45]/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              {saveStatus === "saving" ? <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
                : saveStatus === "saved" ? <><i className="ri-check-line" /> تم الحفظ!</>
                : <><i className="ri-save-line" /> حفظ التغييرات</>}
            </button>
          </div>
        </div>

        {/* ── Changes Banner ── */}
        {hasChanges && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2.5 rounded-lg mb-5">
            <i className="ri-error-warning-line" />
            <span>لديك تغييرات غير محفوظة</span>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: "ri-calendar-event-line", bg: "bg-amber-50", color: "text-amber-600", value: String(activeSeasonalCount), label: "عروض موسمية نشطة", sub: `من ${seasonal.length} إجمالي` },
            { icon: "ri-flashlight-line",     bg: "bg-rose-50",  color: "text-rose-600",  value: String(activeFlashCount),    label: "عروض فلاش نشطة",    sub: `من ${flash.length} إجمالي` },
            { icon: "ri-gift-line",           bg: "bg-[#2E4E45]/10", color: "text-[#2E4E45]", value: String(new Set(seasonal.flatMap((o) => o.packageIds)).size), label: "باقة مشمولة", sub: "في العروض الموسمية" },
            { icon: "ri-percent-line",        bg: "bg-emerald-50", color: "text-emerald-600", value: `${maxDiscount}%`, label: "أعلى نسبة خصم", sub: "في جميع العروض" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${s.bg} mb-2`}>
                <i className={`${s.icon} ${s.color} text-base`} />
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1.5 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-all
                ${activeTab === tab.id ? "bg-[#2E4E45] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {activeTab === "hero"     && <HeroEditor     data={hero}     onChange={updateHero} />}
        {activeTab === "seasonal" && <SeasonalEditor data={seasonal} onChange={updateSeasonal} />}
        {activeTab === "flash"    && <FlashEditor    data={flash}    onChange={updateFlash} />}
        {activeTab === "redeem"   && (
          <RedeemEditor steps={redeem} notify={notify}
            onStepsChange={updateRedeem} onNotifyChange={updateNotify} />
        )}

        {/* ── Bottom Save Bar ── */}
        {hasChanges && (
          <div className="mt-6 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <i className="ri-error-warning-line" />
              <span>تغييرات غير محفوظة</span>
            </div>
            <button onClick={() => save({ hero, seasonal, flash, redeem, notify })}
              disabled={saveStatus === "saving"}
              className="px-5 py-2 text-sm font-bold bg-[#2E4E45] text-white rounded-lg hover:bg-[#2E4E45]/90 cursor-pointer whitespace-nowrap disabled:opacity-60">
              {saveStatus === "saving" ? "جاري الحفظ..." : <><i className="ri-save-line ml-1" />حفظ الآن</>}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
