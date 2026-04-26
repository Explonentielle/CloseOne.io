"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Send,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

type DealStatus =
  | "Finalisé"
  | "Non signé"
  | "En attente de paiement"
  | "Paiement en cours"
  | "R2 en attente";

interface Deal {
  id: string;
  name: string;
  client: string;
  contracted: number;
  collected: number;
  status: DealStatus;
  commission: number;
  delaiConversion: number | null;
  typeVente: string | null;
  nbMensualites: string | null;
}

// Correction : utiliser dateR2 au lieu de dateClose
function computeDealStatus(
  montantContracte: number,
  montantCollecte: number,
  typeVente: string | null,
  dateR2: Date | null
): DealStatus {
  // Finalisé : contrat signé et encaissement total
  if (montantContracte > 0 && montantCollecte >= montantContracte) {
    return "Finalisé";
  }
  // Non signé : pas de contrat ET pas de R2 planifié
  if (montantContracte === 0 && dateR2 === null) {
    return "Non signé";
  }
  // En attente de paiement : Full Pay signé mais rien encaissé
  if (typeVente === "FULL_PAY" && montantContracte > 0 && montantCollecte === 0) {
    return "En attente de paiement";
  }
  // Paiement en cours : Split Pay signé (peu importe le collecté)
  if (typeVente === "SPLIT_PAY" && montantContracte > 0) {
    return "Paiement en cours";
  }
  // R2 en attente : pas de contrat mais R2 planifié
  if (montantContracte === 0 && dateR2 !== null) {
    return "R2 en attente";
  }
  return "Non signé";
}

