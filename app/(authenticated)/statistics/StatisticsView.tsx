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

function fmtEur(n: number) {
  return `${Math.round(n).toLocaleString("fr-FR")}€`;
}
function fmtPct(n: number) {
  return `${Math.round(n)}%`;
}
function toDateKey(d: Date | string) {
  return new Date(d).toISOString().split("T")[0];
}

type Metric = { label: string; value: string };
type UserType = NonNullable<ReturnType<typeof useUser>>;

const getAllDeals = (user: UserType) => {
  const challengeDeals = user.challenges.flatMap(ch => ch.deals);
  const directDeals = user.deals ?? [];
  return [...challengeDeals, ...directDeals];
};

// Journée
function useDayMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];
    const todayKey = toDateKey(new Date());
    let r1Effectue = 0, r2Effectue = 0, signedDealsToday = 0, totalDealsToday = 0, cashToday = 0;
    const allDeals = getAllDeals(user);
    for (const deal of allDeals) {
      const createdAtKey = deal.createdAt ? toDateKey(deal.createdAt) : null;
      const dateR1Key = deal.dateR1 ? toDateKey(deal.dateR1) : null;
      const dateR2Key = deal.dateR2 ? toDateKey(deal.dateR2) : null;
      if (dateR1Key === todayKey) r1Effectue++;
      if (dateR2Key === todayKey) r2Effectue++;
      if (createdAtKey === todayKey) totalDealsToday++;
      if (createdAtKey === todayKey && deal.montantContracte > 0) signedDealsToday++;
      let collectDateKey = dateR2Key ?? dateR1Key ?? (deal.dateClose ? toDateKey(deal.dateClose) : null) ?? createdAtKey;
      if (collectDateKey === todayKey && deal.montantCollecte > 0) cashToday += deal.montantCollecte;
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

// Challenge (global)
function useChallengeMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];
    const allDeals = getAllDeals(user);
    const totalDeals = allDeals.length;
    const signedDeals = allDeals.filter(d => d.montantContracte > 0).length;
    const tauxConversion = totalDeals ? (signedDeals / totalDeals) * 100 : 0;
    const totalContracte = allDeals.reduce((s, d) => s + d.montantContracte, 0);
    const totalCollecte = allDeals.reduce((s, d) => s + d.montantCollecte, 0);
    const delais = allDeals.map(d => d.delaiConversion).filter((d): d is number => d !== null && d > 0);
    const delaiMoyen = delais.length ? delais.reduce((a, b) => a + b, 0) / delais.length : 0;
    const fullPayCount = allDeals.filter(d => d.typeVente === "FULL_PAY").length;
    const fullPayPct = totalDeals ? (fullPayCount / totalDeals) * 100 : 0;
    return [
      { label: "Taux conversion", value: fmtPct(tauxConversion) },
      { label: "Délai moy. closing", value: delaiMoyen ? `${delaiMoyen.toFixed(1)}j` : "—" },
      { label: "Cash contracté", value: fmtEur(totalContracte) },
      { label: "Cash collecté", value: fmtEur(totalCollecte) },
      { label: "Full Pay", value: fmtPct(fullPayPct) },
    ];
  }, [user]);
}

// Infopreneur (meilleur infopreneur par nombre de deals)
function useInfopreneurMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];
    const byInf: Record<string, { name: string; deals: any[] }> = {};
    const allDeals = getAllDeals(user);
    for (const deal of allDeals) {
      const inf = deal.package?.infopreneur;
      if (!inf) continue;
      if (!byInf[inf.id]) byInf[inf.id] = { name: inf.nom, deals: [] };
      byInf[inf.id].deals.push(deal);
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

// Niche (top 3 niches par cash contracté)
function useNicheMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];
    const byNiche: Record<string, { name: string; cash: number; totalDeals: number; signedDeals: number }> = {};
    const allDeals = getAllDeals(user);
    for (const deal of allDeals) {
      const inf = deal.package?.infopreneur;
      if (!inf) continue;
      const nicheName = inf.niche?.nom;
      if (!nicheName) continue;
      if (!byNiche[nicheName]) byNiche[nicheName] = { name: nicheName, cash: 0, totalDeals: 0, signedDeals: 0 };
      byNiche[nicheName].cash += deal.montantContracte;
      byNiche[nicheName].totalDeals++;
      if (deal.montantContracte > 0) byNiche[nicheName].signedDeals++;
    }
    const entries = Object.values(byNiche).sort((a, b) => b.cash - a.cash);
    if (entries.length === 0) return [{ label: "Aucune niche", value: "—" }];
    const top3 = entries.slice(0, 3);
    const metrics: Metric[] = top3.map(n => ({ label: n.name, value: fmtEur(n.cash) }));
    const totalDealsAll = entries.reduce((s, n) => s + n.totalDeals, 0);
    const signedDealsAll = entries.reduce((s, n) => s + n.signedDeals, 0);
    const tauxMoyen = totalDealsAll ? (signedDealsAll / totalDealsAll) * 100 : 0;
    metrics.push({ label: "Taux conversion moyen", value: fmtPct(tauxMoyen) });
    return metrics;
  }, [user]);
}

