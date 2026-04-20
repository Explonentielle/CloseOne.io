import AppLayout from "@/components/AppLayout";
import ProfilView from "./ProfilView"; // un seul import
import { syncUser } from "@/lib/syncUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await syncUser();
  if (!user) return null;

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      metrics: true,
      deals: true,
    },
  });

  if (!fullUser) {
    redirect("/sign-in");
  }

  return (
    <AppLayout>
      <ProfilView user={fullUser} />
    </AppLayout>
  );
}
