"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { computeMonthlyScore } from "@/lib/scoreComputation";

// Schéma pour la saisie journalière
const DailyEntrySchema = z.object({
  date: z.string(),
  r1Planifie: z.number().min(0).default(0),
  r1Effectue: z.number().min(0).default(0),
  r2Planifie: z.number().min(0).default(0),
  r2Effectue: z.number().min(0).default(0),
  nbCloses: z.number().min(0).default(0),
  sentiment: z
    .enum(["HAPPY", "NEUTRAL", "FRUSTRATED", "ON_FIRE", "TIRED"])
    .optional(),
});

// Schéma pour les objectifs hebdomadaires
const WeeklyObjectivesSchema = z.object({
  semaine: z.string(), // format: "YYYY-WW"
  objectifR1: z.number().min(0).default(0),
  objectifCloses: z.number().min(0).default(0),
  objectifCA: z.number().min(0).default(0),
  objectifClosingPct: z.number().min(0).max(100).default(0),
  focus1: z.string().optional(),
  focus2: z.string().optional(),
});

// Schéma pour les objectifs mensuels
const MonthlyObjectiveSchema = z.object({
  mois: z.string(), // format: "MM-YYYY"
  intitule: z.string().min(1),
  valeurCible: z.int(),
  typeObjectif: z.enum([
    "CASH_CONTRACTE",
    "TAUX_CLOSING",
    "NB_CLOSES",
    "TAUX_COLLECTE",
    "NB_R1",
    "LIBRE",
  ]),
});

export type DailyEntryInput = z.infer<typeof DailyEntrySchema>;
export type WeeklyObjectivesInput = z.infer<typeof WeeklyObjectivesSchema>;
export type MonthlyObjectiveInput = z.infer<typeof MonthlyObjectiveSchema>;

// Sauvegarder une entrée journalière
export async function saveDailyEntry(
  data: DailyEntryInput & { challengeId: string },
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = DailyEntrySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Vérifier si l'entrée existe déjà pour ce challenge et cette date
    const existing = await prisma.dailyEntry.findFirst({
      where: {
        challengeId: data.challengeId,
        date: new Date(data.date),
      },
    });

    let dailyEntry;
    if (existing) {
      dailyEntry = await prisma.dailyEntry.update({
        where: { id: existing.id },
        data: {
          r1Planifie: data.r1Planifie,
          r1Effectue: data.r1Effectue,
          r2Planifie: data.r2Planifie,
          r2Effectue: data.r2Effectue,
          nbCloses: data.nbCloses,
          sentiment: data.sentiment,
        },
      });
    } else {
      dailyEntry = await prisma.dailyEntry.create({
        data: {
          challengeId: data.challengeId,
          date: new Date(data.date),
          r1Planifie: data.r1Planifie,
          r1Effectue: data.r1Effectue,
          r2Planifie: data.r2Planifie,
          r2Effectue: data.r2Effectue,
          nbCloses: data.nbCloses,
          sentiment: data.sentiment,
        },
      });
    }

    // Recalculer le MonthlyScore pour le mois concerné
    const mois = new Date(data.date)
      .toLocaleString("fr-FR", { month: "2-digit", year: "numeric" })
      .replace(" ", "-");
    await computeMonthlyScore(userId, mois);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur saveDailyEntry:", error);
    return { success: false, error: "Erreur lors de l'enregistrement" };
  }
}

// Sauvegarder les objectifs hebdomadaires
export async function saveWeeklyObjectives(data: WeeklyObjectivesInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = WeeklyObjectivesSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Stocker dans une table dédiée (à créer si besoin)
    // Pour l'instant, on peut stocker dans UserMetrics ou une nouvelle table

    // Recalculer le MonthlyScore pour prendre en compte les objectifs
    // extract month from semaine
    const [year, week] = data.semaine.split("-");
    // Simplification: on recalcule pour le mois en cours

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur saveWeeklyObjectives:", error);
    return { success: false, error: "Erreur lors de l'enregistrement" };
  }
}

// Sauvegarder un objectif mensuel
export async function saveMonthlyObjective(data: MonthlyObjectiveInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  try {
    // Vérifier le nombre d'objectifs pour ce mois (max 4)
    const existingCount = await prisma.objective.count({
      where: {
        userId,
        mois: data.mois,
      },
    });

    if (existingCount >= 4) {
      return { success: false, error: "Maximum 4 objectifs par mois" };
    }

    const objective = await prisma.objective.create({
      data: {
        userId,
        mois: data.mois,
        intitule: data.intitule,
        valeurCible: data.valeurCible,
        typeObjectif: data.typeObjectif,
        atteint: false,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: objective };
  } catch (error) {
    console.error("Erreur saveMonthlyObjective:", error);
    return { success: false, error: "Erreur lors de l'enregistrement" };
  }
}

// Valider un objectif mensuel (fin de mois)
export async function validateMonthlyObjective(
  objectiveId: string,
  atteint: boolean,
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  try {
    await prisma.objective.update({
      where: { id: objectiveId },
      data: {
        atteint,
        dateValidation: new Date(),
      },
    });

    // Recalculer le MonthlyScore
    const objective = await prisma.objective.findUnique({
      where: { id: objectiveId },
    });
    if (objective?.mois) {
      await computeMonthlyScore(userId, objective.mois);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur validateMonthlyObjective:", error);
    return { success: false, error: "Erreur lors de la validation" };
  }
}
