import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { firstName, lastName, email } = body;

  if (email && typeof email !== "string") {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  console.log("dfd")
  try {
    const updated = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
