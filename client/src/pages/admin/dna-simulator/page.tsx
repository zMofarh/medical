import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import DNAStatsCards from "./components/DNAStatsCards";
import RiskDistributionChart from "./components/RiskDistributionChart";
import PackageRecommendationsChart from "./components/PackageRecommendationsChart";
import DailyEvaluationsChart from "./components/DailyEvaluationsChart";
import EvaluationsList from "./components/EvaluationsList";
import EvaluationDetailModal from "./components/EvaluationDetailModal";
import { getDNAEvaluations, updateDNAEvaluation } from "@/api/dna_config";
import {
  dnaEvaluations as mockEvaluations,
  dnaStats as mockStats,
  riskDistribution as mockRiskDistribution,
  packageRecommendations as mockPackageRecommendations,
  dailyEvaluations as mockDailyEvaluations,
} from "@/mocks/dnaSimulatorData";
import type { DNAEvaluation } from "@/mocks/dnaSimulatorData";

// Adapter function to map API response to frontend DNAEvaluation model
function adaptEvaluationToFrontend(res: any): DNAEvaluation {
  const categoriesList = res.report_content?.riskCategories || [];
  const categories = {
    cardiac: categoriesList.find((c: any) => c.id === "cardiac")?.score || 0,
    metabolic: categoriesList.find((c: any) => c.id === "metabolic")?.score || 0,
    neuro: categoriesList.find((c: any) => c.id === "neuro")?.score || 0,
    bone: categoriesList.find((c: any) => c.id === "bone")?.score || 0,
    mental: categoriesList.find((c: any) => c.id === "mental")?.score || 0,
  };

  return {
    id: res.id,
    userName: res.patient_name || "مريض مجهول",
    userPhone: res.patient_phone || "",
    userEmail: res.patient_email || "",
    age: res.patient_age?.toString() || res.answers?.age?.[0] || "",
    overallScore: res.overall_score || 0,
    riskLevel: res.risk_level as any,
    categories,
    recommendedPackage: res.report_content?.primaryPackage || "",
    goal: res.answers?.goal?.[0] || "",
    familyHistory: res.answers?.family_history || [],
    lifestyle: res.answers?.lifestyle?.[0] || "",
    diet: res.answers?.diet?.[0] || "",
    stress: res.answers?.stress?.[0] || "",
    sleep: res.answers?.sleep?.[0] || "",
    symptoms: res.answers?.symptoms || [],
    checkups: res.answers?.checkups?.[0] || "",
    smoking: res.answers?.smoking?.[0] || "",
    createdAt: res.created_at,
    status: res.status as any,
    notes: res.notes || "",
  };
}

