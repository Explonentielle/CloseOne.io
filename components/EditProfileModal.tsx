"use client";

import { useState } from "react";
import { ExperienceClosing } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ProfileFormData, updateProfile } from "@/app/actions/UpdateProfile";

interface EditProfilModalProps {
  open: boolean;
  onClose: () => void;
  defaultValues: ProfileFormData;
}

const experienceOptions: { value: ExperienceClosing; label: string }[] = [
  { value: "MOINS_1_AN",     label: "Moins d'1 an" },
  { value: "UN_AN",          label: "1 an" },
  { value: "DEUX_ANS",       label: "2 ans" },
  { value: "TROIS_ANS_PLUS", label: "3 ans et plus" },
];

export default function EditProfilModal({ open, onClose, defaultValues }: EditProfilModalProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormData>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const set = (field: keyof ProfileFormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value || null }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const result = await updateProfile(form);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop" />
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>

        <h3 className="text-[15px] font-bold text-foreground mb-4">Modifier mon profil</h3>

        <div className="space-y-4">
          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">Prénom</label>
              <input
                value={form.firstName ?? ""}
                onChange={e => set("firstName", e.target.value)}
                className="input-base"
                placeholder="Ex : Thomas"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">Nom</label>
              <input
                value={form.lastName ?? ""}
                onChange={e => set("lastName", e.target.value)}
                className="input-base"
                placeholder="Ex : Dupont"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Téléphone</label>
            <input
              value={form.telephone ?? ""}
              onChange={e => set("telephone", e.target.value)}
              className="input-base"
              placeholder="Ex : +33 6 12 34 56 78"
            />
          </div>

          {/* Localisation */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Localisation</label>
            <input
              value={form.localisation ?? ""}
              onChange={e => set("localisation", e.target.value)}
              className="input-base"
              placeholder="Ex : Paris, France"
            />
          </div>

          {/* Expérience */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              Expérience en closing
            </label>
            <div className="grid grid-cols-2 gap-2">
              {experienceOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm(prev => ({ ...prev, experience: opt.value }))}
                  className={`h-10 rounded-lg text-sm font-medium transition-all border ${
                    form.experience === opt.value
                      ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.3)]"
                      : "bg-background border-border text-muted-foreground hover:border-[hsl(var(--primary)/0.2)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full h-10 text-sm disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}