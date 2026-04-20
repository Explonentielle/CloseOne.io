// "use client";

// import { useState } from "react";
// import { Target, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
// import { toast } from "sonner";

// interface Goal {
//   title: string;
//   progress: number;
//   current: number;
//   target: number;
//   unit?: string;
//   deadline: string;
//   status: string;
// }

// const initialGoals: Goal[] = [
//   {
//     title: "Closer 50 deals ce mois",
//     progress: 78,
//     current: 39,
//     target: 50,
//     deadline: "8 jours",
//     status: "on-track",
//   },
//   {
//     title: "Atteindre €500K de revenue",
//     progress: 57,
//     current: 284,
//     target: 500,
//     unit: "K€",
//     deadline: "22 jours",
//     status: "at-risk",
//   },
//   {
//     title: "Recruter 5 nouveaux agents",
//     progress: 60,
//     current: 3,
//     target: 5,
//     deadline: "15 jours",
//     status: "on-track",
//   },
//   {
//     title: "NPS client > 85",
//     progress: 94,
//     current: 88,
//     target: 85,
//     deadline: "Atteint!",
//     status: "completed",
//   },
//   {
//     title: "Réduire le cycle de vente à 14j",
//     progress: 45,
//     current: 21,
//     target: 14,
//     unit: "jours",
//     deadline: "30 jours",
//     status: "behind",
//   },
//   {
//     title: "Formation équipe complétée",
//     progress: 100,
//     current: 34,
//     target: 34,
//     deadline: "Atteint!",
//     status: "completed",
//   },
// ];

// const statusConfig = {
//   "on-track": {
//     icon: Clock,
//     color: "#0EFF9C",
//     bg: "rgba(14,255,156,0.1)",
//     label: "En bonne voie",
//   },
//   "at-risk": {
//     icon: AlertCircle,
//     color: "#F59E0B",
//     bg: "rgba(245,158,11,0.1)",
//     label: "À risque",
//   },
//   behind: {
//     icon: AlertCircle,
//     color: "#F87171",
//     bg: "rgba(248,113,113,0.1)",
//     label: "En retard",
//   },
//   completed: {
//     icon: CheckCircle2,
//     color: "#00C27A",
//     bg: "rgba(0,194,122,0.1)",
//     label: "Atteint",
//   },
// };

// const inputClass =
//   "w-full h-11 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50 transition-all";

