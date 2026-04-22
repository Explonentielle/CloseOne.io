"use client";

import { useUser } from "@/contexts/UserContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function KpiDailyHistoryTab() {
  const user= useUser();
  
  // Récupérer toutes les entrées journalières de tous les challenges
  const allDailyEntries = user?.challenges?.flatMap(challenge => 
    challenge.dailyEntries.map(entry => ({
      ...entry,
      challengeLabel: challenge.label || `Challenge #${challenge.numero}`,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  const getStatus = (entry: any) => {
    if (entry.nbCloses > 0) return "good";
    if (entry.r1Effectue >= entry.r1Planifie && entry.r1Planifie > 0) return "good";
    return "bad";
  };

  const getTauxClosing = (entry: any) => {
    if (entry.r1Effectue === 0) return 0;
    return Math.round((entry.nbCloses / entry.r1Effectue) * 100);
  };

  if (allDailyEntries.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] text-center">
          <p className="text-[hsl(var(--muted-foreground))]">Aucune saisie journalière pour le moment.</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
            Utilise le bouton KPI Daily pour ajouter ta première journée
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">Historique KPI Daily</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
          {allDailyEntries.length} journée(s) enregistrée(s)
        </p>

        <div className="space-y-3">
          {allDailyEntries.map((entry) => {
            const status = getStatus(entry);
            const tauxClosing = getTauxClosing(entry);
            const date = new Date(entry.date);
            
            return (
              <div 
                key={entry.id} 
                className={`p-4 rounded-lg ${status === 'good' ? 'bg-[hsl(var(--primary)/0.05)]' : 'bg-[hsl(var(--background))]'}`}
              >
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                    </span>
                    <span className="text-xs ml-2 text-[hsl(var(--muted-foreground))]">
                      {entry.challengeLabel}
                    </span>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    {[
                      { label: "R1", value: `${entry.r1Effectue}/${entry.r1Planifie}` },
                      { label: "R2", value: `${entry.r2Effectue}/${entry.r2Planifie}` },
                      { label: "Closes", value: entry.nbCloses },
                      { label: "Taux", value: `${tauxClosing}%` },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center min-w-[60px]">
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</div>
                        <div className="font-semibold text-[hsl(var(--foreground))]">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status === 'good'
                      ? 'bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]'
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {status === 'good' ? "✅ Bonne journée" : "⚠️ À améliorer"}
                  </span>
                </div>

                {entry.sentiment && (
                  <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                    Sentiment: {entry.sentiment}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}