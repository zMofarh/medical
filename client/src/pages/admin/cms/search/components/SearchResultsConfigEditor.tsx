import { SearchResultsConfig } from "@/types/cms";

interface SectionToggleProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  description: string;
  enabled: boolean;
  previewCount: number;
  maxPreview: number;
  onToggle: () => void;
  onCountChange: (val: number) => void;
}

function SectionToggle({
  icon, iconBg, iconColor, label, description,
  enabled, previewCount, maxPreview, onToggle, onCountChange,
}: SectionToggleProps) {
  return (
    <div className={`border rounded-xl p-4 transition-all ${enabled ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${iconBg}`}>
          <i className={`${icon} text-base ${iconColor}`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{label}</div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${enabled ? "bg-[#2E4E45]" : "bg-gray-200"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? "right-0.5" : "left-0.5"}`}></span>
        </button>
      </div>
      {enabled && (
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">
            عدد النتائج في &quot;الكل&quot;:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCountChange(Math.max(1, previewCount - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className="ri-subtract-line text-sm"></i>
            </button>
            <span className="w-8 text-center font-bold text-gray-900 text-sm">{previewCount}</span>
            <button
              onClick={() => onCountChange(Math.min(maxPreview, previewCount + 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className="ri-add-line text-sm"></i>
            </button>
          </div>
          <span className="text-xs text-gray-400">(الحد الأقصى: {maxPreview})</span>
        </div>
      )}
    </div>
  );
}

interface SearchResultsConfigEditorProps {
  data: SearchResultsConfig;
  onChange: (d: SearchResultsConfig) => void;
}

export default function SearchResultsConfigEditor({ data, onChange }: SearchResultsConfigEditorProps) {
  const sections = [
    {
      key: "Doctors" as const,
      icon: "ri-user-heart-line",
      iconBg: "bg-[#2E4E45]/10",
      iconColor: "text-[#2E4E45]",
      label: "قسم الأطباء",
      description: "نتائج الأطباء في صفحة البحث",
      enabledKey: "showDoctors" as keyof SearchResultsConfig,
      countKey: "doctorsPreviewCount" as keyof SearchResultsConfig,
      maxPreview: 6,
    },
    {
      key: "Services" as const,
      icon: "ri-stethoscope-line",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      label: "قسم الخدمات",
      description: "نتائج الخدمات الطبية في صفحة البحث",
      enabledKey: "showServices" as keyof SearchResultsConfig,
      countKey: "servicesPreviewCount" as keyof SearchResultsConfig,
      maxPreview: 8,
    },
    {
      key: "Packages" as const,
      icon: "ri-gift-line",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      label: "قسم الباقات",
      description: "نتائج الباقات الطبية في صفحة البحث",
      enabledKey: "showPackages" as keyof SearchResultsConfig,
      countKey: "packagesPreviewCount" as keyof SearchResultsConfig,
      maxPreview: 8,
    },
    {
      key: "Blog" as const,
      icon: "ri-article-line",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      label: "قسم المقالات",
      description: "نتائج المقالات الطبية في صفحة البحث",
      enabledKey: "showBlog" as keyof SearchResultsConfig,
      countKey: "blogPreviewCount" as keyof SearchResultsConfig,
      maxPreview: 6,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg">
            <i className="ri-settings-3-line text-gray-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">إعدادات نتائج البحث</h3>
            <p className="text-xs text-gray-400">تحكم في الأقسام الظاهرة وعدد النتائج</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-information-line text-amber-600 text-sm"></i>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          &quot;عدد النتائج في الكل&quot; يتحكم في كم نتيجة تظهر في تبويب &quot;الكل&quot; قبل زر &quot;عرض الكل&quot;. عند الضغط على التبويب المخصص تظهر كل النتائج.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <SectionToggle
            key={section.key}
            icon={section.icon}
            iconBg={section.iconBg}
            iconColor={section.iconColor}
            label={section.label}
            description={section.description}
            enabled={data[section.enabledKey] as boolean}
            previewCount={data[section.countKey] as number}
            maxPreview={section.maxPreview}
            onToggle={() => onChange({ ...data, [section.enabledKey]: !data[section.enabledKey] })}
            onCountChange={(val) => onChange({ ...data, [section.countKey]: val })}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-2">ملخص الإعدادات الحالية:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sections.map((section) => (
            <div key={section.key} className={`text-center p-2 rounded-lg ${data[section.enabledKey] ? "bg-white border border-gray-200" : "bg-gray-100"}`}>
              <div className={`text-lg font-black ${data[section.enabledKey] ? "text-[#2E4E45]" : "text-gray-300"}`}>
                {data[section.enabledKey] ? data[section.countKey] : "—"}
              </div>
              <div className="text-[10px] text-gray-500">{section.label.replace("قسم ", "")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