function StatusBadge({ status }: { status: DealStatus }) {
  const config = {
    Finalisé: {
      bg: "hsl(var(--primary) / 0.15)",
      text: "hsl(var(--primary))",
      icon: CheckCircle,
    },
    "Non signé": {
      bg: "hsl(var(--muted) / 0.3)",
      text: "hsl(var(--muted-foreground))",
      icon: FileText,
    },
    "En attente de paiement": {
      bg: "hsl(var(--warning) / 0.15)",
      text: "hsl(var(--warning))",
      icon: Clock,
    },
    "Paiement en cours": {
      bg: "hsl(var(--warning) / 0.2)",
      text: "hsl(var(--warning))",
      icon: CreditCard,
    },
    "R2 en attente": {
      bg: "hsl(var(--info) / 0.15)",
      text: "hsl(var(--info))",
      icon: Send,
    },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
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
  const [sortBy, setSortBy] = useState<"contracted" | "collected" | "commission" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const userDeals = useMemo<Deal[]>(() => {
    if (!user?.challenges) return [];

    const deals: Deal[] = [];

    for (const challenge of user.challenges) {
      const infopreneur = challenge.infopreneur;
      const clientName = infopreneur?.nom ?? "Client inconnu";

      if (challenge.deals && challenge.deals.length > 0) {
        for (const deal of challenge.deals) {
          const packageName = deal.package?.nomPackage ?? "Deal";
          const dealName = `${packageName} - ${challenge.label ?? `Challenge #${challenge.numero}`}`;

          console.log(deal)
          const status = computeDealStatus(
            deal.montantContracte,
            deal.montantCollecte,
            deal.typeVente,
            deal.dateR2 
          );

          const commission = deal.montantContracte * 0.1; // 10%

          deals.push({
            id: deal.id,
            name: dealName,
            client: clientName,
            contracted: deal.montantContracte,
            collected: deal.montantCollecte,
            status,
            commission,
            delaiConversion: deal.delaiConversion,
            typeVente: deal.typeVente,
            nbMensualites: deal.nbMensualites,
          });
        }
      }
    }
    return deals;
  }, [user]);

  // Deal fictif si aucun deal existant
  const fakeDeal: Deal | null = useMemo(() => {
    if (userDeals.length > 0) return null;
    return {
      id: "fake-deal",
      name: "✨ Nouveau deal à saisir",
      client: "Créez votre premier deal",
      contracted: 0,
      collected: 0,
      status: "Non signé",
      commission: 0,
      delaiConversion: null,
      typeVente: "FULL_PAY",
      nbMensualites: null,
    };
  }, [userDeals]);

  const filteredReal = userDeals
    .filter((d) => filterStatus === "Tous" || d.status === filterStatus)
    .filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.client.toLowerCase().includes(search.toLowerCase())
    );

  const sortedReal = sortBy
    ? [...filteredReal].sort((a, b) =>
        sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
      )
    : filteredReal;

  let displayedDeals = sortedReal;
  if (fakeDeal && sortedReal.length === 0 && filterStatus === "Tous") {
    displayedDeals = [fakeDeal];
  }

  const toggleSort = (col: "contracted" | "collected" | "commission") => {
    if (sortBy === col) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  // Statistiques
  const totalDealsCount = userDeals.length;
  const totalContracted = userDeals.reduce((s, d) => s + d.contracted, 0);
  const totalCollected = userDeals.reduce((s, d) => s + d.collected, 0);
  const totalCommission = userDeals.reduce((s, d) => s + d.commission, 0);
  const finalisedCount = userDeals.filter((d) => d.status === "Finalisé").length;
  const tauxFinalisation = totalDealsCount ? Math.round((finalisedCount / totalDealsCount) * 100) : 0;

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

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Deals", value: totalDealsCount, color: "foreground" },
          { label: "Total contracté", value: `${totalContracted.toLocaleString("fr-FR")}€`, color: "foreground" },
          { label: "Total collecté", value: `${totalCollected.toLocaleString("fr-FR")}€`, color: "primary" },
          { label: "Commissions", value: `${totalCommission.toLocaleString("fr-FR")}€`, color: "primary" },
          { label: "Taux finalisation", value: `${tauxFinalisation}%`, color: "foreground" },
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

      {/* Filtres */}
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
        <div className="flex gap-2 flex-wrap">
          {(["Tous", "Finalisé", "Non signé", "En attente de paiement", "Paiement en cours", "R2 en attente"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
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

      {/* Tableau */}
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
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Deal</th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium cursor-pointer" style={{ color: "hsl(var(--muted-foreground))" }} onClick={() => toggleSort("contracted")}>
                  <span className="flex items-center gap-1">Contracté <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium cursor-pointer" style={{ color: "hsl(var(--muted-foreground))" }} onClick={() => toggleSort("collected")}>
                  <span className="flex items-center gap-1">Collecté <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium cursor-pointer" style={{ color: "hsl(var(--muted-foreground))" }} onClick={() => toggleSort("commission")}>
                  <span className="flex items-center gap-1">Commission <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Délai (j)</th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Mensualités</th>
                <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Statut</th>
               </tr>
            </thead>
            <tbody>
              {displayedDeals.map((d) => (
                <tr
                  key={d.id}
                  className="last:border-0 transition-colors"
                  style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "hsl(var(--secondary))"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <td className="px-5 py-3.5 font-medium" style={{ color: d.id === "fake-deal" ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>
                    {d.name}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--muted-foreground))" }}>{d.client}</td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--foreground))" }}>
                    {d.contracted > 0 ? `€${d.contracted.toLocaleString("fr-FR")}` : "—"}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--foreground))" }}>
                    {d.collected > 0 ? `€${d.collected.toLocaleString("fr-FR")}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "hsl(var(--primary))" }}>
                    {d.commission > 0 ? `€${d.commission.toLocaleString("fr-FR")}` : "—"}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {d.delaiConversion ?? "—"}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {d.typeVente === "FULL_PAY" ? "Full Pay" : d.typeVente === "SPLIT_PAY" ? "Split Pay" : "—"}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {d.nbMensualites ? d.nbMensualites.replace("X", "") + " fois" : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {d.id === "fake-deal" ? (
                      <span className="text-xs text-primary/70 italic">À créer</span>
                    ) : (
                      <StatusBadge status={d.status} />
                    )}
                  </td>
                </tr>
              ))}
              {displayedDeals.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12" style={{ color: "hsl(var(--muted-foreground))" }}>
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