// export default function GoalsView() {
//   const [goals, setGoals] = useState(initialGoals);
//   const [showModal, setShowModal] = useState(false);
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [form, setForm] = useState({
//     title: "",
//     target: "",
//     unit: "",
//     deadline: "",
//   });

//   const openNew = () => {
//     setEditIndex(null);
//     setForm({ title: "", target: "", unit: "", deadline: "" });
//     setShowModal(true);
//   };

//   const openEdit = (i: number) => {
//     const g = goals[i];
//     setEditIndex(i);
//     setForm({
//       title: g.title,
//       target: String(g.target),
//       unit: g.unit || "",
//       deadline: g.deadline,
//     });
//     setShowModal(true);
//   };

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editIndex !== null) {
//       const updated = [...goals];
//       updated[editIndex] = {
//         ...updated[editIndex],
//         title: form.title,
//         target: Number(form.target),
//         unit: form.unit,
//         deadline: form.deadline,
//       };
//       setGoals(updated);
//       toast.success("Objectif modifié !");
//     } else {
//       setGoals([
//         ...goals,
//         {
//           title: form.title,
//           progress: 0,
//           current: 0,
//           target: Number(form.target),
//           unit: form.unit || undefined,
//           deadline: form.deadline || "30 jours",
//           status: "on-track",
//         },
//       ]);
//       toast.success("Objectif créé !");
//     }
//     setShowModal(false);
//   };

//   const barColor = (status: string) => {
//     if (status === "completed")
//       return "linear-gradient(90deg, #0EFF9C, #00a86b)";
//     if (status === "behind") return "#F87171";
//     return "linear-gradient(90deg, #0EFF9C, #00C27A)";
//   };

//   return (
//     <div className="space-y-6 animate-slide-up">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Objectifs</h2>
//           <p className="text-[#A0A0A0] text-sm mt-1">
//             Suivez vos objectifs en temps réel
//           </p>
//         </div>
//         <button
//           onClick={openNew}
//           className="text-[#0D1117] px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
//           style={{ background: "linear-gradient(135deg, #0EFF9C, #00C27A)" }}
//         >
//           + Nouvel Objectif
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//         {goals.map((g, i) => {
//           const config = statusConfig[g.status as keyof typeof statusConfig];
//           const StatusIcon = config.icon;
//           return (
//             <div
//               key={i}
//               className="glass-card p-5 transition-all duration-300 group cursor-pointer hover:border-[#0EFF9C]/30 hover:scale-[1.02]"
//               onClick={() => openEdit(i)}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-sm text-white">
//                     {g.title}
//                   </h3>
//                   <div
//                     className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs"
//                     style={{ background: config.bg, color: config.color }}
//                   >
//                     <StatusIcon size={12} />
//                     {config.label}
//                   </div>
//                 </div>
//                 <Target
//                   size={18}
//                   className="text-[#A0A0A0] group-hover:text-[#0EFF9C] transition-colors"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs">
//                   <span className="text-[#A0A0A0]">
//                     {g.current}/{g.target} {g.unit || ""}
//                   </span>
//                   <span className="font-mono font-semibold text-white">
//                     {g.progress}%
//                   </span>
//                 </div>
//                 <div className="h-2 bg-[#2A2F35] rounded-full overflow-hidden">
//                   <div
//                     className="h-full rounded-full transition-all duration-700"
//                     style={{
//                       width: `${Math.min(g.progress, 100)}%`,
//                       background: barColor(g.status),
//                     }}
//                   />
//                 </div>
//                 <p className="text-xs text-[#A0A0A0] flex items-center gap-1">
//                   <Clock size={10} /> {g.deadline}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           style={{
//             background: "rgba(13,17,23,0.85)",
//             backdropFilter: "blur(8px)",
//           }}
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             className="glass-card p-6 w-full max-w-md animate-slide-up"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-lg font-semibold">
//                 {editIndex !== null ? "Modifier l'objectif" : "Nouvel Objectif"}
//               </h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-[#A0A0A0] hover:text-white"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <form onSubmit={handleSave} className="space-y-4">
//               <div>
//                 <label className="text-sm text-[#A0A0A0] mb-1.5 block">
//                   Titre
//                 </label>
//                 <input
//                   value={form.title}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                   placeholder="Ex: Closer 50 deals"
//                   className={inputClass}
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm text-[#A0A0A0] mb-1.5 block">
//                     Cible
//                   </label>
//                   <input
//                     type="number"
//                     value={form.target}
//                     onChange={(e) =>
//                       setForm({ ...form, target: e.target.value })
//                     }
//                     placeholder="50"
//                     className={inputClass}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-[#A0A0A0] mb-1.5 block">
//                     Unité (optionnel)
//                   </label>
//                   <input
//                     value={form.unit}
//                     onChange={(e) => setForm({ ...form, unit: e.target.value })}
//                     placeholder="K€, jours..."
//                     className={inputClass}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="text-sm text-[#A0A0A0] mb-1.5 block">
//                   Deadline
//                 </label>
//                 <input
//                   value={form.deadline}
//                   onChange={(e) =>
//                     setForm({ ...form, deadline: e.target.value })
//                   }
//                   placeholder="30 jours"
//                   className={inputClass}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full h-11 rounded-lg text-[#0D1117] font-semibold text-sm hover:opacity-90 transition-opacity"
//                 style={{
//                   background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
//                 }}
//               >
//                 {editIndex !== null ? "Sauvegarder" : "Créer l'objectif"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
