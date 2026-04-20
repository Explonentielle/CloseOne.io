"use client";

const currentWeekObjectives = [
  { label: "Objectif R1", target: "10", current: "8 effectués", pct: 80, status: "good" as const },
  { label: "Objectif Closes", target: "3", current: "2 closés", pct: 66, status: "medium" as const },
  { label: "Objectif CA", target: "4 000€", current: "1 800€", pct: 45, status: "bad" as const },
  { label: "Objectif Closing %", target: "35%", current: "33%", pct: 94, status: "good" as const },
];

const bilanData = [
  { label: "R1", obj: "10", real: "8", detail: "80% atteint", pct: 80, status: "good" as const },
  { label: "Closes", obj: "3", real: "3", detail: "100% atteint", pct: 100, status: "good" as const },
  { label: "CA", obj: "4 000€", real: "4 200€", detail: "Dépassé", pct: 105, status: "good" as const },
  { label: "Closing %", obj: "35%", real: "37%", detail: "Dépassé", pct: 106, status: "good" as const },
];

// Définir un type pour les statuts possibles
type Status = "good" | "medium" | "bad";

// Typage explicite de l'objet statusColors
const statusColors: Record<Status, string> = {
  good: "text-[hsl(var(--primary))]",
  medium: "text-[hsl(var(--warning))]",
  bad: "text-[hsl(var(--muted-foreground))]"
};

export default function KpiWeeklyTab() {
  return (
    <div className="space-y-6">
      {/* Current Week Objectives */}
      <div className="rounded-lg p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Semaine 13 — Objectifs</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">24 – 31 mars 2026</p>
          </div>
          <span className="text-xs px-3 py-1 bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] rounded-full">
            En cours
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentWeekObjectives.map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-[hsl(var(--background))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase mb-1">{item.label}</p>
              <p className="text-lg font-bold text-[hsl(var(--foreground))]">{item.target}</p>
              <p className={`text-sm ${statusColors[item.status]} mt-1`}>
                {item.current} — {item.pct}%
              </p>
            </div>
          ))}

          <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded-lg bg-[hsl(var(--background))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase mb-1">FOCUS 1</p>
              <p className="text-sm text-[hsl(var(--foreground))]">Améliorer mon taux de conversion R1 → R2</p>
            </div>
            <div className="p-3 rounded-lg bg-[hsl(var(--background))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase mb-1">FOCUS 2</p>
              <p className="text-sm text-[hsl(var(--foreground))]">Traiter les objections prix sans baisser</p>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Week Review */}
      <div className="rounded-lg p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">Bilan — Semaine 12</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">17 – 23 mars 2026</p>

        <div className="grid grid-cols-2 gap-4">
          {bilanData.map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-[hsl(var(--background))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${statusColors[item.status]} mb-1`}>
                {item.real} / {item.obj}
              </p>
              <p className={`text-sm ${statusColors[item.status]}`}>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-lg bg-[hsl(var(--primary)/0.1)] border-l-4 border-[hsl(var(--primary))]">
          <p className="text-sm font-semibold text-[hsl(var(--primary))]">Félicitations cette semaine</p>
          <p className="text-sm text-[hsl(var(--foreground))] mt-1">
            Tu as augmenté ton cash collecté de +12% vs la semaine précédente. Ton taux de closing dépasse ton objectif pour la 2e semaine consécutive. 🚀
          </p>
        </div>
      </div>
    </div>
  );
}