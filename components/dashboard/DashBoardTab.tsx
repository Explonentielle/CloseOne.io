"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  PhoneForwarded,
  Clock,
  Trophy,
  DollarSign,
  Percent,
  Plus,
  Target,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import CloseScoreCard from "./CloseScoreCard";
import { toDateKey, sumBy, COMMISSION_RATE } from "@/lib/stats-utils";
import type { FullUser } from "@/contexts/UserContext";

type Status = "En cours" | "Atteint" | "Non atteint";

interface KpiItem {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  highlight: boolean;
}

interface Objectif {
  id: string;
  label: string;
  target: string;
  progress: number;
  status: Status;
}

interface DashboardTabProps {
  user: FullUser;
}

const STORAGE_KEY_OBJECTIFS = "dashboard_objectifs_mensuels";

// Récupérer tous les deals (challenge + directs)
const getAllDeals = (user: FullUser) => {
  const challengeDeals = user.challenges.flatMap(ch => ch.deals);
  const directDeals = user.deals ?? [];
  return [...challengeDeals, ...directDeals];
};

// Récupérer toutes les daily entries (tous challenges)
const getAllDailyEntries = (user: FullUser) => {
  return user.challenges.flatMap(ch => ch.dailyEntries ?? []);
};

export default function DashboardTab({ user }: DashboardTabProps) {
  // 1. Métriques globales (tous temps)
  const metrics = useMemo(() => {
    const allDeals = getAllDeals(user);
    const allDailyEntries = getAllDailyEntries(user);

    const r1Effectues = sumBy(allDailyEntries, e => e.r1Effectue);
    const r2Effectues = sumBy(allDailyEntries, e => e.r2Effectue);
    const closes = allDeals.filter(d => d.montantContracte > 0).length;
    const cashCollecte = sumBy(allDeals, d => d.montantCollecte);
    const closingPct = r1Effectues > 0 ? (closes / r1Effectues) * 100 : 0;
    const commissions = cashCollecte * COMMISSION_RATE;
    const followUp = allDeals.filter(d => d.dateR2 && new Date(d.dateR2) > new Date()).length;
    const convR1toR2 = r1Effectues > 0 ? (r2Effectues / r1Effectues) * 100 : 0;

    return {
      r1Effectues,
      r2Effectues,
      convR1toR2,
      followUp,
      closes,
      cashCollecte,
      closingPct,
      commissions,
    };
  }, [user]);

  // 2. Résumé du jour (basé sur la date du jour)
  const todaySummary = useMemo(() => {
    const todayKey = toDateKey(new Date());
    const allDailyEntries = getAllDailyEntries(user);
    const todayEntries = allDailyEntries.filter(e => toDateKey(e.date) === todayKey);
    return {
      r1Plan: sumBy(todayEntries, e => e.r1Planifie),
      r1Eff: sumBy(todayEntries, e => e.r1Effectue),
      r2Plan: sumBy(todayEntries, e => e.r2Planifie),
      r2Eff: sumBy(todayEntries, e => e.r2Effectue),
      closes: sumBy(todayEntries, e => e.nbCloses),
    };
  }, [user]);

  // 3. Objectifs mensuels (localStorage) – inchangé
  const [objectifs, setObjectifs] = useState<Objectif[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_OBJECTIFS);
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: "1", label: "Cash collecté mensuel", target: "10 000€", progress: 0, status: "En cours" },
      { id: "2", label: "Nombre de closes", target: "10", progress: 0, status: "En cours" },
      { id: "3", label: "Taux de closing", target: "35%", progress: 0, status: "En cours" },
    ];
  });

  const objectifsWithProgress = useMemo(() => {
    if (!metrics) return objectifs;
    return objectifs.map(obj => {
      let progress = 0;
      let status: Status = "En cours";
      if (obj.label === "Cash collecté mensuel") {
        const targetNum = parseFloat(obj.target.replace(/[^0-9]/g, ""));
        progress = targetNum ? (metrics.cashCollecte / targetNum) * 100 : 0;
      } else if (obj.label === "Nombre de closes") {
        const targetNum = parseFloat(obj.target);
        progress = targetNum ? (metrics.closes / targetNum) * 100 : 0;
      } else if (obj.label === "Taux de closing") {
        const targetNum = parseFloat(obj.target.replace("%", ""));
        progress = targetNum ? (metrics.closingPct / targetNum) * 100 : 0;
      }
      if (progress >= 100) status = "Atteint";
      else if (progress > 0) status = "En cours";
      return { ...obj, progress: Math.min(progress, 100), status };
    });
  }, [objectifs, metrics]);

  const saveObjectifs = (newList: Objectif[]) => {
    setObjectifs(newList);
    localStorage.setItem(STORAGE_KEY_OBJECTIFS, JSON.stringify(newList));
  };

  const addObjectif = (label: string, target: string) => {
    if (objectifs.length >= 4) return;
    const newObj: Objectif = {
      id: Date.now().toString(),
      label,
      target,
      progress: 0,
      status: "En cours",
    };
    saveObjectifs([...objectifs, newObj]);
  };

  // 4. KPIs dynamiques (valeurs globales)
  const kpis: KpiItem[] = useMemo(() => {
    if (!metrics) return [];
    return [
      { label: "CALLS R1", value: String(metrics.r1Effectues), sub: "total", subColor: "text-[hsl(var(--primary))]", icon: Phone, highlight: false },
      { label: "CALLS R2", value: String(metrics.r2Effectues), sub: `${Math.round(metrics.convR1toR2)}% conv. R1`, subColor: "text-[hsl(var(--muted-foreground))]", icon: PhoneForwarded, highlight: false },
      { label: "FOLLOW UP", value: String(metrics.followUp), sub: "À relancer", subColor: "text-[hsl(var(--muted-foreground))]", icon: Clock, highlight: false },
      { label: "CLOSES", value: String(metrics.closes), sub: "total", subColor: "text-[hsl(var(--primary))]", icon: Trophy, highlight: false },
      { label: "CASH COLLECTÉ", value: `${metrics.cashCollecte.toLocaleString("fr-FR")}€`, sub: `Comm: ${Math.round(metrics.commissions)}€ · C2 du Close Score`, subColor: "text-[hsl(var(--muted-foreground))]", icon: DollarSign, highlight: false },
      { label: "CLOSING %", value: `${Math.round(metrics.closingPct)}%`, sub: "global", subColor: "text-[hsl(var(--primary))]", icon: Percent, highlight: true },
    ];
  }, [metrics]);

  const [showObjModal, setShowObjModal] = useState(false);
  const [newObj, setNewObj] = useState({ label: "", target: "" });

  // Close Score officiel (issu de monthlyScores)
  const lastMonthlyScore = user.monthlyScores?.[0];
  const closeScore = lastMonthlyScore?.scoreFinal ?? 50;

  if (!metrics || !todaySummary) {
    return <div className="p-8 text-center">Chargement des données...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Section A — KPI Cards + Close Score */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className={`rounded-[var(--radius-lg)] p-4 bg-[hsl(var(--card))] border ${
                k.highlight ? "border-[hsl(var(--primary))] border-2" : "border-[hsl(var(--border)/0.3)]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <k.icon size={16} className="text-[hsl(var(--primary))]" />
                <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase">
                  {k.label}
                </span>
              </div>
              <p className={`text-xl font-bold ${
                k.label === "CASH COLLECTÉ" ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"
              }`}>
                {k.value}
              </p>
              <p className={`text-[11px] mt-0.5 ${k.subColor}`}>{k.sub}</p>
            </div>
          ))}
        </div>

        <CloseScoreCard score={closeScore} monthlyScore={lastMonthlyScore} className="lg:block" />
      </div>

      {/* Section B — Commissions (basée sur les commissions globales) */}
      <div className="rounded-[var(--radius-xl)] p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[hsl(var(--foreground))]">Avance des commissions mensuelles</h3>
          <span className="font-bold text-[hsl(var(--primary))]">{Math.round(metrics.commissions)}€ / 2 000€</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[hsl(var(--primary))]">Commissions collectées</span>
              <span className="font-semibold text-[hsl(var(--primary))]">{Math.round(metrics.commissions)}€</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: `${Math.min((metrics.commissions / 2000) * 100, 100)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[hsl(var(--warning))]">Super Green Goal</span>
              <span className="font-semibold text-[hsl(var(--warning))]">3 000€</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full bg-[hsl(var(--warning))]" style={{ width: `${Math.min((metrics.commissions / 3000) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-[hsl(var(--background))] rounded-[var(--radius-lg)]">
          <p className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase mb-2">
            Résumé du jour — {new Date().toLocaleDateString("fr-FR")}
          </p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: "R1 Plan.", value: todaySummary.r1Plan, color: "text-[hsl(var(--foreground))]" },
              { label: "R1 Eff.", value: todaySummary.r1Eff, color: "text-[hsl(var(--primary))]" },
              { label: "R2 Plan.", value: todaySummary.r2Plan, color: "text-[hsl(var(--foreground))]" },
              { label: "R2 Eff.", value: todaySummary.r2Eff, color: "text-[hsl(var(--primary))]" },
              { label: "Closes", value: todaySummary.closes, color: "text-[hsl(var(--primary))]" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{s.label}</div>
                <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section C — Objectifs mensuels */}
      <div className="rounded-[var(--radius-xl)] p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[hsl(var(--foreground))]">Mes objectifs du mois</h3>
          {objectifs.length < 4 ? (
            <button onClick={() => setShowObjModal(true)} className="text-xs text-[hsl(var(--primary))] flex items-center gap-1 hover:underline">
              <Plus size={14} /> Ajouter un objectif
            </button>
          ) : (
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Maximum atteint (4/4)</span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {objectifsWithProgress.map((obj) => {
            const Icon = obj.status === "Atteint" ? CheckCircle2 : obj.status === "Non atteint" ? AlertCircle : Target;
            return (
              <div key={obj.id} className="bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] rounded-[var(--radius-lg)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={obj.status === "Atteint" ? "text-[hsl(var(--primary))]" : obj.status === "Non atteint" ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--muted-foreground))]"} />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">{obj.label}</span>
                  </div>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                    obj.status === "Atteint" ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]" :
                    obj.status === "Non atteint" ? "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]" :
                    "bg-[hsl(var(--muted)/0.3)] text-[hsl(var(--muted-foreground))]"
                  }`}>
                    {obj.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-[hsl(var(--primary))] mb-2">{obj.target}</p>
                <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${obj.status === "Atteint" ? "bg-[hsl(var(--primary))]" : obj.status === "Non atteint" ? "bg-[hsl(var(--destructive))]" : "bg-[hsl(var(--primary)/0.6)]"}`} style={{ width: `${Math.min(obj.progress, 100)}%` }} />
                </div>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">{Math.round(obj.progress)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal ajout objectif */}
      {showObjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowObjModal(false)}>
          <div className="bg-[hsl(var(--card))] rounded-[var(--radius-xl)] p-6 max-w-md w-full mx-4 border border-[hsl(var(--border)/0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-bold text-[hsl(var(--foreground))]">Ajouter un objectif</h3>
              <button onClick={() => setShowObjModal(false)} className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-[hsl(var(--muted-foreground))] block mb-1">Intitulé</label>
                <input value={newObj.label} onChange={(e) => setNewObj({...newObj, label: e.target.value})} placeholder="Ex: Cash collecté mensuel" className="w-full h-10 rounded-[var(--radius-md)] border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))]" />
              </div>
              <div>
                <label className="text-[10px] text-[hsl(var(--muted-foreground))] block mb-1">Valeur cible</label>
                <input value={newObj.target} onChange={(e) => setNewObj({...newObj, target: e.target.value})} placeholder="Ex: 15 000€" className="w-full h-10 rounded-[var(--radius-md)] border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))]" />
              </div>
              <button onClick={() => { if (!newObj.label.trim() || !newObj.target.trim() || objectifs.length >= 4) return; addObjectif(newObj.label, newObj.target); setNewObj({ label: "", target: "" }); setShowObjModal(false); }} className="w-full h-10 rounded-[var(--radius-lg)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold text-sm hover:opacity-90 transition-opacity">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}