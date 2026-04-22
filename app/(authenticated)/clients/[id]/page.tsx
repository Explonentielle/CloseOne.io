import PageLayout from "@/components/PageLayout";
import { syncUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";
import ClientDetailView from "./ClientDetailView";
 
export default async function ClientDetailsPage() {


  return (
    <PageLayout>
      <ClientDetailView />
    </PageLayout>
  );
}