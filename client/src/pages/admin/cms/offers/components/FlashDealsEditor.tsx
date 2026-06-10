import { useState } from "react";
import { flashDealsData, type FlashDealCMS } from "@/mocks/offersData";

interface FlashDealRowProps {
  deal: FlashDealCMS;
  onUpdate: (updated: FlashDealCMS) => void;
  onDelete: () => void;
}

function FlashDealRow({ deal, onUpdate, onDelete }: FlashDealRowProps) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<FlashDealCMS>(deal);

  const handleSave = () => {
    onUpdate(local);
    setEditing(false);
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${deal.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
      <div className="flex items-center gap-3 p-4">
        {/* Flash icon */}
        <div className="w-9 h-9 flex items-center justify-center bg-rose-50 rounded-lg flex-shrink-0">
          <i className="ri-flashlight-line text-rose-500 text-base"></i>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{deal.label}</span>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
              خصم {deal.flashDiscount}%
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${deal.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {deal.active ? "نشط" : "مخفي"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-500">الباقة: <code className="bg-gray-100 px-1 rounded text-[10px]">{deal.packageId}</code></span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">ينتهي خلال {deal.endsIn} ساعة</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onUpdate({ ...deal, active: !deal.active })}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              deal.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            <i className={deal.active ? "ri-eye-line text-sm" : "ri-eye-off-line text-sm"}></i>
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className={`${editing ? "ri-arrow-up-s-line" : "ri-pencil-line"} text-sm`}></i>
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-line text-sm"></i>
          </button>
        </div>
      </div>

      {editing && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">التسمية</label>
              <input
                type="text"
                value={local.label}
                onChange={(e) => setLocal({ ...local, label: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">معرّف الباقة</label>
              <input
                type="text"
                value={local.packageId}
                onChange={(e) => setLocal({ ...local, packageId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
                placeholder="check-executive"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">نسبة الخصم (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={local.flashDiscount}
                onChange={(e) => setLocal({ ...local, flashDiscount: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ينتهي خلال (ساعة)</label>
              <input
                type="number"
                min={1}
                value={local.endsIn}
                onChange={(e) => setLocal({ ...local, endsIn: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={() => { setLocal(deal); setEditing(false); }}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#2E4E45] text-white hover:bg-[#243d36] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-save-line ml-1"></i>
              حفظ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlashDealsEditor() {
  const [deals, setDeals] = useState<FlashDealCMS[]>(flashDealsData);
  const [saved, setSaved] = useState(false);

  const handleUpdate = (index: number, updated: FlashDealCMS) => {
    const next = [...deals];
    next[index] = updated;
    setDeals(next);
  };

  const handleDelete = (index: number) => {
    setDeals(deals.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newDeal: FlashDealCMS = {
      id: `fd-${Date.now()}`,
      packageId: "",
      flashDiscount: 25,
      endsIn: 48,
      label: "عرض جديد",
      active: true,
    };
    setDeals([...deals, newDeal]);
  };

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-rose-50 rounded-lg">
            <i className="ri-flashlight-line text-rose-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">عروض الفلاش سيل</h3>
            <p className="text-xs text-gray-400">{deals.length} عرض — {deals.filter((d) => d.active).length} نشط</p>
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

      {/* Info note */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-information-line text-amber-600 text-sm"></i>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          عروض الفلاش سيل تعتمد على معرّف الباقة (Package ID). تأكد من إدخال المعرّف الصحيح كما هو موجود في قاعدة البيانات.
        </p>
      </div>

      <div className="space-y-3">
        {deals.map((deal, index) => (
          <FlashDealRow
            key={deal.id}
            deal={deal}
            onUpdate={(updated) => handleUpdate(index, updated)}
            onDelete={() => handleDelete(index)}
          />
        ))}
        {deals.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-3">
              <i className="ri-flashlight-line text-xl"></i>
            </div>
            <p className="text-sm">لا توجد عروض فلاش. أضف عرضاً جديداً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
