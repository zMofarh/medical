import { useState, useEffect } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import ServiceFormModal from "./components/ServiceFormModal";
import { useCMSServices, type ServiceDetail } from "@/hooks/useCMSServices";

export default function AdminServicesPage() {
  const { services, loading, save, reload } = useCMSServices();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDetail | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category)))];

  const filtered = services.filter((s) => {
    const matchSearch = !search || s.name.includes(search) || s.category.includes(search);
    const matchCat = filterCategory === "all" || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleEdit = (service: ServiceDetail) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleSave = async (data: any) => {
    let updatedList: ServiceDetail[];
    // Reconstruct data into ServiceDetail
    const newService: ServiceDetail = {
      ...data,
      id: data.id || `srv-${Date.now()}`,
      // Fallbacks for data coming from the modal if missing
      longDescription: data.longDescription || data.description || "",
      stats: data.stats || [],
      procedures: data.procedures || [],
      prices: data.prices || [{ price: data.price, duration: data.duration }],
      doctors: data.doctors || [],
      faqs: data.faqs || [],
      relatedServices: data.relatedServices || [],
      status: data.status || "active",
    };

    if (data.id) {
      updatedList = services.map((s) => (s.id === data.id ? newService : s));
    } else {
      updatedList = [newService, ...services];
    }
    
    await save(updatedList);
  };

  const handleDelete = async (id: string) => {
    const updatedList = services.filter((s) => s.id !== id);
    await save(updatedList);
    setDeleteConfirm(null);
  };

  const toggleStatus = async (id: string) => {
    const updatedList = services.map((s) => {
      if (s.id === id) {
        return { ...s, status: ((s as any).status === "active" ? "inactive" : "active") as "active" | "inactive" };
      }
      return s;
    });
    await save(updatedList);
  };

  const stats = {
    total: services.length,
    active: services.filter((s) => (s as any).status !== "inactive").length,
    inactive: services.filter((s) => (s as any).status === "inactive").length,
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
            <h2 className="text-xl font-bold text-gray-800">إدارة الخدمات</h2>
            <p className="text-sm text-gray-500 mt-1">إضافة وتعديل وإدارة خدمات العيادة</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            خدمة جديدة
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الخدمات", value: stats.total, icon: "ri-stethoscope-line", color: "text-[#2E4E45]", bg: "bg-[#2E4E45]/10" },
            { label: "نشطة", value: stats.active, icon: "ri-check-line", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "معطلة", value: stats.inactive, icon: "ri-close-line", color: "text-gray-500", bg: "bg-gray-100" },
            { label: "الفئات", value: stats.categories, icon: "ri-folders-line", color: "text-[#C8A96E]", bg: "bg-[#C8A96E]/10" },
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
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                  <th className="text-right py-3 px-4 font-medium">الخدمة</th>
                  <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">الفئة</th>
                  <th className="text-right py-3 px-4 font-medium">السعر</th>
                  <th className="text-right py-3 px-4 font-medium hidden md:table-cell">المدة</th>
                  <th className="text-right py-3 px-4 font-medium">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service) => (
                  <tr key={service.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2E4E45]/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {service.image
                            ? <img src={service.image} alt="" className="w-full h-full object-cover" />
                            : <i className={`${service.icon} text-[#2E4E45]`} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800">{service.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{service.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-xs bg-[#2E4E45]/10 text-[#2E4E45] px-2.5 py-1 rounded-full font-medium whitespace-nowrap">{service.category}</span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{service.prices?.[0]?.price || "—"} ريال</td>
                    <td className="py-3 px-4 hidden md:table-cell text-sm text-gray-500">{service.prices?.[0]?.duration || "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(service.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all whitespace-nowrap
                          ${(service as any).status !== "inactive"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                            : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                          }`}
                      >
                        {(service as any).status !== "inactive" ? "نشط" : "معطل"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(service)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                          title="تعديل"
                        >
                          <i className="ri-edit-line text-sm" />
                        </button>
                        {deleteConfirm === service.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap"
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg cursor-pointer whitespace-nowrap"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(service.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <i className="ri-stethoscope-line text-gray-400 text-2xl" />
              </div>
              <p className="text-sm text-gray-500">لا توجد نتائج تطابق البحث</p>
            </div>
          )}
        </div>
      </div>

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingService ? {
          ...editingService,
          price: editingService.price || "",
          duration: editingService.duration || "",
          status: editingService.status || "active",
          image: editingService.image || "",
          heroImage: editingService.heroImage || "",
        } as any : null}
      />
    </AdminLayout>
  );
}
