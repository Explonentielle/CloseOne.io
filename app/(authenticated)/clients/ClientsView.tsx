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
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getAllInfopreneurs, createInfopreneur, getNiches } from "@/app/actions/ClientsActions";
import CreateInfopreneurModal from "@/components/client/CreateClientModal";

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
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllInfopreneurs(),
      getNiches(),
    ]).then(([infosRes, nichesRes]) => {
      if (infosRes.success && infosRes.data) setAllInfos(infosRes.data);
      if (nichesRes.success && nichesRes.data) setNiches(nichesRes.data);
      setLoading(false);
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

  const handleCreateInfopreneur = async (data: {
    name: string;
    nicheId: string;
    status: "Actif" | "Inactif";
    logo?: string | null;
  }) => {
    setSaving(true);
    const result = await createInfopreneur(data);
    setSaving(false);
    if (result.success) {
      const refreshed = await getAllInfopreneurs();
      if (refreshed.success && refreshed.data) setAllInfos(refreshed.data);
      setShowModal(false);
    } else {
      alert(result.error);
    }
  };

  const getTypeBadge = (inf: Infopreneur) => {
    if (!inf.isCustom) {
      return (
        <span className="text-[11px] font-medium bg-green-500/15 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
          Vérifié
        </span>
      );
    }
    if (inf.createdByUserId === user?.id) {
      return (
        <span className="text-[11px] font-medium bg-warning/15 text-warning border border-warning/30 px-2 py-0.5 rounded-full">
          Personnalisé (moi)
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium bg-warning/15 text-warning border border-warning/30 px-2 py-0.5 rounded-full">
        Personnalisé (autre)
      </span>
    );
  };

  // Attendre que l'utilisateur soit chargé, mais pas les infos distantes
  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mes Clients</h2>
          <p className="text-sm muted-foreground">
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
          <Briefcase size={18} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Mes collaborations
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              ({filteredMyClients.length})
            </span>
          </h3>
        </div>
        <p className="text-sm muted-foreground mb-4">
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
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        client.status === "Actif"
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-muted text-muted-foreground border-border"
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

      {/* Section 2 : Infopreneurs disponibles - avec loader pendant le chargement */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              Clients disponibles
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({loading ? "..." : filteredAvailable.length})
              </span>
            </h3>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-xs bg-primary/20 border border-border rounded-lg px-2 py-1 whitespace-nowrap hover:bg-primary/30 transition text-primary"
          >
            <PlusCircle size={14} />
            Créer un client personnalisé
          </button>
        </div>

        <p className="text-sm muted-foreground mb-4">
          Vous n'avez encore jamais travaillé avec ces infopreneurs. Cliquez sur{" "}
          <strong>Ajouter</strong> pour collaborer.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAvailable.length === 0 ? (
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
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        client.status === "Actif"
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-muted text-muted-foreground border-border"
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
                    className="flex-1 flex items-center justify-center gap-1 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
                  >
                    <PlusCircle size={14} /> Ajouter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateInfopreneurModal
        open={showModal}
        onClose={() => setShowModal(false)}
        niches={niches}
        onCreate={handleCreateInfopreneur}
        loading={saving}
      />
    </div>
  );
}