"use client";

import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import {
  Search,
  Users,
  Eye,
  UserPlus,
  Briefcase,
  PlusCircle,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getAllInfopreneurs, createInfopreneur, getNiches } from "@/app/actions/ClientsActions";

interface Niche {
  id: string;
  nom: string;
}

interface Infopreneur {
  id: string;
  name: string;
  niche: string;
  nicheId: string;
  status: "Actif" | "Inactif";
  logo?: string | null;
  isCustom?: boolean;
  createdByUserId?: string;
}

export default function ClientsView() {
  const user = useUser();
  const [search, setSearch] = useState("");
  const [allInfos, setAllInfos] = useState<Infopreneur[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newInfopreneur, setNewInfopreneur] = useState({
    name: "",
    nicheId: "",
    status: "Actif" as "Actif" | "Inactif",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllInfopreneurs().then((res) => {
      if (res.success && res.data) setAllInfos(res.data);
    });
    getNiches().then((res) => {
      if (res.success && res.data) setNiches(res.data);
    });
  }, []);

  const myClients = useMemo(() => {
    if (!user?.challenges) return [];
    const map = new Map();
    for (const challenge of user.challenges) {
      const inf = challenge.infopreneur;
      if (!inf) continue;
      if (!map.has(inf.id)) {
        map.set(inf.id, {
          id: inf.id,
          name: inf.nom,
          niche: inf.niche?.nom || "Niche inconnue",
          status: inf.actif ? "Actif" : "Inactif",
          challengesCount: 0,
          logo: inf.logo,
          isCustom: inf.isCustom,
          createdByUserId: inf.createdByUserId,
        });
      }
      map.get(inf.id).challengesCount += 1;
    }
    return Array.from(map.values());
  }, [user]);

  const myClientIds = useMemo(
    () => new Set(myClients.map((c) => c.id)),
    [myClients],
  );

  const availableInfos = useMemo(() => {
    return allInfos.filter((inf) => !myClientIds.has(inf.id));
  }, [allInfos, myClientIds]);

  const filteredMyClients = myClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredAvailable = availableInfos.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreateInfopreneur = async () => {
    if (!newInfopreneur.name.trim() || !newInfopreneur.nicheId) return;
    setSaving(true);
    const result = await createInfopreneur(newInfopreneur);
    setSaving(false);
    if (result.success) {
      // Recharger la liste des infopreneurs
      const refreshed = await getAllInfopreneurs();
      if (refreshed.success && refreshed.data) setAllInfos(refreshed.data);
      setShowModal(false);
      setNewInfopreneur({ name: "", nicheId: niches[0]?.id || "", status: "Actif" });
    } else {
      alert(result.error);
    }
  };

  if (!user) return <div className="py-20 text-center">Chargement...</div>;

  // Helper pour obtenir le badge selon le type d'infopreneur
  const getTypeBadge = (inf: Infopreneur) => {
    if (!inf.isCustom) {
      return (
        <span className="text-[11px] font-medium bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
          Vérifié
        </span>
      );
    }
    if (inf.createdByUserId === user.id) {
      return (
        <span className="text-[11px] font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
          Personnalisé (moi)
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium bg-orange-500/15 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
        Personnalisé (autre)
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête avec titre et barre de recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold blue">Mes Clients</h2>
          <p className="text-muted-foreground text-sm">
            Gérez vos relations clients
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou niche..."
            className="input-base pl-10 w-full"
          />
        </div>
      </div>

      {/* Section 1 : Mes collaborations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={18} className="text-primary blue" />
          <h3 className="text-lg font-semibold blue">
            Mes collaborations
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              ({filteredMyClients.length})
            </span>
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Clients avec lesquels vous avez déjà collaboré (challenges ou VSL).
        </p>

        {filteredMyClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-lg">
            Aucune collaboration pour le moment. Ajoutez un infopreneur depuis
            la liste ci-dessous.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMyClients.map((client) => (
              <div key={client.id} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={18} className="text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <div className="flex gap-2">
                    {getTypeBadge(client)}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        client.status === "Actif"
                          ? "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30"
                          : "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {client.niche}
                </span>
                <p className="text-xs text-muted-foreground mt-3">
                  {client.challengesCount} challenge
                  {client.challengesCount > 1 ? "s" : ""}
                </p>
                <Link
                  href={`/clients/${client.id}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
                >
                  <Eye size={14} /> Voir la fiche
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2 : Infopreneurs disponibles */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold">
              Clients disponibles
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({filteredAvailable.length})
              </span>
            </h3>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-xs bg-primary/20 border border-border rounded-lg px-2 py-1 whitespace-nowrap hover:bg-primary/30 transition"
          >
            <PlusCircle size={14} />
            Créer un infopreneur personnalisé
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Vous n'avez encore jamais travaillé avec ces infopreneurs. Cliquez sur{" "}
          <strong>Ajouter</strong> pour créer un premier challenge.
        </p>

        {filteredAvailable.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-lg">
            Tous les infopreneurs disponibles sont déjà dans votre liste.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailable.map((client) => (
              <div
                key={client.id}
                className="glass-card p-5 opacity-90 hover:opacity-100 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Users size={18} className="text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <div className="flex gap-2">
                    {getTypeBadge(client)}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        client.status === "Actif"
                          ? "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30"
                          : "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {client.niche}
                </span>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex-1 flex items-center justify-center gap-1 h-9 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
                  >
                    <Eye size={14} /> Voir
                  </Link>
                  <Link
                    href={`/clients/${client.id}/challenges/new`}
                    className="flex-1 flex items-center justify-center border border-border gap-1 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-sm shadow-primary/30"
                  >
                    <PlusCircle size={14} /> Ajouter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de création personnalisée */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-card rounded-xl p-6 w-full max-w-md border border-border/30" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold mb-4">Créer un infopreneur personnalisé</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  placeholder="Ex: Nouvel Infopreneur"
                  value={newInfopreneur.name}
                  onChange={(e) => setNewInfopreneur({ ...newInfopreneur, name: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Niche</label>
                <select
                  value={newInfopreneur.nicheId}
                  onChange={(e) => setNewInfopreneur({ ...newInfopreneur, nicheId: e.target.value })}
                  className="input-base w-full"
                >
                  <option value="">Sélectionner une niche</option>
                  {niches.map(n => (
                    <option key={n.id} value={n.id}>{n.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewInfopreneur({ ...newInfopreneur, status: "Actif" })}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      newInfopreneur.status === "Actif"
                        ? "bg-primary/15 text-primary border-primary/30"
                        : "bg-background border-border"
                    }`}
                  >
                    Actif
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewInfopreneur({ ...newInfopreneur, status: "Inactif" })}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      newInfopreneur.status === "Inactif"
                        ? "bg-primary/15 text-primary border-primary/30"
                        : "bg-background border-border"
                    }`}
                  >
                    Inactif
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreateInfopreneur}
                disabled={saving}
                className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {saving ? "Création..." : "Créer l'infopreneur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}