import Header from "./Header";
import Sidebar from "./Sidebar";
import { syncUser } from "@/lib/syncUser";

 
export default async function AppLayout({ children }: { children: React.ReactNode }) {
const user = await syncUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user!} />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}