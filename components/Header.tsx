"use client";

import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Props = {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatarUrl: string | null;
    role: string;
  };
};

const roleLabel: Record<string, string> = {
  CLOSER: "Closer",
  MANAGER: "Manager",
  ADMIN: "Admin",
  USER: "Utilisateur",
};

export default function Header({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((n) => n![0].toUpperCase())
      .join("") || user.email[0].toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/0.7)] backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-end px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[hsl(var(--destructive))] border-2 border-[hsl(var(--background))]" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-expanded={open}
            aria-haspopup="true"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">
                {fullName}
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {roleLabel[user.role] ?? user.role}
              </p>
            </div>

            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-[hsl(var(--background))]">
                {initials}
              </div>
            )}

            <ChevronDown
              size={14}
              className={`text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-48 glass-card py-1 overflow-hidden animate-fade-in"
            >
              <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="text-sm font-medium truncate text-[hsl(var(--foreground))]">
                  {fullName}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate">
                  {user.email}
                </p>
              </div>

              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  router.push("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
              >
                <User size={14} />
                Mon profil
              </button>

              <button
                // onClick={() => signOut(() => router.push("/sign-in"))}
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
              >
                <LogOut size={14} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
