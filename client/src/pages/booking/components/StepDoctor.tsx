import { useState } from "react";
import { usePublicDoctors } from "@/hooks/useCMSDoctors";
import { servicesData } from "@/mocks/servicesData";

const visitTypes = [
  { id: "first",       label: "زيارة أولى",  icon: "ri-user-add-line",         desc: "للمرضى الجدد" },
  { id: "followup",    label: "متابعة",       icon: "ri-refresh-line",           desc: "للمرضى الحاليين" },
  { id: "consultation",label: "استشارة",      icon: "ri-question-answer-line",   desc: "رأي طبي متخصص" },
];

interface StepDoctorProps {
  serviceId: string;
  selectedDoctor: string;
  visitType: string;
  onSelectDoctor: (id: string) => void;
  onSelectVisitType: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDoctor({
  serviceId,
  selectedDoctor,
  visitType,
  onSelectDoctor,
  onSelectVisitType,
  onNext,
  onBack,
}: StepDoctorProps) {
  const [search, setSearch] = useState("");
  const { doctors: doctorsDetailed } = usePublicDoctors();

  const service = servicesData.find((s) => s.id === serviceId);

  // Filter doctors relevant to the selected service
  const serviceDocNames = service?.doctors.map((d) => d.name) ?? [];
  const relevantDoctors = serviceDocNames.length > 0
    ? doctorsDetailed.filter((d) => serviceDocNames.includes(d.name))
    : doctorsDetailed;

  const allDoctors = relevantDoctors.length > 0 ? relevantDoctors : doctorsDetailed;

  const filtered = allDoctors.filter(
    (d) =>
      d.name.includes(search) ||
      d.specialty.includes(search) ||
      d.title.includes(search)
  );

  return (
    <div>
      {/* Service context */}
      {service && (
        <div className="flex items-center gap-2 bg-brand-cream-50 border border-brand-cream-200 rounded-xl px-4 py-2.5 mb-5">
          <i className={`${service.icon} text-brand-forest-600 text-sm`}></i>
          <span className="text-xs font-semibold text-brand-forest-700 truncate">{service.name.split("—")[0].trim()}</span>
          <button onClick={onBack} className="mr-auto text-xs text-brand-forest-500 font-semibold hover:underline cursor-pointer whitespace-nowrap">
            تغيير
          </button>
        </div>
      )}

      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900 mb-1">اختر الطبيب المناسب</h2>
        <p className="text-gray-400 text-sm">الأطباء المتخصصون في الخدمة المختارة</p>
      </div>

      {/* Visit Type */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">نوع الزيارة</p>
        <div className="grid grid-cols-3 gap-2">
          {visitTypes.map((vt) => (
            <button
              key={vt.id}
              onClick={() => onSelectVisitType(vt.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                visitType === vt.id
                  ? "border-brand-forest-500 bg-brand-cream-50"
                  : "border-gray-100 bg-white hover:border-brand-cream-300"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center mx-auto mb-1.5 rounded-lg bg-brand-cream-100">
                <i className={`${vt.icon} text-brand-forest-600 text-sm`}></i>
              </div>
              <p className={`text-xs font-bold ${visitType === vt.id ? "text-brand-forest-700" : "text-gray-700"}`}>{vt.label}</p>
              <p className="text-[10px] text-gray-400">{vt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <i className="ri-search-line absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          type="text"
          placeholder="ابحث باسم الطبيب أو التخصص..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 text-sm border border-brand-cream-200 rounded-xl outline-none focus:border-brand-forest-400 bg-brand-cream-50 placeholder-gray-300"
        />
      </div>

      {/* Doctors list */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pl-1">
        {filtered.map((doc) => {
          const isSelected = selectedDoctor === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => onSelectDoctor(doc.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-right ${
                isSelected
                  ? "border-brand-forest-500 bg-brand-cream-50"
                  : "border-gray-100 bg-white hover:border-brand-cream-300"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-14 h-14 rounded-xl object-cover object-top"
                />
                {isSelected && (
                  <div className="absolute -top-1.5 -left-1.5 w-5 h-5 flex items-center justify-center bg-brand-forest-600 rounded-full">
                    <i className="ri-check-line text-white text-[10px]"></i>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                <p className="text-brand-forest-600 text-xs font-medium">{doc.specialty}</p>
                <p className="text-gray-400 text-xs">{doc.experience}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`ri-star-fill text-[10px] ${i < Math.floor(doc.rating) ? "text-amber-400" : "text-gray-200"}`}></i>
                  ))}
                  <span className="text-[10px] text-gray-500 mr-0.5">{doc.rating} ({doc.reviewsCount})</span>
                </div>
              </div>

              <div className="text-left flex-shrink-0">
                <p className="text-[10px] text-gray-400">الاستشارة</p>
                <p className="font-black text-brand-forest-700 text-sm">{doc.consultationFee}</p>
                <p className="text-[10px] text-gray-400">ريال</p>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <i className="ri-search-line text-2xl mb-2 block"></i>
            لا توجد نتائج
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-3.5 rounded-full hover:border-gray-300 transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-arrow-right-line"></i>
          السابق
        </button>
        <button
          onClick={() => selectedDoctor && onNext()}
          disabled={!selectedDoctor}
          className={`inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
            selectedDoctor
              ? "bg-brand-forest-600 hover:bg-brand-forest-700 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          التالي — اختر الموعد
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
    </div>
  );
}
