"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const levels = ["Journée", "Challenge", "Infopreneur", "Niche", "Global"] as const;
type Level = (typeof levels)[number];

const cashData = [
  { date: "1 mars", cash: 0 },
  { date: "5 mars", cash: 1200 },
  { date: "10 mars", cash: 2800 },
  { date: "15 mars", cash: 3600 },
  { date: "20 mars", cash: 5100 },
  { date: "25 mars", cash: 6200 },
  { date: "31 mars", cash: 7400 },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const hasClose = [3, 7, 10, 14, 18, 22, 25, 28, 31].includes(day);
  return { day, hasClose, cash: hasClose ? [1200, 800, 1500, 2000, 600, 1800, 900, 1400, 1200][Math.floor(Math.random() * 9)] : 0 };
});

const metrics: Record<Level, { label: string; value: string }[]> = {
  Journée: [
    { label: "R1 effectués", value: "3" },
    { label: "Closes", value: "1" },
    { label: "Cash", value: "1 800€" },
    { label: "Taux", value: "33%" },
  ],
  Challenge: [
    { label: "Taux de conversion", value: "28%" },
    { label: "Durée moy. closing", value: "2.4j" },
    { label: "Cash contracté", value: "12 500€" },
    { label: "Cash collecté", value: "9 200€" },
    { label: "Full Pay", value: "60%" },
    { label: "Close Score", value: "82" },
  ],
  Infopreneur: [
    { label: "Taux de conversion", value: "31%" },
    { label: "Cash contracté", value: "38 000€" },
    { label: "Cash collecté %", value: "78%" },
    { label: "Full Pay vs Split", value: "65/35" },
    { label: "Temps signature", value: "1.8j" },
    { label: "Close Score", value: "82" },
  ],
  Niche: [
    { label: "Business & Scaling", value: "42 000€" },
    { label: "Dev. personnel", value: "18 000€" },
    { label: "Fitness & Santé", value: "8 500€" },
    { label: "Taux moyen", value: "33%" },
  ],
  Global: [
    { label: "Taux de conversion", value: "33%" },
    { label: "Cash total contracté", value: "68 500€" },
    { label: "Cash total collecté", value: "52 100€" },
    { label: "Taux collecte", value: "76%" },
    { label: "Full Pay ratio", value: "65%" },
    { label: "Close Score", value: "82" },
  ],
};

export default function StatisticsView() {
  const [level, setLevel] = useState<Level>("Global");

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
                : {
                    color: "hsl(var(--muted-foreground))",
                  }
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

      {/* Metrics */}
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

      {/* Cash Chart */}
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
            7 400€
          </span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashData}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 12,
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
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
          Calendrier — Mars 2026
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
          {/* offset for march 2026 starting on Sunday */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {calendarDays.map((d) => (
            <div
              key={d.day}
              className="text-center py-2 rounded-lg text-xs"
              style={
                d.hasClose
                  ? {
                      backgroundColor: "hsl(var(--primary) / 0.15)",
                      color: "hsl(var(--primary))",
                    }
                  : {
                      backgroundColor: "hsl(var(--secondary) / 0.3)",
                      color: "hsl(var(--muted-foreground))",
                    }
              }
            >
              <div className="font-semibold">{d.day}</div>
              <div className="text-[9px]">{d.hasClose ? `${d.cash}€` : "0€"}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
            Deal closé
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--muted))" }} />
            Pas de close
          </span>
        </div>
      </div>
    </div>
  );
}