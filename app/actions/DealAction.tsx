"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDeal(data: {
  challengeId: string | null;
  packageId: string;
  prenomClient: string | null;
  montantContracte: number;
  montantCollecte: number;
  typeVente: "FULL_PAY" | "SPLIT_PAY";
  nbMensualites: "X2" | "X3" | "X4" | "X6" | "X8" | "X10" | null;
  dateR1: Date | null;
  dateClose: Date | null;
  closeEn: "R1" | "R2";
  delaiConversion: number | null;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  try {
    const deal = await prisma.deal.create({
      data: {
        challengeId: data.challengeId,
        packageId: data.packageId,
        prenomClient: data.prenomClient,
        montantContracte: data.montantContracte,
        montantCollecte: data.montantCollecte,
        typeVente: data.typeVente,
        nbMensualites: data.nbMensualites,
        dateR1: data.dateR1,
        dateClose: data.dateClose,
        closeEn: data.closeEn,
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