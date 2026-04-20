// app/clients/[id]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Package, Swords } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  price: number;
  financing: string;
}

interface Challenge {
  id: string;
  number: number;
  label: string;
  startDate: string;
  endDate: string;
  status: "En cours" | "Terminé" | "À venir";
}

const mockClientsData: Record<
  string,
  {
    name: string;
    niche: string;
    status: string;
    packages: PackageItem[];
    challenges: Challenge[];
  }
> = {
  "1": {
    name: "Alex Hormozi FR",
    niche: "Business & Scaling",
    status: "Actif",
    packages: [
      { id: "p1", name: "Scaling Mastery", price: 3000, financing: "Full Pay" },
      {
        id: "p2",
        name: "1-on-1 Premium",
        price: 5000,
        financing: "Split Pay x3",
      },
    ],
    challenges: [
      {
        id: "c1",
        number: 1,
        label: "Challenge Janvier",
        startDate: "2026-01-06",
        endDate: "2026-01-31",
        status: "Terminé",
      },
      {
        id: "c2",
        number: 2,
        label: "Challenge Mars",
        startDate: "2026-03-03",
        endDate: "2026-03-28",
        status: "En cours",
      },
      {
        id: "c3",
        number: 3,
        label: "Challenge Avril",
        startDate: "2026-04-07",
        endDate: "2026-05-02",
        status: "À venir",
      },
    ],
  },
  "2": {
    name: "Marie Coaching",
    niche: "Développement personnel",
    status: "Actif",
    packages: [
      {
        id: "p3",
        name: "Programme Confiance",
        price: 2000,
        financing: "Split Pay x4",
      },
    ],
    challenges: [
      {
        id: "c4",
        number: 1,
        label: "Challenge Février",
        startDate: "2026-02-03",
        endDate: "2026-02-28",
        status: "Terminé",
      },
      {
        id: "c5",
        number: 2,
        label: "Challenge Avril",
        startDate: "2026-04-01",
        endDate: "2026-04-25",
        status: "En cours",
      },
    ],
  },
  "3": {
    name: "Pierre Fitness Pro",
    niche: "Fitness & Santé",
    status: "Inactif",
    packages: [
      {
        id: "p4",
        name: "Transformation 90j",
        price: 1500,
        financing: "Full Pay",
      },
    ],
    challenges: [
      {
        id: "c6",
        number: 1,
        label: "Challenge Décembre",
        startDate: "2025-12-01",
        endDate: "2025-12-20",
        status: "Terminé",
      },
    ],
  },
};

const statusColors: Record<string, string> = {
  "En cours": "bg-primary/15 text-primary",
  Terminé: "bg-muted/20 text-muted-foreground",
  "À venir": "bg-yellow-500/15 text-yellow-400",
};

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const client = mockClientsData[id];

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  if (!client) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Client introuvable</p>
        <Link
          href="/clients"
          className="text-primary underline mt-2 inline-block"
        >
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/clients"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> Retour aux clients
      </Link>

      {/* Header */}
      <div className="bg-card border border-border/50 rounded-[12px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] bg-background px-2 py-0.5 rounded-full text-muted-foreground">
                {client.niche}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  client.status === "Actif"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted/30 text-muted-foreground"
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Packages</h3>
          <button
            onClick={() => setShowPkgModal(true)}
            className="text-xs text-primary flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> Ajouter un package
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {client.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-card border border-border/50 rounded-[10px] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Package size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium">{pkg.name}</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {pkg.price.toLocaleString("fr-FR")}€
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {pkg.financing}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Challenges</h3>
          <button
            onClick={() => setShowChallengeModal(true)}
            className="text-xs text-primary flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> Créer un challenge
          </button>
        </div>
        <div className="space-y-2">
          {client.challenges.map((ch) => (
            <Link
              key={ch.id}
              href={`/challenges/${ch.id}`}
              className="flex items-center justify-between bg-card border border-border/50 rounded-[10px] p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Swords size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Challenge #{ch.number} — {ch.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {ch.startDate} → {ch.endDate}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[ch.status]}`}
              >
                {ch.status}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Package Modal */}
      {showPkgModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowPkgModal(false)}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="relative bg-card border border-border/50 rounded-2xl p-6 w-full max-w-[460px] mx-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPkgModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <h3 className="text-[15px] font-bold mb-4">Ajouter un package</h3>
            <div className="space-y-3">
              <input
                placeholder="Nom du package"
                className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary"
              />
              <input
                placeholder="Prix (€)"
                type="number"
                className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary"
              />
              <select className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary">
                <option>Full Pay</option>
                <option>Split Pay x2</option>
                <option>Split Pay x3</option>
                <option>Split Pay x4</option>
                <option>Split Pay x6</option>
              </select>
              <button
                onClick={() => setShowPkgModal(false)}
                className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowChallengeModal(false)}
        >
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="relative bg-card border border-border/50 rounded-2xl p-6 w-full max-w-[460px] mx-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowChallengeModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <h3 className="text-[15px] font-bold mb-4">Créer un challenge</h3>
            <div className="space-y-3">
              <input
                placeholder="Label du challenge"
                className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Date début
                  </label>
                  <input
                    type="date"
                    className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Date fin
                  </label>
                  <input
                    type="date"
                    className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
