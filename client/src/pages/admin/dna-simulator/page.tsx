import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import DNAStatsCards from "./components/DNAStatsCards";
import RiskDistributionChart from "./components/RiskDistributionChart";
import PackageRecommendationsChart from "./components/PackageRecommendationsChart";
import DailyEvaluationsChart from "./components/DailyEvaluationsChart";
import EvaluationsList from "./components/EvaluationsList";
import EvaluationDetailModal from "./components/EvaluationDetailModal";
import {
  dnaEvaluations,
  dnaStats,
  riskDistribution,
  packageRecommendations,
  dailyEvaluations,
} from "@/mocks/dnaSimulatorData";
import type { DNAEvaluation } from "@/mocks/dnaSimulatorData";

export default function DNASimulatorAdminPage() {
  const navigate = useNavigate();
  const [selectedEvaluation, setSelectedEvaluation] = useState<DNAEvaluation | null>(null);
  const [evaluations, setEvaluations] = useState<DNAEvaluation[]>(dnaEvaluations);

  const handleStatusChange = (id: string, status: string) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: status as DNAEvaluation["status"] } : e))
    );
    if (selectedEvaluation?.id === id) {
      setSelectedEvaluation((prev) => (prev ? { ...prev, status: status as DNAEvaluation["status"] } : null));
    }
  };

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

        {/* Stats Cards */}
        <DNAStatsCards stats={dnaStats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <RiskDistributionChart data={riskDistribution} />
          </div>
          <div className="lg:col-span-1">
            <PackageRecommendationsChart data={packageRecommendations} />
          </div>
          <div className="lg:col-span-1">
            <DailyEvaluationsChart data={dailyEvaluations} />
          </div>
        </div>

        {/* Evaluations List */}
        <EvaluationsList
          evaluations={evaluations}
          onViewDetail={setSelectedEvaluation}
        />
      </div>

      {/* Detail Modal */}
      {selectedEvaluation && (
        <EvaluationDetailModal
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminLayout>
  );
}