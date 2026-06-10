interface DNAStatsCardsProps {
  stats: {
    totalEvaluations: number;
    todayEvaluations: number;
    thisWeekEvaluations: number;
    highRiskCount: number;
    conversionRate: number;
    avgScore: number;
  };
}

export default function DNAStatsCards({ stats }: DNAStatsCardsProps) {
  const cards = [
    {
      label: "إجمالي التقييمات",
      value: stats.totalEvaluations.toLocaleString(),
      icon: "ri-dna-line",
      color: "bg-brand-forest-50 text-brand-forest-700",
      border: "border-brand-forest-200",
    },
    {
      label: "تقييمات اليوم",
      value: stats.todayEvaluations.toString(),
      icon: "ri-calendar-check-line",
      color: "bg-teal-50 text-teal-700",
      border: "border-teal-200",
    },
    {
      label: "هذا الأسبوع",
      value: stats.thisWeekEvaluations.toString(),
      icon: "ri-bar-chart-grouped-line",
      color: "bg-amber-50 text-amber-700",
      border: "border-amber-200",
    },
    {
      label: "مخاطر عالية/مرتفعة",
      value: stats.highRiskCount.toString(),
      icon: "ri-alert-line",
      color: "bg-red-50 text-red-700",
      border: "border-red-200",
    },
    {
      label: "معدل التحويل",
      value: `${stats.conversionRate}%`,
      icon: "ri-exchange-dollar-line",
      color: "bg-emerald-50 text-emerald-700",
      border: "border-emerald-200",
    },
    {
      label: "متوسط المخاطر",
      value: `${stats.avgScore}%`,
      icon: "ri-percent-line",
      color: "bg-violet-50 text-violet-700",
      border: "border-violet-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl border ${card.border} p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${card.color.split(" ")[0]}`}>
              <i className={`${card.icon} text-sm ${card.color.split(" ")[1]}`}></i>
            </div>
          </div>
          <p className="text-xl font-black text-gray-900">{card.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}