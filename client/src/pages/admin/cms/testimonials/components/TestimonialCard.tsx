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
  isSelected: boolean;
  onSelect: () => void;
  onTogglePublish: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}

export default function TestimonialCard({
  testimonial: t,
  isSelected,
  onSelect,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
}: Props) {
  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? "border-[#2E4E45] ring-2 ring-[#2E4E45]/15"
          : "border-gray-200 hover:border-gray-300"
      } ${!t.published ? "opacity-60" : ""}`}
      onClick={onSelect}
    >
      {/* Status bar */}
      <div className={`h-1 w-full ${t.published ? (t.featured ? "bg-[#C8A96E]" : "bg-[#2E4E45]") : "bg-gray-200"}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <img
            src={t.image}
            alt={t.name}
            className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 border-2 border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-gray-800 truncate">{t.name}</p>
              {t.verified && (
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className="ri-verified-badge-fill text-sky-500 text-sm" />
                </span>
              )}
              {t.featured && (
                <span className="px-1.5 py-0.5 rounded text-xs bg-[#C8A96E]/15 text-[#C8A96E] font-medium flex-shrink-0">مميز</span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{t.specialty}</p>
          </div>
          {/* Rating */}
          <div className="flex gap-0.5 flex-shrink-0">
            {[1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={`text-xs ${s <= t.rating ? "ri-star-fill text-amber-400" : "ri-star-line text-gray-200"}`} />
            ))}
          </div>
        </div>

        {/* Text */}
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
          «{t.text}»
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">{t.service}</span>
          <span className="text-xs text-gray-400">{t.date}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
          {/* Publish toggle */}
          <button
            onClick={onTogglePublish}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              t.published
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <i className={t.published ? "ri-eye-line" : "ri-eye-off-line"} />
            {t.published ? "منشور" : "مخفي"}
          </button>

          {/* Featured toggle */}
          <button
            onClick={onToggleFeatured}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              t.featured
                ? "bg-[#C8A96E]/15 text-[#C8A96E] hover:bg-[#C8A96E]/25"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <i className={t.featured ? "ri-star-fill" : "ri-star-line"} />
            {t.featured ? "مميز" : "تمييز"}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="mr-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-line text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
