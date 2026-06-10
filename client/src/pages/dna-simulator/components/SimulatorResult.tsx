import { Link } from "react-router-dom";
import RiskGauge from "./RiskGauge";
import AIReportSection from "./AIReportSection";

export interface RiskCategory {
  id: string;
  label: string;
  icon: string;
  score: number; // 0–100
}

export interface PackageRecommendation {
  id: string;
  name: string;
  category: string;
  price: number;
  badge?: string;
  icon: string;
  accentColor: string;
  features: string[];
  reason: string;
}

interface SimulatorResultProps {
  overallScore: number;
  riskCategories: RiskCategory[];
  primaryPackage: PackageRecommendation;
  secondaryPackage?: PackageRecommendation;
  onRetake: () => void;
  answers?: Record<string, string[]>;
}

function getRiskLevel(score: number): { label: string; desc: string; color: string; bg: string } {
  if (score < 30) return { label: "منخفض", desc: "مخاطرك الصحية منخفضة — الوقاية المبكرة تحافظ على هذا المستوى", color: "text-brand-forest-700", bg: "bg-brand-forest-50" };
  if (score < 55) return { label: "متوسط", desc: "هناك عوامل خطر تستحق التقييم الدقيق والمتابعة المنتظمة", color: "text-amber-700", bg: "bg-amber-50" };
  if (score < 75) return { label: "مرتفع", desc: "مستوى المخاطر يستدعي تقييمًا عميقًا وخطة وقائية شخصية", color: "text-orange-700", bg: "bg-orange-50" };
  return { label: "مرتفع جداً", desc: "التدخل المبكر ضروري — التقييم الشامل يمكّنك من استباق المخاطر", color: "text-red-700", bg: "bg-red-50" };
}

const accentMap: Record<string, { btn: string; border: string; text: string; bg: string; badge: string }> = {
  teal:   { btn: "bg-brand-forest-700 hover:bg-brand-forest-800", border: "border-brand-cream-200", text: "text-brand-forest-700", bg: "bg-brand-forest-50", badge: "bg-brand-forest-600" },
  violet: { btn: "bg-violet-600 hover:bg-violet-700", border: "border-violet-200", text: "text-violet-700", bg: "bg-violet-50", badge: "bg-violet-600" },
  rose:   { btn: "bg-rose-600 hover:bg-rose-700", border: "border-rose-200", text: "text-rose-700", bg: "bg-rose-50", badge: "bg-rose-600" },
  orange: { btn: "bg-orange-500 hover:bg-orange-600", border: "border-orange-200", text: "text-orange-700", bg: "bg-orange-50", badge: "bg-orange-500" },
  amber:  { btn: "bg-amber-500 hover:bg-amber-600", border: "border-amber-200", text: "text-amber-700", bg: "bg-amber-50", badge: "bg-amber-500" },
  cyan:   { btn: "bg-cyan-600 hover:bg-cyan-700", border: "border-cyan-200", text: "text-cyan-700", bg: "bg-cyan-50", badge: "bg-cyan-600" },
};

