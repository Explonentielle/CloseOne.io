"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@/contexts/UserContext";

const levels = ["Journée", "Challenge", "Infopreneur", "Niche", "Global"] as const;
type Level = (typeof levels)[number];

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmtEur(n: number) {
  return `${Math.round(n).toLocaleString("fr-FR")}€`;
}

function fmtPct(n: number) {
  return `${Math.round(n)}%`;
}

function toDateKey(d: Date | string) {
  return new Date(d).toISOString().split("T")[0];
}

// ─── Types ──────────────────────────────────────────────────────────────────
type Metric = { label: string; value: string };
type UserType = NonNullable<ReturnType<typeof useUser>>;

// ─── Métriques "Journée" ───────────────────────────────────────────────────
function useDayMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];
    const todayKey = toDateKey(new Date());

    let r1Effectue = 0;
    let r2Effectue = 0;
    let signedDealsToday = 0;
    let totalDealsToday = 0;
    let cashToday = 0;

    for (const ch of user.challenges) {
      for (const deal of ch.deals) {
        const createdAtKey = deal.createdAt ? toDateKey(deal.createdAt) : null;
        const dateR1Key = deal.dateR1 ? toDateKey(deal.dateR1) : null;
        const dateR2Key = deal.dateR2 ? toDateKey(deal.dateR2) : null;
        const dateCloseKey = deal.dateClose ? toDateKey(deal.dateClose) : null;

        // Compter les R1 effectués (aujourd'hui)
        if (dateR1Key === todayKey) r1Effectue++;

        // Compter les R2 effectués (aujourd'hui)
        if (dateR2Key === todayKey) r2Effectue++;

        // Total deals créés aujourd'hui (pour le taux)
        if (createdAtKey === todayKey) totalDealsToday++;

        // Deals signés (montantContracte > 0) créés aujourd'hui
        if (createdAtKey === todayKey && deal.montantContracte > 0) signedDealsToday++;

        // Cash collecté aujourd'hui : priorité à dateR2, puis dateClose, puis createdAt
        let collectDateKey = dateR2Key ?? dateCloseKey ?? createdAtKey;
        if (collectDateKey === todayKey && deal.montantCollecte > 0) {
          cashToday += deal.montantCollecte;
        }
      }
    }

    const taux = totalDealsToday ? (signedDealsToday / totalDealsToday) * 100 : 0;

    return [
      { label: "R1 effectués", value: String(r1Effectue) },
      { label: "R2 effectués", value: String(r2Effectue) },
      { label: "Closes", value: String(signedDealsToday) },
      { label: "Cash du jour", value: fmtEur(cashToday) },
      { label: "Taux conversion", value: fmtPct(taux) },
    ];
  }, [user]);
}

// ─── Métriques "Challenge" ──────────────────────────────────────────────────
// Agrège tous les challenges
function useChallengeMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];

    let totalDeals = 0;
    let signedDeals = 0;
    let totalContracte = 0;
    let totalCollecte = 0;
    let delais: number[] = [];
    let fullPayCount = 0;

    for (const ch of user.challenges) {
      const deals = ch.deals;
      totalDeals += deals.length;
      signedDeals += deals.filter(d => d.montantContracte > 0).length;
      totalContracte += deals.reduce((s, d) => s + d.montantContracte, 0);
      totalCollecte += deals.reduce((s, d) => s + d.montantCollecte, 0);
      deals.forEach(d => {
        if (d.delaiConversion && d.delaiConversion > 0) delais.push(d.delaiConversion);
        if (d.typeVente === "FULL_PAY") fullPayCount++;
      });
    }

    const delaiMoyen = delais.length ? delais.reduce((a, b) => a + b, 0) / delais.length : 0;
    const fullPayPct = totalDeals ? (fullPayCount / totalDeals) * 100 : 0;
    const tauxConversion = totalDeals ? (signedDeals / totalDeals) * 100 : 0;

    return [
      { label: "Taux conversion", value: fmtPct(tauxConversion) },
      { label: "Délai moy. closing", value: delaiMoyen ? `${delaiMoyen.toFixed(1)}j` : "—" },
      { label: "Cash contracté", value: fmtEur(totalContracte) },
      { label: "Cash collecté", value: fmtEur(totalCollecte) },
      { label: "Full Pay", value: fmtPct(fullPayPct) },
    ];
  }, [user]);
}

