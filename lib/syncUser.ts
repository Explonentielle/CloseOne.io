import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getFullUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  // Tente de récupérer l'user avec toutes ses relations en une seule requête
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      metrics: true,
      challenges: {
        include: {
          deals: true,
          dailyEntries: true,
          infopreneur: {
            include: { niche: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      objectives: { orderBy: { createdAt: "desc" } },
      monthlyScores: { orderBy: { mois: "desc" } },
      niches: true,
    },
  });

  // Profil complet → retourne directement, 0 appel Clerk
  if (existingUser?.firstName && existingUser?.lastName) {
    return existingUser;
  }

  // Nouvel utilisateur ou profil incomplet → appel Clerk pour compléter
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
    include: {
      metrics: true,
      challenges: {
        include: { 
          deals: true,
          dailyEntries: true,
          infopreneur: {
            include: { niche: true }
          }
        },
        orderBy: { createdAt: "desc" },
      },
      objectives: { orderBy: { createdAt: "desc" } },
      monthlyScores: { orderBy: { mois: "desc" } },
      niches: true,
    },
  });

  return upserted;
});

// Alias léger pour les endroits qui ont juste besoin de savoir si l'user existe
// sans les relations — utilise le cache de getFullUser, pas de requête supplémentaire
export const syncUser = cache(async () => {
  const user = await getFullUser();
  if (!user) return null;
  const { metrics, challenges, objectives, monthlyScores, niches, ...base } = user;
  return base;
});