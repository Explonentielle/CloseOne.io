import PageLayout from "@/components/PageLayout";
import { syncUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";
import ClientsView from "./ClientsView";
 
export default async function ClientPage() {


  return (
    <PageLayout>
      <ClientsView />
    </PageLayout>
  );
}