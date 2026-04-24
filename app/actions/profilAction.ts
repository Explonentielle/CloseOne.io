"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExperienceClosing } from "@prisma/client";
import { z } from "zod";

const ProfileSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(50),
  lastName: z.string().min(1, "Nom requis").max(50),
  telephone: z.string().max(20).optional().nullable(),
  localisation: z.string().max(100).optional().nullable(),
  experience: z.nativeEnum(ExperienceClosing).optional().nullable(),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfile(data: ProfileFormData): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = ProfileSchema.safeParse(data);
  if (!parsed.success) {
    // ✅ Correction ici : utiliser .issues au lieu de .errors
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        telephone: parsed.data.telephone ?? null,
        localisation: parsed.data.localisation ?? null,
        experience: parsed.data.experience ?? null,
      },
    });

    revalidatePath("/profil");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}