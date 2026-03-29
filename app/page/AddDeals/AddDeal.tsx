"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
 
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
    "w-full h-11 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50 transition-all";
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/deals");
  };
 
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up">
      <button
        onClick={() => router.push("/deals")}
        className="flex items-center gap-2 text-[#A0A0A0] hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Retour aux deals
      </button>
 
      <div>
        <h2 className="text-2xl font-bold">Ajouter un Deal</h2>
        <p className="text-[#A0A0A0] text-sm mt-1">Créez un nouveau deal commercial</p>
      </div>
 
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-[#A0A0A0] mb-1.5 block">Nom du Deal</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Contrat SaaS Premium"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="text-sm text-[#A0A0A0] mb-1.5 block">Client</label>
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Ex: TechCorp"
              className={inputClass}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#A0A0A0] mb-1.5 block">Montant (€)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="text-sm text-[#A0A0A0] mb-1.5 block">Commission (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>
 
          {/* Commission calculée */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#0D1117] border border-[#2A2F35]">
            <span className="text-sm text-[#A0A0A0]">Commission calculée</span>
            <span className="text-lg font-bold text-[#0EFF9C]">
              €{computedCommission.toLocaleString("fr-FR", { minimumFractionDigits: 0 })}
            </span>
          </div>
 
          <div>
            <label className="text-sm text-[#A0A0A0] mb-1.5 block">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DealStatus)}
              className={inputClass}
            >
              <option value="En cours">En cours</option>
              <option value="Gagné">Gagné</option>
              <option value="Perdu">Perdu</option>
            </select>
          </div>
 
          <button
            type="submit"
            className="w-full h-11 rounded-lg gradient-primary text-[#0D1117] font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Créer le Deal
          </button>
        </form>
      </div>
    </div>
  );
}