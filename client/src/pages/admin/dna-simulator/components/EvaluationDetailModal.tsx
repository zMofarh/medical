import type { DNAEvaluation } from "@/mocks/dnaSimulatorData";

interface EvaluationDetailModalProps {
  evaluation: DNAEvaluation | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusOptions = [
  { value: "new", label: "جديد", color: "text-blue-700 bg-blue-50" },
  { value: "viewed", label: "تمت المراجعة", color: "text-amber-700 bg-amber-50" },
  { value: "contacted", label: "تم التواصل", color: "text-violet-700 bg-violet-50" },
  { value: "booked", label: "تم الحجز", color: "text-emerald-700 bg-emerald-50" },
];

const riskConfig: Record<string, { color: string; bg: string; bar: string }> = {
  "منخفض": { color: "text-brand-forest-700", bg: "bg-brand-forest-50", bar: "bg-brand-forest-600" },
  "متوسط": { color: "text-amber-700", bg: "bg-amber-50", bar: "bg-amber-500" },
  "مرتفع": { color: "text-orange-700", bg: "bg-orange-50", bar: "bg-orange-500" },
  "مرتفع جداً": { color: "text-red-700", bg: "bg-red-50", bar: "bg-red-500" },
};

export default function EvaluationDetailModal({
  evaluation,
  onClose,
  onStatusChange,
}: EvaluationDetailModalProps) {
  if (!evaluation) return null;

  const risk = riskConfig[evaluation.riskLevel];

  const categories = [
    { key: "cardiac", label: "القلب والأوعية", icon: "ri-heart-pulse-line" },
    { key: "metabolic", label: "الأيض والسكري", icon: "ri-scales-line" },
    { key: "neuro", label: "الجهاز العصبي", icon: "ri-brain-line" },
    { key: "bone", label: "العظام والمفاصل", icon: "ri-body-scan-line" },
    { key: "mental", label: "الصحة النفسية", icon: "ri-mental-health-line" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-brand-forest-100 rounded-xl">
              <i className="ri-dna-line text-brand-forest-700 text-lg"></i>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">تفاصيل التقييم</h2>
              <p className="text-xs text-gray-500 font-mono">{evaluation.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-gray-500"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">الاسم</p>
              <p className="font-semibold text-gray-900">{evaluation.userName}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">الجوال</p>
              <p className="font-semibold text-gray-900">{evaluation.userPhone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
              <p className="font-semibold text-gray-900">{evaluation.userEmail}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">العمر</p>
              <p className="font-semibold text-gray-900">{evaluation.age}</p>
            </div>
          </div>

          {/* Risk Score */}
          <div className={`rounded-xl p-5 ${risk.bg} border border-opacity-20`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-700">مستوى المخاطر الإجمالي</p>
                <p className={`text-3xl font-black ${risk.color} mt-1`}>
                  {evaluation.overallScore}%
                </p>
              </div>
              <span className={`text-sm font-bold px-4 py-2 rounded-full bg-white/60 ${risk.color}`}>
                {evaluation.riskLevel}
              </span>
            </div>

            {/* Category bars */}
            <div className="space-y-2">
              {categories.map((cat) => {
                const score = evaluation.categories[cat.key as keyof typeof evaluation.categories];
                const catRisk =
                  score < 30
                    ? { bar: "bg-brand-forest-600", text: "text-brand-forest-700" }
                    : score < 55
                    ? { bar: "bg-amber-500", text: "text-amber-700" }
                    : score < 75
                    ? { bar: "bg-orange-500", text: "text-orange-700" }
                    : { bar: "bg-red-500", text: "text-red-700" };
                return (
                  <div key={cat.key} className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <i className={`${cat.icon} text-xs text-gray-500`}></i>
                    </div>
                    <span className="text-xs text-gray-700 w-28 flex-shrink-0">{cat.label}</span>
                    <div className="flex-1 bg-white/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${catRisk.bar}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-8 text-left ${catRisk.text}`}>{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Answers Summary */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <i className="ri-questionnaire-line text-brand-forest-600"></i>
              ملخص الإجابات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "التاريخ العائلي", value: evaluation.familyHistory.join("، ") },
                { label: "نمط الحياة", value: evaluation.lifestyle },
                { label: "النظام الغذائي", value: evaluation.diet },
                { label: "مستوى الضغط", value: evaluation.stress },
                { label: "جودة النوم", value: evaluation.sleep },
                { label: "الأعراض", value: evaluation.symptoms.join("، ") || "لا يوجد" },
                { label: "آخر فحص", value: evaluation.checkups },
                { label: "التدخين", value: evaluation.smoking },
                { label: "الهدف", value: evaluation.goal },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Package */}
          <div className="bg-brand-forest-50 rounded-xl p-4 border border-brand-forest-200">
            <p className="text-xs text-brand-forest-600 mb-1">الباقة الموصى بها</p>
            <p className="font-bold text-brand-forest-900">{evaluation.recommendedPackage}</p>
          </div>

          {/* Status & Notes */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">حالة التقييم</p>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onStatusChange(evaluation.id, opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        evaluation.status === opt.value
                          ? `${opt.color} ring-2 ring-offset-1 ring-gray-200`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {evaluation.notes && (
              <div className="mt-4 bg-amber-50 rounded-xl p-3 border border-amber-200">
                <p className="text-xs text-amber-700 font-semibold mb-1">ملاحظات</p>
                <p className="text-sm text-amber-800">{evaluation.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a
              href={`tel:${evaluation.userPhone}`}
              className="flex-1 text-center bg-brand-forest-700 hover:bg-brand-forest-800 text-white font-bold py-2.5 rounded-xl transition-colors text-sm cursor-pointer whitespace-nowrap"
            >
              <i className="ri-phone-line ml-2"></i>
              اتصال بالمستخدم
            </a>
            <a
              href={`https://wa.me/${evaluation.userPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm cursor-pointer whitespace-nowrap"
            >
              <i className="ri-whatsapp-line ml-2"></i>
              واتساب
            </a>
            <a
              href={`mailto:${evaluation.userEmail}`}
              className="flex-1 text-center border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm cursor-pointer whitespace-nowrap"
            >
              <i className="ri-mail-line ml-2"></i>
              بريد
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}