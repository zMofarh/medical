import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { LotusShape, StarShape, SunShape } from "@/components/base/BrandShapes";
import SimulatorQuestion, { type Question } from "./components/SimulatorQuestion";
import SimulatorResult, { type RiskCategory, type PackageRecommendation } from "./components/SimulatorResult";

// ─── Questions ────────────────────────────────────────────────────────────────
const questions: Question[] = [
  {
    id: "age",
    category: "المعلومات الأساسية",
    categoryIcon: "ri-user-line",
    categoryColor: "teal",
    question: "ما هي فئتك العمرية؟",
    subtitle: "العمر عامل محوري في تقييم المخاطر الصحية المستقبلية",
    options: [
      { label: "أقل من 30 سنة", value: "under30", riskScore: 1, icon: "ri-seedling-line" },
      { label: "30 – 40 سنة", value: "30-40", riskScore: 3, icon: "ri-plant-line" },
      { label: "40 – 50 سنة", value: "40-50", riskScore: 5, icon: "ri-tree-line" },
      { label: "50 – 60 سنة", value: "50-60", riskScore: 7, icon: "ri-ancient-gate-line" },
      { label: "أكثر من 60 سنة", value: "over60", riskScore: 9, icon: "ri-ancient-pavilion-line" },
    ],
  },
  {
    id: "family_history",
    category: "التاريخ العائلي",
    categoryIcon: "ri-group-line",
    categoryColor: "violet",
    question: "هل يوجد في عائلتك تاريخ لأي من هذه الأمراض؟",
    subtitle: "التاريخ العائلي من أقوى مؤشرات الاستعداد الجيني",
    multiSelect: true,
    options: [
      { label: "أمراض القلب والشرايين", value: "heart", riskScore: 8, icon: "ri-heart-pulse-line" },
      { label: "السكري من النوع الثاني", value: "diabetes", riskScore: 7, icon: "ri-drop-line" },
      { label: "السرطان (أي نوع)", value: "cancer", riskScore: 9, icon: "ri-microscope-line" },
      { label: "الزهايمر أو الخرف", value: "alzheimer", riskScore: 8, icon: "ri-brain-line" },
      { label: "هشاشة العظام", value: "osteoporosis", riskScore: 6, icon: "ri-body-scan-line" },
      { label: "لا يوجد تاريخ عائلي معروف", value: "none", riskScore: 1, icon: "ri-checkbox-circle-line" },
    ],
  },
  {
    id: "lifestyle",
    category: "نمط الحياة",
    categoryIcon: "ri-run-line",
    categoryColor: "orange",
    question: "كيف تصف نمط حياتك اليومي؟",
    options: [
      { label: "نشيط جداً — رياضة يومية", value: "very_active", riskScore: 1, icon: "ri-run-line" },
      { label: "نشيط نسبياً — رياضة 3 مرات أسبوعياً", value: "active", riskScore: 3, icon: "ri-walk-line" },
      { label: "خامل نسبياً — حركة محدودة", value: "sedentary", riskScore: 6, icon: "ri-sofa-line" },
      { label: "خامل تماماً — جلوس معظم اليوم", value: "very_sedentary", riskScore: 9, icon: "ri-computer-line" },
    ],
  },
  {
    id: "diet",
    category: "النظام الغذائي",
    categoryIcon: "ri-restaurant-line",
    categoryColor: "amber",
    question: "كيف تصف نظامك الغذائي؟",
    options: [
      { label: "صحي ومتوازن — خضروات وبروتين وحبوب كاملة", value: "healthy", riskScore: 1, icon: "ri-leaf-line" },
      { label: "متوسط — أحياناً صحي وأحياناً لا", value: "moderate", riskScore: 4, icon: "ri-scales-line" },
      { label: "غير صحي — وجبات سريعة وسكريات عالية", value: "unhealthy", riskScore: 7, icon: "ri-restaurant-2-line" },
      { label: "غير منتظم — لا نمط واضح", value: "irregular", riskScore: 6, icon: "ri-time-line" },
    ],
  },
  {
    id: "stress",
    category: "الصحة النفسية",
    categoryIcon: "ri-mental-health-line",
    categoryColor: "rose",
    question: "ما مستوى الضغط النفسي في حياتك؟",
    subtitle: "الضغط المزمن يؤثر على الصحة الجسدية بشكل مباشر",
    options: [
      { label: "منخفض — حياة هادئة ومتوازنة", value: "low", riskScore: 1, icon: "ri-sun-line" },
      { label: "متوسط — ضغط عمل معتاد", value: "moderate", riskScore: 4, icon: "ri-cloud-line" },
      { label: "مرتفع — ضغط مستمر ومؤثر", value: "high", riskScore: 7, icon: "ri-thunderstorms-line" },
      { label: "مرتفع جداً — إرهاق مزمن وقلق دائم", value: "very_high", riskScore: 9, icon: "ri-tornado-line" },
    ],
  },
  {
    id: "sleep",
    category: "النوم والراحة",
    categoryIcon: "ri-moon-line",
    categoryColor: "violet",
    question: "كيف تصف جودة نومك؟",
    options: [
      { label: "ممتاز — 7-9 ساعات منتظمة", value: "excellent", riskScore: 1, icon: "ri-moon-clear-line" },
      { label: "جيد — 6-7 ساعات في الغالب", value: "good", riskScore: 3, icon: "ri-moon-line" },
      { label: "متقطع — أستيقظ كثيراً", value: "interrupted", riskScore: 6, icon: "ri-moon-foggy-line" },
      { label: "سيء — أقل من 6 ساعات أو أرق مزمن", value: "poor", riskScore: 9, icon: "ri-moon-cloudy-line" },
    ],
  },
  {
    id: "symptoms",
    category: "الأعراض الحالية",
    categoryIcon: "ri-stethoscope-line",
    categoryColor: "cyan",
    question: "هل تعاني من أي من هذه الأعراض؟",
    subtitle: "اختر كل ما ينطبق عليك",
    multiSelect: true,
    options: [
      { label: "تعب مزمن غير مفسَّر", value: "fatigue", riskScore: 7, icon: "ri-battery-low-line" },
      { label: "زيادة في الوزن صعبة الإنقاص", value: "weight", riskScore: 6, icon: "ri-scales-line" },
      { label: "ضغط دم مرتفع أو حدودي", value: "bp", riskScore: 8, icon: "ri-heart-pulse-line" },
      { label: "سكر دم مرتفع أو مقاومة أنسولين", value: "glucose", riskScore: 8, icon: "ri-drop-line" },
      { label: "آلام مفاصل أو عظام", value: "joints", riskScore: 5, icon: "ri-body-scan-line" },
      { label: "لا أعاني من أعراض واضحة", value: "none", riskScore: 1, icon: "ri-checkbox-circle-line" },
    ],
  },
  {
    id: "checkups",
    category: "الفحوصات الدورية",
    categoryIcon: "ri-file-chart-line",
    categoryColor: "teal",
    question: "متى كان آخر فحص طبي شامل؟",
    options: [
      { label: "خلال الـ 6 أشهر الماضية", value: "recent", riskScore: 1, icon: "ri-calendar-check-line" },
      { label: "خلال السنة الماضية", value: "year", riskScore: 3, icon: "ri-calendar-line" },
      { label: "منذ أكثر من سنتين", value: "two_years", riskScore: 6, icon: "ri-calendar-2-line" },
      { label: "لم أجرِ فحصاً شاملاً من قبل", value: "never", riskScore: 9, icon: "ri-close-circle-line" },
    ],
  },
  {
    id: "smoking",
    category: "عوامل الخطر",
    categoryIcon: "ri-lungs-line",
    categoryColor: "orange",
    question: "ما علاقتك بالتدخين؟",
    options: [
      { label: "لم أدخن قط", value: "never", riskScore: 0, icon: "ri-checkbox-circle-line" },
      { label: "مدخن سابق — توقفت", value: "former", riskScore: 4, icon: "ri-history-line" },
      { label: "مدخن حالي — أقل من علبة يومياً", value: "light", riskScore: 7, icon: "ri-alert-line" },
      { label: "مدخن حالي — علبة أو أكثر يومياً", value: "heavy", riskScore: 10, icon: "ri-error-warning-line" },
    ],
  },
  {
    id: "goal",
    category: "هدفك من التقييم",
    categoryIcon: "ri-focus-3-line",
    categoryColor: "teal",
    question: "ما الذي تبحث عنه بالتحديد؟",
    subtitle: "سيساعدنا هذا في توصية الباقة الأنسب لك",
    options: [
      { label: "فهم مخاطري الصحية المستقبلية", value: "risk", riskScore: 0, icon: "ri-radar-line" },
      { label: "تحسين طاقتي ومستوى حيويتي", value: "energy", riskScore: 0, icon: "ri-flashlight-line" },
      { label: "إدارة حالة صحية موجودة", value: "manage", riskScore: 0, icon: "ri-heart-pulse-line" },
      { label: "الوقاية قبل ظهور الأعراض", value: "prevention", riskScore: 0, icon: "ri-shield-flash-line" },
    ],
  },
];

