"use client";
 
import { Star, Medal, Trophy, Zap, Flame, Crown, CheckCircle } from "lucide-react";
 
export interface BadgeConfig {
  key: string;
  name: string;
  color: string;
  icon: React.ElementType;
  threshold: number;
}
 
export const BADGE_CONFIGS: BadgeConfig[] = [
  { key: "starter",    name: "Starter Pro",              color: "#CD7F32", icon: Star,        threshold: 30000  },
  { key: "confirmed",  name: "Closer Confirmé",          color: "#C0C0C0", icon: Medal,       threshold: 40000  },
  { key: "elite",      name: "Elite Closer",             color: "#FFD700", icon: Trophy,      threshold: 50000  },
  { key: "top5",       name: "Top 5%",                   color: "#8B5CF6", icon: Zap,         threshold: 80000  },
  { key: "legendary",  name: "Legendary Closer",         color: "#EF4444", icon: Flame,       threshold: 100000 },
  { key: "hallOfFame", name: "Hall of Fame",             color: "#06B6D4", icon: Crown,       threshold: 200000 },
  { key: "certified",  name: "Closer Certifié CloseOne", color: "#0EFF9C", icon: CheckCircle, threshold: 0      },
];
 
export function getBadgesForCA(ca: number, certified = false): BadgeConfig[] {
  return BADGE_CONFIGS.filter((b) => {
    if (b.key === "certified") return certified;
    return ca >= b.threshold;
  });
}
 
export function getHighestBadge(ca: number): BadgeConfig | null {
  const earned = BADGE_CONFIGS.filter((b) => b.key !== "certified" && ca >= b.threshold);
  return earned.length > 0 ? earned[earned.length - 1] : null;
}
 
interface CloserBadgeProps {
  badge: BadgeConfig;
  size?: number;
  locked?: boolean;
}
 
export default function CloserBadge({ badge, size = 32, locked = false }: CloserBadgeProps) {
  const Icon = badge.icon;
  const iconSize = size * 0.5;
 
  return (
    <div className="relative group">
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-200 ${
          locked ? "opacity-40 grayscale" : "hover:scale-110 cursor-pointer"
        }`}
        style={{
          width: size,
          height: size,
          backgroundColor: locked ? "#1A1F24" : `${badge.color}20`,
          boxShadow: locked ? "none" : `0 0 12px ${badge.color}40`,
          border: `2px solid ${locked ? "#2A2F35" : badge.color}`,
        }}
      >
        <Icon size={iconSize} style={{ color: locked ? "#A0A0A0" : badge.color }} />
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-[#1A1F24] border border-[#2A2F35] text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <p>{badge.name}</p>
        {badge.threshold > 0 && (
          <p className="text-[#A0A0A0] text-[10px]">€{badge.threshold.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
 