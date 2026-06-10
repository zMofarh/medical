import { useState, useCallback } from "react";

export interface AIReportData {
  overallScore: number;
  riskLevel: string;
  riskCategories: { id: string; label: string; score: number }[];
  answers: Record<string, string[]>;
  primaryPackage: string;
  secondaryPackage?: string;
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

function getApiKey(): string | null {
  return localStorage.getItem("openai_api_key");
}

function buildPrompt(data: AIReportData): string {
  const categoriesText = data.riskCategories
    .map((c) => `- ${c.label}: ${c.score}%`)
    .join("\n");

  const answersText = Object.entries(data.answers)
    .map(([key, values]) => {
      const labelMap: Record<string, string> = {
        age: "العمر",
        family_history: "التاريخ العائلي",
        lifestyle: "نمط الحياة",
        diet: "النظام الغذائي",
        stress: "مستوى الضغط النفسي",
        sleep: "جودة النوم",
        symptoms: "الأعراض الحالية",
        checkups: "الفحوصات الدورية",
        smoking: "التدخين",
        goal: "الهدف من التقييم",
      };
      return `- ${labelMap[key] || key}: ${values.join(", ")}`;
    })
    .join("\n");

  return `أنت استشاري طبي متخصص في الطب الدقيق والطب الوقائي. قم بتحليل تقييم DNA Risk Score التالي واكتب تقريرًا طبيًا شخصيًا باللغة العربية الفصحى.

## بيانات المريض:

**مستوى المخاطر الإجمالي:** ${data.overallScore}% (${data.riskLevel})

**تفصيل المخاطر حسب المجال:**
${categoriesText}

**إجابات المستخدم:**
${answersText}

**الباقة الموصى بها:** ${data.primaryPackage}
${data.secondaryPackage ? `**الباقة الثانوية:** ${data.secondaryPackage}` : ""}

## المطلوب:

اكتب تقريرًا طبيًا شخصيًا يتكون من:

1. **ملخص تنفيذي** (فقرة واحدة): وصف عام لحالة المستخدم وما يعنيه مستوى المخاطر
2. **تحليل المخاطر الرئيسية**: شرح 2-3 مخاطر الأكثر إلحاحًا مع تفسير سببها
3. **التوصيات الطبية**: 4-6 توصيات عملية وقابلة للتنفيذ
4. **الخطوات التالية**: ما يجب على المستخدم فعله فورًا وفي المدى القصير
5. **مستوى الإلحاح**: قيّم مدى ضرورة التدخل السريع

اكتب بأسلوب:
- طبي دقيق لكن مفهوم للمريض العادي
- داعم ومحفز (لا تخويفي)
- يؤكد أن الجينات ليست مصيرًا وأن التدخل المبكر يغير المسار
- استخدم "أنت" للمخاطبة المباشرة

أرجع النتيجة بصيغة JSON فقط بهذا الهيكل:
{
  "report": "النص الكامل للتقرير مع فقرات منفصلة",
  "recommendations": ["توصية 1", "توصية 2", ...],
  "urgencyLevel": "low|medium|high|critical",
  "followUpActions": ["خطوة 1", "خطوة 2", ...]
}`;
}

export function useAIReport(): UseAIReportReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AIReportResult | null>(null);

  const generateReport = useCallback(async (data: AIReportData): Promise<AIReportResult> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("لم يتم إعداد مفتاح OpenAI API. يرجى إدخال المفتاح في إعدادات الموقع.");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "أنت استشاري طبي متخصص في الطب الدقيق والطب الوقائي. تكتب تقارير طبية شخصية بالعربية الفصحى. دقيق، داعم، ومحفز.",
            },
            {
              role: "user",
              content: buildPrompt(data),
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `خطأ في الاتصال: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content || "";

      // Extract JSON from response
      let parsed: AIReportResult;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("لم يتم العثور على JSON في الرد");
        }
      } catch {
        // Fallback: create structured report from text
        parsed = {
          report: content,
          recommendations: [
            "احجز جلسة تقييم عميق مع استشاري متخصص",
            "ابدأ بتغيير نمط الحياة تدريجياً",
            "تابع الفحوصات الدورية بانتظام",
          ],
          urgencyLevel: data.overallScore >= 75 ? "critical" : data.overallScore >= 55 ? "high" : data.overallScore >= 30 ? "medium" : "low",
          followUpActions: [
            "مراجعة التقرير مع طبيبك",
            "تحديد موعد للتقييم العميق",
          ],
        };
      }

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