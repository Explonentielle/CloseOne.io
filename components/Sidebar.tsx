"use client";

import {
  LayoutDashboard,
  Users,
  HandCoins,
  Trophy,
  UserCircle,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Mes Clients", path: "/clients" },
  { icon: HandCoins, label: "Deals", path: "/deals" },
  { icon: Trophy, label: "Stats", path: "/statistics" },
  { icon: UserCircle, label: "Profil", path: "/profil" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-16 lg:w-60 min-h-screen glass-card border-r border-border/50 flex flex-col py-5 shrink-0 rounded-[var(--radius-lg)] sticky top-0 self-start h-screen">
      <div className="px-3 lg:px-5 mb-8">
        <Link href="/landingpage" className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={16} className="text-[hsl(var(--background))]" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-[hsl(var(--foreground))]">Close</span>
            <span className="text-[hsl(var(--primary))]">One</span>
            <span className="text-[hsl(var(--muted-foreground))]">.io</span>
          </h1>
        </Link>
        <Link href="/dashboard" className="lg:hidden flex justify-center">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={18} className="text-[hsl(var(--background))]" />
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
                  ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] border-l-2 border-[hsl(var(--primary))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden lg:inline text-sm font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 lg:px-3 space-y-0.5 mt-auto">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            pathname === "/settings"
              ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] border-l-2 border-[hsl(var(--primary))]"
              : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
          }`}
        >
          <Settings size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">
            Paramètres
          </span>
        </Link>
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}