// ─── Métriques "Infopreneur" ────────────────────────────────────────────────
function useInfopreneurMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];

    const byInf: Record<string, { name: string; deals: any[]; entries: any[] }> = {};

    for (const ch of user.challenges) {
      const infId = ch.infopreneurId;
      if (!byInf[infId]) {
        byInf[infId] = { name: ch.infopreneur.nom, deals: [], entries: [] };
      }
      byInf[infId].deals.push(...ch.deals);
      byInf[infId].entries.push(...ch.dailyEntries);
    }

    const top = Object.values(byInf).sort((a, b) => b.deals.length - a.deals.length)[0];
    if (!top) return [{ label: "Aucune donnée", value: "—" }];

    const totalDeals = top.deals.length;
    const signedDeals = top.deals.filter(d => d.montantContracte > 0).length;
    const tauxConversion = totalDeals ? (signedDeals / totalDeals) * 100 : 0;

    const totalContracte = top.deals.reduce((s, d) => s + d.montantContracte, 0);
    const totalCollecte = top.deals.reduce((s, d) => s + d.montantCollecte, 0);
    const collectePct = totalContracte ? (totalCollecte / totalContracte) * 100 : 0;

    const fullPay = top.deals.filter(d => d.typeVente === "FULL_PAY").length;
    const splitPay = top.deals.filter(d => d.typeVente === "SPLIT_PAY").length;

    const delais = top.deals.map(d => d.delaiConversion).filter((d): d is number => d !== null && d > 0);
    const tempsMoyen = delais.length ? delais.reduce((a, b) => a + b, 0) / delais.length : 0;

    return [
      { label: "Infopreneur", value: top.name },
      { label: "Taux conversion", value: fmtPct(tauxConversion) },
      { label: "Cash contracté", value: fmtEur(totalContracte) },
      { label: "Cash collecté %", value: fmtPct(collectePct) },
      { label: "Full Pay / Split", value: `${fullPay}/${splitPay}` },
      { label: "Délai signature", value: tempsMoyen ? `${tempsMoyen.toFixed(1)}j` : "—" },
    ];
  }, [user]);
}

// ─── Métriques "Niche" ──────────────────────────────────────────────────────
function useNicheMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];

    const byNiche: Record<string, { name: string; cash: number; totalDeals: number; signedDeals: number }> = {};

    for (const ch of user.challenges) {
      const nicheName = ch.infopreneur.niche.nom;
      if (!byNiche[nicheName]) {
        byNiche[nicheName] = { name: nicheName, cash: 0, totalDeals: 0, signedDeals: 0 };
      }
      byNiche[nicheName].cash += ch.deals.reduce((s, d) => s + d.montantContracte, 0);
      byNiche[nicheName].totalDeals += ch.deals.length;
      byNiche[nicheName].signedDeals += ch.deals.filter(d => d.montantContracte > 0).length;
    }

    const entries = Object.values(byNiche).sort((a, b) => b.cash - a.cash);
    if (entries.length === 0) return [{ label: "Aucune niche", value: "—" }];

    const top3 = entries.slice(0, 3);
    const metrics: Metric[] = top3.map((n) => ({ label: n.name, value: fmtEur(n.cash) }));

    // Taux conversion moyen pondéré (total signed / total deals toutes niches)
    const totalDealsAll = entries.reduce((s, n) => s + n.totalDeals, 0);
    const signedDealsAll = entries.reduce((s, n) => s + n.signedDeals, 0);
    const tauxMoyen = totalDealsAll ? (signedDealsAll / totalDealsAll) * 100 : 0;
    metrics.push({ label: "Taux conversion moyen", value: fmtPct(tauxMoyen) });
    return metrics;
  }, [user]);
}

