export interface DNAEvaluation {
  id: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  age: string;
  overallScore: number;
  riskLevel: "منخفض" | "متوسط" | "مرتفع" | "مرتفع جداً";
  categories: {
    cardiac: number;
    metabolic: number;
    neuro: number;
    bone: number;
    mental: number;
  };
  recommendedPackage: string;
  goal: string;
  familyHistory: string[];
  lifestyle: string;
  diet: string;
  stress: string;
  sleep: string;
  symptoms: string[];
  checkups: string;
  smoking: string;
  createdAt: string;
  status: "new" | "viewed" | "contacted" | "booked";
  notes: string;
}

export const dnaEvaluations: DNAEvaluation[] = [
  {
    id: "DNA-2026-001",
    userName: "أحمد محمد العتيبي",
    userPhone: "+966 50 123 4567",
    userEmail: "ahmed.otaibi@email.com",
    age: "45 – 50 سنة",
    overallScore: 72,
    riskLevel: "مرتفع",
    categories: { cardiac: 78, metabolic: 65, neuro: 55, bone: 45, mental: 70 },
    recommendedPackage: "منصة الطب الدقيق الشاملة",
    goal: "فهم مخاطري الصحية المستقبلية",
    familyHistory: ["أمراض القلب", "السكري"],
    lifestyle: "خامل نسبياً",
    diet: "غير صحي",
    stress: "مرتفع",
    sleep: "متقطع",
    symptoms: ["تعب مزمن", "ضغط دم مرتفع"],
    checkups: "منذ أكثر من سنتين",
    smoking: "مدخن سابق",
    createdAt: "2026-04-24T10:30:00",
    status: "new",
    notes: "",
  },
  {
    id: "DNA-2026-002",
    userName: "سارة عبدالله الفهد",
    userPhone: "+966 55 987 6543",
    userEmail: "sara.fahd@email.com",
    age: "30 – 40 سنة",
    overallScore: 38,
    riskLevel: "متوسط",
    categories: { cardiac: 30, metabolic: 45, neuro: 35, bone: 25, mental: 50 },
    recommendedPackage: "التقييم العميق الشامل",
    goal: "تحسين طاقتي ومستوى حيويتي",
    familyHistory: ["لا يوجد"],
    lifestyle: "نشيط نسبياً",
    diet: "متوسط",
    stress: "متوسط",
    sleep: "جيد",
    symptoms: ["زيادة في الوزن"],
    checkups: "خلال السنة الماضية",
    smoking: "لم أدخن قط",
    createdAt: "2026-04-24T09:15:00",
    status: "viewed",
    notes: "اتصلنا وحددنا موعد للتقييم العميق",
  },
  {
    id: "DNA-2026-003",
    userName: "خالد سعد الحربي",
    userPhone: "+966 54 456 7890",
    userEmail: "khaled.harbi@email.com",
    age: "50 – 60 سنة",
    overallScore: 85,
    riskLevel: "مرتفع جداً",
    categories: { cardiac: 90, metabolic: 80, neuro: 75, bone: 60, mental: 85 },
    recommendedPackage: "باقة الوقاية من الزهايمر",
    goal: "إدارة حالة صحية موجودة",
    familyHistory: ["الزهايمر", "أمراض القلب", "السرطان"],
    lifestyle: "خامل تماماً",
    diet: "غير صحي",
    stress: "مرتفع جداً",
    sleep: "سيء",
    symptoms: ["تعب مزمن", "ضغط دم مرتفع", "سكر دم مرتفع", "آلام مفاصل"],
    checkups: "لم أجرِ فحصاً شاملاً",
    smoking: "مدخن حالي — علبة أو أكثر",
    createdAt: "2026-04-23T16:45:00",
    status: "contacted",
    notes: "حالة عالية الخطورة — يحتاج متابعة عاجلة",
  },
  {
    id: "DNA-2026-004",
    userName: "نورة سلمان الدوسري",
    userPhone: "+966 56 789 0123",
    userEmail: "nora.dosari@email.com",
    age: "أقل من 30 سنة",
    overallScore: 22,
    riskLevel: "منخفض",
    categories: { cardiac: 15, metabolic: 20, neuro: 18, bone: 25, mental: 30 },
    recommendedPackage: "DNA Risk Score الأساسي",
    goal: "الوقاية قبل ظهور الأعراض",
    familyHistory: ["لا يوجد"],
    lifestyle: "نشيط جداً",
    diet: "صحي",
    stress: "منخفض",
    sleep: "ممتاز",
    symptoms: ["لا أعاني من أعراض"],
    checkups: "خلال الـ 6 أشهر الماضية",
    smoking: "لم أدخن قط",
    createdAt: "2026-04-23T14:20:00",
    status: "booked",
    notes: "حجزت باقة DNA الأساسي — موعد 28 أبريل",
  },
  {
    id: "DNA-2026-005",
    userName: "فهد مبارك الشمري",
    userPhone: "+966 53 234 5678",
    userEmail: "fahd.shammari@email.com",
    age: "40 – 50 سنة",
    overallScore: 58,
    riskLevel: "مرتفع",
    categories: { cardiac: 65, metabolic: 70, neuro: 45, bone: 40, mental: 55 },
    recommendedPackage: "باقة السمنة والخلل الأيضي",
    goal: "إدارة حالة صحية موجودة",
    familyHistory: ["السكري", "هشاشة العظام"],
    lifestyle: "خامل نسبياً",
    diet: "غير منتظم",
    stress: "مرتفع",
    sleep: "متقطع",
    symptoms: ["زيادة في الوزن", "سكر دم مرتفع"],
    checkups: "منذ أكثر من سنتين",
    smoking: "مدخن سابق",
    createdAt: "2026-04-23T11:00:00",
    status: "new",
    notes: "",
  },
  {
    id: "DNA-2026-006",
    userName: "لمياء راشد القحطاني",
    userPhone: "+966 59 876 5432",
    userEmail: "lamia.qahtani@email.com",
    age: "30 – 40 سنة",
    overallScore: 48,
    riskLevel: "متوسط",
    categories: { cardiac: 35, metabolic: 50, neuro: 40, bone: 30, mental: 65 },
    recommendedPackage: "باقة الرعاية النفسية",
    goal: "تحسين طاقتي ومستوى حيويتي",
    familyHistory: ["لا يوجد"],
    lifestyle: "نشيط نسبياً",
    diet: "متوسط",
    stress: "مرتفع جداً",
    sleep: "سيء",
    symptoms: ["تعب مزمن"],
    checkups: "خلال السنة الماضية",
    smoking: "لم أدخن قط",
    createdAt: "2026-04-22T18:30:00",
    status: "viewed",
    notes: "ضغط نفسي مزمن — يحتاج تقييم نفسي عميق",
  },
  {
    id: "DNA-2026-007",
    userName: "عبدالرحمن طلال السبيعي",
    userPhone: "+966 51 345 6789",
    userEmail: "abdulrahman.subei@email.com",
    age: "50 – 60 سنة",
    overallScore: 68,
    riskLevel: "مرتفع",
    categories: { cardiac: 75, metabolic: 60, neuro: 50, bone: 55, mental: 60 },
    recommendedPackage: "منصة الطب الدقيق الشاملة",
    goal: "فهم مخاطري الصحية المستقبلية",
    familyHistory: ["أمراض القلب"],
    lifestyle: "خامل نسبياً",
    diet: "غير صحي",
    stress: "مرتفع",
    sleep: "متقطع",
    symptoms: ["ضغط دم مرتفع"],
    checkups: "خلال السنة الماضية",
    smoking: "مدخن حالي — أقل من علبة",
    createdAt: "2026-04-22T15:10:00",
    status: "new",
    notes: "",
  },
  {
    id: "DNA-2026-008",
    userName: "مها فهد المطيري",
    userPhone: "+966 58 654 3210",
    userEmail: "maha.mutairi@email.com",
    age: "أقل من 30 سنة",
    overallScore: 28,
    riskLevel: "منخفض",
    categories: { cardiac: 20, metabolic: 25, neuro: 22, bone: 30, mental: 35 },
    recommendedPackage: "التقييم العميق الشامل",
    goal: "الوقاية قبل ظهور الأعراض",
    familyHistory: ["لا يوجد"],
    lifestyle: "نشيط جداً",
    diet: "صحي",
    stress: "منخفض",
    sleep: "ممتاز",
    symptoms: ["لا أعاني من أعراض"],
    checkups: "خلال الـ 6 أشهر الماضية",
    smoking: "لم أدخن قط",
    createdAt: "2026-04-22T10:00:00",
    status: "booked",
    notes: "حجزت التقييم العميق — موعد 30 أبريل",
  },
];

