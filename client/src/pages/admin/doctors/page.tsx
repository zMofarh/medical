import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import DoctorFormModal from "./components/DoctorFormModal";
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, CMSDoctorResponse, CMSDoctorCreate, CMSDoctorUpdate } from "@/api/doctors";
import { pushNotification } from "@/hooks/useNotifications";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  rating: number;
  reviewsCount: number;
  title: string;
  education: string;
  bio: string;
  languages: string[];
  availableDays: string[];
  consultationFee: string;
  specializations: string[];
  achievements: string[];
}

export default function AdminDoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getDoctors();
      setDoctors(data.map(d => ({
        id: d.id, // we might need doctor_id for routing, but we use id for list
        doctor_id: d.doctor_id,
        name: d.name,
        specialty: d.specialty || "",
        experience: d.experience || "",
        image: d.image || "",
        rating: d.rating || 5.0,
        reviewsCount: d.reviews_count || 0,
        title: d.title || "",
        education: d.education || "",
        bio: d.bio || "",
        languages: d.languages || [],
        availableDays: d.available_days || [],
        consultationFee: d.consultation_fee || "",
        specializations: d.specializations || [],
        achievements: d.achievements || [],
      } as Doctor & { doctor_id: string })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = ["all", ...Array.from(new Set(doctors.map((d) => d.specialty)))];

  const filtered = doctors.filter((d) => {
    const matchSearch = !search || d.name.includes(search) || d.specialty.includes(search);
    const matchSpec = filterSpecialty === "all" || d.specialty === filterSpecialty;
    return matchSearch && matchSpec;
  });

  const handleAdd = () => {
    setEditingDoctor(null);
    setModalOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<Doctor, "id"> & { id?: string }) => {
    try {
      const apiData = {
        doctor_id: data.id || `dr-${Date.now()}`,
        name: data.name,
        specialty: data.specialty,
        experience: data.experience,
        image: data.image,
        rating: data.rating,
        reviews_count: data.reviewsCount,
        title: data.title,
        education: data.education,
        languages: data.languages,
        available_days: data.availableDays,
        bio: data.bio,
        specializations: data.specializations,
        achievements: data.achievements,
        consultation_fee: data.consultationFee,
      };

      if (data.id) {
        // Find internal id
        const originalDoc = (doctors as any[]).find(d => d.id === data.id || d.doctor_id === data.id);
        if (originalDoc && originalDoc.id) {
           await updateDoctor(originalDoc.id, apiData as CMSDoctorUpdate);
        }
      } else {
        await createDoctor(apiData as CMSDoctorCreate);
      }
      
      pushNotification({
        type: "cms",
        title: data.id ? "تم التعديل" : "تمت الإضافة",
        message: `تم حفظ بيانات الطبيب ${data.name} بنجاح`,
      });
      fetchDoctors();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حفظ بيانات الطبيب");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // id here is the frontend id, which corresponds to the backend UUID
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      setDeleteConfirm(null);
      pushNotification({
        type: "cms",
        title: "تم الحذف",
        message: "تم حذف الطبيب بنجاح",
      });
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حذف الطبيب");
    }
  };

  const stats = {
    total: doctors.length,
    active: doctors.length,
    avgRating: doctors.length > 0 ? (doctors.reduce((s, d) => s + d.rating, 0) / doctors.length).toFixed(1) : "0",
    totalReviews: doctors.reduce((s, d) => s + d.reviewsCount, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة الأطباء</h2>
            <p className="text-sm text-gray-500 mt-1">إضافة وتعديل بيانات فريق الأطباء</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            طبيب جديد
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الأطباء", value: stats.total, icon: "ri-user-star-line", color: "text-[#2E4E45]", bg: "bg-[#2E4E45]/10" },
            { label: "نشط", value: stats.active, icon: "ri-check-line", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "متوسط التقييم", value: stats.avgRating, icon: "ri-star-line", color: "text-amber-500", bg: "bg-amber-50" },
            { label: "إجمالي التقييمات", value: stats.totalReviews, icon: "ri-chat-quote-line", color: "text-violet-600", bg: "bg-violet-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <i className={`${s.icon} ${s.color} text-sm`} />
              </div>
              <p className="text-xl font-bold text-gray-800">{loading ? "..." : s.value}</p>
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
              placeholder="ابحث بالاسم أو التخصص..."
              className="w-full border border-gray-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
            />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] bg-white cursor-pointer"
          >
            <option value="all">كل التخصصات</option>
            {specialties.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-gray-500">جاري التحميل...</div>
          ) : filtered.map((doctor) => {
            const docId = (doctor as any).doctor_id || doctor.id;
            return (
            <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all group">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#C8A96E]/30 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://readdy.ai/api/search-image?query=professional%20doctor%20avatar%20placeholder%20neutral%20background&width=100&height=100&seq=placeholder&orientation=squarish"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-800">{doctor.name}</h3>
                    <p className="text-xs text-[#C8A96E] mt-0.5">{doctor.specialty}</p>
                    <p className="text-xs text-gray-400 mt-1">{doctor.experience}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <i className="ri-star-fill text-amber-400 text-xs" />
                      <span className="text-xs font-medium text-gray-700">{doctor.rating}</span>
                      <span className="text-xs text-gray-400">({doctor.reviewsCount} تقييم)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2E4E45]/10 text-gray-400 hover:text-[#2E4E45] transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <i className="ri-edit-line text-sm" />
                    </button>
                    {deleteConfirm === doctor.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(doctor.id)}
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
                        onClick={() => setDeleteConfirm(doctor.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {doctor.languages.map((lang) => (
                      <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{lang}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {doctor.availableDays.slice(0, 3).join("، ")}
                      {doctor.availableDays.length > 3 && ` +${doctor.availableDays.length - 3}`}
                    </span>
                    <span className="text-xs font-medium text-[#2E4E45]">{doctor.consultationFee} ريال</span>
                  </div>
                </div>
              </div>

              {/* Quick actions bar */}
              <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/doctors/${docId}`)}
                  className="flex-1 py-2 rounded-lg text-xs text-[#2E4E45] hover:bg-[#2E4E45]/5 transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-eye-line" />
                  عرض الملف
                </button>
                <button
                  onClick={() => handleEdit(doctor)}
                  className="flex-1 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line" />
                  تعديل
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
               <i className="ri-user-search-line text-gray-400 text-2xl" />
            </div>
            <p className="text-sm text-gray-500">لا توجد نتائج تطابق البحث</p>
          </div>
        )}
      </div>

      <DoctorFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingDoctor}
      />
    </AdminLayout>
  );
}
