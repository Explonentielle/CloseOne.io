"use client";

import { User, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";

const inputClass =
  "w-full h-11 rounded-lg border border-border bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

export default function SettingsView() {
  const user = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Ici, on pourrait appeler une action serveur pour mettre à jour le profil
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulation
    toast.success("Paramètres sauvegardés !");
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Paramètres</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      {/* Profil */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Profil</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Prénom
            </label>
            <input
              defaultValue={user.firstName ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Nom
            </label>
            <input
              defaultValue={user.lastName ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">
            Email
          </label>
          <input
            defaultValue={user.email}
            className={inputClass}
            disabled
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        {["Nouveaux deals", "Objectifs atteints", "Classement mis à jour"].map(
          (n) => (
            <label
              key={n}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <span className="text-sm text-foreground">{n}</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-primary focus:ring-primary/20"
              />
            </label>
          ),
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full h-11 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-50 btn-primary"
      >
        {isSaving ? (
          <>
            <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          "Sauvegarder"
        )}
      </button>
    </div>
  );
}