import { getFullUser } from "@/lib/syncUser";
import { redirect } from "next/navigation";
import { UserProvider } from "@/contexts/UserContext";
 
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullUser = await getFullUser();
 
  if (!fullUser) redirect("/sign-in");
 
  return <UserProvider user={fullUser}>{children}</UserProvider>;
}
 