// "use client";

// import { Phone, Mail, Search, ZoomIn, ZoomOut, User } from "lucide-react";
// import { useMemo, useState } from "react";
// import { toast } from "sonner";
// import CloserBadge, { getBadgesForCA } from "@/components/CloserBadge";
// import MapProvider from "./MapProvider";

// interface Closer {
//   id: number;
//   name: string;
//   role: string;
//   city: string;
//   sectors: string[];
//   available: boolean;
//   avatar: string;
//   deals: number;
//   revenue: string;
//   ca: number;
//   email: string;
//   phone: string;
// }

// const closers: Closer[] = [
//   {
//     id: 1,
//     name: "Sophie Martin",
//     role: "Senior Closer",
//     city: "Paris",
//     sectors: ["SaaS", "B2B"],
//     available: true,
//     avatar: "SM",
//     deals: 52,
//     revenue: "€145K",
//     ca: 145000,
//     email: "sophie@closeone.io",
//     phone: "+33 6 12 34 56 78",
//   },
//   {
//     id: 2,
//     name: "Lucas Bernard",
//     role: "Closer",
//     city: "Lyon",
//     sectors: ["E-commerce"],
//     available: true,
//     avatar: "LB",
//     deals: 47,
//     revenue: "€132K",
//     ca: 132000,
//     email: "lucas@closeone.io",
//     phone: "+33 6 23 45 67 89",
//   },
//   {
//     id: 3,
//     name: "Emma Dubois",
//     role: "Senior Closer",
//     city: "Marseille",
//     sectors: ["Finance", "Assurance"],
//     available: false,
//     avatar: "ED",
//     deals: 43,
//     revenue: "€118K",
//     ca: 118000,
//     email: "emma@closeone.io",
//     phone: "+33 6 34 56 78 90",
//   },
//   {
//     id: 4,
//     name: "Thomas Petit",
//     role: "Closer",
//     city: "Bordeaux",
//     sectors: ["Coaching"],
//     available: true,
//     avatar: "TP",
//     deals: 38,
//     revenue: "€98K",
//     ca: 98000,
//     email: "thomas@closeone.io",
//     phone: "+33 6 45 67 89 01",
//   },
//   {
//     id: 5,
//     name: "Léa Moreau",
//     role: "Closer",
//     city: "Lille",
//     sectors: ["Marketing", "SaaS"],
//     available: true,
//     avatar: "LM",
//     deals: 35,
//     revenue: "€92K",
//     ca: 92000,
//     email: "lea@closeone.io",
//     phone: "+33 6 56 78 90 12",
//   },
//   {
//     id: 6,
//     name: "Hugo Laurent",
//     role: "Junior Closer",
//     city: "Toulouse",
//     sectors: ["Santé"],
//     available: false,
//     avatar: "HL",
//     deals: 31,
//     revenue: "€84K",
//     ca: 84000,
//     email: "hugo@closeone.io",
//     phone: "+33 6 67 89 01 23",
//   },
//   {
//     id: 7,
//     name: "Chloé Roux",
//     role: "Closer",
//     city: "Nantes",
//     sectors: ["B2B", "Tech"],
//     available: true,
//     avatar: "CR",
//     deals: 28,
//     revenue: "€76K",
//     ca: 76000,
//     email: "chloe@closeone.io",
//     phone: "+33 6 78 90 12 34",
//   },
//   {
//     id: 8,
//     name: "Antoine Leroy",
//     role: "Closer",
//     city: "Strasbourg",
//     sectors: ["Finance"],
//     available: true,
//     avatar: "AL",
//     deals: 25,
//     revenue: "€68K",
//     ca: 68000,
//     email: "antoine@closeone.io",
//     phone: "+33 6 89 01 23 45",
//   },
// ];

