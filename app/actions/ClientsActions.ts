"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schémas de validation
const InfopreneurSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  nicheId: z.string().min(1, "Niche requise"),
  status: z.enum(["Actif", "Inactif"]),
});

const NicheSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
});

// Types
export type InfopreneurInput = z.infer<typeof InfopreneurSchema>;
export type NicheInput = z.infer<typeof NicheSchema>;

export type ClientType = {
  id: string;
  name: string;
  niche: string;
  status: "Actif" | "Inactif";
  challenges: number;
};

export type ClientDetail = {
  id: string;
  name: string;
  niche: string;
  status: "Actif" | "Inactif";
  packages: {
    id: string;
    name: string;
    price: number;
    financing: string;
  }[];
  challenges: {
    id: string;
    number: number;
    label: string | null;
    startDate: string | null;
    endDate: string | null;
    status: "En cours" | "Terminé" | "À venir";
  }[];
};

// GET - Récupérer tous les infopreneurs du user connecté
export async function getInfopreneurs(): Promise<{
  success: boolean;
  error?: string;
  data: ClientType[];
}> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié", data: [] };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user)
    return { success: false, error: "Utilisateur non trouvé", data: [] };

  const infopreneurs = await prisma.infopreneur.findMany({
    where: {
      challenges: {
        some: { userId: user.id },
      },
    },
    include: {
      niche: true,
      challenges: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted: ClientType[] = infopreneurs.map((inf) => ({
    id: inf.id,
    name: inf.nom,
    niche: inf.niche.nom,
    status: inf.actif ? "Actif" : "Inactif",
    challenges: inf.challenges.length,
  }));

  return { success: true, data: formatted };
}

// GET - Récupérer toutes les niches (prédéfinies + perso)
export async function getNiches() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié", data: [] };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user)
    return { success: false, error: "Utilisateur non trouvé", data: [] };

  const niches = await prisma.niche.findMany({
    where: {
      OR: [{ isCustom: false }, { isCustom: true, createdByUserId: user.id }],
    },
    orderBy: { nom: "asc" },
  });

  return { success: true, data: niches };
}

// POST - Créer un infopreneur
export async function createInfopreneur(data: InfopreneurInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = InfopreneurSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  try {
    const infopreneur = await prisma.infopreneur.create({
      data: {
        nom: parsed.data.name,
        nicheId: parsed.data.nicheId,
        actif: parsed.data.status === "Actif",
        isCustom: true,
        createdByUserId: user.id,
      },
    });

    revalidatePath("/clients");
    return { success: true, data: infopreneur };
  } catch (error) {
    console.error("Erreur création infopreneur:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

// POST - Créer une niche personnalisée
export async function createNiche(data: NicheInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = NicheSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  try {
    const niche = await prisma.niche.create({
      data: {
        nom: parsed.data.nom,
        isCustom: true,
        createdByUserId: user.id,
      },
    });

    revalidatePath("/clients");
    return { success: true, data: niche };
  } catch (error) {
    console.error("Erreur création niche:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

// GET - Détail d'un infopreneur avec ses packages et challenges
export async function getClientDetail(
  infopreneurId: string,
): Promise<{ success: boolean; error?: string; data?: ClientDetail }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  const infopreneur = await prisma.infopreneur.findFirst({
    where: {
      id: infopreneurId,
      challenges: { some: { userId: user.id } },
    },
    include: {
      niche: true,
      packages: true,
      challenges: {
        where: { userId: user.id },
        orderBy: { numero: "asc" },
      },
    },
  });

  if (!infopreneur) {
    return {
      success: false,
      error: "Client introuvable ou accès non autorisé",
    };
  }

  // Formater les packages
  const packages = infopreneur.packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.nomPackage,
    price: pkg.valeur,
    financing: pkg.financementDisponible
      ? `Split Pay x${pkg.optionsFinancement[0] || 2}`
      : "Full Pay",
  }));

  // Formater les challenges
  const now = new Date();
  const challenges = infopreneur.challenges.map((ch) => {
    let status: "En cours" | "Terminé" | "À venir" = "À venir";
    if (ch.dateDebut && ch.dateFin) {
      if (now >= ch.dateDebut && now <= ch.dateFin) status = "En cours";
      else if (now > ch.dateFin) status = "Terminé";
    }
    return {
      id: ch.id,
      number: ch.numero,
      label: ch.label,
      startDate: ch.dateDebut?.toISOString().split("T")[0] || null,
      endDate: ch.dateFin?.toISOString().split("T")[0] || null,
      status,
    };
  });

  return {
    success: true,
    data: {
      id: infopreneur.id,
      name: infopreneur.nom,
      niche: infopreneur.niche.nom,
      status: infopreneur.actif ? "Actif" : "Inactif",
      packages,
      challenges,
    },
  };
}

// Schéma pour création package
const PackageSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  financing: z.enum([
    "Full Pay",
    "Split Pay x2",
    "Split Pay x3",
    "Split Pay x4",
    "Split Pay x6",
    "Split Pay x8",
    "Split Pay x10",
  ]),
});

// POST - Créer un package pour un infopreneur
export async function createPackage(
  infopreneurId: string,
  data: z.infer<typeof PackageSchema>,
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = PackageSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  // Vérifier que l'infopreneur appartient bien à l'utilisateur (via un challenge existant)
  const infopreneur = await prisma.infopreneur.findFirst({
    where: {
      id: infopreneurId,
      challenges: { some: { userId: user.id } },
    },
  });
  if (!infopreneur)
    return { success: false, error: "Accès non autorisé à cet infopreneur" };

  // Extraire le nombre de mensualités
  let financementDisponible = false;
  let optionsFinancement: any[] = [];
  let nbMensualites = null;
  if (parsed.data.financing !== "Full Pay") {
    financementDisponible = true;
    const match = parsed.data.financing.match(/x(\d+)/);
    if (match) {
      nbMensualites = parseInt(match[1]);
      optionsFinancement = [nbMensualites];
    }
  }

  try {
    const pkg = await prisma.package.create({
      data: {
        nomPackage: parsed.data.name,
        valeur: parsed.data.price,
        infopreneurId: infopreneur.id,
        financementDisponible,
        optionsFinancement,
        fraisFinancement: false, // par défaut, à adapter si besoin
      },
    });
    revalidatePath(`/clients/${infopreneurId}`);
    return { success: true, data: pkg };
  } catch (error) {
    console.error("Erreur création package:", error);
    return { success: false, error: "Erreur lors de la création du package" };
  }
}

// Schéma pour création challenge
const ChallengeSchema = z.object({
  label: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

// POST - Créer un challenge pour un infopreneur
export async function createChallenge(
  infopreneurId: string,
  data: z.infer<typeof ChallengeSchema>,
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = ChallengeSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  // Vérifier l'infopreneur
  const infopreneur = await prisma.infopreneur.findUnique({
    where: { id: infopreneurId },
  });
  if (!infopreneur) return { success: false, error: "Infopreneur introuvable" };

  // Calculer le prochain numéro de challenge pour cet infopreneur et cet utilisateur
  const lastChallenge = await prisma.challenge.findFirst({
    where: {
      userId: user.id,
      infopreneurId: infopreneur.id,
    },
    orderBy: { numero: "desc" },
  });
  const nextNumero = (lastChallenge?.numero ?? 0) + 1;

  try {
    const challenge = await prisma.challenge.create({
      data: {
        userId: user.id,
        infopreneurId: infopreneur.id,
        numero: nextNumero,
        label: parsed.data.label || null,
        dateDebut: new Date(parsed.data.startDate),
        dateFin: new Date(parsed.data.endDate),
        statut: "A_VENIR",
      },
    });
    revalidatePath(`/clients/${infopreneurId}`);
    return { success: true, data: challenge };
  } catch (error) {
    console.error("Erreur création challenge:", error);
    return { success: false, error: "Erreur lors de la création du challenge" };
  }
}


export async function getAllInfopreneurs(): Promise<{
  success: boolean;
  error?: string;
  data: {
    id: string;
    name: string;
    niche: string;
    nicheId: string;
    status: "Actif" | "Inactif";
    logo?: string | null;
    isCustom: boolean;
    createdByUserId?: string; 
  }[];
}> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié", data: [] };

  const infopreneurs = await prisma.infopreneur.findMany({
    include: { niche: true },
    orderBy: { nom: "asc" },
  });

  const formatted = infopreneurs.map((inf) => ({
    id: inf.id,
    name: inf.nom,
    niche: inf.niche.nom,
    nicheId: inf.nicheId,
    status: (inf.actif ? "Actif" : "Inactif") as "Actif" | "Inactif",
    logo: inf.logo,
    isCustom: inf.isCustom ?? false,
    createdByUserId: inf.createdByUserId ?? undefined,
  }));

  return { success: true, data: formatted };
}