// ─── Métriques "Global" ─────────────────────────────────────────────────────
function useGlobalMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];

    const allDeals = user.challenges.flatMap((ch) => ch.deals);
    const totalDeals = allDeals.length;
    const signedDeals = allDeals.filter(d => d.montantContracte > 0).length;
    const tauxConversion = totalDeals ? (signedDeals / totalDeals) * 100 : 0;

    const totalContracte = allDeals.reduce((s, d) => s + d.montantContracte, 0);
    const totalCollecte = allDeals.reduce((s, d) => s + d.montantCollecte, 0);
    const collectePct = totalContracte ? (totalCollecte / totalContracte) * 100 : 0;

    const fullPayCount = allDeals.filter(d => d.typeVente === "FULL_PAY").length;
    const fullPayPct = totalDeals ? (fullPayCount / totalDeals) * 100 : 0;

    const scores = user.monthlyScores ?? [];
    const closeScore =
      scores.length > 0
        ? Math.round(scores.reduce((s, m) => s + (m.scoreFinal ?? 0), 0) / scores.length)
        : 0;

    return [
      { label: "Taux conversion", value: fmtPct(tauxConversion) },
      { label: "Cash contracté", value: fmtEur(totalContracte) },
      { label: "Cash collecté", value: fmtEur(totalCollecte) },
      { label: "Taux collecte", value: fmtPct(collectePct) },
      { label: "Full Pay", value: fmtPct(fullPayPct) },
      { label: "Close Score", value: closeScore > 0 ? String(closeScore) : "—" },
    ];
  }, [user]);
}

// ─── Graphique cash cumulé (basé sur createdAt ou date de collecte) ─────────
function useCashChartData(user: UserType | null) {
  return useMemo(() => {
    if (!user) return [{ date: "Aucune donnée", cash: 0 }];

    const byDay: Record<string, number> = {};

    for (const ch of user.challenges) {
      for (const deal of ch.deals) {
        if (deal.montantCollecte <= 0) continue;
        let date = deal.dateClose ?? deal.dateR2 ?? deal.createdAt;
        if (!date) continue;
        const key = toDateKey(date);
        byDay[key] = (byDay[key] ?? 0) + deal.montantCollecte;
      }
    }

    const sortedDays = Object.keys(byDay).sort((a, b) => a.localeCompare(b));
    if (sortedDays.length === 0) {
      return [{ date: "Aujourd'hui", cash: 0 }];
    }

    let cumul = 0;
    const data = sortedDays.map((dateStr) => {
      cumul += byDay[dateStr];
      const label = new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      return { date: label, cash: cumul };
    });
    return data;
  }, [user]);
}

