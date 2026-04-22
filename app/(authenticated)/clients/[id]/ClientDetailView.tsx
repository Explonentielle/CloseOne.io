"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Package, Swords, Loader2 } from "lucide-react";
import { getClientDetail, createPackage, createChallenge, ClientDetail } from "@/app/actions/ClientsActions";

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
  
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Formulaires
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: 0,
    financing: "Full Pay" as "Full Pay" | "Split Pay x2" | "Split Pay x3" | "Split Pay x4" | "Split Pay x6" | "Split Pay x8" | "Split Pay x10"
  });
  const [newChallenge, setNewChallenge] = useState({
    label: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    setLoading(true);
    setError(null);
    const result = await getClientDetail(id);
    if (result.success && result.data) {
      setClient(result.data);
    } else {
      setError(result.error || "Client introuvable");
    }
    setLoading(false);
  };

  const handleAddPackage = async () => {
    if (!newPackage.name.trim() || newPackage.price <= 0) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setSaving(true);
    const result = await createPackage(id, newPackage);
    setSaving(false);
    if (result.success) {
      await loadClient();
      setShowPkgModal(false);
      setNewPackage({ name: "", price: 0, financing: "Full Pay" });
    } else {
      alert(result.error);
    }
  };

  const handleAddChallenge = async () => {
    if (!newChallenge.startDate || !newChallenge.endDate) {
      alert("Veuillez remplir les dates");
      return;
    }
    setSaving(true);
    const result = await createChallenge(id, newChallenge);
    setSaving(false);
    if (result.success) {
      await loadClient();
      setShowChallengeModal(false);
      setNewChallenge({
        label: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
    } else {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-20" style={{ color: "hsl(var(--muted-foreground))" }}>
        <p>{error || "Client introuvable"}</p>
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
          {client.packages.length === 0 && (
            <div className="text-muted-foreground text-sm">Aucun package pour le moment</div>
          )}
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
                        Challenge #{ch.number} — {ch.label || "Sans titre"}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                        {ch.startDate ? new Date(ch.startDate).toLocaleDateString("fr-FR") : "?"} → {ch.endDate ? new Date(ch.endDate).toLocaleDateString("fr-FR") : "?"}
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
          {client.challenges.length === 0 && (
            <div className="text-muted-foreground text-sm">Aucun challenge pour le moment</div>
          )}
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
                value={newPackage.name}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
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
                value={newPackage.price || ""}
                onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) || 0 })}
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
                value={newPackage.financing}
                onChange={(e) => setNewPackage({ ...newPackage, financing: e.target.value as any })}
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
                <option>Split Pay x8</option>
                <option>Split Pay x10</option>
              </select>
              <button
                onClick={handleAddPackage}
                disabled={saving}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  background: "var(--gradient-primary)",
                  color: "hsl(var(--primary-foreground))",
                  fontWeight: 600,
                  borderRadius: radii.md,
                  border: "none",
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? "Création..." : "Ajouter"}
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
                placeholder="Label du challenge (optionnel)"
                value={newChallenge.label}
                onChange={(e) => setNewChallenge({ ...newChallenge, label: e.target.value })}
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
                    value={newChallenge.startDate}
                    onChange={(e) => setNewChallenge({ ...newChallenge, startDate: e.target.value })}
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
                    value={newChallenge.endDate}
                    onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
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
                onClick={handleAddChallenge}
                disabled={saving}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  background: "var(--gradient-primary)",
                  color: "hsl(var(--primary-foreground))",
                  fontWeight: 600,
                  borderRadius: radii.md,
                  border: "none",
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? "Création..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}