// ─── Risk calculation ─────────────────────────────────────────────────────────
function calculateRisks(answers: Record<string, string[]>): {
  overall: number;
  categories: RiskCategory[];
} {
  const getScore = (qId: string): number => {
    const q = questions.find((q) => q.id === qId);
    if (!q) return 0;
    const selected = answers[qId] ?? [];
    if (selected.length === 0) return 0;
    const scores = selected.map((v) => q.options.find((o) => o.value === v)?.riskScore ?? 0);
    // For multi-select, take average + bonus for multiple selections
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const bonus = scores.length > 1 ? Math.min(scores.length * 0.5, 2) : 0;
    return Math.min(avg + bonus, 10);
  };

  const ageScore = getScore("age");
  const familyScore = getScore("family_history");
  const lifestyleScore = getScore("lifestyle");
  const dietScore = getScore("diet");
  const stressScore = getScore("stress");
  const sleepScore = getScore("sleep");
  const symptomsScore = getScore("symptoms");
  const checkupsScore = getScore("checkups");
  const smokingScore = getScore("smoking");

  // Weighted categories
  const cardiac = Math.round(((familyScore * 0.35 + ageScore * 0.2 + smokingScore * 0.25 + lifestyleScore * 0.2) / 10) * 100);
  const metabolic = Math.round(((dietScore * 0.35 + symptomsScore * 0.3 + lifestyleScore * 0.2 + ageScore * 0.15) / 10) * 100);
  const neuro = Math.round(((familyScore * 0.3 + ageScore * 0.25 + stressScore * 0.25 + sleepScore * 0.2) / 10) * 100);
  const bone = Math.round(((familyScore * 0.3 + ageScore * 0.3 + lifestyleScore * 0.2 + dietScore * 0.2) / 10) * 100);
  const mental = Math.round(((stressScore * 0.45 + sleepScore * 0.3 + symptomsScore * 0.25) / 10) * 100);

  const overall = Math.round((cardiac * 0.25 + metabolic * 0.25 + neuro * 0.2 + bone * 0.15 + mental * 0.15));

  return {
    overall: Math.min(overall, 98),
    categories: [
      { id: "cardiac", label: "القلب والأوعية", icon: "ri-heart-pulse-line", score: Math.min(cardiac, 98) },
      { id: "metabolic", label: "الأيض والسكري", icon: "ri-scales-line", score: Math.min(metabolic, 98) },
      { id: "neuro", label: "الجهاز العصبي", icon: "ri-brain-line", score: Math.min(neuro, 98) },
      { id: "bone", label: "العظام والمفاصل", icon: "ri-body-scan-line", score: Math.min(bone, 98) },
      { id: "mental", label: "الصحة النفسية", icon: "ri-mental-health-line", score: Math.min(mental, 98) },
    ],
  };
}

