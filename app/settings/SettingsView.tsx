"use client";

import { User, Bell } from "lucide-react";
import { toast } from "sonner";

const inputClass =
  "w-full h-11 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50 transition-all";

export default function SettingsView() {
  const handleSave = () => toast.success("Paramètres sauvegardés !");

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Paramètres</h2>
        <p className="text-[#A0A0A0] text-sm mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      {/* Profil */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User size={18} className="text-[#0EFF9C]" />
          <h3 className="font-semibold">Profil</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#A0A0A0] mb-1.5 block">
              Prénom
            </label>
            <input defaultValue="Julien" className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-[#A0A0A0] mb-1.5 block">Nom</label>
            <input defaultValue="De Bonnières" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-sm text-[#A0A0A0] mb-1.5 block">Email</label>
          <input
            defaultValue="julien.debonnieres@closeone.io"
            className={inputClass}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={18} className="text-[#0EFF9C]" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        {["Nouveaux deals", "Objectifs atteints", "Classement mis à jour"].map(
          (n) => (
            <label
              key={n}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <span className="text-sm text-white">{n}</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded accent-[#0EFF9C]"
              />
            </label>
          ),
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full h-11 rounded-lg text-[#0D1117] font-semibold text-sm hover:opacity-90 transition-opacity"
        style={{ background: "linear-gradient(135deg, #0EFF9C, #00C27A)" }}
      >
        Sauvegarder
      </button>
    </div>
  );
}
