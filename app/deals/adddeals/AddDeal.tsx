"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Users,
  Tag,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

type DealStatus = "En cours" | "Gagné" | "Perdu";

export default function AddDeal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");
  const [status, setStatus] = useState<DealStatus>("En cours");

  const computedCommission =
    ((parseFloat(amount) || 0) * (parseFloat(commissionRate) || 0)) / 100;

  const inputClass =
    "w-full h-11 rounded-lg px-4 text-sm transition-all focus:outline-none focus:ring-2";
  const inputStyle = {
    border: "1px solid hsl(var(--border))",
    backgroundColor: "hsl(var(--secondary))",
    color: "hsl(var(--foreground))",
  };

  const quickCommissionRates = [5, 10, 15, 20];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/deals");
  };

  return (
    <div className="w-full mx-auto px-4 py-4 space-y-5 animate-slide-up">
      {/* Bouton retour aligné à gauche */}

      <div className="grid grid-cols-3 items-center mb-2">
        <button
          onClick={() => router.push("/deals")}
          className="justify-self-start inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ArrowLeft size={16} /> Retour aux deals
        </button>
        <div className="text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Ajouter un Deal
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Créez un nouveau deal commercial
          </p>
        </div>
        <div /> {/* colonne vide pour équilibre */}
      </div>

      <div
        className="p-5 space-y-5"
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border) / 0.5)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom du Deal */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Nom du Deal
            </label>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Contrat SaaS Premium"
                className={inputClass}
                style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                required
              />
            </div>
          </div>

          {/* Client */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Client
            </label>
            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Ex: TechCorp"
                className={inputClass}
                style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                required
              />
            </div>
          </div>

          {/* Montant & Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Montant (€)
              </label>
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Commission (%)
              </label>
              <div className="relative">
                <TrendingUp
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="10"
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Quick commission */}
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Rapide :
            </span>
            {quickCommissionRates.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setCommissionRate(String(rate))}
                className="px-2 py-1 text-xs rounded-md transition-colors"
                style={{
                  backgroundColor:
                    commissionRate === String(rate)
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))",
                  color:
                    commissionRate === String(rate)
                      ? "hsl(var(--primary-foreground))"
                      : "hsl(var(--muted-foreground))",
                  border: `1px solid ${commissionRate === String(rate) ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                }}
              >
                {rate}%
              </button>
            ))}
          </div>

          {/* Commission calculée */}
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <span
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Commission estimée
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: "hsl(var(--primary))" }}
            >
              €
              {computedCommission.toLocaleString("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Statut */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DealStatus)}
              className={inputClass}
              style={inputStyle}
            >
              <option value="En cours">🟡 En cours</option>
              <option value="Gagné">🟢 Gagné</option>
              <option value="Perdu">🔴 Perdu</option>
            </select>
          </div>

          {/* Alerte gros montant */}
          {parseFloat(amount) > 50000 && (
            <div
              className="flex items-center gap-2 p-2 rounded-md text-xs"
              style={{
                backgroundColor: "hsl(var(--warning) / 0.15)",
                color: "hsl(var(--warning))",
                border: "1px solid hsl(var(--warning) / 0.3)",
              }}
            >
              <AlertCircle size={14} />
              Deal de grande valeur — pensez à valider les conditions.
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity mt-2"
            style={{
              background: "var(--gradient-primary)",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            Créer le Deal
          </button>
        </form>
      </div>
    </div>
  );
}
