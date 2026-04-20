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

const mockClientsData: Record<string, {
  name: string;
  niche: string;
  status: string;
  packages: PackageItem[];
  challenges: Challenge[];
}> = {
  "1": {
    name: "Alex Hormozi FR",
    niche: "Business & Scaling",
    status: "Actif",
    packages: [
      { id: "p1", name: "Scaling Mastery", price: 3000, financing: "Full Pay" },
      { id: "p2", name: "1-on-1 Premium", price: 5000, financing: "Split Pay x3" },
    ],
    challenges: [
      { id: "c1", number: 1, label: "Challenge Janvier", startDate: "2026-01-06", endDate: "2026-01-31", status: "Terminé" },
      { id: "c2", number: 2, label: "Challenge Mars", startDate: "2026-03-03", endDate: "2026-03-28", status: "En cours" },
      { id: "c3", number: 3, label: "Challenge Avril", startDate: "2026-04-07", endDate: "2026-05-02", status: "À venir" },
    ],
  },
  "2": {
    name: "Marie Coaching",
    niche: "Développement personnel",
    status: "Actif",
    packages: [
      { id: "p3", name: "Programme Confiance", price: 2000, financing: "Split Pay x4" },
    ],
    challenges: [
      { id: "c4", number: 1, label: "Challenge Février", startDate: "2026-02-03", endDate: "2026-02-28", status: "Terminé" },
      { id: "c5", number: 2, label: "Challenge Avril", startDate: "2026-04-01", endDate: "2026-04-25", status: "En cours" },
    ],
  },
  "3": {
    name: "Pierre Fitness Pro",
    niche: "Fitness & Santé",
    status: "Inactif",
    packages: [
      { id: "p4", name: "Transformation 90j", price: 1500, financing: "Full Pay" },
    ],
    challenges: [
      { id: "c6", number: 1, label: "Challenge Décembre", startDate: "2025-12-01", endDate: "2025-12-20", status: "Terminé" },
    ],
  },
};

// Styles unifiés pour les radius
const radii = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  full: "9999px",
};

// Configuration des couleurs pour les statuts des challenges
const challengeStatusConfig = {
  "En cours": {
    backgroundColor: "hsl(var(--primary) / 0.15)",
    color: "hsl(var(--primary))",
    borderColor: "hsl(var(--primary) / 0.3)",
    iconColor: "hsl(var(--primary))",
    label: "En cours"
  },
  "Terminé": {
    backgroundColor: "hsl(var(--muted))",
    color: "hsl(var(--muted-foreground))",
    borderColor: "hsl(var(--border))",
    iconColor: "hsl(var(--muted-foreground))",
    label: "Terminé"
  },
  "À venir": {
    backgroundColor: "hsl(var(--warning) / 0.15)",
    color: "hsl(var(--warning))",
    borderColor: "hsl(var(--warning) / 0.3)",
    iconColor: "hsl(var(--warning))",
    label: "À venir"
  }
};

