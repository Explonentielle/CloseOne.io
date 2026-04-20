"use client";
import { useState } from "react";
import {
  Phone,
  PhoneForwarded,
  Clock,
  Trophy,
  DollarSign,
  Percent,
  Plus,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import CloseScoreCard from "./CloseScoreCard";

// Définition des types
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

// Données des KPIs avec les couleurs CSS
const kpis: KpiItem[] = [
  {
    label: "CALLS R1",
    value: "18",
    sub: "+3 ce mois",
    subColor: "text-[hsl(var(--primary))]",
    icon: Phone,
    highlight: false,
  },
  {
    label: "CALLS R2",
    value: "9",
    sub: "50% conv. R1",
    subColor: "text-[hsl(var(--muted-foreground))]",
    icon: PhoneForwarded,
    highlight: false,
  },
  {
    label: "FOLLOW UP",
    value: "4",
    sub: "En attente",
    subColor: "text-[hsl(var(--muted-foreground))]",
    icon: Clock,
    highlight: false,
  },
  {
    label: "CLOSES",
    value: "6",
    sub: "Record mois",
    subColor: "text-[hsl(var(--primary))]",
    icon: Trophy,
    highlight: false,
  },
  {
    label: "CASH COLLECTÉ",
    value: "7 400€",
    sub: "Comm: 740€ · C2 du Close Score",
    subColor: "text-[hsl(var(--muted-foreground))]",
    icon: DollarSign,
    highlight: false,
  },
  {
    label: "CLOSING %",
    value: "33%",
    sub: "Top 20% · C1 du Close Score",
    subColor: "text-[hsl(var(--primary))]",
    icon: Percent,
    highlight: true,
  },
];

const initialObjectifs: Objectif[] = [
  {
    id: "1",
    label: "Cash collecté mensuel",
    target: "10 000€",
    progress: 74,
    status: "En cours",
  },
  {
    id: "2",
    label: "Nombre de closes",
    target: "10",
    progress: 60,
    status: "En cours",
  },
  {
    id: "3",
    label: "Taux de closing",
    target: "35%",
    progress: 94,
    status: "Atteint",
  },
];

// Styles et icônes par statut
const statusStyle: Record<Status, string> = {
  "En cours": "bg-[hsl(var(--muted)/0.3)] text-[hsl(var(--muted-foreground))]",
  "Atteint": "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]",
  "Non atteint": "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]"
};

const statusIcon: Record<Status, typeof CheckCircle2> = {
  "En cours": Target,
  "Atteint": CheckCircle2,
  "Non atteint": AlertCircle
};

export default function DashboardTab() {
  const [objectifs, setObjectifs] = useState<Objectif[]>(initialObjectifs);
  const [showObjModal, setShowObjModal] = useState(false);
  const [newObj, setNewObj] = useState({ label: "", target: "" });

  const addObjectif = () => {
    if (!newObj.label.trim() || !newObj.target.trim() || objectifs.length >= 4) return;

    const newObjectif: Objectif = {
      id: String(Date.now()),
      label: newObj.label,
      target: newObj.target,
      progress: 0,
      status: "En cours"
    };

    setObjectifs([...objectifs, newObjectif]);
    setNewObj({ label: "", target: "" });
    setShowObjModal(false);
  };

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

        {/* Close Score */}
        <CloseScoreCard score={82} className="lg:block" />
      </div>

      {/* Section B — Commissions */}
      <div className="rounded-[var(--radius-xl)] p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[hsl(var(--foreground))]">Avance des commissions mensuelles</h3>
          <span className="font-bold text-[hsl(var(--primary))]">740€ / 2 000€</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[hsl(var(--primary))]">Commissions collectées</span>
              <span className="font-semibold text-[hsl(var(--primary))]">740€</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: "37%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[hsl(var(--warning))]">Super Green Goal</span>
              <span className="font-semibold text-[hsl(var(--warning))]">3 000€</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full bg-[hsl(var(--warning))]" style={{ width: "25%" }} />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-[hsl(var(--background))] rounded-[var(--radius-lg)]">
          <p className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase mb-2">
            Résumé du jour — 31 mars
          </p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: "R1 Plan.", value: "4", color: "text-[hsl(var(--foreground))]" },
              { label: "R1 Eff.", value: "3", color: "text-[hsl(var(--primary))]" },
              { label: "R2 Plan.", value: "2", color: "text-[hsl(var(--foreground))]" },
              { label: "R2 Eff.", value: "1", color: "text-[hsl(var(--primary))]" },
              { label: "Closes", value: "1", color: "text-[hsl(var(--primary))]" },
            ].map((s, i) => (
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
            <button
              onClick={() => setShowObjModal(true)}
              className="text-xs text-[hsl(var(--primary))] flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Ajouter un objectif
            </button>
          ) : (
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
              Maximum atteint (4/4)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {objectifs.map((obj) => {
            const Icon = statusIcon[obj.status];
            return (
              <div
                key={obj.id}
                className="bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] rounded-[var(--radius-lg)] p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={14}
                      className={
                        obj.status === "Atteint"
                          ? "text-[hsl(var(--primary))]"
                          : obj.status === "Non atteint"
                            ? "text-[hsl(var(--destructive))]"
                            : "text-[hsl(var(--muted-foreground))]"
                      }
                    />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">{obj.label}</span>
                  </div>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${statusStyle[obj.status]}`}>
                    {obj.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-[hsl(var(--primary))] mb-2">{obj.target}</p>
                <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      obj.status === "Atteint"
                        ? "bg-[hsl(var(--primary))]"
                        : obj.status === "Non atteint"
                          ? "bg-[hsl(var(--destructive))]"
                          : "bg-[hsl(var(--primary)/0.6)]"
                    }`}
                    style={{ width: `${Math.min(obj.progress, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                  {obj.progress}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal pour ajouter un objectif */}
      {showObjModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowObjModal(false)}
        >
          <div
            className="bg-[hsl(var(--card))] rounded-[var(--radius-xl)] p-6 max-w-md w-full mx-4 border border-[hsl(var(--border)/0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-bold text-[hsl(var(--foreground))]">Ajouter un objectif</h3>
              <button
                onClick={() => setShowObjModal(false)}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-[hsl(var(--muted-foreground))] block mb-1">Intitulé</label>
                <input
                  value={newObj.label}
                  onChange={(e) => setNewObj({...newObj, label: e.target.value})}
                  placeholder="Ex: Cash collecté mensuel"
                  className="w-full h-10 rounded-[var(--radius-md)] border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[hsl(var(--muted-foreground))] block mb-1">Valeur cible</label>
                <input
                  value={newObj.target}
                  onChange={(e) => setNewObj({...newObj, target: e.target.value})}
                  placeholder="Ex: 15 000€"
                  className="w-full h-10 rounded-[var(--radius-md)] border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <button
                onClick={addObjectif}
                className="w-full h-10 rounded-[var(--radius-lg)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}