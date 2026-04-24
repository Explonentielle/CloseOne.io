"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

type DealStatus = "En cours" | "Gagné" | "Perdu";

interface Deal {
  id: string;
  name: string;
  client: string;
  amount: number;
  commission: number;
  status: DealStatus;
}

function StatusBadge({ status }: { status: DealStatus }) {
  const config = {
    Gagné: {
      bg: "hsl(var(--primary) / 0.15)",
      text: "hsl(var(--primary))",
      icon: CheckCircle,
    },
    "En cours": {
      bg: "hsl(var(--warning) / 0.15)",
      text: "hsl(var(--warning))",
      icon: Clock,
    },
    Perdu: {
      bg: "hsl(var(--destructive) / 0.15)",
      text: "hsl(var(--destructive))",
      icon: XCircle,
    },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

export default function DealsView() {
  const user = useUser();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "Tous">("Tous");
  const [sortBy, setSortBy] = useState<"amount" | "commission" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Transformation des données utilisateur en liste de deals
  const userDeals = useMemo<Deal[]>(() => {
    if (!user?.challenges) return [];

    const deals: Deal[] = [];

    for (const challenge of user.challenges) {
      const infopreneur = challenge.infopreneur;
      const clientName = infopreneur?.nom ?? "Client inconnu";
      // Déterminer le statut du deal à partir du statut du challenge
      let status: DealStatus = "En cours";
      if (challenge.statut === "TERMINE") status = "Gagné";
      else if (challenge.statut === "EN_COURS") status = "En cours";
      else if (challenge.statut === "A_VENIR") status = "En cours";
      // Par défaut, on ne met pas de "Perdu" car non géré

      if (challenge.deals && challenge.deals.length > 0) {
        for (const deal of challenge.deals) {
          // Nom du deal : on combine le nom du package (s'il existe) et le label du challenge
          const packageName = deal.package?.nomPackage ?? "Deal";
          const dealName = `${packageName} - ${challenge.label ?? `Challenge #${challenge.numero}`}`;

          // Commission par défaut : 10% du montant contracté (à adapter selon ton modèle)
          const commission = deal.montantContracte * 0.1;

          deals.push({
            id: deal.id,
            name: dealName,
            client: clientName,
            amount: deal.montantContracte,
            commission: commission,
            status: status,
          });
        }
      } else {
        // Si aucun deal n'est associé au challenge, on peut créer un deal fictif ?
        // Par défaut on ne fait rien. Sinon on peut ignorer.
      }
    }
    return deals;
  }, [user]);

  const filtered = userDeals
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

  const totalCA = userDeals
    .filter((d) => d.status === "Gagné")
    .reduce((s, d) => s + d.amount, 0);
  const totalComm = userDeals
    .filter((d) => d.status === "Gagné")
    .reduce((s, d) => s + d.commission, 0);
  const totalDealsCount = userDeals.length;
  const tauxClosing = totalDealsCount
    ? Math.round((userDeals.filter(d => d.status === "Gagné").length / totalDealsCount) * 100)
    : 0;

  if (!user) return <div className="py-20 text-center">Chargement...</div>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            Deals
          </h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Gérez tous vos deals commerciaux
          </p>
        </div>
        <Link
          href="/deals/adddeals"
          className="px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          style={{
            background: "var(--gradient-primary)",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          <Plus size={16} /> Ajouter un Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Deals", value: totalDealsCount, color: "foreground" },
          {
            label: "CA Gagné",
            value: `€${(totalCA / 1000).toFixed(0)}K`,
            color: "primary",
          },
          {
            label: "Commissions",
            value: `€${(totalComm / 1000).toFixed(1)}K`,
            color: "primary",
          },
          {
            label: "Taux de closing",
            value: `${tauxClosing}%`,
            color: "foreground",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border) / 0.5)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {s.label}
            </p>
            <p
              className="text-xl font-bold mt-1"
              style={{ color: s.color === "primary" ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
            >
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
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un deal ou client..."
            className="w-full h-10 rounded-lg pl-10 pr-4 text-sm"
            style={{
              border: "1px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--secondary))",
              color: "hsl(var(--foreground))",
            }}
          />
        </div>
        <div className="flex gap-2">
          {(["Tous", "En cours", "Gagné", "Perdu"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={
                filterStatus === s
                  ? {
                      background: "var(--gradient-primary)",
                      color: "hsl(var(--primary-foreground))",
                    }
                  : {
                      backgroundColor: "hsl(var(--secondary))",
                      color: "hsl(var(--muted-foreground))",
                      border: "1px solid hsl(var(--border))",
                    }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border) / 0.5)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Deal
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Client
                </th>
                <th
                  className="text-left px-5 py-3 text-xs font-medium cursor-pointer select-none"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  onClick={() => toggleSort("amount")}
                >
                  <span className="flex items-center gap-1">
                    Montant <ArrowUpDown size={12} />
                  </span>
                </th>
                <th
                  className="text-left px-5 py-3 text-xs font-medium cursor-pointer select-none"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  onClick={() => toggleSort("commission")}
                >
                  <span className="flex items-center gap-1">
                    Commission <ArrowUpDown size={12} />
                  </span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr
                  key={d.id}
                  className="last:border-0 transition-colors"
                  style={{
                    borderBottom: "1px solid hsl(var(--border) / 0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(var(--secondary))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="px-5 py-3.5 font-medium" style={{ color: "hsl(var(--foreground))" }}>
                    {d.name}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {d.client}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--foreground))" }}>
                    €{d.amount.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "hsl(var(--primary))" }}>
                    €{d.commission.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12" style={{ color: "hsl(var(--muted-foreground))" }}>
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