export default function ClientDetailView() {
  const params = useParams();
  const id = params.id as string;
  const client = mockClientsData[id];

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  if (!client) {
    return (
      <div className="text-center py-20" style={{ color: "hsl(var(--muted-foreground))" }}>
        <p>Client introuvable</p>
        <Link href="/clients" className="inline-block mt-2 underline" style={{ color: "hsl(var(--primary))" }}>
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      {/* Retour */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: "hsl(var(--muted-foreground))" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "hsl(var(--foreground))"}
        onMouseLeave={(e) => e.currentTarget.style.color = "hsl(var(--muted-foreground))"}
      >
        <ArrowLeft size={16} /> Retour aux clients
      </Link>

      {/* En-tête client */}
      <div
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: radii.lg,
          padding: "1.5rem"
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "hsl(var(--foreground))" }}>
          {client.name}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span
            style={{
              fontSize: "0.75rem",
              backgroundColor: "hsl(var(--secondary))",
              color: "hsl(var(--secondary-foreground))",
              padding: "0.25rem 0.5rem",
              borderRadius: radii.full
            }}
          >
            {client.niche}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              padding: "0.25rem 0.5rem",
              borderRadius: radii.full,
              backgroundColor: client.status === "Actif" ? "hsl(var(--primary) / 0.15)" : "hsl(var(--muted))",
              color: client.status === "Actif" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
          >
            {client.status}
          </span>
        </div>
      </div>

      {/* Packages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>Packages</h3>
          <button
            onClick={() => setShowPkgModal(true)}
            style={{
              color: "hsl(var(--primary))",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              backgroundColor: "hsl(var(--primary) / 0.1)",
              borderRadius: radii.sm,
              padding: "0.25rem 0.5rem"
            }}
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {client.packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: radii.md,
                padding: "1rem"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Package size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
                <span style={{ fontWeight: 500, color: "hsl(var(--foreground))" }}>{pkg.name}</span>
              </div>
              <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "hsl(var(--primary))" }}>
                {pkg.price.toLocaleString("fr-FR")}€
              </p>
              <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.25rem" }}>
                {pkg.financing}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>Challenges</h3>
          <button
            onClick={() => setShowChallengeModal(true)}
            style={{
              color: "hsl(var(--primary))",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              backgroundColor: "hsl(var(--primary) / 0.1)",
              borderRadius: radii.sm,
              padding: "0.25rem 0.5rem"
            }}
          >
            <Plus size={14} /> Créer
          </button>
        </div>
        <div className="space-y-3">
          {client.challenges.map((ch) => {
            const statusStyle = challengeStatusConfig[ch.status];
            return (
              <Link
                key={ch.id}
                href={`/challenges/${ch.id}`}
                style={{
                  display: "block",
                  backgroundColor: "hsl(var(--card))",
                  border: `1px solid ${statusStyle.borderColor}`,
                  borderRadius: radii.md,
                  padding: "1rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = statusStyle.borderColor;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        backgroundColor: `${statusStyle.color} / 0.1`,
                        borderRadius: radii.sm,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Swords size={14} style={{ color: statusStyle.iconColor }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, color: "hsl(var(--foreground))" }}>
                        Challenge #{ch.number} — {ch.label}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                        {new Date(ch.startDate).toLocaleDateString("fr-FR")} → {new Date(ch.endDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      padding: "0.25rem 0.5rem",
                      borderRadius: radii.full,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color
                    }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Modal Ajouter Package */}
      {showPkgModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)"
          }}
          onClick={() => setShowPkgModal(false)}
        >
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: radii.xl,
              padding: "1.5rem",
              width: "100%",
              maxWidth: "460px",
              margin: "0 1rem",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPkgModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                width: "1.75rem",
                height: "1.75rem",
                backgroundColor: "hsl(var(--secondary))",
                borderRadius: radii.sm,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "hsl(var(--foreground))" }}>
              Ajouter un package
            </h3>
            <div className="space-y-3">
              <input
                placeholder="Nom du package"
                style={{
                  width: "100%",
                  height: "2.5rem",
                  borderRadius: radii.md,
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--secondary))",
                  padding: "0 0.75rem",
                  fontSize: "0.875rem",
                  color: "hsl(var(--foreground))"
                }}
              />
              <input
                placeholder="Prix (€)"
                type="number"
                style={{
                  width: "100%",
                  height: "2.5rem",
                  borderRadius: radii.md,
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--secondary))",
                  padding: "0 0.75rem",
                  fontSize: "0.875rem",
                  color: "hsl(var(--foreground))"
                }}
              />
              <select
                style={{
                  width: "100%",
                  height: "2.5rem",
                  borderRadius: radii.md,
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--secondary))",
                  padding: "0 0.75rem",
                  fontSize: "0.875rem",
                  color: "hsl(var(--foreground))"
                }}
              >
                <option>Full Pay</option>
                <option>Split Pay x2</option>
                <option>Split Pay x3</option>
                <option>Split Pay x4</option>
                <option>Split Pay x6</option>
              </select>
              <button
                onClick={() => setShowPkgModal(false)}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  background: "var(--gradient-primary)",
                  color: "hsl(var(--primary-foreground))",
                  fontWeight: 600,
                  borderRadius: radii.md,
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer Challenge */}
      {showChallengeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)"
          }}
          onClick={() => setShowChallengeModal(false)}
        >
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: radii.xl,
              padding: "1.5rem",
              width: "100%",
              maxWidth: "460px",
              margin: "0 1rem",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowChallengeModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                width: "1.75rem",
                height: "1.75rem",
                backgroundColor: "hsl(var(--secondary))",
                borderRadius: radii.sm,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "hsl(var(--foreground))" }}>
              Créer un challenge
            </h3>
            <div className="space-y-3">
              <input
                placeholder="Label du challenge"
                style={{
                  width: "100%",
                  height: "2.5rem",
                  borderRadius: radii.md,
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--secondary))",
                  padding: "0 0.75rem",
                  fontSize: "0.875rem",
                  color: "hsl(var(--foreground))"
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", display: "block", marginBottom: "0.25rem" }}>
                    Date début
                  </label>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      height: "2.5rem",
                      borderRadius: radii.md,
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--secondary))",
                      padding: "0 0.75rem",
                      fontSize: "0.875rem",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", display: "block", marginBottom: "0.25rem" }}>
                    Date fin
                  </label>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      height: "2.5rem",
                      borderRadius: radii.md,
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--secondary))",
                      padding: "0 0.75rem",
                      fontSize: "0.875rem",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => setShowChallengeModal(false)}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  background: "var(--gradient-primary)",
                  color: "hsl(var(--primary-foreground))",
                  fontWeight: 600,
                  borderRadius: radii.md,
                  border: "none",
                  cursor: "pointer"
                }}
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