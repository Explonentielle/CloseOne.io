"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  CheckCircle,
  Clock,
  FileText,
  Send,
  CreditCard,
  Loader2,
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
  dateR1: Date | null;
  dateR2: Date | null;
}

function computeDealStatus(
  montantContracte: number,
  montantCollecte: number,
  typeVente: string | null,
  dateR2: Date | null
): DealStatus {
  if (montantContracte > 0 && montantCollecte >= montantContracte) return "Finalisé";
  if (montantContracte === 0 && dateR2 === null) return "Non signé";
  if (typeVente === "FULL_PAY" && montantContracte > 0 && montantCollecte === 0) return "En attente de paiement";
  if (typeVente === "SPLIT_PAY" && montantContracte > 0) return "Paiement en cours";
  if (montantContracte === 0 && dateR2 !== null) return "R2 en attente";
  return "Non signé";
}

function StatusBadge({ status }: { status: DealStatus }) {
  const config = {
    Finalisé: { bg: "bg-primary/15", text: "text-primary", icon: CheckCircle },
    "Non signé": { bg: "bg-muted/30", text: "text-muted-foreground", icon: FileText },
    "En attente de paiement": { bg: "bg-warning/15", text: "text-warning", icon: Clock },
    "Paiement en cours": { bg: "bg-warning/20", text: "text-warning", icon: CreditCard },
    "R2 en attente": { bg: "bg-info/15", text: "text-info", icon: Send },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function DealsView() {
  const user = useUser();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "Tous">("Tous");
  const [sortBy, setSortBy] = useState<"contracted" | "collected" | "commission" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // ✅ Fusionner deals des challenges + deals directs
  const allDeals = useMemo(() => {
    if (!user) return [];
    const challengeDeals = user.challenges.flatMap((challenge) => challenge.deals);
    const directDeals = user.deals ?? [];
    
    return [...challengeDeals, ...directDeals];
  }, [user]);

  const userDeals = useMemo<Deal[]>(() => {
    const deals: Deal[] = [];
    for (const deal of allDeals) {
      // Récupérer le client (soit via le package, soit via le challenge)
      let clientName = "Client inconnu";
      if (deal.package?.infopreneur) {
        clientName = deal.package.infopreneur.nom;
      } else if (deal.challengeId) {
        const challenge = user?.challenges.find(ch => ch.id === deal.challengeId);
        if (challenge?.infopreneur) clientName = challenge.infopreneur.nom;
      }
      const packageName = deal.package?.nomPackage ?? "Deal";
      let challengeLabel = "";
      if (deal.challengeId) {
        const challenge = user?.challenges.find(ch => ch.id === deal.challengeId);
        challengeLabel = challenge?.label ? ` - ${challenge.label}` : ` - Challenge #${challenge?.numero}`;
      }
      const dealName = `${packageName}${challengeLabel}`;
      const status = computeDealStatus(deal.montantContracte, deal.montantCollecte, deal.typeVente, deal.dateR2);
      const commission = deal.montantContracte * 0.1;
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
        dateR1: deal.dateR1 ?? null,
        dateR2: deal.dateR2 ?? null,
      });
    }
    return deals;
  }, [allDeals, user]);

  const fakeDeal = useMemo(() => {
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
      dateR1: null,
      dateR2: null,
    } as Deal;
  }, [userDeals]);

  const filteredReal = userDeals
    .filter(d => filterStatus === "Tous" || d.status === filterStatus)
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase()));

  const sortedReal = sortBy
    ? [...filteredReal].sort((a, b) => (sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]))
    : filteredReal;

  let displayedDeals = sortedReal;
  if (fakeDeal && sortedReal.length === 0 && filterStatus === "Tous") {
    displayedDeals = [fakeDeal];
  }

  const toggleSort = (col: "contracted" | "collected" | "commission") => {
    if (sortBy === col) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const totalDealsCount = userDeals.length;
  const totalContracted = userDeals.reduce((s, d) => s + d.contracted, 0);
  const totalCollected = userDeals.reduce((s, d) => s + d.collected, 0);
  const totalCommission = userDeals.reduce((s, d) => s + d.commission, 0);
  const finalisedCount = userDeals.filter(d => d.status === "Finalisé").length;
  const tauxFinalisation = totalDealsCount ? Math.round((finalisedCount / totalDealsCount) * 100) : 0;

  if (!user) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Deals</h2>
          <p className="text-sm mt-1 text-muted-foreground">Gérez tous vos deals commerciaux</p>
        </div>
        <Link href="/deals/adddeals" className="px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 bg-gradient-primary text-primary-foreground">
          <Plus size={16} /> Ajouter un Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Deals", value: totalDealsCount, color: "foreground" },
          { label: "Total contracté", value: `${totalContracted.toLocaleString("fr-FR")}€`, color: "foreground" },
          { label: "Total collecté", value: `${totalCollected.toLocaleString("fr-FR")}€`, color: "primary" },
          { label: "Commissions", value: `${totalCommission.toLocaleString("fr-FR")}€`, color: "primary" },
          { label: "Taux finalisation", value: `${tauxFinalisation}%`, color: "foreground" },
        ].map(s => (
          <div key={s.label} className="p-4 bg-card border border-border/50 rounded-lg">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color === "primary" ? "text-primary" : "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un deal ou client..." className="w-full h-10 rounded-lg pl-10 pr-4 text-sm border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["Tous", "Finalisé", "Non signé", "En attente de paiement", "Paiement en cours", "R2 en attente"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterStatus === s ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground border border-border hover:bg-secondary/80"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden bg-card border border-border/50 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Deal</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium cursor-pointer select-none text-muted-foreground" onClick={() => toggleSort("contracted")}><span className="flex items-center gap-1">Contracté <ArrowUpDown size={12} /></span></th>
                <th className="text-left px-5 py-3 text-xs font-medium cursor-pointer select-none text-muted-foreground" onClick={() => toggleSort("collected")}><span className="flex items-center gap-1">Collecté <ArrowUpDown size={12} /></span></th>
                <th className="text-left px-5 py-3 text-xs font-medium cursor-pointer select-none text-muted-foreground" onClick={() => toggleSort("commission")}><span className="flex items-center gap-1">Commission <ArrowUpDown size={12} /></span></th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Délai (j)</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Mensualités</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Date R1</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Date R2</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {displayedDeals.map(d => (
                <tr key={d.id} className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary">
                  <td className={`px-5 py-3.5 font-medium ${d.id === "fake-deal" ? "text-primary" : "text-foreground"}`}>{d.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.client}</td>
                  <td className="px-5 py-3.5 text-foreground">{d.contracted > 0 ? `€${d.contracted.toLocaleString("fr-FR")}` : "—"}</td>
                  <td className="px-5 py-3.5 text-foreground">{d.collected > 0 ? `€${d.collected.toLocaleString("fr-FR")}` : "—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-primary">{d.commission > 0 ? `€${d.commission.toLocaleString("fr-FR")}` : "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.delaiConversion ?? "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.typeVente === "FULL_PAY" ? "Full Pay" : d.typeVente === "SPLIT_PAY" ? "Split Pay" : "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.nbMensualites ? d.nbMensualites.replace("X", "") + " fois" : "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(d.dateR1)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(d.dateR2)}</td>
                  <td className="px-5 py-3.5">
                    {d.id === "fake-deal" ? <span className="text-xs text-primary/70 italic">À créer</span> : <StatusBadge status={d.status} />}
                  </td>
                </tr>
              ))}
              {displayedDeals.length === 0 && (
                <tr><td colSpan={11} className="text-center py-12 text-muted-foreground">Aucun deal trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}