export const dnaStats = {
  totalEvaluations: 156,
  todayEvaluations: 8,
  thisWeekEvaluations: 34,
  highRiskCount: 42,
  mediumRiskCount: 68,
  lowRiskCount: 46,
  conversionRate: 28,
  avgScore: 51,
};

export const riskDistribution = [
  { level: "منخفض", count: 46, color: "#2E4E45", percentage: 29.5 },
  { level: "متوسط", count: 68, color: "#d97706", percentage: 43.6 },
  { level: "مرتفع", count: 32, color: "#ea580c", percentage: 20.5 },
  { level: "مرتفع جداً", count: 10, color: "#dc2626", percentage: 6.4 },
];

export const packageRecommendations = [
  { package: "منصة الطب الدقيق الشاملة", count: 48, percentage: 30.8 },
  { package: "التقييم العميق الشامل", count: 38, percentage: 24.4 },
  { package: "باقة الوقاية من الزهايمر", count: 22, percentage: 14.1 },
  { package: "باقة السمنة والخلل الأيضي", count: 18, percentage: 11.5 },
  { package: "باقة الرعاية النفسية", count: 15, percentage: 9.6 },
  { package: "DNA Risk Score الأساسي", count: 15, percentage: 9.6 },
];

export const dailyEvaluations = [
  { date: "18 أبريل", count: 12 },
  { date: "19 أبريل", count: 15 },
  { date: "20 أبريل", count: 8 },
  { date: "21 أبريل", count: 20 },
  { date: "22 أبريل", count: 18 },
  { date: "23 أبريل", count: 22 },
  { date: "24 أبريل", count: 8 },
];