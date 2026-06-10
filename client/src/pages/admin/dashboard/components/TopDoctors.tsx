interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bookings: number;
  rating: number;
  avatar: string;
  growth: number;
}

interface TopDoctorsProps {
  doctors: Doctor[];
  onNavigate: (path: string) => void;
}

export default function TopDoctors({ doctors, onNavigate }: TopDoctorsProps) {
  const maxBookings = Math.max(...doctors.map((d) => d.bookings));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-800 text-base">أداء الأطباء</h3>
          <p className="text-xs text-gray-400 mt-0.5">الأكثر حجزاً هذا الشهر</p>
        </div>
        <button
          onClick={() => onNavigate("/admin/doctors")}
          className="text-xs text-[#2E4E45] hover:text-[#C8A96E] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          عرض الكل
          <i className="ri-arrow-left-line" />
        </button>
      </div>

      <div className="space-y-4">
        {doctors.map((doc, i) => (
          <div key={doc.id} className="flex items-center gap-3">
            {/* Rank */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? "bg-[#C8A96E] text-white" : i === 1 ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-500"}`}>
              {i + 1}
            </div>

            {/* Avatar */}
            <img
              src={doc.avatar}
              alt={doc.name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800 truncate">{doc.name}</span>
                <span className="text-xs font-bold text-gray-700 flex-shrink-0">{doc.bookings}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(doc.bookings / maxBookings) * 100}%`,
                      backgroundColor: i === 0 ? "#C8A96E" : "#2E4E45",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <i className="ri-star-fill text-[10px] text-amber-400" />
                  <span className="text-[10px] text-gray-500">{doc.rating}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{doc.specialty}</p>
            </div>

            {/* Growth */}
            <div className="flex-shrink-0 text-right">
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                +{doc.growth}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