function PackageCard({ pkg, isPrimary }: { pkg: PackageRecommendation; isPrimary: boolean }) {
  const accent = accentMap[pkg.accentColor] ?? accentMap.teal;
  return (
    <div className={`relative bg-white rounded-2xl border-2 ${isPrimary ? accent.border : "border-brand-cream-200"} p-5 flex flex-col gap-4 ${isPrimary ? "ring-2 ring-offset-2 ring-brand-forest-200" : ""}`}>
      {isPrimary && (
        <div className="absolute -top-3 right-4">
          <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${accent.badge}`}>
            الأنسب لحالتك
          </span>
        </div>
      )}
      {pkg.badge && !isPrimary && (
        <div className="absolute -top-3 right-4">
          <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-gray-500">
            {pkg.badge}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${accent.bg}`}>
          <i className={`${pkg.icon} text-xl ${accent.text}`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">{pkg.category}</p>
          <h3 className="font-black text-gray-900 text-sm leading-tight">{pkg.name}</h3>
        </div>
        <div className="text-left flex-shrink-0">
          <div className={`text-xl font-black ${accent.text}`}>{pkg.price.toLocaleString()}</div>
          <div className="text-xs text-gray-400">ريال</div>
        </div>
      </div>

      {/* Reason */}
      <div className={`rounded-xl p-3 ${accent.bg}`}>
        <p className={`text-xs font-semibold ${accent.text} leading-relaxed`}>
          <i className="ri-lightbulb-line ml-1"></i>
          {pkg.reason}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-1.5">
        {pkg.features.slice(0, 4).map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
            <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${accent.bg}`}>
              <i className={`ri-check-line text-[9px] ${accent.text}`}></i>
            </div>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-auto">
        <Link
          to={`/packages/${pkg.id}`}
          className={`flex-1 text-center text-xs font-semibold py-2.5 rounded-xl border-2 ${accent.border} ${accent.text} hover:${accent.bg} transition-colors cursor-pointer whitespace-nowrap`}
        >
          التفاصيل
        </Link>
        <Link
          to={`/booking?package=${pkg.id}`}
          className={`flex-1 text-center text-xs font-bold text-white py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${accent.btn}`}
        >
          <i className="ri-calendar-check-line ml-1"></i>
          احجز الآن
        </Link>
      </div>
    </div>
  );
}

export default function SimulatorResult({
  overallScore,
  riskCategories,
  primaryPackage,
  secondaryPackage,
  onRetake,
  answers = {},
}: SimulatorResultProps) {
  const risk = getRiskLevel(overallScore);

  const aiReportData = {
    overallScore,
    riskLevel: risk.label,
    riskCategories: riskCategories.map((c) => ({ id: c.id, label: c.label, score: c.score })),
    answers,
    primaryPackage: primaryPackage.name,
    secondaryPackage: secondaryPackage?.name,
  };

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Overall Score */}
      <div className={`rounded-2xl p-6 ${risk.bg} border border-opacity-30`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <RiskGauge score={overallScore} label="مستوى المخاطر الإجمالي" animate />
          </div>
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <span className={`text-2xl font-black ${risk.color}`}>مستوى المخاطر: {risk.label}</span>
            </div>
            <p className={`text-sm leading-relaxed ${risk.color} opacity-80 mb-4`}>{risk.desc}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/60 ${risk.color}`}>
                <i className="ri-shield-check-line ml-1"></i>
                التقييم المبكر يغير المسار
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/60 ${risk.color}`}>
                <i className="ri-dna-line ml-1"></i>
                الجينات ليست مصيرًا
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Categories Breakdown */}
      <div>
        <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-brand-forest-100 rounded-lg">
            <i className="ri-bar-chart-2-line text-brand-forest-700 text-sm"></i>
          </div>
          تفصيل المخاطر حسب المجال
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {riskCategories.map((cat) => (
            <RiskGauge key={cat.id} score={cat.score} label={cat.label} animate />
          ))}
        </div>
      </div>

      {/* Risk Bars */}
      <div className="bg-white rounded-2xl border border-brand-cream-200 p-5">
        <h3 className="font-black text-gray-900 text-sm mb-4">تحليل المخاطر التفصيلي</h3>
        <div className="space-y-3">
          {riskCategories.map((cat) => {
            const c = cat.score < 30 ? { bar: "bg-brand-forest-600", text: "text-brand-forest-700" }
              : cat.score < 55 ? { bar: "bg-amber-500", text: "text-amber-700" }
              : cat.score < 75 ? { bar: "bg-orange-500", text: "text-orange-700" }
              : { bar: "bg-red-500", text: "text-red-700" };
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className={`${cat.icon} text-sm text-gray-500`}></i>
                </div>
                <span className="text-xs text-gray-700 w-28 flex-shrink-0 font-medium">{cat.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${c.bar}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-8 text-left flex-shrink-0 ${c.text}`}>{cat.score}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Recommendations */}
      <div>
        <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-brand-forest-100 rounded-lg">
            <i className="ri-award-line text-brand-forest-700 text-sm"></i>
          </div>
          الباقة الموصى بها لحالتك
        </h3>
        <p className="text-sm text-gray-500 mb-5">بناءً على إجاباتك، هذه الباقات الأنسب لمستوى مخاطرك</p>
        <div className={`grid gap-4 ${secondaryPackage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-md"}`}>
          <PackageCard pkg={primaryPackage} isPrimary />
          {secondaryPackage && <PackageCard pkg={secondaryPackage} isPrimary={false} />}
        </div>
      </div>

      {/* AI Report */}
      <AIReportSection data={aiReportData} />

      {/* Disclaimer + Retake */}
      <div className="bg-brand-cream-50 border border-brand-cream-200 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-200 rounded-full flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-brand-forest-700 text-sm"></i>
          </div>
          <p className="text-xs text-brand-forest-700 leading-relaxed">
            هذا التقييم تقديري ومبني على إجاباتك — لا يُغني عن التقييم السريري الفعلي مع استشاري متخصص.
            DNA Risk Score الحقيقي يتطلب تحليلًا جينيًا مخبريًا دقيقًا.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/booking"
            className="flex-1 text-center bg-brand-forest-700 hover:bg-brand-forest-800 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer text-sm whitespace-nowrap"
          >
            <i className="ri-calendar-check-line ml-2"></i>
            احجز تقييمًا حقيقيًا مع استشاري
          </Link>
          <button
            onClick={onRetake}
            className="flex-1 text-center border-2 border-brand-cream-300 text-brand-forest-700 font-bold py-3 rounded-xl hover:bg-brand-cream-100 transition-colors cursor-pointer text-sm whitespace-nowrap"
          >
            <i className="ri-refresh-line ml-2"></i>
            إعادة التقييم
          </button>
        </div>
      </div>
    </div>
  );
}