// const geoMap: Record<string, { lat: number; lng: number }> = {
//   Paris: { lat: 48.8566, lng: 2.3522 },
//   Lyon: { lat: 45.764, lng: 4.8357 },
//   Marseille: { lat: 43.2965, lng: 5.3698 },
//   Bordeaux: { lat: 44.8378, lng: -0.5792 },
//   Lille: { lat: 50.6292, lng: 3.0573 },
//   Toulouse: { lat: 43.6047, lng: 1.4442 },
//   Nantes: { lat: 47.2184, lng: -1.5536 },
//   Strasbourg: { lat: 48.5734, lng: 7.7521 },
// };

// interface Closer {
//   id: number;
//   name: string;
//   role: string;
//   city: string;
//   sectors: string[];
//   available: boolean;
//   avatar: string;
//   deals: number;
//   revenue: string;
//   ca: number;
//   email: string;
//   phone: string;
// }

// const isElite = (c: Closer) => c.ca >= 50000;

// const dotColor = (c: Closer) => {
//   if (!c.available) return "#A0A0A0";
//   return isElite(c) ? "#FFD700" : "#0EFF9C";
// };

// const dotGlow = (c: Closer) => {
//   if (!c.available) return undefined;
//   if (isElite(c)) return "0 0 12px #FFD70080, 0 0 24px #FFD70040";
//   return "0 0 8px #0EFF9C60";
// };

// export default function MapView() {
//   const [selected, setSelected] = useState<Closer | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterCity, setFilterCity] = useState("");
//   const [filterAvail, setFilterAvail] = useState<
//     "all" | "available" | "unavailable"
//   >("all");

//   // ✅ filtered défini AVANT utilisation
//   const filtered = useMemo(() => {
//     return closers.filter((c) => {
//       if (
//         search &&
//         !c.name.toLowerCase().includes(search.toLowerCase()) &&
//         !c.city.toLowerCase().includes(search.toLowerCase())
//       )
//         return false;

//       if (filterCity && c.city !== filterCity) return false;

//       if (filterAvail === "available" && !c.available) return false;
//       if (filterAvail === "unavailable" && c.available) return false;

//       return true;
//     });
//   }, [search, filterCity, filterAvail]);

//   const cities = [...new Set(closers.map((c) => c.city))];

//   const points = useMemo(() => {
//     return filtered
//       .map((c) => {
//         const pos = geoMap[c.city];
//         if (!pos) return null;
//         return {
//           id: c.id,
//           name: c.name,
//           ...pos,
//         };
//       })
//       .filter(Boolean);
//   }, [filtered]);

//   const handleContact = (type: "phone" | "email") => {
//     if (!selected) return;

//     if (type === "phone") {
//       toast.success(`Appel vers ${selected.phone}`, {
//         description: selected.name,
//       });
//     } else {
//       toast.success(`Email envoyé à ${selected.email}`, {
//         description: selected.name,
//       });
//     }

//     const dotColor = (c: Closer) => {
//       if (!c.available) return "#A0A0A0";
//       return isElite(c) ? "#FFD700" : "#0EFF9C";
//     };

//     const dotGlow = (c: Closer) => {
//       if (!c.available) return undefined;
//       if (isElite(c)) return "0 0 12px #FFD70080, 0 0 24px #FFD70040";
//       return "0 0 8px #0EFF9C60";
//     };
//   };

//   return (
//     <div className="space-y-6 animate-slide-up">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold">Carte des Closers</h2>
//         <p className="text-[#A0A0A0] text-sm mt-1">
//           Localisez les closers disponibles
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
//           />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Rechercher..."
//             className="w-full h-10 rounded-lg border border-[#2A2F35] bg-[#1A1F24] pl-10 pr-4 text-sm text-white"
//           />
//         </div>

//         <select
//           value={filterCity}
//           onChange={(e) => setFilterCity(e.target.value)}
//           className="h-10 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-3 text-sm text-white"
//         >
//           <option value="">Toutes les villes</option>
//           {cities.map((c) => (
//             <option key={c} value={c}>
//               {c}
//             </option>
//           ))}
//         </select>