// ─── Package recommendation logic ─────────────────────────────────────────────
function recommendPackages(
  overall: number,
  categories: RiskCategory[],
  answers: Record<string, string[]>
): { primary: PackageRecommendation; secondary?: PackageRecommendation } {
  const goal = answers["goal"]?.[0] ?? "risk";
  const hasFamily = (answers["family_history"] ?? []).some((v) => v !== "none");
  const neuroScore = categories.find((c) => c.id === "neuro")?.score ?? 0;
  const metabolicScore = categories.find((c) => c.id === "metabolic")?.score ?? 0;
  const mentalScore = categories.find((c) => c.id === "mental")?.score ?? 0;

  // High overall risk → Precision Medicine
  if (overall >= 65 || (hasFamily && overall >= 45)) {
    return {
      primary: {
        id: "precision-standard",
        name: "منصة الطب الدقيق الشاملة",
        category: "الطب الدقيق",
        price: 2800,
        badge: "الأكثر طلباً",
        icon: "ri-radar-line",
        accentColor: "violet",
        features: ["تقييم عميق 120 دقيقة", "DNA Risk Score شامل (50+ مرض)", "تقييم العمر البيولوجي", "تحاليل أيضية ووظيفية", "خطة وقائية شخصية", "متابعة 6 أشهر"],
        reason: "مستوى مخاطرك يستدعي تقييمًا جينيًا شاملًا مع خطة وقائية مبنية على بيولوجيتك الخاصة",
      },
      secondary: {
        id: "dna-complete",
        name: "باقة DNA الشاملة",
        category: "الجينات والDNA",
        price: 4200,
        badge: "حصري",
        icon: "ri-focus-3-line",
        accentColor: "violet",
        features: ["DNA Risk Score شامل (50+ مرض)", "DNA النفسي", "تقييم العمر البيولوجي", "جلسة تفسير شاملة 90 دقيقة", "خطة وقائية متكاملة", "متابعة 6 أشهر"],
        reason: "للحصول على أعمق صورة جينية ممكنة مع تحليل نفسي وبيولوجي متكامل",
      },
    };
  }

  // High neuro risk → Alzheimer prevention
  if (neuroScore >= 60) {
    return {
      primary: {
        id: "neuro-standard",
        name: "باقة الوقاية من الزهايمر",
        category: "الوقاية العصبية",
        price: 3800,
        badge: "الأكثر طلباً",
        icon: "ri-shield-flash-line",
        accentColor: "violet",
        features: ["تقييم عميق 90 دقيقة", "التقييم الجيني للزهايمر (APOE)", "MRI دماغ متقدم", "تحاليل المؤشرات الحيوية العصبية", "خطة وقائية شخصية", "متابعة سنة"],
        reason: "مؤشرات المخاطر العصبية لديك تستدعي تقييمًا مبكرًا للوقاية من التنكس العصبي",
      },
      secondary: {
        id: "dna-basic",
        name: "DNA Risk Score الأساسي",
        category: "الجينات والDNA",
        price: 1800,
        icon: "ri-dna-line",
        accentColor: "violet",
        features: ["تحليل DNA (20 مرض رئيسي)", "تقرير المخاطر الجينية", "جلسة تفسير النتائج", "توصيات وقائية"],
        reason: "خطوة أولى لفهم استعداداتك الجينية بتكلفة معقولة",
      },
    };
  }

  // High metabolic risk
  if (metabolicScore >= 60) {
    return {
      primary: {
        id: "metabolic-standard",
        name: "باقة السمنة والخلل الأيضي",
        category: "الخلل الأيضي",
        price: 2200,
        badge: "الأكثر طلباً",
        icon: "ri-flask-line",
        accentColor: "orange",
        features: ["تقييم أيضي عميق 120 دقيقة", "تحاليل MASLD المتخصصة", "Fibroscan الكبد", "التقييم الجيني الأيضي", "خطة علاجية شخصية", "متابعة 3 أشهر"],
        reason: "مؤشراتك الأيضية تستدعي تقييمًا عميقًا للخلل الأيضي وخطة علاجية مخصصة",
      },
      secondary: {
        id: "iv-energy",
        name: "باقة الطاقة الخلوية",
        category: "العلاجات الوريدية",
        price: 3200,
        badge: "الأكثر طلباً",
        icon: "ri-flashlight-line",
        accentColor: "cyan",
        features: ["تحاليل وظيفية قبل البدء", "5 جلسات بروتوكول الطاقة الخلوية", "دعم الميتوكوندريا", "مضادات الأكسدة العالية", "متابعة شهر"],
        reason: "لتحسين مستوى الطاقة الخلوية وتسريع التعافي الأيضي",
      },
    };
  }

  // High mental stress
  if (mentalScore >= 60 || goal === "energy") {
    return {
      primary: {
        id: "psych-standard",
        name: "باقة الرعاية النفسية",
        category: "الطب النفسي",
        price: 2500,
        badge: "الأكثر طلباً",
        icon: "ri-brain-line",
        accentColor: "rose",
        features: ["تقييم نفسي عميق 90 دقيقة", "DNA النفسي", "تقييم الوظائف المعرفية", "4 جلسات متابعة", "خطة علاجية شخصية"],
        reason: "مستوى الضغط النفسي لديك يستدعي تقييمًا عميقًا يربط البيولوجي بالنفسي",
      },
      secondary: {
        id: "iv-energy",
        name: "باقة الطاقة الخلوية",
        category: "العلاجات الوريدية",
        price: 3200,
        icon: "ri-flashlight-line",
        accentColor: "cyan",
        features: ["تحاليل وظيفية قبل البدء", "5 جلسات بروتوكول الطاقة الخلوية", "دعم الميتوكوندريا", "مضادات الأكسدة العالية", "متابعة شهر"],
        reason: "لاستعادة الطاقة الخلوية وتحسين مستوى الحيوية",
      },
    };
  }

  // Low-moderate risk → Deep assessment
  return {
    primary: {
      id: "deep-standard",
      name: "التقييم العميق الشامل",
      category: "التقييم العميق",
      price: 1400,
      badge: "الأكثر طلباً",
      icon: "ri-stack-line",
      accentColor: "teal",
      features: ["جلسة تقييم 120 دقيقة", "تحاليل وظيفية وأيضية متقدمة", "قراءة المخاطر الحالية والمستقبلية", "استشارة استشاري أول", "تقرير سريري + خطة شخصية", "متابعة شهر"],
      reason: "نقطة البداية المثالية — تقييم عميق يبني صورة واضحة عن مسارك الصحي",
    },
    secondary: {
      id: "dna-basic",
      name: "DNA Risk Score الأساسي",
      category: "الجينات والDNA",
      price: 1800,
      icon: "ri-dna-line",
      accentColor: "violet",
      features: ["تحليل DNA (20 مرض رئيسي)", "تقرير المخاطر الجينية", "جلسة تفسير النتائج", "توصيات وقائية"],
      reason: "لفهم استعداداتك الجينية وبناء خطة وقائية مبكرة",
    },
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DNASimulatorPage() {
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = Math.round((currentQuestion / questions.length) * 100);

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id] ?? [];

  const canProceed = currentAnswer.length > 0;

  const handleAnswer = (values: string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: values }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setCurrentStep("result");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    } else {
      setCurrentStep("intro");
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setCurrentStep("intro");
  };

  const results = useMemo(() => {
    if (currentStep !== "result") return null;
    return calculateRisks(answers);
  }, [currentStep, answers]);

  const recommendation = useMemo(() => {
    if (!results) return null;
    return recommendPackages(results.overall, results.categories, answers);
  }, [results, answers]);

  useEffect(() => {
    if (currentStep === "quiz") {
      progressRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  return (
    <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-brand-forest-900 via-brand-forest-800 to-brand-forest-700">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://readdy.ai/api/search-image?query=DNA%20double%20helix%20genetic%20code%20abstract%20visualization%20dark%20forest%20green%20background%20glowing%20strands%20precision%20medicine%20genomics%20sophisticated%20scientific&width=1440&height=500&seq=dna-sim-hero-v1&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest-900/40 via-transparent to-brand-forest-900/60" />

        {/* Decorative shapes */}
        <div className="absolute top-8 right-12 opacity-[0.12] pointer-events-none">
          <LotusShape size={100} color="#e8dcc8" />
        </div>
        <div className="absolute bottom-6 left-16 opacity-[0.10] pointer-events-none">
          <StarShape size={72} color="#e8dcc8" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 opacity-[0.06] pointer-events-none">
          <SunShape size={56} color="#e8dcc8" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <i className="ri-dna-line text-brand-cream-300"></i>
            أداة تفاعلية مجانية
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            DNA Risk Score
            <span className="block text-brand-cream-300 text-2xl md:text-3xl mt-1 font-bold">
              اكتشف مستوى مخاطرك الصحية المستقبلية
            </span>
          </h1>
          <p className="text-brand-cream-200 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            10 أسئلة تفاعلية تحلل عوامل الخطر الجينية والبيئية لديك — وتوصيك بالباقة الأنسب لمسارك الصحي
          </p>

          {currentStep === "intro" && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setCurrentStep("quiz")}
                className="bg-brand-cream-300 text-brand-forest-900 font-bold px-8 py-3.5 rounded-full hover:bg-brand-cream-200 transition-colors cursor-pointer text-sm whitespace-nowrap"
              >
                <i className="ri-play-circle-line ml-2 text-base"></i>
                ابدأ التقييم الآن — مجاناً
              </button>
              <Link
                to="/services/dna-risk"
                className="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-sm whitespace-nowrap"
              >
                <i className="ri-information-line ml-2"></i>
                تعرف على DNA Risk Score الحقيقي
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-10">
            {[
              { value: "10", label: "أسئلة فقط" },
              { value: "5", label: "مجالات صحية" },
              { value: "100%", label: "مجاني" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-brand-cream-300 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Cards */}
      {currentStep === "intro" && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-3">كيف يعمل التقييم؟</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              نحلل عوامل الخطر الرئيسية لديك ونبني صورة تقديرية عن مستوى مخاطرك الصحية المستقبلية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: "01",
                icon: "ri-questionnaire-line",
                title: "أجب على 10 أسئلة",
                desc: "أسئلة تغطي التاريخ العائلي، نمط الحياة، الأعراض الحالية، والعوامل البيئية",
                color: "bg-brand-forest-50 text-brand-forest-700",
              },
              {
                step: "02",
                icon: "ri-bar-chart-2-line",
                title: "نحلل مخاطرك",
                desc: "خوارزمية تحليل تقيّم 5 مجالات صحية رئيسية وتحسب مستوى المخاطر الإجمالي",
                color: "bg-violet-50 text-violet-700",
              },
              {
                step: "03",
                icon: "ri-award-line",
                title: "توصية شخصية",
                desc: "نوصيك بالباقة الأنسب لمستوى مخاطرك مع رابط مباشر للحجز",
                color: "bg-amber-50 text-amber-700",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-brand-cream-200 p-6 text-center">
                <div className="text-4xl font-black text-brand-cream-300 mb-3">{item.step}</div>
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mx-auto mb-4 ${item.color.split(" ")[0]}`}>
                  <i className={`${item.icon} text-xl ${item.color.split(" ")[1]}`}></i>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Risk categories preview */}
          <div className="bg-white rounded-2xl border border-brand-cream-200 p-6 mb-10">
            <h3 className="font-black text-gray-900 text-base mb-5 text-center">المجالات الصحية التي نقيّمها</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: "ri-heart-pulse-line", label: "القلب والأوعية", color: "bg-rose-50 text-rose-600" },
                { icon: "ri-scales-line", label: "الأيض والسكري", color: "bg-orange-50 text-orange-600" },
                { icon: "ri-brain-line", label: "الجهاز العصبي", color: "bg-violet-50 text-violet-600" },
                { icon: "ri-body-scan-line", label: "العظام والمفاصل", color: "bg-amber-50 text-amber-600" },
                { icon: "ri-mental-health-line", label: "الصحة النفسية", color: "bg-brand-forest-50 text-brand-forest-600" },
              ].map((cat) => (
                <div key={cat.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-brand-cream-50">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${cat.color.split(" ")[0]}`}>
                    <i className={`${cat.icon} text-lg ${cat.color.split(" ")[1]}`}></i>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentStep("quiz")}
              className="bg-brand-forest-700 hover:bg-brand-forest-800 text-white font-bold px-10 py-4 rounded-full transition-colors cursor-pointer text-base whitespace-nowrap"
            >
              <i className="ri-dna-line ml-2 text-lg"></i>
              ابدأ تقييم DNA Risk Score
            </button>
            <p className="text-xs text-gray-400 mt-3">مجاني تماماً · لا يتطلب تسجيل · نتائج فورية</p>
          </div>
        </section>
      )}

      {/* Quiz */}
      {currentStep === "quiz" && (
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-10">
          {/* Progress */}
          <div ref={progressRef} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-forest-700">
                سؤال {currentQuestion + 1} من {questions.length}
              </span>
              <span className="text-xs text-gray-400">{progress}% مكتمل</span>
            </div>
            <div className="w-full bg-brand-cream-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-brand-forest-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-1 mt-3 justify-center flex-wrap">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentQuestion
                      ? "bg-brand-forest-600 w-4"
                      : i === currentQuestion
                      ? "bg-brand-forest-400 w-6"
                      : "bg-brand-cream-300 w-1.5"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-brand-cream-200 p-6 md:p-8 mb-6">
            <SimulatorQuestion
              question={currentQ}
              selected={currentAnswer}
              onSelect={handleAnswer}
              questionIndex={currentQuestion}
              totalQuestions={questions.length}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-brand-cream-200 hover:bg-brand-cream-50 whitespace-nowrap"
            >
              <i className="ri-arrow-right-line"></i>
              السابق
            </button>

            <div className="text-xs text-gray-400 text-center hidden sm:block">
              {currentQ.multiSelect ? "يمكنك اختيار أكثر من إجابة" : "اختر إجابة واحدة"}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                canProceed
                  ? "bg-brand-forest-700 hover:bg-brand-forest-800 text-white"
                  : "bg-brand-cream-200 text-brand-cream-400 cursor-not-allowed"
              }`}
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <i className="ri-bar-chart-2-line"></i>
                  عرض النتائج
                </>
              ) : (
                <>
                  التالي
                  <i className="ri-arrow-left-line"></i>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Result */}
      {currentStep === "result" && results && recommendation && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-forest-100 text-brand-forest-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              <i className="ri-check-double-line"></i>
              تم تحليل إجاباتك
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">نتائج تقييم DNA Risk Score</h2>
            <p className="text-gray-500 text-sm">بناءً على إجاباتك، هذا تقييمنا التقديري لمستوى مخاطرك الصحية</p>
          </div>

          <SimulatorResult
            overallScore={results.overall}
            riskCategories={results.categories}
            primaryPackage={recommendation.primary}
            secondaryPackage={recommendation.secondary}
            onRetake={handleRetake}
            answers={answers}
          />
        </section>
      )}

      {/* Bottom CTA — only on intro */}
      {currentStep === "intro" && (
        <section className="py-12 bg-brand-forest-900 relative overflow-hidden">
          <div className="absolute top-4 right-10 opacity-[0.10] pointer-events-none">
            <StarShape size={80} color="#e8dcc8" />
          </div>
          <div className="absolute bottom-4 left-10 opacity-[0.08] pointer-events-none">
            <LotusShape size={70} color="#e8dcc8" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl font-black text-white mb-3">هل تريد تقييمًا جينيًا حقيقيًا؟</h2>
            <p className="text-brand-cream-200 text-sm mb-7 leading-relaxed">
              DNA Risk Score الحقيقي يتطلب تحليلًا جينيًا مخبريًا دقيقًا — احجز جلسة مع استشاريينا لبدء رحلتك
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/booking"
                className="bg-brand-cream-300 text-brand-forest-900 font-bold px-7 py-3 rounded-full hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer text-sm"
              >
                <i className="ri-calendar-check-line ml-2"></i>
                احجز جلسة DNA Risk Score
              </Link>
              <Link
                to="/services/dna-risk"
                className="border-2 border-white/40 text-white font-bold px-7 py-3 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-sm"
              >
                <i className="ri-information-line ml-2"></i>
                تعرف على الخدمة
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
