"use client";

import CloserBadge, {
  BADGE_CONFIGS,
  getBadgesForCA,
} from "@/components/CloserBadge";
import {
  Mail,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { User, UserMetrics, Deal } from "@prisma/client";
import { useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";

type UserWithRelations = User & {
  metrics: UserMetrics | null;
  deals: Deal[];
};

export default function ProfileView({ user }: { user: UserWithRelations }) {
  const [editOpen, setEditOpen] = useState(false);
  const metrics = user.metrics;
  const caMensuel = metrics?.monthlyRevenue ?? 0;
  const caTotal = metrics?.totalRevenue ?? 0;
  const dealsTotal = metrics?.totalDeals ?? 0;
  const tauxClosing =
    metrics && metrics.totalDeals > 0
      ? Math.round((metrics.wonDeals / metrics.totalDeals) * 100)
      : 0;

  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((n) => n![0].toUpperCase())
      .join("") || user.email[0].toUpperCase();

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  const roleLabel: Record<string, string> = {
    CLOSER: "Closer",
    MANAGER: "Manager",
    ADMIN: "Admin",
    USER: "Utilisateur",
  };

  const memberSince = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  const earnedBadges = getBadgesForCA(caMensuel);
  const badgeProgressData = BADGE_CONFIGS.filter(
    (b) => b.key !== "certified",
  ).map((b) => ({
    ...b,
    progress: Math.min(100, Math.round((caMensuel / b.threshold) * 100)),
    unlocked: caMensuel >= b.threshold,
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Profil</h2>
        <p className="text-[#A0A0A0] text-sm mt-1">Votre espace personnel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-6">
        {/* LEFT CARD */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={fullName}
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full gradient-primary flex items-center justify-center text-[28px] font-bold text-[#0D1117]">
              {initials}
            </div>
          )}

          <div>
            <h3 className="font-bold text-xl">{fullName}</h3>
            <p className="text-sm text-[#A0A0A0]">
              {roleLabel[user.role] ?? user.role}
            </p>
          </div>

          {earnedBadges.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#A0A0A0] tracking-[1.5px] mb-3 uppercase">
                Badges Gagnés
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {earnedBadges.map((b) => (
                  <CloserBadge key={b.key} badge={b} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5 text-sm text-[#A0A0A0] w-full text-left">
            <div className="flex items-center gap-3">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={14} className="shrink-0" />
              Membre depuis {memberSince}
            </div>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="w-full h-10 rounded-lg border border-[#0EFF9C] text-[#0EFF9C] text-sm font-medium hover:bg-[#0EFF9C]/10 transition-colors"
          >
            Modifier mon profil
          </button>

          <EditProfileModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            user={user}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[22px]">
                Performance Mensuelle
              </h3>
              {tauxClosing >= 70 && (
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#8B5CF620", color: "#8B5CF6" }}
                >
                  <Zap size={12} /> Top 5%
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: Trophy,
                  label: "CA Mensuel",
                  value: `€${caMensuel.toLocaleString("fr-FR")}`,
                  highlight: true,
                },
                {
                  icon: Target,
                  label: "CA Total",
                  value: `€${caTotal.toLocaleString("fr-FR")}`,
                  highlight: false,
                },
                {
                  icon: TrendingUp,
                  label: "Deals Total",
                  value: String(dealsTotal),
                  highlight: false,
                },
                {
                  icon: Users,
                  label: "Taux closing",
                  value: `${tauxClosing}%`,
                  highlight: false,
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon size={20} className="mx-auto mb-2 text-[#A0A0A0]" />
                  <p className="text-xs text-[#A0A0A0] mb-1">{s.label}</p>
                  <p
                    className={`text-2xl font-bold ${s.highlight ? "text-[#0EFF9C]" : "text-white"}`}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-[22px] mb-5">
              Progression des Badges
            </h3>
            <div className="space-y-4">
              {badgeProgressData.map((b) => (
                <div key={b.key} className="flex items-center gap-3">
                  <CloserBadge badge={b} size={28} locked={!b.unlocked} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-sm font-medium ${b.unlocked ? "text-white" : "text-[#A0A0A0]"}`}
                      >
                        {b.name}
                      </span>
                      <span className="text-xs text-[#A0A0A0]">
                        €{b.threshold.toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#2A2F35]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${b.progress}%`,
                          backgroundColor: "#00C27A",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#A0A0A0] w-10 text-right">
                    {b.progress}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
