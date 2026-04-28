import PageLayout from "@/components/PageLayout";
import { syncUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";
import StatisticsView from "./StatisticsView";

export default async function StatisticsPage() {


  return (
    <PageLayout>
      <StatisticsView />
    </PageLayout>
  );
}
