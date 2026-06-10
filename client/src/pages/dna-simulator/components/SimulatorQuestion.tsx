import { useEffect, useRef } from "react";

export interface QuestionOption {
  label: string;
  value: string;
  riskScore: number; // 0–10
  icon?: string;
}

export interface Question {
  id: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  question: string;
  subtitle?: string;
  options: QuestionOption[];
  multiSelect?: boolean;
}

interface SimulatorQuestionProps {
  question: Question;
  selected: string[];
  onSelect: (values: string[]) => void;
  questionIndex: number;
  totalQuestions: number;
}

export default function SimulatorQuestion({
  question,
  selected,
  onSelect,
  questionIndex,
  totalQuestions,
}: SimulatorQuestionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [question.id]);

  const handleToggle = (value: string) => {
    if (question.multiSelect) {
      if (selected.includes(value)) {
        onSelect(selected.filter((v) => v !== value));
      } else {
        onSelect([...selected, value]);
      }
    } else {
      onSelect([value]);
    }
  };

  const colorMap: Record<string, { bg: string; border: string; text: string; selectedBg: string; selectedBorder: string; selectedText: string; badge: string }> = {
    teal:   { bg: "bg-brand-forest-50",  border: "border-brand-cream-200", text: "text-brand-forest-700", selectedBg: "bg-brand-forest-700", selectedBorder: "border-brand-forest-700", selectedText: "text-white", badge: "bg-brand-forest-100 text-brand-forest-700" },
    violet: { bg: "bg-violet-50",  border: "border-violet-200", text: "text-violet-700", selectedBg: "bg-violet-600", selectedBorder: "border-violet-600", selectedText: "text-white", badge: "bg-violet-100 text-violet-700" },
    rose:   { bg: "bg-rose-50",    border: "border-rose-200",   text: "text-rose-700",   selectedBg: "bg-rose-600",   selectedBorder: "border-rose-600",   selectedText: "text-white", badge: "bg-rose-100 text-rose-700" },
    orange: { bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700", selectedBg: "bg-orange-500", selectedBorder: "border-orange-500", selectedText: "text-white", badge: "bg-orange-100 text-orange-700" },
    amber:  { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700",  selectedBg: "bg-amber-500",  selectedBorder: "border-amber-500",  selectedText: "text-white", badge: "bg-amber-100 text-amber-700" },
    cyan:   { bg: "bg-cyan-50",    border: "border-cyan-200",   text: "text-cyan-700",   selectedBg: "bg-cyan-600",   selectedBorder: "border-cyan-600",   selectedText: "text-white", badge: "bg-cyan-100 text-cyan-700" },
  };

  const c = colorMap[question.categoryColor] ?? colorMap.teal;

  return (
    <div ref={containerRef} className="animate-fadeIn">
      {/* Category badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${c.badge}`}>
          <i className={`${question.categoryIcon} text-xs`}></i>
          {question.category}
        </span>
        <span className="text-xs text-gray-400">
          سؤال {questionIndex + 1} من {totalQuestions}
        </span>
        {question.multiSelect && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            يمكن اختيار أكثر من إجابة
          </span>
        )}
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-1 leading-snug">
        {question.question}
      </h2>
      {question.subtitle && (
        <p className="text-sm text-gray-500 mb-6">{question.subtitle}</p>
      )}
      {!question.subtitle && <div className="mb-6" />}

      {/* Options */}
      <div className={`grid gap-3 ${question.options.length <= 3 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => handleToggle(opt.value)}
              className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? `${c.selectedBg} ${c.selectedBorder} ${c.selectedText}`
                  : `bg-white ${c.border} hover:${c.bg} ${c.text} hover:border-opacity-60`
              }`}
            >
              {opt.icon && (
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors ${
                  isSelected ? "bg-white/20" : c.bg
                }`}>
                  <i className={`${opt.icon} text-lg ${isSelected ? "text-white" : c.text}`}></i>
                </div>
              )}
              <span className={`font-semibold text-sm flex-1 text-right ${isSelected ? "text-white" : "text-gray-800"}`}>
                {opt.label}
              </span>
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 flex-shrink-0 transition-all ${
                isSelected
                  ? "bg-white border-white"
                  : "border-gray-300 group-hover:border-gray-400"
              }`}>
                {isSelected && (
                  <i className={`ri-check-line text-xs ${c.text}`}></i>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
