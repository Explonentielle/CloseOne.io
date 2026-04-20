"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CloseScoreRadar from "./CloseScoreRadar";

function getScoreInfo(score: number) {
  const capped = Math.min(score, 95);
  if (capped >= 90) return { label: "Master de la vente", icon: "🏆" };
  if (capped >= 80) return { label: "Excellent profil", icon: "🥇" };
  if (capped >= 60) return { label: "Bon profil", icon: "🥈" };
  if (capped >= 40) return { label: "Profil moyen", icon: "🥉" };
  return { label: "Profil insuffisant", icon: "⚠️" };
}

interface Props {
  score?: number;
  className?: string;
}

const CloseScoreCard = ({ score = 82, className = "" }: Props) => {
  const [showRadar, setShowRadar] = useState(false);
  const capped = Math.min(score, 95);
  const info = getScoreInfo(score);

  return (
    <div
      className={`rounded-[var(--radius-lg)] p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.5)] ${className}`}
    >
      <span className="text-[10px] font-medium tracking-wider text-[hsl(var(--muted-foreground))] uppercase">
        Close Score
      </span>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-4xl font-bold text-[hsl(var(--primary))]">{capped}</span>
        <span className="text-lg">{info.icon}</span>
      </div>

      <div className="h-2 rounded-full bg-[hsl(var(--muted))] mt-3">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-700"
          style={{ width: `${(capped / 95) * 100}%` }}
        />
      </div>

      <p className="text-[11px] font-semibold text-[hsl(var(--primary))] mt-2">
        {info.label}
      </p>

      <button
        onClick={() => setShowRadar(!showRadar)}
        className="flex items-center gap-1 mt-3 text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
      >
        {showRadar ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {showRadar ? "Masquer le détail" : "Voir le détail"}
      </button>

      {showRadar && (
        <div className="mt-3 animate-fade-in">
          <CloseScoreRadar />
          <p className="text-[9px] text-[hsl(var(--muted-foreground))] text-center mt-1">
            Score calculé sur 5 critères vérifiés par CloseOne
          </p>
        </div>
      )}
    </div>
  );
};

export { getScoreInfo };
export default CloseScoreCard;