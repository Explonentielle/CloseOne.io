import TrackRecordView from "./TrackRecordView";
import { syncUser } from "@/lib/syncUser";
import AppLayout from "@/components/AppLayout";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function TrackRecordPage() {
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
      <TrackRecordView user={fullUser} />
    </AppLayout>
  );
}
