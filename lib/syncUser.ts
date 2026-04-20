import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Vérifie d'abord si l'user existe déjà en base
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Si l'user existe et a déjà ses infos de base, pas besoin d'appeler Clerk
  if (existingUser?.firstName && existingUser?.lastName) {
    return { ...existingUser, isNewUser: false };
  }

  // Sinon on appelle Clerk uniquement pour la création ou complétion du profil
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const isNewUser = !existingUser;

  const user = await prisma.user.upsert({
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
  });

  return { ...user, isNewUser };
}
