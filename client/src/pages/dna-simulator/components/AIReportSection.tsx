import { useState, useEffect } from "react";
import { useAIReport, type AIReportData } from "@/hooks/useAIReport";

interface AIReportSectionProps {
  data: AIReportData;
}

const urgencyConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  low: { label: "إلحاح منخفض", color: "text-brand-forest-700", bg: "bg-brand-forest-50", icon: "ri-shield-check-line" },
  medium: { label: "إلحاح متوسط", color: "text-amber-700", bg: "bg-amber-50", icon: "ri-alert-line" },
  high: { label: "إلحاح مرتفع", color: "text-orange-700", bg: "bg-orange-50", icon: "ri-error-warning-line" },
  critical: { label: "إلحاح حرج", color: "text-red-700", bg: "bg-red-50", icon: "ri-fire-line" },
};

export default function AIReportSection({ data }: AIReportSectionProps) {
  const { generateReport, loading, error, report } = useAIReport();
  const [showReport, setShowReport] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    const key = localStorage.getItem("openai_api_key");
    setApiKeyMissing(!key);
  }, []);

  const handleGenerate = async () => {
    if (apiKeyMissing && !apiKeyInput.trim()) return;
    if (apiKeyInput.trim()) {
      localStorage.setItem("openai_api_key", apiKeyInput.trim());
      setApiKeyMissing(false);
    }
    try {
      await generateReport(data);
      setShowReport(true);
    } catch {
      // error handled in hook
    }
  };

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("openai_api_key", apiKeyInput.trim());
      setApiKeyMissing(false);
    }
  };

  if (apiKeyMissing) {
    return (
      <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-violet-100 rounded-xl">
            <i className="ri-brain-line text-violet-700 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">التقرير الذكي بالذكاء الاصطناعي</h3>
            <p className="text-xs text-gray-500">تقرير طبي شخصي مكتوب بالذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <i className="ri-key-line text-amber-600 mt-0.5"></i>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">مطلوب مفتاح OpenAI API</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                لإنشاء التقارير الذكية، أدخل مفتاح OpenAI API الخاص بك. المفتاح يُحفظ في متصفحك فقط ولا يُرسل لأي خادم.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="password"
            placeholder="sk-..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-forest-200"
          />
          <button
            onClick={handleSaveKey}
            disabled={!apiKeyInput.trim()}
            className="px-5 py-2.5 bg-brand-forest-700 text-white text-sm font-bold rounded-xl hover:bg-brand-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            حفظ المفتاح
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          <i className="ri-lock-line ml-1"></i>
          المفتاح يُحفظ محلياً في متصفحك فقط
        </p>
      </div>
    );
  }

  if (!showReport && !report) {
    return (
      <div className="bg-white rounded-2xl border border-brand-cream-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-violet-100 rounded-xl">
            <i className="ri-brain-line text-violet-700 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">التقرير الذكي بالذكاء الاصطناعي</h3>
            <p className="text-xs text-gray-500">احصل على تقرير طبي شخصي مفصل مكتوب بالذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <i className="ri-sparkling-line text-violet-600 mt-0.5"></i>
            <div>
              <p className="text-sm font-semibold text-violet-800 mb-1">ما يتضمنه التقرير:</p>
              <ul className="text-xs text-violet-700 space-y-1">
                <li>• ملخص تنفيذي لحالتك الصحية</li>
                <li>• تحليل المخاطر الرئيسية مع تفسير</li>
                <li>• توصيات طبية عملية مخصصة</li>
                <li>• خطوات فورية للمتابعة</li>
                <li>• تقييم مستوى الإلحاح</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70 cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-loader-4-line animate-spin"></i>
              جاري كتابة التقرير الذكي...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-sparkling-line"></i>
              إنشاء التقرير الذكي
            </span>
          )}
        </button>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700 flex items-center gap-1.5">
              <i className="ri-error-warning-line"></i>
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-brand-cream-200 p-8 text-center">
        <div className="w-12 h-12 flex items-center justify-center bg-violet-100 rounded-full mx-auto mb-3">
          <i className="ri-brain-line text-violet-700 text-xl animate-pulse"></i>
        </div>
        <p className="font-bold text-gray-900 mb-1">جاري تحليل بياناتك...</p>
        <p className="text-xs text-gray-500">الذكاء الاصطناعي يكتب تقريرك الطبي الشخصي</p>
        <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
          <div className="h-full bg-violet-500 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  if (!report) return null;

  const urgency = urgencyConfig[report.urgencyLevel] || urgencyConfig.medium;

  return (
    <div className="bg-white rounded-2xl border border-brand-cream-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-violet-100 rounded-xl">
              <i className="ri-brain-line text-violet-700 text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">التقرير الطبي الذكي</h3>
              <p className="text-xs text-gray-500">مكتوب بالذكاء الاصطناعي بناءً على إجاباتك</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${urgency.bg} ${urgency.color}`}>
            <i className={urgency.icon}></i>
            {urgency.label}
          </span>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-5 space-y-5">
        {/* Main Report Text */}
        <div className="prose prose-sm max-w-none">
          {report.report.split("\n\n").map((paragraph, i) => {
            const isHeading = paragraph.startsWith("##") || paragraph.startsWith("**");
            if (isHeading) {
              return (
                <h4 key={i} className="font-bold text-gray-900 text-sm mt-4 mb-2">
                  {paragraph.replace(/[#*]/g, "").trim()}
                </h4>
              );
            }
            return (
              <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="bg-brand-forest-50 rounded-xl p-4 border border-brand-forest-200">
            <h4 className="font-bold text-brand-forest-900 text-sm mb-3 flex items-center gap-2">
              <i className="ri-lightbulb-line text-brand-forest-600"></i>
              التوصيات الطبية
            </h4>
            <ul className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-brand-forest-800">
                  <div className="w-5 h-5 flex items-center justify-center bg-brand-forest-200 rounded-full flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-brand-forest-700">{i + 1}</span>
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Actions */}
        {report.followUpActions.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-2">
              <i className="ri-calendar-check-line text-amber-600"></i>
              الخطوات التالية
            </h4>
            <ul className="space-y-2">
              {report.followUpActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <i className="ri-arrow-left-circle-line text-amber-600 mt-0.5 flex-shrink-0"></i>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          <i className="ri-information-line ml-1"></i>
          هذا التقرير مولد بالذكاء الاصطناعي ولا يُغني عن استشارة طبية
        </p>
        <button
          onClick={() => {
            setShowReport(false);
            handleGenerate();
          }}
          className="text-xs font-semibold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
        >
          <i className="ri-refresh-line ml-1"></i>
          إعادة إنشاء
        </button>
      </div>
    </div>
  );
}