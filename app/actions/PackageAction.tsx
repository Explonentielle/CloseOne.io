"use server";
import { prisma } from "@/lib/prisma";

export async function getPackagesByInfopreneur(infopreneurId: string) {
  try {
    const packages = await prisma.package.findMany({
      where: { infopreneurId },
      select: {
        id: true,
        nomPackage: true,
        valeur: true,
        financementDisponible: true,
        optionsFinancement: true,
      },
    });
    return { success: true, data: packages };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la récupération des packages" };
  }
}