// Stats computations
function computeStats(evs: DNAEvaluation[]) {
  const total = evs.length;
  const today = evs.filter(e => {
    const d = new Date(e.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;
  
  const highRisk = evs.filter(e => e.riskLevel === "مرتفع" || e.riskLevel === "مرتفع جداً").length;
  const mediumRisk = evs.filter(e => e.riskLevel === "متوسط").length;
  const lowRisk = evs.filter(e => e.riskLevel === "منخفض").length;
  const booked = evs.filter(e => e.status === "booked").length;
  const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0;
  const avgScore = total > 0 ? Math.round(evs.reduce((acc, curr) => acc + curr.overallScore, 0) / total) : 0;
  
  return {
    totalEvaluations: total,
    todayEvaluations: today,
    thisWeekEvaluations: evs.filter(e => {
      const d = new Date(e.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return d >= oneWeekAgo;
    }).length,
    highRiskCount: highRisk,
    mediumRiskCount: mediumRisk,
    lowRiskCount: lowRisk,
    conversionRate,
    avgScore,
  };
}

function computeRiskDistribution(evs: DNAEvaluation[]) {
  const total = evs.length;
  const levels = ["منخفض", "متوسط", "مرتفع", "مرتفع جداً"];
  const colors = ["#2E4E45", "#d97706", "#ea580c", "#dc2626"];
  
  return levels.map((lvl, idx) => {
    const count = evs.filter(e => e.riskLevel === lvl).length;
    const percentage = total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0;
    return {
      level: lvl,
      count,
      color: colors[idx],
      percentage
    };
  });
}

function computePackageRecommendations(evs: DNAEvaluation[]) {
  const total = evs.length;
  const pkgsMap: Record<string, number> = {};
  evs.forEach(e => {
    if (e.recommendedPackage) {
      pkgsMap[e.recommendedPackage] = (pkgsMap[e.recommendedPackage] || 0) + 1;
    }
  });
  
  return Object.entries(pkgsMap)
    .map(([pkg, count]) => ({
      package: pkg,
      count,
      percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);
}

function computeDailyEvaluations(evs: DNAEvaluation[]) {
  const dailyMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("ar-SA", { day: "numeric", month: "long" });
    dailyMap[label] = 0;
  }
  
  evs.forEach(e => {
    const d = new Date(e.createdAt);
    const label = d.toLocaleDateString("ar-SA", { day: "numeric", month: "long" });
    if (label in dailyMap) {
      dailyMap[label]++;
    }
  });
  
  return Object.entries(dailyMap).map(([date, count]) => ({
    date,
    count
  }));
}

export default function DNASimulatorAdminPage() {
  const navigate = useNavigate();
  const [selectedEvaluation, setSelectedEvaluation] = useState<DNAEvaluation | null>(null);
  const [evaluations, setEvaluations] = useState<DNAEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token") || "";
      const raw = await getDNAEvaluations(token);
      if (raw && raw.length > 0) {
        const adapted = raw.map(adaptEvaluationToFrontend);
        setEvaluations(adapted);
      } else {
        // Fallback to mocks if no db evaluations exist yet
        setEvaluations(mockEvaluations);
      }
    } catch (err) {
      console.error("Failed to fetch DNA evaluations:", err);
      // Fallback
      setEvaluations(mockEvaluations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleStatusChange = async (id: string, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem("access_token") || "";
      // Only call API if it is a real DB evaluation (UUID format)
      if (id.length > 15) {
        await updateDNAEvaluation(id, { status, notes }, token);
      }
    } catch (err) {
      console.error("Failed to update status in backend:", err);
    }

    setEvaluations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: status as DNAEvaluation["status"], notes: notes ?? e.notes } : e))
    );
    if (selectedEvaluation?.id === id) {
      setSelectedEvaluation((prev) => (prev ? { ...prev, status: status as DNAEvaluation["status"], notes: notes ?? prev.notes } : null));
    }
  };

  // Compute metrics dynamically or use mock fallbacks
  const hasRealData = evaluations.length > 0 && evaluations !== mockEvaluations;
  const stats = hasRealData ? computeStats(evaluations) : mockStats;
  const riskDist = hasRealData ? computeRiskDistribution(evaluations) : mockRiskDistribution;
  const pkgRecs = hasRealData ? computePackageRecommendations(evaluations) : mockPackageRecommendations;
  const dailyEvs = hasRealData ? computeDailyEvaluations(evaluations) : mockDailyEvaluations;

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">DNA Risk Score Simulator</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              إدارة تقييمات المخاطر الصحية وتحليل النتائج
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/dna-simulator"
              onClick={(e) => {
                e.preventDefault();
                navigate("/dna-simulator");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-forest-700 bg-brand-forest-50 rounded-lg hover:bg-brand-forest-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line"></i>
              عرض الصفحة العامة
            </a>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-brand-forest"></i>
            <p className="text-sm text-gray-500 mt-2">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <DNAStatsCards stats={stats} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1">
                <RiskDistributionChart data={riskDist} />
              </div>
              <div className="lg:col-span-1">
                <PackageRecommendationsChart data={pkgRecs} />
              </div>
              <div className="lg:col-span-1">
                <DailyEvaluationsChart data={dailyEvs} />
              </div>
            </div>

            {/* Evaluations List */}
            <EvaluationsList
              evaluations={evaluations}
              onViewDetail={setSelectedEvaluation}
            />
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEvaluation && (
        <EvaluationDetailModal
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
          onStatusChange={(id, status) => handleStatusChange(id, status)}
          onSaveNotes={(notes) => handleStatusChange(selectedEvaluation.id, selectedEvaluation.status, notes)}
        />
      )}
    </AdminLayout>
  );
}