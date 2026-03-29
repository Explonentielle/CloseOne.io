"use client";

import { useState } from "react";
import {
  Search,
  X,
  Users,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Calendar,
  Target,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

interface Ecosystem {
  id: number;
  name: string;
  type: "Écosystème" | "Infopreneur";
  theme: string;
  logo: string;
  description: string;
  closers: number;
  avgCommission: string;
  partner: boolean;
  challengeActive: boolean;
}

const ecosystems: Ecosystem[] = [
  {
    id: 1,
    name: "ScaleUp Academy",
    type: "Écosystème",
    theme: "SaaS B2B",
    logo: "SA",
    description:
      "Écosystème leader pour les closers SaaS. Formations, leads qualifiés et communauté active.",
    closers: 45,
    avgCommission: "12%",
    partner: true,
    challengeActive: true,
  },
  {
    id: 2,
    name: "CloserPro",
    type: "Infopreneur",
    theme: "Coaching",
    logo: "CP",
    description:
      "Réseau de closers spécialisés dans le coaching et le développement personnel.",
    closers: 32,
    avgCommission: "15%",
    partner: true,
    challengeActive: false,
  },
  {
    id: 3,
    name: "Digital Empire",
    type: "Écosystème",
    theme: "E-commerce",
    logo: "DE",
    description:
      "Plateforme e-commerce avec une communauté de closers dédiée au high-ticket.",
    closers: 28,
    avgCommission: "10%",
    partner: false,
    challengeActive: true,
  },
  {
    id: 4,
    name: "LeadMachine",
    type: "Infopreneur",
    theme: "Marketing",
    logo: "LM",
    description:
      "Spécialiste du marketing digital avec des offres high-ticket exclusives.",
    closers: 19,
    avgCommission: "18%",
    partner: false,
    challengeActive: false,
  },
  {
    id: 5,
    name: "FinanceFlow",
    type: "Écosystème",
    theme: "Finance",
    logo: "FF",
    description:
      "Écosystème finance et investissement. Produits premium pour closers expérimentés.",
    closers: 22,
    avgCommission: "14%",
    partner: true,
    challengeActive: true,
  },
  {
    id: 6,
    name: "HealthPeak",
    type: "Infopreneur",
    theme: "Santé",
    logo: "HP",
    description:
      "Réseau santé et bien-être avec des programmes de coaching premium.",
    closers: 15,
    avgCommission: "16%",
    partner: false,
    challengeActive: false,
  },
];

interface Challenge {
  id: number;
  name: string;
  ecosystem: string;
  startDate: string;
  endDate: string;
  objective: string;
  status: "En cours" | "Terminé" | "À venir";
  participants: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    name: "Sprint Q1",
    ecosystem: "ScaleUp Academy",
    startDate: "1 Jan",
    endDate: "31 Mar",
    objective: "50 deals closés",
    status: "En cours",
    participants: 28,
  },
  {
    id: 2,
    name: "Marathon Closer",
    ecosystem: "CloserPro",
    startDate: "15 Fév",
    endDate: "15 Mar",
    objective: "€100K de CA",
    status: "Terminé",
    participants: 42,
  },
  {
    id: 3,
    name: "Top Performer",
    ecosystem: "Digital Empire",
    startDate: "1 Avr",
    endDate: "30 Avr",
    objective: "Taux closing > 40%",
    status: "À venir",
    participants: 15,
  },
  {
    id: 4,
    name: "Commission Race",
    ecosystem: "FinanceFlow",
    startDate: "1 Mar",
    endDate: "31 Mar",
    objective: "€15K commissions",
    status: "En cours",
    participants: 19,
  },
];

function challengeStatusStyle(status: string): React.CSSProperties {
  if (status === "En cours")
    return { background: "rgba(14,255,156,0.1)", color: "#0EFF9C" };
  if (status === "À venir")
    return { background: "rgba(245,158,11,0.1)", color: "#F59E0B" };
  return { background: "#1A1F24", color: "#A0A0A0" };
}

const topClosers = [
  {
    name: "Sophie Martin",
    initials: "SM",
    eco: "ScaleUp Academy",
    ca: "€145K",
  },
  { name: "Lucas Bernard", initials: "LB", eco: "CloserPro", ca: "€132K" },
  { name: "Emma Dubois", initials: "ED", eco: "Digital Empire", ca: "€118K" },
  { name: "Thomas Petit", initials: "TP", eco: "FinanceFlow", ca: "€98K" },
  { name: "Léa Moreau", initials: "LM", eco: "ScaleUp Academy", ca: "€92K" },
];

