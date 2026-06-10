import { useState } from "react";
import { Doctor } from "@/hooks/useCMSDoctors";

interface CMSDoctorsEditorProps {
  data: Doctor[];
  onChange: (data: Doctor[]) => void;
}

export default function CMSDoctorsEditor({ data, onChange }: CMSDoctorsEditorProps) {
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id || "");
  const [expandedSection, setExpandedSection] = useState<string>("basic");

  const selected = data.find((d) => d.id === selectedId);

  const updateDoctor = (updated: Doctor) => {
    onChange(data.map((d) => (d.id === updated.id ? updated : d)));
  };

  const updateField = <K extends keyof Doctor>(field: K, value: Doctor[K]) => {
    if (!selected) return;
    updateDoctor({ ...selected, [field]: value });
  };

  const updateSpecialization = (idx: number, val: string) => {
    if (!selected) return;
    const arr = [...selected.specializations];
    arr[idx] = val;
    updateField("specializations", arr);
  };

  const addSpecialization = () => {
    if (!selected) return;
    updateField("specializations", [...selected.specializations, "تخصص جديد"]);
  };

  const removeSpecialization = (idx: number) => {
    if (!selected) return;
    updateField("specializations", selected.specializations.filter((_, i) => i !== idx));
  };

  const updateAchievement = (idx: number, val: string) => {
    if (!selected) return;
    const arr = [...selected.achievements];
    arr[idx] = val;
    updateField("achievements", arr);
  };

  const addAchievement = () => {
    if (!selected) return;
    updateField("achievements", [...selected.achievements, "إنجاز جديد"]);
  };

  const removeAchievement = (idx: number) => {
    if (!selected) return;
    updateField("achievements", selected.achievements.filter((_, i) => i !== idx));
  };

  const updateReview = (idx: number, key: keyof Doctor["reviews"][0], val: string | number) => {
    if (!selected) return;
    const reviews = [...selected.reviews];
    reviews[idx] = { ...reviews[idx], [key]: val };
    updateField("reviews", reviews);
  };

  const addReview = () => {
    if (!selected) return;
    updateField("reviews", [...selected.reviews, { name: "مريض جديد", rating: 5, text: "تجربة رائعة", date: "أبريل 2026" }]);
  };

  const removeReview = (idx: number) => {
    if (!selected) return;
    updateField("reviews", selected.reviews.filter((_, i) => i !== idx));
  };

  const sections = [
    { key: "basic", label: "المعلومات الأساسية", icon: "ri-user-line" },
    { key: "specializations", label: "التخصصات", icon: "ri-stethoscope-line" },
    { key: "achievements", label: "الإنجازات", icon: "ri-award-line" },
    { key: "reviews", label: "آراء المرضى", icon: "ri-chat-quote-line" },
  ];

  if (!selected) return null;

  return (
    <div className="flex gap-4">
      {/* Doctors List */}
      <div className="w-44 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">الأطباء</p>
          </div>
          <div className="p-1.5">
            {data.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                className={`w-full text-right px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer
                  ${selectedId === doc.id ? "bg-[#2E4E45] text-white font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-2">
                  <img src={doc.image} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Section Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setExpandedSection(sec.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap
                ${expandedSection === sec.key ? "bg-[#2E4E45] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              <i className={`${sec.icon} text-xs`} />
              {sec.label}
            </button>
          ))}
        </div>

        {/* Basic Info */}
        {expandedSection === "basic" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-700">المعلومات الأساسية</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الاسم</label>
                <input
                  value={selected.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">التخصص</label>
                <input
                  value={selected.specialty}
                  onChange={(e) => updateField("specialty", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">اللقب الوظيفي</label>
                <input
                  value={selected.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">سنوات الخبرة</label>
                <input
                  value={selected.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">المؤهل العلمي</label>
                <input
                  value={selected.education}
                  onChange={(e) => updateField("education", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">رسوم الاستشارة (ريال)</label>
                <input
                  value={selected.consultationFee}
                  onChange={(e) => updateField("consultationFee", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">نبذة تعريفية</label>
              <textarea
                value={selected.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">رابط الصورة</label>
              <input
                value={selected.image}
                onChange={(e) => updateField("image", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
              />
              {selected.image && (
                <img src={selected.image} alt="" className="mt-2 h-24 w-24 object-cover rounded-xl" />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">أيام العمل</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      const days = selected.availableDays.includes(day)
                        ? selected.availableDays.filter((d) => d !== day)
                        : [...selected.availableDays, day];
                      updateField("availableDays", days);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all
                      ${selected.availableDays.includes(day) ? "bg-[#2E4E45] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Specializations */}
        {expandedSection === "specializations" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">التخصصات</h4>
              <button
                onClick={addSpecialization}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.specializations.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={spec}
                  onChange={(e) => updateSpecialization(idx, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
                <button
                  onClick={() => removeSpecialization(idx)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {expandedSection === "achievements" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">الإنجازات والمؤهلات</h4>
              <button
                onClick={addAchievement}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.achievements.map((ach, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className="ri-medal-line text-[#C8A96E] text-sm" />
                </div>
                <input
                  value={ach}
                  onChange={(e) => updateAchievement(idx, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                />
                <button
                  onClick={() => removeAchievement(idx)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {expandedSection === "reviews" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">آراء المرضى</h4>
              <button
                onClick={addReview}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E4E45] text-white text-xs rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> إضافة
              </button>
            </div>
            {selected.reviews.map((review, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <input
                      value={review.name}
                      onChange={(e) => updateReview(idx, "name", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                      placeholder="اسم المريض"
                    />
                    <input
                      value={review.date}
                      onChange={(e) => updateReview(idx, "date", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45]"
                      placeholder="التاريخ"
                    />
                  </div>
                  <button
                    onClick={() => removeReview(idx)}
                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateReview(idx, "rating", star)}
                      className="w-5 h-5 flex items-center justify-center cursor-pointer"
                    >
                      <i className={`${star <= review.rating ? "ri-star-fill text-amber-400" : "ri-star-line text-gray-300"} text-sm`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={review.text}
                  onChange={(e) => updateReview(idx, "text", e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  placeholder="نص التقييم"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
