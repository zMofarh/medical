import { useState, useCallback } from "react";
import { API_BASE_URL } from "../api/config";

export interface AIReportData {
  overallScore: number;
  riskLevel: string;
  riskCategories: { id: string; label: string; score: number }[];
  answers: Record<string, string[]>;
  primaryPackage: string;
  secondaryPackage?: string;
  patientName?: string;
  patientAge?: number;
  patientEmail?: string;
  patientPhone?: string;
}

export interface AIReportResult {
  report: string;
  recommendations: string[];
  urgencyLevel: "low" | "medium" | "high" | "critical";
  followUpActions: string[];
}

interface UseAIReportReturn {
  generateReport: (data: AIReportData) => Promise<AIReportResult>;
  loading: boolean;
  error: string | null;
  report: AIReportResult | null;
}

export function useAIReport(): UseAIReportReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AIReportResult | null>(null);

  const generateReport = useCallback(async (data: AIReportData): Promise<AIReportResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai-reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `خطأ في الاتصال: ${response.status}`);
      }

      const parsed: AIReportResult = await response.json();
      setReport(parsed);
      return parsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateReport, loading, error, report };
}