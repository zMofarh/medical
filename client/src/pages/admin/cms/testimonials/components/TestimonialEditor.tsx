interface Testimonial {
  id: string;
  name: string;
  specialty: string;
  text: string;
  rating: number;
  image: string;
  date: string;
  service: string;
  verified: boolean;
  published: boolean;
  featured: boolean;
}

interface Props {
  testimonial: Testimonial;
  onChange: (updated: Testimonial) => void;
}

const serviceOptions = [
  "منصة الطب الدقيق",
  "DNA Risk Score",
  "Second Opinion الدولي",
  "السمنة والخلل الأيضي",
  "التقييم العميق الشامل",
  "الطب النفسي للبالغين",
  "العلاجات الوريدية",
  "هشاشة العظام",
  "الرعاية الدولية المتكاملة",
];

export default function TestimonialEditor({ testimonial: t, onChange }: Props) {
  const update = (field: keyof Testimonial, value: string | number | boolean) => {
    onChange({ ...t, [field]: value });
  };

  return (
    <div className="space-y-5">
      {/* Live preview */}
      <div className="rounded-xl bg-[#2E4E45]/5 border border-[#2E4E45]/15 p-5">
        <p className="text-xs font-semibold text-[#2E4E45] mb-3 flex items-center gap-1.5">
          <i className="ri-eye-line" />
          معاينة التقييم
        </p>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={`text-base ${s <= t.rating ? "ri-star-fill text-amber-400" : "ri-star-line text-gray-200"}`} />
            ))}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium">«{t.text || "نص التقييم..."}»</p>
          <div className="flex items-center gap-3">
            <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover object-top border-2 border-gray-100" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{t.name || "اسم المريض"}</p>
              <p className="text-[#2E4E45] text-xs">{t.specialty || "التخصص"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient info */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <i className="ri-user-line text-[#2E4E45]" />
          بيانات المريض
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">الاسم <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={t.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="اسم المريض..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">التخصص / الوصف</label>
            <input
              type="text"
              value={t.specialty}
              onChange={(e) => update("specialty", e.target.value)}
              placeholder="مريض — اسم الخدمة"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Photo */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">صورة المريض</label>
        <div className="flex items-center gap-3">
          <img
            src={t.image}
            alt={t.name}
            className="w-14 h-14 rounded-full object-cover object-top border-2 border-gray-200 flex-shrink-0"
          />
          <input
            type="url"
            value={t.image}
            onChange={(e) => update("image", e.target.value)}
            dir="ltr"
            placeholder="رابط الصورة..."
            className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Review text */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-500">نص التقييم <span className="text-red-400">*</span></label>
          <span className={`text-xs ${t.text.length > 400 ? "text-red-400" : "text-gray-400"}`}>
            {t.text.length}/500
          </span>
        </div>
        <textarea
          rows={5}
          value={t.text}
          onChange={(e) => update("text", e.target.value.slice(0, 500))}
          placeholder="اكتب نص التقييم هنا..."
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all resize-none"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">التقييم</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => update("rating", star)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <i className={`text-2xl ${star <= t.rating ? "ri-star-fill text-amber-400" : "ri-star-line text-gray-300"}`} />
            </button>
          ))}
          <span className="text-sm font-bold text-gray-700 mr-2">{t.rating}/5</span>
        </div>
      </div>

      {/* Service & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">الخدمة المستخدمة</label>
          <select
            value={t.service}
            onChange={(e) => update("service", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all cursor-pointer"
          >
            {serviceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">التاريخ</label>
          <input
            type="text"
            value={t.date}
            onChange={(e) => update("date", e.target.value)}
            placeholder="مارس 2026"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { field: "published" as const, label: "منشور", icon: "ri-eye-line", desc: "يظهر للزوار", color: "emerald" },
          { field: "featured" as const, label: "مميز", icon: "ri-star-line", desc: "يظهر في الواجهة", color: "amber" },
          { field: "verified" as const, label: "موثق", icon: "ri-verified-badge-line", desc: "مريض حقيقي", color: "sky" },
        ].map(({ field, label, icon, desc, color }) => (
          <button
            key={field}
            onClick={() => update(field, !t[field])}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-right ${
              t[field]
                ? `border-${color}-200 bg-${color}-50`
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              t[field] ? `bg-${color}-100 text-${color}-600` : "bg-gray-100 text-gray-400"
            }`}>
              <i className={`${icon} text-sm`} />
            </div>
            <div>
              <p className={`text-xs font-semibold ${t[field] ? `text-${color}-700` : "text-gray-500"}`}>{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <div className={`mr-auto w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              t[field] ? `border-${color}-500 bg-${color}-500` : "border-gray-300"
            }`}>
              {t[field] && <i className="ri-check-line text-white text-xs" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
