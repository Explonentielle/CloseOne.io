"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
};

export default function EditProfileModal({ open, onClose, user }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Une erreur est survenue");
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md glass-card p-6 space-y-5 mx-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Modifier mon profil</h2>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A0A0] font-medium">
                Prénom
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                className="w-full h-10 px-3 rounded-lg bg-[#1A1F26] border border-[#2A2F35] text-sm text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#0EFF9C] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#A0A0A0] font-medium">Nom</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                className="w-full h-10 px-3 rounded-lg bg-[#1A1F26] border border-[#2A2F35] text-sm text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#0EFF9C] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#A0A0A0] font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-10 px-3 rounded-lg bg-[#1A1F26] border border-[#2A2F35] text-sm text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#0EFF9C] transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-[#2A2F35] text-[#A0A0A0] text-sm hover:border-[#A0A0A0] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-10 rounded-lg bg-[#0EFF9C] text-[#0D1117] text-sm font-semibold hover:bg-[#0EFF9C]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