export default function EcosystemsView() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ecosystem | null>(null);
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [participating, setParticipating] = useState<Set<number>>(new Set());

  const filtered = ecosystems.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.theme.toLowerCase().includes(search.toLowerCase()),
  );

  const handleJoin = (eco: Ecosystem) => {
    setJoined((prev) => new Set(prev).add(eco.id));
    toast.success(`Demande envoyée à ${eco.name} !`, {
      description: "Vous serez notifié de la réponse.",
    });
    setSelected(null);
  };

  const handleParticipate = (ch: Challenge) => {
    setParticipating((prev) => new Set(prev).add(ch.id));
    toast.success(`Inscrit au challenge "${ch.name}" !`);
  };

  const inputClass =
    "w-full h-10 rounded-lg border border-[#2A2F35] bg-[#1A1F24] pl-10 pr-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50";

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Écosystèmes & Challenges</h2>
          <p className="text-[#A0A0A0] text-sm mt-1">
            Explorez les opportunités et participez aux challenges
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Ecosystem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((eco) => (
          <div
            key={eco.id}
            className="glass-card p-5 transition-all duration-300 group hover:border-[#0EFF9C]/30 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-[#0D1117] shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                }}
              >
                {eco.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate text-white">
                  {eco.name}
                </h3>
                <p className="text-xs text-[#A0A0A0]">
                  {eco.type} · {eco.theme}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {eco.partner && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    background: "rgba(14,255,156,0.1)",
                    color: "#0EFF9C",
                  }}
                >
                  Partenaire
                </span>
              )}
              {eco.challengeActive && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    color: "#F59E0B",
                  }}
                >
                  Challenge actif
                </span>
              )}
              {joined.has(eco.id) && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    background: "rgba(0,194,122,0.1)",
                    color: "#00C27A",
                  }}
                >
                  Rejoint ✓
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[#A0A0A0]">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {eco.closers}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} /> {eco.avgCommission}
                </span>
              </div>
              <button
                onClick={() => setSelected(eco)}
                className="text-xs text-[#0EFF9C] font-medium flex items-center gap-1 hover:underline"
              >
                Voir <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Challenges Slider */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Challenges</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className="glass-card p-5 min-w-[280px] snap-start shrink-0 hover:border-[#0EFF9C]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={challengeStatusStyle(ch.status)}
                >
                  {ch.status}
                </span>
                <Trophy size={16} className="text-[#A0A0A0]" />
              </div>
              <h4 className="font-semibold text-sm mb-1 text-white">
                {ch.name}
              </h4>
              <p className="text-xs text-[#A0A0A0] mb-3">{ch.ecosystem}</p>
              <div className="space-y-2 text-xs text-[#A0A0A0]">
                <div className="flex items-center gap-2">
                  <Calendar size={12} /> {ch.startDate} → {ch.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Target size={12} /> {ch.objective}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} /> {ch.participants} participants
                </div>
              </div>

              {ch.status === "À venir" && !participating.has(ch.id) && (
                <button
                  onClick={() => handleParticipate(ch)}
                  className="mt-4 w-full h-9 rounded-lg text-[#0D1117] text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                  }}
                >
                  Participer
                </button>
              )}
              {ch.status === "À venir" && participating.has(ch.id) && (
                <button
                  disabled
                  className="mt-4 w-full h-9 rounded-lg text-xs font-medium cursor-default"
                  style={{
                    background: "rgba(0,194,122,0.1)",
                    color: "#00C27A",
                  }}
                >
                  ✓ Inscrit
                </button>
              )}
              {ch.status === "En cours" && (
                <button
                  onClick={() =>
                    toast.info(
                      `Classement du challenge "${ch.name}" bientôt disponible`,
                    )
                  }
                  className="mt-4 w-full h-9 rounded-lg bg-[#1A1F24] border border-[#2A2F35] text-white text-xs font-medium hover:bg-[#2A2F35] transition-colors"
                >
                  Voir le classement
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Closers */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">
          Top Closers des Écosystèmes
        </h3>
        <div className="glass-card divide-y divide-[#2A2F35]/50">
          {topClosers.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#1A1F24] transition-colors"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#0D1117] shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                }}
              >
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {c.name}
                </p>
                <p className="text-xs text-[#A0A0A0]">{c.eco}</p>
              </div>
              <span className="text-sm font-bold text-[#0EFF9C]">{c.ca}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(13,17,23,0.85)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-card p-6 w-full max-w-lg animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-[#0D1117]"
                  style={{
                    background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                  }}
                >
                  {selected.logo}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selected.name}
                  </h3>
                  <p className="text-xs text-[#A0A0A0]">
                    {selected.type} · {selected.theme}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[#A0A0A0] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-[#A0A0A0] mb-5">
              {selected.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#0D1117] rounded-lg p-3 border border-[#2A2F35]">
                <p className="text-xs text-[#A0A0A0]">Closers actifs</p>
                <p className="text-xl font-bold mt-1 text-white">
                  {selected.closers}
                </p>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 border border-[#2A2F35]">
                <p className="text-xs text-[#A0A0A0]">Commission moy.</p>
                <p className="text-xl font-bold mt-1 text-[#0EFF9C]">
                  {selected.avgCommission}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {joined.has(selected.id) ? (
                <button
                  disabled
                  className="flex-1 h-10 rounded-lg text-sm font-medium cursor-default"
                  style={{
                    background: "rgba(0,194,122,0.1)",
                    color: "#00C27A",
                  }}
                >
                  ✓ Demande envoyée
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(selected)}
                  className="flex-1 h-10 rounded-lg text-[#0D1117] text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{
                    background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                  }}
                >
                  Rejoindre
                </button>
              )}
              <button
                onClick={() => toast.info("Lien externe bientôt disponible")}
                className="h-10 px-4 rounded-lg bg-[#1A1F24] border border-[#2A2F35] text-white text-sm font-medium hover:bg-[#2A2F35] transition-colors flex items-center gap-2"
              >
                <ExternalLink size={14} /> Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