// Global
function useGlobalMetrics(user: UserType | null): Metric[] {
  return useMemo(() => {
    if (!user) return [];
    const allDeals = getAllDeals(user);
    const totalDeals = allDeals.length;
    const signedDeals = allDeals.filter(d => d.montantContracte > 0).length;
    const tauxConversion = totalDeals ? (signedDeals / totalDeals) * 100 : 0;
    const totalContracte = allDeals.reduce((s, d) => s + d.montantContracte, 0);
    const totalCollecte = allDeals.reduce((s, d) => s + d.montantCollecte, 0);
    const collectePct = totalContracte ? (totalCollecte / totalContracte) * 100 : 0;
    const fullPayCount = allDeals.filter(d => d.typeVente === "FULL_PAY").length;
    const fullPayPct = totalDeals ? (fullPayCount / totalDeals) * 100 : 0;
    const scores = user.monthlyScores ?? [];
    const closeScore = scores.length ? Math.round(scores.reduce((s, m) => s + (m.scoreFinal ?? 0), 0) / scores.length) : 0;
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

// Cash chart
function useCashChartData(user: UserType | null) {
  return useMemo(() => {
    if (!user) return [{ date: "Aucune donnée", cash: 0 }];
    const byDay: Record<string, number> = {};
    const allDeals = getAllDeals(user);

    for (const deal of allDeals) {
      if (deal.montantCollecte <= 0) continue;
      let date = deal.dateR2 ?? deal.dateR1 ?? deal.dateClose ?? deal.createdAt;
      if (!date) continue;
      const key = toDateKey(date);
      byDay[key] = (byDay[key] ?? 0) + deal.montantCollecte;
    }
    const sortedDays = Object.keys(byDay).sort((a, b) => a.localeCompare(b));
    if (sortedDays.length === 0) return [{ date: "Aujourd'hui", cash: 0 }];
    let cumul = 0;
    return sortedDays.map(dateStr => {
      cumul += byDay[dateStr];
      const label = new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      return { date: label, cash: cumul };
    });
  }, [user]);
}

// Calendar
function useCalendarData(user: UserType | null) {
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayRaw = new Date(year, month, 1).getDay();
    const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
    const dayMap: Record<number, { r1: number; r2: number; cash: number }> = {};
    if (user) {
      const allDeals = getAllDeals(user);
      for (const deal of allDeals) {
        if (deal.dateR1) {
          const d = new Date(deal.dateR1);
          if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!dayMap[day]) dayMap[day] = { r1: 0, r2: 0, cash: 0 };
            dayMap[day].r1++;
          }
        }
        if (deal.dateR2) {
          const d = new Date(deal.dateR2);
          if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!dayMap[day]) dayMap[day] = { r1: 0, r2: 0, cash: 0 };
            dayMap[day].r2++;
          }
        }
        if (deal.montantCollecte > 0) {
          let cashDate = deal.dateR2 ?? deal.dateR1 ?? deal.dateClose ?? deal.createdAt;
          if (cashDate) {
            const d = new Date(cashDate);
            if (d.getFullYear() === year && d.getMonth() === month) {
              const day = d.getDate();
              if (!dayMap[day]) dayMap[day] = { r1: 0, r2: 0, cash: 0 };
              dayMap[day].cash += deal.montantCollecte;
            }
          }
        }
      }
    }
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const data = dayMap[day] || { r1: 0, r2: 0, cash: 0 };
      return {
        day,
        cash: data.cash,
        r1: data.r1,
        r2: data.r2,
        hasActivity: data.r1 > 0 || data.r2 > 0 || data.cash > 0,
        hasClose: data.cash > 0,
      };
    });
    const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return { days, offset, monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1) };
  }, [user]);
}

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
  const totalCollecte = user ? getAllDeals(user).reduce((s, d) => s + d.montantCollecte, 0) : 0;

  const metrics: Record<Level, Metric[]> = {
    Journée: dayMetrics,
    Challenge: challengeMetrics,
    Infopreneur: infopreneurMetrics,
    Niche: nicheMetrics,
    Global: globalMetrics,
  };

  if (!user) {
    return <div className="py-20 text-center text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Statistiques</h2>
        <p className="text-sm mt-1 text-muted-foreground">Analysez vos performances à tous les niveaux</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {levels.map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={level === l ? { backgroundColor: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.25)" } : { color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => { if (level !== l) e.currentTarget.style.color = "hsl(var(--foreground))"; }}
            onMouseLeave={e => { if (level !== l) e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {metrics[level].map(m => (
          <div key={m.label} className="p-4 bg-card border border-border/50 rounded-sm">
            <p className="text-[10px] uppercase tracking-wider mb-1 text-muted-foreground">{m.label}</p>
            <p className="text-xl font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-card border border-border/50 rounded-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Cash collecté cumulé</h3>
          <span className="text-sm font-bold text-primary">{fmtEur(totalCollecte)}</span>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={cashChartData}>
              <defs><linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(value) => fmtEur(value as number)} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius-sm)", fontSize: 12 }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} formatter={(value: unknown) => { const num = typeof value === "number" ? value : 0; return fmtEur(num); }} />
              <Area type="monotone" dataKey="cash" stroke="hsl(var(--primary))" fill="url(#cashGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-5 bg-card border border-border/50 rounded-md">
        <h3 className="text-base font-semibold mb-4 text-foreground">Calendrier — {monthLabel}</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} className="text-center text-[10px] py-1 text-muted-foreground">{d}</div>)}
          {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
          {days.map(d => (
            <div key={d.day} className="text-center py-2 rounded-lg text-xs" style={d.hasClose ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" } : d.hasActivity ? { backgroundColor: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" } : { backgroundColor: "hsl(var(--secondary) / 0.3)", color: "hsl(var(--muted-foreground))" }}>
              <div className="font-semibold">{d.day}</div>
              <div className="text-[9px] space-y-0.5">
                {d.cash > 0 && <div>💰 {fmtEur(d.cash)}</div>}
                {d.r1 > 0 && <div>📞 Premier RDV: {d.r1}</div>}
                {d.r2 > 0 && <div>📞 Second RDV: {d.r2}</div>}
                {d.cash === 0 && d.r1 === 0 && d.r2 === 0 && "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Deal closé (cash collecté)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Second rendez-vous</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted" /> Pas d'activité</span>
        </div>
      </div>
    </div>
  );
}