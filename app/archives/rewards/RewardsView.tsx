// "use client";

// import { Lock, Star, Zap, Crown, Award, Gem, Rocket } from "lucide-react";

// const rewards = [
//   {
//     title: "Closer Rookie",
//     description: "Fermez 10 deals",
//     icon: Star,
//     xpRequired: 500,
//     unlocked: true,
//     tier: "bronze",
//   },
//   {
//     title: "Deal Hunter",
//     description: "Fermez 25 deals en 1 mois",
//     icon: Zap,
//     xpRequired: 1500,
//     unlocked: true,
//     tier: "silver",
//   },
//   {
//     title: "Revenue Master",
//     description: "Générez €100K de revenue",
//     icon: Award,
//     xpRequired: 3000,
//     unlocked: true,
//     tier: "gold",
//   },
//   {
//     title: "Closer Elite",
//     description: "Top 3 du classement",
//     icon: Crown,
//     xpRequired: 4500,
//     unlocked: false,
//     tier: "platinum",
//   },
//   {
//     title: "Diamant",
//     description: "Série de 20 jours consécutifs",
//     icon: Gem,
//     xpRequired: 6000,
//     unlocked: false,
//     tier: "diamond",
//   },
//   {
//     title: "Légende",
//     description: "Atteignez tous les objectifs trimestriels",
//     icon: Rocket,
//     xpRequired: 10000,
//     unlocked: false,
//     tier: "legendary",
//   },
// ];

// const tierColors: Record<
//   string,
//   { bg: string; border: string; text: string; glow?: string }
// > = {
//   bronze: { bg: "rgba(120,60,20,0.2)", border: "#92400E50", text: "#F59E0B" },
//   silver: { bg: "rgba(148,163,184,0.1)", border: "#94A3B850", text: "#CBD5E1" },
//   gold: {
//     bg: "rgba(234,179,8,0.1)",
//     border: "#EAB30850",
//     text: "#FBBF24",
//     glow: "0 0 20px rgba(234,179,8,0.2)",
//   },
//   platinum: {
//     bg: "rgba(14,255,156,0.1)",
//     border: "#0EFF9C50",
//     text: "#0EFF9C",
//   },
//   diamond: { bg: "rgba(34,211,238,0.1)", border: "#22D3EE50", text: "#22D3EE" },
//   legendary: {
//     bg: "rgba(168,85,247,0.1)",
//     border: "#A855F750",
//     text: "#C084FC",
//   },
// };

// const milestones = [500, 1500, 3000, 4500, 6000];
// const currentXP = 3200;

// export default function RewardsView() {
//   return (
//     <div className="space-y-6 animate-slide-up">
//       <div>
//         <h2 className="text-2xl font-bold">Récompenses</h2>
//         <p className="text-[#A0A0A0] text-sm mt-1">
//           Débloquez des badges et récompenses
//         </p>
//       </div>

//       {/* XP Bar */}
//       <div className="glass-card p-5">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium">Votre Progression</span>
//           <span className="font-mono text-[#0EFF9C] font-bold">
//             {currentXP} XP
//           </span>
//         </div>
//         <div className="h-3 bg-[#2A2F35] rounded-full overflow-hidden relative">
//           <div
//             className="h-full rounded-full transition-all duration-1000"
//             style={{
//               width: `${(currentXP / 10000) * 100}%`,
//               background: "linear-gradient(90deg, #0EFF9C, #00C27A)",
//             }}
//           />
//           {milestones.map((xp) => (
//             <div
//               key={xp}
//               className="absolute top-0 h-full w-px bg-[#2A2F35]"
//               style={{ left: `${(xp / 10000) * 100}%` }}
//             />
//           ))}
//         </div>
//         <div className="flex justify-between mt-1">
//           <span className="text-xs text-[#A0A0A0]">0</span>
//           <span className="text-xs text-[#A0A0A0]">10 000 XP</span>
//         </div>
//       </div>

//       {/* Rewards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {rewards.map((r, i) => {
//           const tier = tierColors[r.tier];
//           return (
//             <div
//               key={i}
//               className="glass-card p-5 transition-all duration-300 hover:scale-[1.02]"
//               style={{
//                 border: `1px solid ${r.unlocked ? tier.border : "#2A2F35"}`,
//                 opacity: r.unlocked ? 1 : 0.6,
//                 boxShadow: r.unlocked && tier.glow ? tier.glow : undefined,
//               }}
//             >
//               <div className="flex items-center gap-3 mb-3">
//                 <div
//                   className="w-12 h-12 rounded-xl flex items-center justify-center"
//                   style={{ background: r.unlocked ? tier.bg : "#1A1F24" }}
//                 >
//                   {r.unlocked ? (
//                     <r.icon size={22} style={{ color: tier.text }} />
//                   ) : (
//                     <Lock size={22} className="text-[#A0A0A0]" />
//                   )}
//                 </div>
//                 <div>
//                   <h3
//                     className="font-semibold text-sm"
//                     style={{ color: r.unlocked ? "#fff" : "#A0A0A0" }}
//                   >
//                     {r.title}
//                   </h3>
//                   <p className="text-xs text-[#A0A0A0] capitalize">{r.tier}</p>
//                 </div>
//               </div>

//               <p className="text-xs text-[#A0A0A0] mb-3">{r.description}</p>

//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-mono text-[#A0A0A0]">
//                   {r.xpRequired} XP requis
//                 </span>
//                 {r.unlocked ? (
//                   <span
//                     className="text-xs font-medium flex items-center gap-1"
//                     style={{ color: "#0EFF9C" }}
//                   >
//                     <Star size={10} /> Débloqué
//                   </span>
//                 ) : (
//                   <span className="text-xs font-mono text-[#A0A0A0]">
//                     {Math.max(0, r.xpRequired - currentXP)} XP restants
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
