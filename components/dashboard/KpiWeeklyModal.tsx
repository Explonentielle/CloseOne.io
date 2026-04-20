"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface KpiWeeklyModalProps {
  open: boolean;
  onClose: () => void;
}

type FieldKey = "r1" | "closes" | "ca" | "closingPct";

const fields: { key: FieldKey; label: string }[] = [
  { key: "r1", label: "Objectif R1" },
  { key: "closes", label: "Objectif Closes" },
  { key: "ca", label: "Objectif CA €" },
  { key: "closingPct", label: "Objectif Closing %" },
];

export default function KpiWeeklyModal({ open, onClose }: KpiWeeklyModalProps) {
  const [values, setValues] = useState<Record<FieldKey, number>>({
    r1: 0, closes: 0, ca: 0, closingPct: 0,
  });
  const [focus1, setFocus1] = useState<string>("");
  const [focus2, setFocus2] = useState<string>("");

  const handleChange = (key: FieldKey, val: string) => {
    setValues(prev => ({ ...prev, [key]: Number(val) || 0 }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border)/0.3)]">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--warning)/0.2)] flex items-center justify-center">
              <span className="font-bold text-[hsl(var(--warning))]">W</span>
            </div>
            <div>
              <h3 className="font-bold text-[hsl(var(--foreground))]">KPI Weekly</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Semaine 13 — 24 au 31 mars 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">{field.label}</label>
              <input
                type="number"
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--warning))] outline-none"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Focus 1</label>
            <input
              type="text"
              value={focus1}
              onChange={(e) => setFocus1(e.target.value)}
              placeholder="Ex: Améliorer mon taux de conversion R1 → R2"
              className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--warning))] outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Focus 2</label>
            <input
              type="text"
              value={focus2}
              onChange={(e) => setFocus2(e.target.value)}
              placeholder="Ex: Traiter les objections prix sans baisser"
              className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border)/0.3)] rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--warning))] outline-none"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] rounded-lg hover:opacity-90 font-semibold"
        >
          Enregistrer mes objectifs
        </button>
      </div>
    </div>
  );
}