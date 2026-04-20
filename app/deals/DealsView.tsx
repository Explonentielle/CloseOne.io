"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type DealStatus = "En cours" | "Gagné" | "Perdu";

interface Deal {
  id: number;
  name: string;
  client: string;
  amount: number;
  commission: number;
  status: DealStatus;
}

const mockDeals: Deal[] = [
  {
    id: 1,
    name: "Contrat SaaS Premium",
    client: "TechCorp",
    amount: 24000,
    commission: 2400,
    status: "Gagné",
  },
  {
    id: 2,
    name: "Licence Enterprise",
    client: "DataFlow",
    amount: 18500,
    commission: 1850,
    status: "Gagné",
  },
  {
    id: 3,
    name: "Consulting Pack",
    client: "StartupXYZ",
    amount: 8000,
    commission: 960,
    status: "En cours",
  },
  {
    id: 4,
    name: "Formation Équipe",
    client: "MegaRetail",
    amount: 12000,
    commission: 1200,
    status: "En cours",
  },
  {
    id: 5,
    name: "Setup Infrastructure",
    client: "CloudNine",
    amount: 35000,
    commission: 3500,
    status: "Gagné",
  },
  {
    id: 6,
    name: "Migration Cloud",
    client: "OldSchool Inc",
    amount: 15000,
    commission: 1500,
    status: "Perdu",
  },
  {
    id: 7,
    name: "Audit Sécurité",
    client: "SecureBank",
    amount: 22000,
    commission: 2640,
    status: "En cours",
  },
  {
    id: 8,
    name: "API Integration",
    client: "FinTechPro",
    amount: 9500,
    commission: 950,
    status: "Gagné",
  },
];

function StatusBadge({ status }: { status: DealStatus }) {
  const config = {
    Gagné: {
      bg: "rgba(0,194,122,0.15)",
      text: "#00C27A",
      icon: CheckCircle,
      shadow: "0 0 8px rgba(0,194,122,0.3)",
    },
    "En cours": {
      bg: "rgba(59,130,246,0.15)",
      text: "#3B82F6",
      icon: Clock,
      shadow: "none",
      border: "1px solid rgba(59,130,246,0.4)",
    },
    Perdu: {
      bg: "rgba(248,113,113,0.15)",
      text: "#F87171",
      icon: XCircle,
      shadow: "none",
    },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        boxShadow: config.shadow,
        border: "border" in config ? config.border : "none",
      }}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

export default function DealsView() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "Tous">("Tous");
  const [sortBy, setSortBy] = useState<"amount" | "commission" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = mockDeals
    .filter((d) => filterStatus === "Tous" || d.status === filterStatus)
    .filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.client.toLowerCase().includes(search.toLowerCase()),
    );

  const sorted = sortBy
    ? [...filtered].sort((a, b) =>
        sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy],
      )
    : filtered;

  const toggleSort = (col: "amount" | "commission") => {
    if (sortBy === col) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const totalCA = mockDeals
    .filter((d) => d.status === "Gagné")
    .reduce((s, d) => s + d.amount, 0);
  const totalComm = mockDeals
    .filter((d) => d.status === "Gagné")
    .reduce((s, d) => s + d.commission, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Deals</h2>
          <p className="text-[#A0A0A0] text-sm mt-1">
            Gérez tous vos deals commerciaux
          </p>
        </div>
        <Link
          href="/deals/adddeals"
          className="gradient-primary text-[#0D1117] px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Ajouter un Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Deals", value: mockDeals.length, color: "white" },
          {
            label: "CA Gagné",
            value: `€${(totalCA / 1000).toFixed(0)}K`,
            color: "#0EFF9C",
          },
          {
            label: "Commissions",
            value: `€${(totalComm / 1000).toFixed(1)}K`,
            color: "#0EFF9C",
          },
          {
            label: "Taux de closing",
            value: `${Math.round((mockDeals.filter((d) => d.status === "Gagné").length / mockDeals.length) * 100)}%`,
            color: "white",
          },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-xs text-[#A0A0A0]">{s.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un deal ou client..."
            className="w-full h-10 rounded-lg border border-[#2A2F35] bg-[#1A1F24] pl-10 pr-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50"
          />
        </div>
        <div className="flex gap-2">
          {(["Tous", "En cours", "Gagné", "Perdu"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s
                  ? "gradient-primary text-[#0D1117]"
                  : "bg-[#1A1F24] text-[#A0A0A0] hover:text-white border border-[#2A2F35]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2F35]">
                <th className="text-left px-5 py-3 text-xs text-[#A0A0A0] font-medium">
                  Deal
                </th>
                <th className="text-left px-5 py-3 text-xs text-[#A0A0A0] font-medium">
                  Client
                </th>
                <th
                  className="text-left px-5 py-3 text-xs text-[#A0A0A0] font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("amount")}
                >
                  <span className="flex items-center gap-1">
                    Montant <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  className="text-left px-5 py-3 text-xs text-[#A0A0A0] font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("commission")}
                >
                  <span className="flex items-center gap-1">
                    Commission <ArrowUpDown size={12} />
                  </span>
                </th>
                <th className="text-left px-5 py-3 text-xs text-[#A0A0A0] font-medium">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-[#2A2F35]/50 last:border-0 hover:bg-[#1A1F24] transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium">{d.name}</td>
                  <td className="px-5 py-3.5 text-[#A0A0A0]">{d.client}</td>
                  <td className="px-5 py-3.5">
                    €{d.amount.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3.5 text-[#0EFF9C] font-semibold">
                    €{d.commission.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#A0A0A0]">
                    Aucun deal trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