//         <div className="flex gap-1.5">
//           {(["all", "available", "unavailable"] as const).map((v) => (
//             <button
//               key={v}
//               onClick={() => setFilterAvail(v)}
//               className="px-3 py-2 rounded-lg text-xs"
//               style={
//                 filterAvail === v
//                   ? {
//                       background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
//                       color: "#0D1117",
//                     }
//                   : {
//                       background: "#1A1F24",
//                       color: "#A0A0A0",
//                       border: "1px solid #2A2F35",
//                     }
//               }
//             >
//               {v === "all" ? "Tous" : v === "available" ? "Dispo" : "Indispo"}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* MAP */}
//         <div className="lg:col-span-2 glass-card p-6">
//           <div className="h-[450px] w-full rounded-xl overflow-hidden">
//             <MapProvider
//               apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
//               center={{ lat: 46.603354, lng: 1.888334 }}
//               points={points as any}
//               selectedId={selected?.id}
//               onSelect={(id: number) => {
//                 const closer = closers.find((c) => c.id === id);
//                 if (closer) setSelected(closer);
//               }}
//             />
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="space-y-4">
//           {selected ? (
//             <div className="glass-card p-5 space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[#0D1117] bg-gradient-to-r from-[#0EFF9C] to-[#00C27A]">
//                   {selected.avatar}
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-white">{selected.name}</h3>
//                   <p className="text-xs text-[#A0A0A0]">{selected.role}</p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-1.5">
//                 {getBadgesForCA(selected.ca).map((b) => (
//                   <CloserBadge key={b.key} badge={b} size={24} />
//                 ))}
//               </div>

//               <div className="text-sm space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-[#A0A0A0]">Ville</span>
//                   <span>{selected.city}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#A0A0A0]">Deals</span>
//                   <span className="font-semibold">{selected.deals}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#A0A0A0]">CA</span>
//                   <span className="text-[#0EFF9C]">{selected.revenue}</span>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleContact("phone")}
//                   className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg text-[#0D1117] text-xs font-semibold bg-gradient-to-r from-[#0EFF9C] to-[#00C27A] hover:opacity-90 transition"
//                 >
//                   <Phone size={14} />
//                   Contacter
//                 </button>

//                 <button
//                   onClick={() => handleContact("email")}
//                   className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-[#1A1F24] border border-[#2A2F35] text-white text-xs hover:bg-[#232830] transition"
//                 >
//                   <Mail size={14} />
//                   Email
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="glass-card p-5 flex items-center justify-center h-48 text-[#A0A0A0]">
//               <User className="mr-2" />
//               Sélectionner un closer
//             </div>
//           )}

//           {/* Closer list */}
//           <div className="glass-card p-4">
//             <h3 className="font-semibold text-sm mb-3 text-white">
//               Closers ({filtered.length})
//             </h3>
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {filtered.map((c) => (
//                 <button
//                   key={c.id}
//                   onClick={() => setSelected(c)}
//                   className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors"
//                   style={{
//                     background:
//                       selected?.id === c.id
//                         ? "rgba(14,255,156,0.1)"
//                         : "transparent",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (selected?.id !== c.id)
//                       (e.currentTarget as HTMLButtonElement).style.background =
//                         "#1A1F24";
//                   }}
//                   onMouseLeave={(e) => {
//                     if (selected?.id !== c.id)
//                       (e.currentTarget as HTMLButtonElement).style.background =
//                         "transparent";
//                   }}
//                 >
//                   <div
//                     className="w-2 h-2 rounded-full shrink-0"
//                     style={{ background: dotColor(c) }}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate text-white">
//                       {c.name}
//                     </p>
//                     <p className="text-xs text-[#A0A0A0]">{c.city}</p>
//                   </div>
//                   <span className="text-xs text-[#A0A0A0]">
//                     {c.deals} deals
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
