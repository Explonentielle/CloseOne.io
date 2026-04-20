import AppLayout from "@/components/AppLayout";
import { syncUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";
import StatisticsView from "./StatisticsView";

export default async function StatisticsPage() {
  const user = await syncUser();

  if (!user) return null;

  if (user.isNewUser) {
    redirect("/profile");
  }

  return (
    <AppLayout>
      <StatisticsView />
    </AppLayout>
  );
}
