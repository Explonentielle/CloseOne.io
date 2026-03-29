"use client";

import { Phone, Mail, Search, ZoomIn, ZoomOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CloserBadge, { getBadgesForCA } from "@/components/CloserBadge";

interface Closer {
  id: number;
  name: string;
  role: string;
  city: string;
  sectors: string[];
  available: boolean;
  avatar: string;
  deals: number;
  revenue: string;
  ca: number;
  email: string;
  phone: string;
}

const closers: Closer[] = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Senior Closer",
    city: "Paris",
    sectors: ["SaaS", "B2B"],
    available: true,
    avatar: "SM",
    deals: 52,
    revenue: "€145K",
    ca: 145000,
    email: "sophie@closeone.io",
    phone: "+33 6 12 34 56 78",
  },
  {
    id: 2,
    name: "Lucas Bernard",
    role: "Closer",
    city: "Lyon",
    sectors: ["E-commerce"],
    available: true,
    avatar: "LB",
    deals: 47,
    revenue: "€132K",
    ca: 132000,
    email: "lucas@closeone.io",
    phone: "+33 6 23 45 67 89",
  },
  {
    id: 3,
    name: "Emma Dubois",
    role: "Senior Closer",
    city: "Marseille",
    sectors: ["Finance", "Assurance"],
    available: false,
    avatar: "ED",
    deals: 43,
    revenue: "€118K",
    ca: 118000,
    email: "emma@closeone.io",
    phone: "+33 6 34 56 78 90",
  },
  {
    id: 4,
    name: "Thomas Petit",
    role: "Closer",
    city: "Bordeaux",
    sectors: ["Coaching"],
    available: true,
    avatar: "TP",
    deals: 38,
    revenue: "€98K",
    ca: 98000,
    email: "thomas@closeone.io",
    phone: "+33 6 45 67 89 01",
  },
  {
    id: 5,
    name: "Léa Moreau",
    role: "Closer",
    city: "Lille",
    sectors: ["Marketing", "SaaS"],
    available: true,
    avatar: "LM",
    deals: 35,
    revenue: "€92K",
    ca: 92000,
    email: "lea@closeone.io",
    phone: "+33 6 56 78 90 12",
  },
  {
    id: 6,
    name: "Hugo Laurent",
    role: "Junior Closer",
    city: "Toulouse",
    sectors: ["Santé"],
    available: false,
    avatar: "HL",
    deals: 31,
    revenue: "€84K",
    ca: 84000,
    email: "hugo@closeone.io",
    phone: "+33 6 67 89 01 23",
  },
  {
    id: 7,
    name: "Chloé Roux",
    role: "Closer",
    city: "Nantes",
    sectors: ["B2B", "Tech"],
    available: true,
    avatar: "CR",
    deals: 28,
    revenue: "€76K",
    ca: 76000,
    email: "chloe@closeone.io",
    phone: "+33 6 78 90 12 34",
  },
  {
    id: 8,
    name: "Antoine Leroy",
    role: "Closer",
    city: "Strasbourg",
    sectors: ["Finance"],
    available: true,
    avatar: "AL",
    deals: 25,
    revenue: "€68K",
    ca: 68000,
    email: "antoine@closeone.io",
    phone: "+33 6 89 01 23 45",
  },
];

const cityPositions: Record<string, { x: number; y: number }> = {
  Paris: { x: 48, y: 28 },
  Lyon: { x: 52, y: 55 },
  Marseille: { x: 55, y: 74 },
  Bordeaux: { x: 28, y: 58 },
  Lille: { x: 50, y: 10 },
  Toulouse: { x: 34, y: 72 },
  Nantes: { x: 22, y: 40 },
  Strasbourg: { x: 68, y: 28 },
};

const isElite = (c: Closer) => c.ca >= 50000;

const btnClass =
  "w-8 h-8 rounded-lg bg-[#1A1F24] border border-[#2A2F35] flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors";

