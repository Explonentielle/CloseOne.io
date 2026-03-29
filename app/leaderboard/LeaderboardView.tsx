"use client";

import { Trophy, Flame, TrendingUp, TrendingDown, Crown } from "lucide-react";
import CloserBadge, {
  getHighestBadge,
  getBadgesForCA,
} from "@/components/CloserBadge";

const leaders = [
  {
    rank: 1,
    name: "Sophie Martin",
    deals: 52,
    revenue: "€145K",
    ca: 145000,
    streak: 12,
    trend: "up" as const,
    avatar: "SM",
    xp: 4850,
  },
  {
    rank: 2,
    name: "Lucas Bernard",
    deals: 47,
    revenue: "€132K",
    ca: 132000,
    streak: 8,
    trend: "up" as const,
    avatar: "LB",
    xp: 4320,
  },
  {
    rank: 3,
    name: "Emma Dubois",
    deals: 43,
    revenue: "€118K",
    ca: 118000,
    streak: 15,
    trend: "up" as const,
    avatar: "ED",
    xp: 3980,
  },
  {
    rank: 4,
    name: "Thomas Petit",
    deals: 38,
    revenue: "€98K",
    ca: 98000,
    streak: 5,
    trend: "down" as const,
    avatar: "TP",
    xp: 3650,
  },
  {
    rank: 5,
    name: "Léa Moreau",
    deals: 35,
    revenue: "€92K",
    ca: 92000,
    streak: 3,
    trend: "up" as const,
    avatar: "LM",
    xp: 3420,
  },
  {
    rank: 6,
    name: "Hugo Laurent",
    deals: 31,
    revenue: "€84K",
    ca: 84000,
    streak: 7,
    trend: "down" as const,
    avatar: "HL",
    xp: 3100,
  },
  {
    rank: 7,
    name: "Chloé Roux",
    deals: 28,
    revenue: "€76K",
    ca: 76000,
    streak: 2,
    trend: "up" as const,
    avatar: "CR",
    xp: 2890,
  },
  {
    rank: 8,
    name: "Antoine Leroy",
    deals: 25,
    revenue: "€68K",
    ca: 68000,
    streak: 4,
    trend: "up" as const,
    avatar: "AL",
    xp: 2650,
  },
];

const crownColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

function avatarStyle(rank: number): React.CSSProperties {
  if (rank === 1)
    return {
      background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
      color: "#0D1117",
      boxShadow: "0 0 16px rgba(14,255,156,0.4)",
    };
  if (rank === 2) return { background: "#2A2F35", color: "#fff" };
  if (rank === 3)
    return {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      color: "#0D1117",
    };
  return { background: "#1A1F24", color: "#A0A0A0" };
}

export default function LeaderboardView() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Classement</h2>
        <p className="text-[#A0A0A0] text-sm mt-1">Top performers de ce mois</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[leaders[1], leaders[0], leaders[2]].map((l, i) => {
          const order = [2, 1, 3][i];
          const height = order === 1 ? 160 : order === 2 ? 128 : 112;
          const badges = getBadgesForCA(l.ca);
          return (
            <div key={l.rank} className="flex flex-col items-center">
              <Crown
                size={20}
                style={{ color: crownColors[order - 1] }}
                className="mb-1"
              />
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold mb-2"
                style={avatarStyle(order)}
              >
                {l.avatar}
              </div>
              <p className="font-semibold text-sm text-center">{l.name}</p>
              <div className="flex gap-1 mt-1">
                {badges.slice(-3).map((b) => (
                  <CloserBadge key={b.key} badge={b} size={20} />
                ))}
              </div>
              <p className="text-xs text-[#A0A0A0] font-mono mt-1">{l.xp} XP</p>
              <div
                className="w-full mt-3 rounded-t-lg flex flex-col items-center justify-end pb-3"
                style={{ height, ...avatarStyle(order) }}
              >
                {order === 1 && <Trophy size={20} className="mb-1" />}
                <span className="text-2xl font-bold">#{order}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div
          className="grid gap-2 px-5 py-3 text-xs text-[#A0A0A0] font-medium border-b border-[#2A2F35]"
          style={{ gridTemplateColumns: "3rem 1fr 5rem 5rem 4rem 4rem 4rem" }}
        >
          <span>#</span>
          <span>Agent</span>
          <span>Deals</span>
          <span>Revenue</span>
          <span>Série</span>
          <span>XP</span>
          <span>Badge</span>
        </div>

        {leaders.map((l) => {
          const highest = getHighestBadge(l.ca);
          return (
            <div
              key={l.rank}
              className="grid gap-2 px-5 py-3 items-center border-b border-[#2A2F35]/50 last:border-0 hover:bg-[#1A1F24] transition-colors"
              style={{
                gridTemplateColumns: "3rem 1fr 5rem 5rem 4rem 4rem 4rem",
              }}
            >
              <span
                className="text-sm font-bold font-mono"
                style={{ color: l.rank <= 3 ? "#0EFF9C" : "#A0A0A0" }}
              >
                {l.rank}
              </span>

              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={avatarStyle(l.rank)}
                >
                  {l.avatar}
                </div>
                <span className="text-sm font-medium truncate">{l.name}</span>
                {l.trend === "up" ? (
                  <TrendingUp size={14} className="text-[#0EFF9C] shrink-0" />
                ) : (
                  <TrendingDown size={14} className="text-[#F87171] shrink-0" />
                )}
              </div>

              <span className="text-sm font-mono text-white">{l.deals}</span>
              <span className="text-sm font-mono text-white">{l.revenue}</span>
              <span className="text-sm font-mono flex items-center gap-1">
                <Flame size={12} className="text-amber-400" />
                {l.streak}
              </span>
              <span className="text-sm font-mono text-[#0EFF9C]">{l.xp}</span>
              <span>
                {highest && <CloserBadge badge={highest} size={24} />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
