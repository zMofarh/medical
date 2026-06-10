import { useState } from "react";
import { allPackages, packageCategories, type MedicalPackage, type PackageCategory } from "@/mocks/packagesData";

interface CMSPackagesEditorProps {
  data: MedicalPackage[];
  onChange: (data: MedicalPackage[]) => void;
}

export default function CMSPackagesEditor({ data, onChange }: CMSPackagesEditorProps) {
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory>(packageCategories[0]);
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id || "");

  const filteredPackages = data.filter((p) => p.category === selectedCategory);
  const selected = data.find((p) => p.id === selectedId);

  const updatePackage = (updated: MedicalPackage) => {
    onChange(data.map((p) => (p.id === updated.id ? updated : p)));
  };

  const updateField = <K extends keyof MedicalPackage>(field: K, value: MedicalPackage[K]) => {
    if (!selected) return;
    updatePackage({ ...selected, [field]: value });
  };

  const updateFeature = (idx: number, val: string) => {
    if (!selected) return;
    const features = [...selected.features];
    features[idx] = val;
    updateField("features", features);
  };

  const addFeature = () => {
    if (!selected) return;
    updateField("features", [...selected.features, "ميزة جديدة"]);
  };

  const removeFeature = (idx: number) => {
    if (!selected) return;
    updateField("features", selected.features.filter((_, i) => i !== idx));
  };

  const addPackage = () => {
    const newPkg: MedicalPackage = {
      id: `pkg-${Date.now()}`,
      name: "باقة جديدة",
      category: selectedCategory,
      price: 0,
      icon: "ri-vip-crown-line",
      accentColor: "teal",
      features: ["ميزة 1", "ميزة 2"],
    };
    onChange([...data, newPkg]);
    setSelectedId(newPkg.id);
  };

  const removePackage = (id: string) => {
    const remaining = data.filter((p) => p.id !== id);
    onChange(remaining);
    if (selectedId === id) {
      setSelectedId(remaining[0]?.id || "");
    }
  };

  const accentColors = ["teal", "violet", "orange", "amber", "cyan", "rose", "green"];

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {packageCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              const first = data.find((p) => p.category === cat);
              if (first) setSelectedId(first.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap
              ${selectedCategory === cat ? "bg-[#2E4E45] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Packages List */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">الباقات</p>
              <button
                onClick={addPackage}
                className="w-5 h-5 flex items-center justify-center bg-[#2E4E45] text-white rounded cursor-pointer"
              >
                <i className="ri-add-line text-xs" />
              </button>
            </div>
            <div className="p-1.5 max-h-[450px] overflow-y-auto">
              {filteredPackages.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">لا توجد باقات</p>
              )}
              {filteredPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedId(pkg.id)}
                  className={`w-full text-right px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer
                    ${selectedId === pkg.id ? "bg-[#2E4E45] text-white font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <i className={`${pkg.icon} text-xs`} />
                    </div>
                    <span className="truncate leading-tight">{pkg.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        {selected ? (
          <div className="flex-1 min-w-0 space-y-4">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-700">معلومات الباقة</h4>
                <button
                  onClick={() => removePackage(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 border border-red-200 text-xs rounded-lg cursor-pointer hover:bg-red-50 whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line" /> حذف الباقة
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">اسم الباقة</label>
                  <input
                    value={selected.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">الشارة (Badge)</label>
                  <input
                    value={selected.badge || ""}
                    onChange={(e) => updateField("badge", e.target.value || undefined)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="مثال: الأكثر طلباً"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">السعر (ريال)</label>
                  <input
                    type="number"
                    value={selected.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">السعر الأصلي (اختياري)</label>
                  <input
                    type="number"
                    value={selected.originalPrice || ""}
                    onChange={(e) => updateField("originalPrice", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="للعروض فقط"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">المدة</label>
                  <input
                    value={selected.duration || ""}
                    onChange={(e) => updateField("duration", e.target.value || undefined)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    placeholder="مثال: 90 دقيقة"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">أيقونة (Remix Icon)</label>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg flex-shrink-0">
                      <i className={`${selected.icon} text-[#2E4E45] text-base`} />
                    </div>
                    <input
                      value={selected.icon}
                      onChange={(e) => updateField("icon", e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">لون التمييز</label>
                <div className="flex gap-2 flex-wrap">
                  {accentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateField("accentColor", color)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border
                        ${selected.accentColor === color ? "border-[#2E4E45] bg-[#2E4E45]/10 text-[#2E4E45]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الوصف (اختياري)</label>
                <textarea
                  value={selected.description || ""}
                  onChange={(e) => updateField("description", e.target.value || undefined)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="وصف تفصيلي للباقة"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الفئة المستهدفة (اختياري)</label>
                <input
                  value={selected.targetAudience || ""}
                  onChange={(e) => updateField("targetAudience", e.target.value || undefined)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="من يستفيد من هذه الباقة؟"
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-700">مميزات الباقة</h4>
                <button
                  onClick={addFeature}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line" /> إضافة
                </button>
              </div>
              {selected.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-[#2E4E45] text-sm" />
                  </div>
                  <input
                    value={feat}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  />
                  <button
                    onClick={() => removeFeature(idx)}
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-gray-100 p-10">
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mx-auto mb-3">
                <i className="ri-vip-crown-line text-gray-400 text-xl" />
              </div>
              <p className="text-sm text-gray-500">اختر باقة من القائمة أو أضف باقة جديدة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