export default function MapView() {
  const [selected, setSelected] = useState<Closer | null>(null);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterAvail, setFilterAvail] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [zoom, setZoom] = useState(1);

  const filtered = closers.filter((c) => {
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.city.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterCity && c.city !== filterCity) return false;
    if (filterAvail === "available" && !c.available) return false;
    if (filterAvail === "unavailable" && c.available) return false;
    return true;
  });

  const cities = [...new Set(closers.map((c) => c.city))];

  const handleContact = (type: "phone" | "email") => {
    if (!selected) return;
    if (type === "phone")
      toast.success(`Appel vers ${selected.phone}`, {
        description: selected.name,
      });
    else
      toast.success(`Email envoyé à ${selected.email}`, {
        description: selected.name,
      });
  };

  const dotColor = (c: Closer) => {
    if (!c.available) return "#A0A0A0";
    return isElite(c) ? "#FFD700" : "#0EFF9C";
  };

  const dotGlow = (c: Closer) => {
    if (!c.available) return undefined;
    if (isElite(c)) return "0 0 12px #FFD70080, 0 0 24px #FFD70040";
    return "0 0 8px #0EFF9C60";
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Carte des Closers</h2>
        <p className="text-[#A0A0A0] text-sm mt-1">
          Localisez les closers disponibles
        </p>
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
            placeholder="Rechercher par nom ou ville..."
            className="w-full h-10 rounded-lg border border-[#2A2F35] bg-[#1A1F24] pl-10 pr-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50"
          />
        </div>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="h-10 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50"
        >
          <option value="">Toutes les villes</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex gap-1.5">
          {(["all", "available", "unavailable"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterAvail(v)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={
                filterAvail === v
                  ? {
                      background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                      color: "#0D1117",
                    }
                  : {
                      background: "#1A1F24",
                      color: "#A0A0A0",
                      border: "1px solid #2A2F35",
                    }
              }
            >
              {v === "all" ? "Tous" : v === "available" ? "Dispo" : "Indispo"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map area */}
        <div
          className="lg:col-span-2 glass-card p-6 relative overflow-hidden"
          style={{ minHeight: 450 }}
        >
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
              className={btnClass}
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
              className={btnClass}
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className={`${btnClass} text-xs font-bold`}
            >
              1x
            </button>
          </div>

          <div
            className="w-full h-full"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease",
            }}
          >
            {/* SVG France outline */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full absolute inset-0 p-6"
              style={{ opacity: 0.15 }}
            >
              <path
                d="M45 5 L55 8 L62 15 L60 25 L65 35 L60 45 L65 55 L60 65 L55 75 L45 80 L35 75 L28 65 L25 55 L30 45 L28 35 L32 25 L38 15 Z"
                fill="none"
                stroke="#0EFF9C"
                strokeWidth="0.5"
              />
            </svg>

            {/* Closer dots */}
            {filtered.map((c) => {
              const pos = cityPositions[c.city];
              if (!pos) return null;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="absolute group transition-all duration-300"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform:
                      selected?.id === c.id
                        ? "translate(-50%, -50%) scale(1.5)"
                        : "translate(-50%, -50%)",
                    zIndex: selected?.id === c.id ? 10 : 1,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full transition-all duration-200 hover:scale-125"
                    style={{
                      background: dotColor(c),
                      boxShadow: dotGlow(c),
                      animation: c.available
                        ? "pulseGlow 2s ease-in-out infinite"
                        : undefined,
                    }}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1F24] border border-[#2A2F35] px-2 py-0.5 rounded">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="glass-card p-5 space-y-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-[#0D1117]"
                  style={{
                    background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                  }}
                >
                  {selected.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white">{selected.name}</h3>
                  <p className="text-xs text-[#A0A0A0]">{selected.role}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-1.5 flex-wrap">
                {getBadgesForCA(selected.ca).map((b) => (
                  <CloserBadge key={b.key} badge={b} size={24} />
                ))}
              </div>

              <div className="space-y-2 text-sm">
                {[
                  { label: "Ville", value: selected.city },
                  { label: "Secteurs", value: selected.sectors.join(", ") },
                  { label: "Deals", value: String(selected.deals), bold: true },
                  { label: "CA Mensuel", value: selected.revenue, green: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-[#A0A0A0]">{row.label}</span>
                    <span
                      className={row.bold ? "font-semibold" : ""}
                      style={{ color: row.green ? "#0EFF9C" : "#fff" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">Statut</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={
                      selected.available
                        ? {
                            background: "rgba(14,255,156,0.1)",
                            color: "#0EFF9C",
                          }
                        : { background: "#1A1F24", color: "#A0A0A0" }
                    }
                  >
                    {selected.available ? "Disponible" : "Indisponible"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleContact("phone")}
                  className="flex-1 h-9 rounded-lg text-[#0D1117] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                  style={{
                    background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                  }}
                >
                  <Phone size={12} /> Contacter
                </button>
                <button
                  onClick={() => handleContact("email")}
                  className="flex-1 h-9 rounded-lg bg-[#1A1F24] border border-[#2A2F35] text-white text-xs font-medium hover:bg-[#2A2F35] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mail size={12} /> Email
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center h-48">
              <User size={28} className="text-[#A0A0A0] mb-3" />
              <p className="text-[#A0A0A0] text-sm">
                Cliquez sur un closer pour voir son profil
              </p>
            </div>
          )}

          {/* Closer list */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3 text-white">
              Closers ({filtered.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors"
                  style={{
                    background:
                      selected?.id === c.id
                        ? "rgba(14,255,156,0.1)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selected?.id !== c.id)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#1A1F24";
                  }}
                  onMouseLeave={(e) => {
                    if (selected?.id !== c.id)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: dotColor(c) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {c.name}
                    </p>
                    <p className="text-xs text-[#A0A0A0]">{c.city}</p>
                  </div>
                  <span className="text-xs text-[#A0A0A0]">
                    {c.deals} deals
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