// ─── Calendrier mensuel (basé sur dateR1, dateR2 et createdAt) ─────────────
function useCalendarData(user: UserType | null) {
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayRaw = new Date(year, month, 1).getDay();
    const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

    const entryByDay: Record<number, { r1: number; closes: number; cash: number }> = {};

    if (user) {
      for (const ch of user.challenges) {
        for (const entry of ch.dailyEntries) {
          const d = new Date(entry.date);
          if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!entryByDay[day]) entryByDay[day] = { r1: 0, closes: 0, cash: 0 };
            entryByDay[day].r1 += entry.r1Effectue;
            entryByDay[day].closes += entry.nbCloses;
          }
        }
        for (const deal of ch.deals) {
          if (deal.dateR1) {
            const d = new Date(deal.dateR1);
            if (d.getFullYear() === year && d.getMonth() === month) {
              const day = d.getDate();
              if (!entryByDay[day]) entryByDay[day] = { r1: 0, closes: 0, cash: 0 };
              entryByDay[day].r1 += 1;
            }
          }
          if (deal.dateR2 && deal.montantCollecte > 0) {
            const d = new Date(deal.dateR2);
            if (d.getFullYear() === year && d.getMonth() === month) {
              const day = d.getDate();
              if (!entryByDay[day]) entryByDay[day] = { r1: 0, closes: 0, cash: 0 };
              entryByDay[day].closes += 1;
              entryByDay[day].cash += deal.montantCollecte;
            }
          } else if (deal.createdAt && deal.montantCollecte > 0) {
            const d = new Date(deal.createdAt);
            if (d.getFullYear() === year && d.getMonth() === month) {
              const day = d.getDate();
              if (!entryByDay[day]) entryByDay[day] = { r1: 0, closes: 0, cash: 0 };
              entryByDay[day].cash += deal.montantCollecte;
            }
          }
        }
      }
    }

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const data = entryByDay[day];
      return {
        day,
        hasActivity: !!data && (data.r1 > 0 || data.closes > 0 || data.cash > 0),
        hasClose: !!data && data.closes > 0,
        cash: data?.cash ?? 0,
        r1: data?.r1 ?? 0,
      };
    });

    const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return {
      days,
      offset,
      monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    };
  }, [user]);
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function StatisticsView() {
  const user = useUser();
  const [level, setLevel] = useState<Level>("Global");

  const dayMetrics = useDayMetrics(user);
  const challengeMetrics = useChallengeMetrics(user);
  const infopreneurMetrics = useInfopreneurMetrics(user);
  const nicheMetrics = useNicheMetrics(user);
  const globalMetrics = useGlobalMetrics(user);
  const cashChartData = useCashChartData(user);
  const { days, offset, monthLabel } = useCalendarData(user);

  const totalCollecte = user
    ? user.challenges.flatMap((ch) => ch.deals).reduce((s, d) => s + d.montantCollecte, 0)
    : 0;

  const metrics: Record<Level, Metric[]> = {
    Journée: dayMetrics,
    Challenge: challengeMetrics,
    Infopreneur: infopreneurMetrics,
    Niche: nicheMetrics,
    Global: globalMetrics,
  };

  if (!user) {
    return (
      <div className="py-20 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
          Stats
        </h2>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Analysez vos performances à tous les niveaux
        </p>
      </div>

      {/* Level selector */}
      <div className="flex gap-1 flex-wrap">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              level === l
                ? {
                    backgroundColor: "hsl(var(--primary) / 0.15)",
                    color: "hsl(var(--primary))",
                    border: "1px solid hsl(var(--primary) / 0.25)",
                  }
                : { color: "hsl(var(--muted-foreground))" }
            }
            onMouseEnter={(e) => {
              if (level !== l) e.currentTarget.style.color = "hsl(var(--foreground))";
            }}
            onMouseLeave={(e) => {
              if (level !== l) e.currentTarget.style.color = "hsl(var(--muted-foreground))";
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {metrics[level].map((m) => (
          <div
            key={m.label}
            className="p-4"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border) / 0.5)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider mb-1"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {m.label}
            </p>
            <p className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Cash chart */}
      <div
        className="p-5"
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border) / 0.5)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold" style={{ color: "hsl(var(--foreground))" }}>
            Cash collecté cumulé
          </h3>
          <span className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>
            {fmtEur(totalCollecte)}
          </span>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={cashChartData}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => fmtEur(value as number)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: unknown) => {
                  const num = typeof value === "number" ? value : 0;
                  return fmtEur(num);
                }}
              />
              <Area
                type="monotone"
                dataKey="cash"
                stroke="hsl(var(--primary))"
                fill="url(#cashGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar */}
      <div
        className="p-5"
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border) / 0.5)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <h3 className="text-base font-semibold mb-4" style={{ color: "hsl(var(--foreground))" }}>
          Calendrier — {monthLabel}
        </h3>
        <div className="grid grid-cols-7 gap-1.5">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div
              key={i}
              className="text-center text-[10px] py-1"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {d}
            </div>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {days.map((d) => (
            <div
              key={d.day}
              className="text-center py-2 rounded-lg text-xs"
              style={
                d.hasClose
                  ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }
                  : d.hasActivity
                  ? { backgroundColor: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" }
                  : { backgroundColor: "hsl(var(--secondary) / 0.3)", color: "hsl(var(--muted-foreground))" }
              }
            >
              <div className="font-semibold">{d.day}</div>
              <div className="text-[9px]">
                {d.cash > 0
                  ? `${(d.cash / 1000).toFixed(0)}k€`
                  : d.r1 > 0
                  ? `${d.r1} R1`
                  : "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
            Deal closé
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--accent))" }} />
            Activité (R1/R2)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--muted))" }} />
            Pas d'activité
          </span>
        </div>
      </div>
    </div>
  );
}