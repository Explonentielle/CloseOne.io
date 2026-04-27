"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Users,
  Tag,
  AlertCircle,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { createDeal } from "@/app/actions/DealAction";
import { getPackagesByInfopreneur } from "@/app/actions/PackageAction";

type SaleType = "FULL_PAY" | "SPLIT_PAY";
type NbMensualites = "X2" | "X3" | "X4" | "X6" | "X8" | "X10";

interface InfopreneurOption {
  id: string;
  nom: string;
  actif?: boolean;
}

interface ChallengeOption {
  id: string;
  numero: number;
  label: string | null;
  statut?: string;
}

interface PackageOption {
  id: string;
  nomPackage: string;
  valeur: number;
  financementDisponible: boolean;
  optionsFinancement: NbMensualites[];
}

export default function AddDeal() {
  const router = useRouter();
  const user = useUser();

  const [infopreneurs, setInfopreneurs] = useState<InfopreneurOption[]>([]);
  const [challenges, setChallenges] = useState<ChallengeOption[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);

  const [selectedInfopreneurId, setSelectedInfopreneurId] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const [montantContracte, setMontantContracte] = useState("");
  const [montantCollecte, setMontantCollecte] = useState("");
  const [typeVente, setTypeVente] = useState<SaleType>("FULL_PAY");
  const [nbMensualites, setNbMensualites] = useState<NbMensualites | "">("");
  const [dateR1, setDateR1] = useState("");
  const [dateR2, setDateR2] = useState("");
  const [delaiConversion, setDelaiConversion] = useState("");

  useEffect(() => {
    if (!user) return;
    const infosMap = new Map<string, InfopreneurOption>();
    for (const challenge of user.challenges) {
      const inf = challenge.infopreneur;
      if (!inf) continue;
      if (!infosMap.has(inf.id)) {
        infosMap.set(inf.id, {
          id: inf.id,
          nom: inf.nom,
          actif: inf.actif,
        });
      }
    }
    setInfopreneurs(Array.from(infosMap.values()));
  }, [user]);

  useEffect(() => {
    if (!selectedInfopreneurId || !user) {
      setChallenges([]);
      setPackages([]);
      setSelectedChallengeId("");
      setSelectedPackageId("");
      return;
    }

    const challengesForInfo = user.challenges.filter(
      (ch) => ch.infopreneurId === selectedInfopreneurId,
    );
    setChallenges(
      challengesForInfo.map((ch) => ({
        id: ch.id,
        numero: ch.numero,
        label: ch.label,
        statut: ch.statut,
      })),
    );

    const fetchPackages = async () => {
      const result = await getPackagesByInfopreneur(selectedInfopreneurId);
      if (result.success && result.data) {
        setPackages(result.data);
      } else {
        setPackages([]);
      }
    };
    fetchPackages();
  }, [selectedInfopreneurId, user]);

  useEffect(() => {
    const pkg = packages.find((p) => p.id === selectedPackageId);
    if (pkg && !dateR2) {
      setMontantContracte(pkg.valeur.toString());
      if (!pkg.financementDisponible && typeVente === "SPLIT_PAY") {
        setTypeVente("FULL_PAY");
        setNbMensualites("");
      }
    }
  }, [selectedPackageId, packages, dateR2]);

  useEffect(() => {
    if (dateR2) {
      setMontantContracte("0");
      setMontantCollecte("0");
    }
  }, [dateR2]);

  useEffect(() => {
    if (dateR2) return;
    if (typeVente === "FULL_PAY" && montantContracte) {
      setMontantCollecte(montantContracte);
    } else if (typeVente === "SPLIT_PAY" && !montantCollecte && montantContracte && dateR1) {
      const nb = nbMensualites ? parseInt(nbMensualites.slice(1)) : 2;
      const premierMensualite = parseFloat(montantContracte) / nb;
      setMontantCollecte(Math.floor(premierMensualite).toString());
    }
  }, [typeVente, montantContracte, nbMensualites, dateR1, dateR2]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInfopreneurId || !selectedPackageId) {
      alert("Veuillez sélectionner un client et un package.");
      return;
    }
    if (!dateR1 && !dateR2) {
      alert("Veuillez renseigner au moins une date (R1 ou R2).");
      return;
    }

    const response = await createDeal({
      challengeId: selectedChallengeId || null,
      packageId: selectedPackageId,
      montantContracte: parseFloat(montantContracte) || 0,
      montantCollecte: parseFloat(montantCollecte) || 0,
      typeVente: dateR2 ? undefined : typeVente,
      nbMensualites: typeVente === "SPLIT_PAY" && !dateR2 ? (nbMensualites as NbMensualites) : null,
      dateR1: dateR1 ? new Date(dateR1) : null,
      dateR2: dateR2 ? new Date(dateR2) : null,
      delaiConversion: delaiConversion ? parseInt(delaiConversion) : null,
    });

    if (response.success) {
      router.push("/deals");
    } else {
      alert(response.error);
    }
  };

  const selectedInfopreneur = infopreneurs.find((i) => i.id === selectedInfopreneurId);
  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId);
  const isR2Mode = !!dateR2;
  const isR1Mode = !!dateR1 && !dateR2;
  const showTypeVente = !dateR2 && parseInt(montantContracte) > 0;

  const closeEnAuto = dateR2 ? "R2" : dateR1 ? "R1" : "R1";

  const maxSlider = parseInt(montantContracte) || 0;
  const currentSliderValue = parseInt(montantCollecte) || 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMontantCollecte(value.toString());
  };

  if (!user) return <div className="py-20 text-center">Chargement...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-slide-up">
      <div className="relative flex items-center justify-center mb-4">
        <button
          onClick={() => router.push("/deals")}
          className="absolute left-0 inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80 text-muted-foreground"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Nouveau deal</h2>
          <p className="text-sm mt-0.5 text-muted-foreground">
            Renseignez les informations de la vente
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-card border border-border/50 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client + Package */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                <Users size={14} /> Client *
              </label>
              <select
                value={selectedInfopreneurId}
                onChange={(e) => setSelectedInfopreneurId(e.target.value)}
                className="input-base"
                required
              >
                <option value="">Sélectionnez un client</option>
                {infopreneurs.map((inf) => (
                  <option key={inf.id} value={inf.id}>
                    {inf.nom} {inf.actif === false ? "(inactif)" : ""}
                  </option>
                ))}
              </select>
              {selectedInfopreneur?.actif ? (
                <div className="mt-1 text-xs flex items-center gap-1">
                  <CheckCircle size={12} className="text-primary" />
                  <span className="text-primary">Client actif</span>
                </div>
              ) : (
                <div className="mt-1 text-xs flex items-center gap-1">
                  <HelpCircle size={12} className="text-warning" />
                  <span className="text-warning">Client inactif</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                <Tag size={14} /> Package *
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="input-base"
                required
                disabled={!selectedInfopreneurId}
              >
                <option value="">Sélectionnez un package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.nomPackage} – {pkg.valeur.toLocaleString("fr-FR")}€
                  </option>
                ))}
              </select>
              {selectedPackage && (
                <div className="mt-1 text-xs text-primary">
                  {selectedPackage.financementDisponible
                    ? "✓ Financement possible"
                    : "✓ Uniquement Full Pay"}
                </div>
              )}
            </div>
          </div>

          {/* Challenge */}
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
              <Calendar size={14} /> Challenge (optionnel)
            </label>
            <select
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              className="input-base"
              disabled={!selectedInfopreneurId}
            >
              <option value="">Aucun challenge associé</option>
              {challenges.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.label
                    ? `${ch.label} (n°${ch.numero})`
                    : `Challenge #${ch.numero}`}
                </option>
              ))}
            </select>
            {selectedChallenge && (
              <div className="mt-1 text-xs text-muted-foreground text-primary">
                Challenge #{selectedChallenge.numero} –{" "}
                {selectedChallenge.statut === "TERMINE"
                  ? "Terminé"
                  : selectedChallenge.statut === "EN_COURS"
                    ? "En cours"
                    : "À venir"}
              </div>
            )}
          </div>

          {/* Dates R1 / R2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                <Calendar size={14} /> Date du R1 *
              </label>
              <input
                type="date"
                value={dateR1}
                onChange={(e) => setDateR1(e.target.value)}
                className="input-base"
                required={!dateR2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                <Calendar size={14} /> Date du R2
              </label>
              <input
                type="date"
                value={dateR2}
                onChange={(e) => setDateR2(e.target.value)}
                className="input-base"
              />
            </div>
          </div>

          {/* Close effectué en (auto) */}
          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Close effectué en
            </label>
            <div className="flex gap-3">
              <div
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-center ${
                  closeEnAuto === "R1"
                    ? "bg-gradient-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                R1 (premier appel)
              </div>
              <div
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-center ${
                  closeEnAuto === "R2"
                    ? "bg-gradient-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                R2 (second appel)
              </div>
            </div>
          </div>

          {/* Type de vente et mensualités (si applicable) */}
          {showTypeVente && (
            <>
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                  <CreditCard size={14} /> Type de vente *
                </label>
                <select
                  value={typeVente}
                  onChange={(e) => setTypeVente(e.target.value as SaleType)}
                  className="input-base"
                >
                  <option value="FULL_PAY">Full Pay (paiement unique)</option>
                  <option value="SPLIT_PAY">
                    Split Pay (paiement fractionné)
                  </option>
                </select>
              </div>
              {typeVente === "SPLIT_PAY" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Nombre de mensualités *
                  </label>
                  <select
                    value={nbMensualites}
                    onChange={(e) =>
                      setNbMensualites(e.target.value as NbMensualites)
                    }
                    className="input-base"
                    required
                  >
                    <option value="">Sélectionnez</option>
                    <option value="X2">2 fois</option>
                    <option value="X3">3 fois</option>
                    <option value="X4">4 fois</option>
                    <option value="X6">6 fois</option>
                    <option value="X8">8 fois</option>
                    <option value="X10">10 fois</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Montants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Montant contracté */}
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                <DollarSign size={14} /> Montant contracté (€) *
              </label>
              <input
                type="number"
                value={montantContracte}
                onChange={(e) => setMontantContracte(e.target.value)}
                placeholder="0"
                className={`input-base ${isR2Mode ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""}`}
                disabled={isR2Mode}
                required={!isR2Mode}
              />
            </div>

            {/* Montant collecté avec slider */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
                    <DollarSign size={14} /> Montant collecté (€)
                  </label>
                  <div className="text-xs text-muted-foreground pl-5 text-primary">
                    0€ → {maxSlider.toLocaleString("fr-FR")}€
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-28">
                    <input
                      type="number"
                      value={montantCollecte}
                      onChange={(e) => setMontantCollecte(e.target.value)}
                      placeholder="0"
                      className={`input-base ${isR2Mode ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""}`}
                      disabled={isR2Mode}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                      €
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max={maxSlider}
                  step="1"
                  value={currentSliderValue}
                  onChange={handleSliderChange}
                  disabled={isR2Mode || maxSlider === 0}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:bg-[hsl(var(--primary))]
                    [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]
                    [&::-webkit-slider-thumb]:border-0
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:bg-[hsl(var(--primary))]
                    [&::-moz-range-thumb]:border-0"
                  style={{
                    background:
                      maxSlider === 0
                        ? "hsl(var(--secondary))"
                        : `linear-gradient(
                          to right,
                          hsl(var(--primary)) 0%,
                          hsl(var(--primary)) ${(currentSliderValue / maxSlider) * 100}%,
                          hsl(var(--secondary)) ${(currentSliderValue / maxSlider) * 100}%,
                          hsl(var(--secondary)) 100%
                        )`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Délai de conversion */}
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1 text-muted-foreground">
              <Clock size={14} /> Délai de conversion (jours)
            </label>
            <input
              type="number"
              value={delaiConversion}
              onChange={(e) => setDelaiConversion(e.target.value)}
              placeholder="0"
              className={`input-base ${isR2Mode ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""}`}
              disabled={isR2Mode}
            />
          </div>

          {isR1Mode && parseFloat(montantContracte) > 50000 && (
            <div className="flex items-center gap-2 p-3 rounded-md text-sm bg-warning/15 text-warning border border-warning/30">
              <AlertCircle size={16} />
              Deal de grande valeur — pensez à valider les conditions
              commerciales.
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full h-12 text-sm mt-4 text-primary-foreground"
          >
            Créer le deal
          </button>
        </form>
      </div>
    </div>
  );
}