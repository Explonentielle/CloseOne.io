import PageLayout from "@/components/PageLayout";
import SettingsView from "./SettingsView";
import { syncUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";

export default async function SettingsPage() {


  return (
    <PageLayout>
      <SettingsView />
    </PageLayout>
  );
}
