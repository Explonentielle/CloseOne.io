"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { updateDailySentiment } from "@/app/actions/KpiActions";
import { toDateKey, sumBy } from "@/lib/stats-utils";
import type { FullUser } from "@/contexts/UserContext";

interface KpiDailyModalProps {
  open: boolean;
  onClose: () => void;
  challengeId?: string;
}

const sentiments = [
  { value: "HAPPY", emoji: "😊", label: "Heureux" },
  { value: "NEUTRAL", emoji: "😐", label: "Neutre" },
  { value: "FRUSTRATED", emoji: "😤", label: "Frustré" },
  { value: "ON_FIRE", emoji: "🔥", label: "En feu" },
  { value: "TIRED", emoji: "😴", label: "Fatigué" },
];

// Helpers
const getAllDeals = (user: FullUser) => {
  const challengeDeals = user.challenges.flatMap(ch => ch.deals);
  const directDeals = user.deals ?? [];
  return [...challengeDeals, ...directDeals];
};

const getAllDailyEntries = (user: FullUser) => {
  return user.challenges.flatMap(ch => ch.dailyEntries ?? []);
};

export default function KpiDailyModal({ open, onClose, challengeId }: KpiDailyModalProps) {
  const router = useRouter();
  const user = useUser();
  const [sentiment, setSentiment] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);

  // Récupération des données du jour
  const todayData = useMemo(() => {
    if (!user) return null;
    const todayKey = toDateKey(new Date());

    // Daily entries du jour
    const allEntries = getAllDailyEntries(user);
    const todayEntries = allEntries.filter(e => toDateKey(e.date) === todayKey);
    const r1Plan = sumBy(todayEntries, e => e.r1Planifie);
    const r1Eff = sumBy(todayEntries, e => e.r1Effectue);
    const r2Plan = sumBy(todayEntries, e => e.r2Planifie);
    const r2Eff = sumBy(todayEntries, e => e.r2Effectue);
    const closesFromEntries = sumBy(todayEntries, e => e.nbCloses);

    // Deals du jour (date de création)
    const allDeals = getAllDeals(user);
    const todayDeals = allDeals.filter(d => toDateKey(d.createdAt) === todayKey);
    const cashCollected = sumBy(todayDeals, d => d.montantCollecte);
    const closesFromDeals = todayDeals.filter(d => d.montantContracte > 0).length;
    const closes = Math.max(closesFromEntries, closesFromDeals);

    // Sentiment existant
    const existingSentiment = todayEntries[0]?.sentiment;
    if (existingSentiment && !sentiment) setSentiment(existingSentiment);

    const hasActivity = r1Eff > 0 || r2Eff > 0 || closes > 0 || cashCollected > 0;
    return { r1Plan, r1Eff, r2Plan, r2Eff, closes, cashCollected, hasActivity, sentiment: existingSentiment };
  }, [user, sentiment]);

  // Mettre à jour le sentiment
  const handleSaveSentiment = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);

    let activeChallengeId = challengeId;
    if (!activeChallengeId && user.challenges?.length) {
      activeChallengeId = user.challenges[0].id;
    }
    if (!activeChallengeId) {
      setError("Aucun challenge actif.");
      setIsSaving(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const result = await updateDailySentiment({
      challengeId: activeChallengeId,
      date: today,
      sentiment,
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    setIsSaving(false);
  };

  if (!open || !user) return null;
  if (!todayData) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border)/0.3)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary)/0.2)] flex items-center justify-center">
              <span className="font-bold text-[hsl(var(--primary))]">D</span>
            </div>
            <div>
              <h3 className="font-bold text-[hsl(var(--foreground))]">KPI Daily</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Section résumé du jour (repliable) */}
        <div className="mb-5 p-3 bg-[hsl(var(--background))] rounded-[var(--radius-lg)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase">
              Statistiques du jour
            </p>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              {showSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showSummary && (
            <>
              <div className="grid grid-cols-2 gap-3 text-center mb-3">
                <div className="bg-[hsl(var(--card))] p-2 rounded-md">
                  <div className="text-[10px] text-muted-foreground">R1</div>
                  <div className="text-sm font-semibold">
                    {todayData.r1Eff}/{todayData.r1Plan}
                  </div>
                </div>
                <div className="bg-[hsl(var(--card))] p-2 rounded-md">
                  <div className="text-[10px] text-muted-foreground">R2</div>
                  <div className="text-sm font-semibold">
                    {todayData.r2Eff}/{todayData.r2Plan}
                  </div>
                </div>
                <div className="bg-[hsl(var(--card))] p-2 rounded-md">
                  <div className="text-[10px] text-muted-foreground">Closes</div>
                  <div className="text-sm font-semibold text-primary">{todayData.closes}</div>
                </div>
                <div className="bg-[hsl(var(--card))] p-2 rounded-md">
                  <div className="text-[10px] text-muted-foreground">Cash collecté</div>
                  <div className="text-sm font-semibold text-primary">{todayData.cashCollected.toLocaleString("fr-FR")}€</div>
                </div>
              </div>
              {!todayData.hasActivity && (
                <button
                  onClick={() => {
                    onClose();
                    router.push("/deals/new");
                  }}
                  className="w-full mt-2 text-xs bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  + Ajouter un deal aujourd'hui
                </button>
              )}
            </>
          )}
        </div>

        {/* Sentiment de fin de journée */}
        <div className="mb-5">
          <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-2">Comment s'est passée ta journée ?</label>
          <div className="flex gap-2 flex-wrap">
            {sentiments.map((s) => (
              <button
                key={s.value}
                onClick={() => setSentiment(s.value)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  sentiment === s.value
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] hover:bg-[hsl(var(--muted))]"
                }`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton d'enregistrement (uniquement pour le sentiment) */}
        <button
          onClick={handleSaveSentiment}
          disabled={isSaving}
          className="w-full py-2.5 rounded-[var(--radius-lg)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer mon humeur"}
        </button>
      </div>
    </div>
  );
}