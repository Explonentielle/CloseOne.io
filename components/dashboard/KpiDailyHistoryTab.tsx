"use client";

const dailyHistory = [
  { date: "31 mars 2026", r1: "3/4", r2: "1/2", closes: 1, cash: 300, taux: 33, status: "good" },
  { date: "28 mars 2026", r1: "4/4", r2: "2/2", closes: 2, cash: 1800, taux: 50, status: "good" },
  { date: "27 mars 2026", r1: "2/5", r2: "1/3", closes: 0, cash: 0, taux: 0, status: "bad" },
];

export default function KpiDailyHistoryTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">Historique KPI Daily</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
          Utilise le bouton KPI Daily pour ajouter ta journée
        </p>

        <div className="space-y-3">
          {dailyHistory.map((day) => (
            <div key={day.date} className={`p-4 rounded-lg ${day.status === 'good' ? 'bg-[hsl(var(--primary)/0.05)]' : 'bg-[hsl(var(--background))]'}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[hsl(var(--muted-foreground))] min-w-[100px]">{day.date}</span>

                <div className="flex gap-4">
                  {[
                    { label: "R1", value: day.r1 },
                    { label: "R2", value: day.r2 },
                    { label: "Closes", value: day.closes },
                    { label: "Cash", value: `${day.cash}€` },
                    { label: "Taux", value: `${day.taux}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</div>
                      <div className="font-semibold text-[hsl(var(--foreground))]">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${
                  day.status === 'good'
                    ? 'bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                }`}>
                  {day.status === 'good' ? "Bonne journée" : "À améliorer"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}