"use client";

import { useState, useEffect } from "react";

interface Niche {
  id: string;
  nom: string;
}

interface CreateInfopreneurModalProps {
  open: boolean;
  onClose: () => void;
  niches: Niche[];
  onCreate: (data: { name: string; nicheId: string; status: "Actif" | "Inactif"; logo?: string | null }) => Promise<void>;
  loading: boolean;
}

export default function CreateInfopreneurModal({
  open,
  onClose,
  niches,
  onCreate,
  loading,
}: CreateInfopreneurModalProps) {
  const [name, setName] = useState("");
  const [nicheId, setNicheId] = useState("");
  const [status, setStatus] = useState<"Actif" | "Inactif">("Actif");
  const [logo, setLogo] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Réinitialisation à l'ouverture
  useEffect(() => {
    if (open) {
      setName("");
      setNicheId(niches[0]?.id || "");
      setStatus("Actif");
      setLogo("");
      setError(null);
    }
  }, [open, niches]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!nicheId) {
      setError("Veuillez sélectionner une niche");
      return;
    }
    setError(null);
    await onCreate({ name: name.trim(), nicheId, status, logo: logo || null });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop" />
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>

        <h3 className="text-[15px] font-bold text-foreground mb-4">
          Créer un client personnalisé
        </h3>

        <div className="space-y-4">
          {/* Nom */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Nom du client *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base w-full"
              placeholder="Ex : Jean Dupont Consulting"
              autoFocus
            />
          </div>

          {/* Niche */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Niche *</label>
            <select
              value={nicheId}
              onChange={(e) => setNicheId(e.target.value)}
              className="input-base w-full"
            >
              <option value="">Sélectionner une niche</option>
              {niches.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Statut (Actif / Inactif) */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Statut</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("Actif")}
                className={`h-10 rounded-lg text-sm font-medium transition-all border ${
                  status === "Actif"
                    ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.3)]"
                    : "bg-background border-border text-muted-foreground hover:border-[hsl(var(--primary)/0.2)]"
                }`}
              >
                Actif
              </button>
              <button
                type="button"
                onClick={() => setStatus("Inactif")}
                className={`h-10 rounded-lg text-sm font-medium transition-all border ${
                  status === "Inactif"
                    ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.3)]"
                    : "bg-background border-border text-muted-foreground hover:border-[hsl(var(--primary)/0.2)]"
                }`}
              >
                Inactif
              </button>
            </div>
          </div>

          {/* Logo (optionnel) */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Logo (URL optionnelle)</label>
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="input-base w-full"
              placeholder="https://exemple.com/logo.png"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full h-10 text-sm disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer le client"}
          </button>
        </div>
      </div>
    </div>
  );
}