import AppLayout from "@/components/AppLayout";
import { syncUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";
import ClientDetailView from "./ClientDetailView";
 
export default async function ClientPage() {
  const user = await syncUser();
  
  if (!user) return null;

  if (user.isNewUser) {
    redirect("/profile");
  }

  return (
    <AppLayout>
      <ClientDetailView />
    </AppLayout>
  );
}