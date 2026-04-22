"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { saveDailyEntry } from "@/app/actions/KpiActions";

interface KpiDailyModalProps {
  open: boolean;
  onClose: () => void;
  challengeId?: string;
}

type FieldKey = "r1Plan" | "r1Eff" | "r2Plan" | "r2Eff" | "closes" | "cash";

const fields: { key: FieldKey; label: string }[] = [
  { key: "r1Plan", label: "R1 Planifiés" },
  { key: "r1Eff", label: "R1 Effectués" },
  { key: "r2Plan", label: "R2 Planifiés" },
  { key: "r2Eff", label: "R2 Effectués" },
  { key: "closes", label: "Closes" },
  { key: "cash", label: "Cash collecté €" },
];

// Mapping des sentiments pour l'emoji
const sentiments = [
  { value: "HAPPY", emoji: "😊", label: "Heureux" },
  { value: "NEUTRAL", emoji: "😐", label: "Neutre" },
  { value: "FRUSTRATED", emoji: "😤", label: "Frustré" },
  { value: "ON_FIRE", emoji: "🔥", label: "En feu" },
  { value: "TIRED", emoji: "😴", label: "Fatigué" },
];

const KpiDailyModal = ({ open, onClose, challengeId }: KpiDailyModalProps) => {
  const user = useUser();
  const [values, setValues] = useState<Record<FieldKey, number>>({
    r1Plan: 0, r1Eff: 0, r2Plan: 0, r2Eff: 0, closes: 0, cash: 0,
  });
  const [sentiment, setSentiment] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: FieldKey, val: string) => {
    setValues(prev => ({ ...prev, [key]: Number(val) || 0 }));
    setError(null);
  };

  const closingRate = values.r1Eff > 0 ? Math.round((values.closes / values.r1Eff) * 100) : 0;

  const getMessage = () => {
    if (values.closes > 0) return "🔥 Bonne journée — tu as closé.";
    if (values.r1Eff >= values.r1Plan && values.r1Plan > 0) return "✅ Discipline parfaite aujourd'hui.";
    if (values.r1Eff < values.r1Plan) return "⚠️ Pense à replanifier demain.";
    return "📋 Journée de préparation.";
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Récupérer le challenge actif (le plus récent)
      let activeChallengeId = challengeId;
      if (!activeChallengeId && user?.challenges?.length) {
        activeChallengeId = user.challenges[0]?.id;
      }

      if (!activeChallengeId) {
        setError("Aucun challenge actif. Crée un challenge d'abord.");
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const result = await saveDailyEntry({
        challengeId: activeChallengeId,
        date: today,
        r1Planifie: values.r1Plan,
        r1Effectue: values.r1Eff,
        r2Planifie: values.r2Plan,
        r2Effectue: values.r2Eff,
        nbCloses: values.closes,
        sentiment: sentiment as any,
      });

      if (result.success) {
        onClose();
        // Reset form
        setValues({ r1Plan: 0, r1Eff: 0, r2Plan: 0, r2Eff: 0, closes: 0, cash: 0 });
        setSentiment("");
        setShowSummary(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border)/0.3)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary)/0.2)] flex items-center justify-center">
              <span className="font-bold text-[hsl(var(--primary))]">D</span>
            </div>
            <div>
              <h3 className="font-bold text-[hsl(var(--foreground))]">KPI Daily</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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

        <div className="grid grid-cols-2 gap-3 mb-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">{field.label}</label>
              <input
                type="number"
                min={0}
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--primary))] outline-none"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        {/* Sentiment de fin de journée */}
        <div className="mb-4">
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

        {showSummary && (
          <div className="mt-4 p-4 bg-[hsl(var(--background))] rounded-lg border border-[hsl(var(--primary)/0.3)]">
            <p className="text-xs font-medium text-[hsl(var(--primary))] mb-2">Résumé de ta journée</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span>R1: <strong>{values.r1Eff}/{values.r1Plan}</strong></span>
              <span>R2: <strong>{values.r2Eff}/{values.r2Plan}</strong></span>
              <span>Closes: <strong>{values.closes}</strong></span>
              <span>Cash: <strong className="text-[hsl(var(--primary))]">{values.cash}€</strong></span>
              <span>Taux: <strong>{closingRate}%</strong></span>
            </div>
            <p className="mt-2 text-sm font-bold text-[hsl(var(--primary))]">{getMessage()}</p>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setShowSummary(true)}
            className="flex-1 py-2.5 rounded-[var(--radius-lg)] border border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))] text-sm font-medium hover:bg-[hsl(var(--primary)/0.1)] transition-all"
          >
            Voir le résumé
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-[var(--radius-lg)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KpiDailyModal;