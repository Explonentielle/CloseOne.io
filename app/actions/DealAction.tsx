"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDeal(data: {
  challengeId: string | null;
  packageId: string;
  montantContracte: number;
  montantCollecte: number;
  typeVente?: "FULL_PAY" | "SPLIT_PAY";
  nbMensualites: "X2" | "X3" | "X4" | "X6" | "X8" | "X10" | null;
  dateR1: Date | null;
  dateR2: Date | null;
  delaiConversion: number | null;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  try {
     const deal = await prisma.deal.create({
    data: {
      challenge: data.challengeId ? { connect: { id: data.challengeId } } : undefined,
      package: { connect: { id: data.packageId } },
      montantContracte: data.montantContracte,
      montantCollecte: data.montantCollecte,
      typeVente: data.typeVente, // peut être undefined
      nbMensualites: data.nbMensualites,
      dateR1: data.dateR1,
      dateR2: data.dateR2,
      delaiConversion: data.delaiConversion,
    },
  });
    revalidatePath("/deals");
    return { success: true, data: deal };
  } catch (error) {
    console.error("Erreur création deal:", error);
    return { success: false, error: "Erreur lors de la création du deal" };
  }
}