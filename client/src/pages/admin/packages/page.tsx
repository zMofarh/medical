import { useState, useEffect } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import PackageFormModal from "./components/PackageFormModal";
import { useCMSPackages, type MedicalPackage } from "@/hooks/useCMSPackages";

export default function AdminPackagesPage() {
  const { packages, loading, save, reload } = useCMSPackages();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<MedicalPackage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(packages.map((p) => p.category)))];

  const filtered = packages.filter((p) => {
    const matchSearch = !search || p.name.includes(search) || p.category.includes(search);
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    setEditingPackage(null);
    setModalOpen(true);
  };

  const handleEdit = (pkg: MedicalPackage) => {
    setEditingPackage(pkg);
    setModalOpen(true);
  };

  const handleSave = async (data: any) => {
    let updatedList: MedicalPackage[];
    // Reconstruct data into MedicalPackage
    const newPackage: MedicalPackage = {
      ...data,
      id: data.id || `pkg-${Date.now()}`,
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
      price: data.price ? parseFloat(data.price) : 0,
      features: data.features || [],
      includes: data.includes || [],
      faqs: data.faqs || [],
      preparation: data.preparation || [],
      status: data.status || "active",
      accentColor: data.accentColor || "teal",
    };

    if (data.id) {
      updatedList = packages.map((p) => (p.id === data.id ? newPackage : p));
    } else {
      updatedList = [newPackage, ...packages];
    }
    
    await save(updatedList);
  };

  const handleDelete = async (id: string) => {
    const updatedList = packages.filter((p) => p.id !== id);
    await save(updatedList);
    setDeleteConfirm(null);
  };

  const toggleStatus = async (id: string) => {
    const updatedList = packages.map((p) => {
      if (p.id === id) {
        return { ...p, status: ((p as any).status === "active" ? "inactive" : "active") as "active" | "inactive" };
      }
      return p;
    });
    await save(updatedList);
  };

  const stats = {
    total: packages.length,
    active: packages.filter((p) => (p as any).status !== "inactive").length,
    withDiscount: packages.filter((p) => p.originalPrice).length,
    categories: categories.length - 1,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#2E4E45] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة الباقات</h2>
            <p className="text-sm text-gray-500 mt-1">إضافة وتعديل باقات وعروض العيادة</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            باقة جديدة
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الباقات", value: stats.total, icon: "ri-vip-crown-line", color: "text-[#2E4E45]", bg: "bg-[#2E4E45]/10" },
            { label: "نشطة", value: stats.active, icon: "ri-check-line", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "بخصم", value: stats.withDiscount, icon: "ri-price-tag-3-line", color: "text-[#C8A96E]", bg: "bg-[#C8A96E]/10" },
            { label: "الفئات", value: stats.categories, icon: "ri-folders-line", color: "text-violet-600", bg: "bg-violet-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <i className={`${s.icon} ${s.color} text-sm`} />
              </div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-sm" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الفئة..."
              className="w-full border border-gray-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
          >
            <option value="all">كل الفئات</option>
            {categories.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c as string}>{c as string}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all group">
              {(pkg as any).image && (
                <div className="w-full h-32 overflow-hidden">
                  <img src={(pkg as any).image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pkg.badge ? "bg-[#C8A96E]/10" : "bg-[#2E4E45]/5"}`}>
                    <i className={`${pkg.icon} ${pkg.badge ? "text-[#C8A96E]" : "text-[#2E4E45]"} text-lg`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {pkg.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8A96E]/10 text-[#C8A96E] font-medium">{pkg.badge}</span>
                    )}
                    <button
                      onClick={() => toggleStatus(pkg.id)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium cursor-pointer whitespace-nowrap
                        ${(pkg as any).status !== "inactive" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {(pkg as any).status !== "inactive" ? "نشط" : "معطل"}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-800 mb-1">{pkg.name}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{pkg.description || pkg.features?.[0] || "—"}</p>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-[#2E4E45]">{pkg.price} ريال</span>
                  {pkg.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{pkg.originalPrice} ريال</span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {pkg.features?.length || 0} ميزات
                </div>

                <div className="flex flex-wrap gap-1">
                  {(pkg.features || []).slice(0, 3).map((f: any, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {typeof f === 'string' ? f : (f.title || f.name || JSON.stringify(f))}
                    </span>
                  ))}
                  {(pkg.features || []).length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{(pkg.features || []).length - 3}</span>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 py-2 rounded-lg text-xs text-[#2E4E45] hover:bg-[#2E4E45]/5 transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line" />
                  تعديل
                </button>
                {deleteConfirm === pkg.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="flex-1 py-2 text-xs bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 py-2 text-xs bg-gray-100 text-gray-600 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(pkg.id)}
                    className="flex-1 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line" />
                    حذف
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <i className="ri-vip-crown-line text-gray-400 text-2xl" />
            </div>
            <p className="text-sm text-gray-500">لا توجد نتائج تطابق البحث</p>
          </div>
        )}
      </div>

      <PackageFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingPackage ? {
          ...editingPackage,
          price: editingPackage.price?.toString() || "",
          originalPrice: editingPackage.originalPrice?.toString() || "",
          description: editingPackage.description || "",
          duration: editingPackage.duration || "",
          targetAudience: editingPackage.targetAudience || "",
          status: editingPackage.status || "active",
          image: editingPackage.image || "",
        } as any : null}
      />
    </AdminLayout>
  );
}
