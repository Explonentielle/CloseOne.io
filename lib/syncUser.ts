import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Prisma } from "@prisma/client";

export const getFullUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  // Inclusion complète avec tous les niveaux de relations
  const includeOptions: Prisma.UserInclude = {
    metrics: true,
    challenges: {
      include: {
        deals: {
          include: {
            package: {
              include: {
                infopreneur: {
                  include: {
                    niche: true,
                  },
                },
              },
            },
          },
        },
        dailyEntries: true,
        infopreneur: {
          include: {
            niche: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc" as const,
      },
    },
    objectives: {
      orderBy: {
        createdAt: "desc" as const,
      },
    },
    monthlyScores: {
      orderBy: {
        mois: "desc" as const,
      },
    },
    niches: true,
  };

  // Récupération de l'utilisateur existant
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: includeOptions,
  });

  // Si le profil est déjà complet, on le retourne
  if (existingUser?.firstName && existingUser?.lastName) {
    return existingUser;
  }

  // Sinon, on complète avec les données Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const upserted = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: clerkUser.emailAddresses[0].emailAddress,
      avatarUrl: clerkUser.imageUrl,
      ...(!existingUser?.firstName && { firstName: clerkUser.firstName }),
      ...(!existingUser?.lastName && { lastName: clerkUser.lastName }),
    },
    create: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      avatarUrl: clerkUser.imageUrl,
    },
    include: includeOptions,
  });

  return upserted;
});

// Alias pour n'avoir que les infos de base (sans les relations)
export const syncUser = cache(async () => {
  const user = await getFullUser();
  if (!user) return null;
  const { metrics, challenges, objectives, monthlyScores, niches, ...base } = user;
  return base;
});