"use client";
 
import { BarChart3, Map, Target, Trophy, Gift, Briefcase, Globe, Settings, Zap, LogOut, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
 
const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: Briefcase, label: "Deals", path: "/deals" },
  { icon: Map, label: "Carte", path: "/map" },
  { icon: Target, label: "Objectifs", path: "/goals" },
  { icon: Trophy, label: "Classement", path: "/leaderboard" },
  { icon: Gift, label: "Récompenses", path: "/rewards" },
  { icon: Globe, label: "Écosystèmes", path: "/ecosystems" },
  { icon: BookOpen, label: "Climb", path: "/climb" },
  { icon: User, label: "Profil", path: "/profile" },
];
 
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
 
  return (
    <aside className="w-16 lg:w-60 h-screen glass-card border-r border-border/50 flex flex-col py-5 shrink-0">
      <div className="px-3 lg:px-5 mb-8">
        <Link href="/dashboard" className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={16} className="text-[#0D1117]" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-white">Close</span>
            <span className="text-[#0EFF9C]">One</span>
            <span className="text-[#A0A0A0]">.io</span>
          </h1>
        </Link>
        <Link href="/dashboard" className="lg:hidden flex justify-center">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={18} className="text-[#0D1117]" />
          </div>
        </Link>
      </div>
 
      <nav className="flex-1 space-y-0.5 px-2 lg:px-3 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#0EFF9C]/10 text-[#0EFF9C] border-l-2 border-[#0EFF9C]"
                  : "text-[#A0A0A0] hover:text-white hover:bg-[#1A1F24]"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden lg:inline text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
 
      <div className="px-2 lg:px-3 space-y-0.5">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            pathname === "/settings"
              ? "bg-[#0EFF9C]/10 text-[#0EFF9C] border-l-2 border-[#0EFF9C]"
              : "text-[#A0A0A0] hover:text-white hover:bg-[#1A1F24]"
          }`}
        >
          <Settings size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Paramètres</span>
        </Link>
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1A1F24] transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}