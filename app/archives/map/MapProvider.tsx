// "use client";

// import { LoadScript } from "@react-google-maps/api";
// import Map from "./Map";

// interface MapProviderProps {
//   apiKey: string;
//   center: { lat: number; lng: number };
//   points: any[];
//   onSelect?: (id: number) => void;
//   selectedId?: number | null;
// }

// export default function MapProvider({
//   apiKey,
//   center,
//   points,
//   onSelect,
//   selectedId,
// }: MapProviderProps) {
//   return (
//     <LoadScript googleMapsApiKey={apiKey}>
//       <div className="w-full h-[450px] rounded-xl overflow-hidden">
//         <Map
//           center={center}
//           points={points}
//           onSelect={onSelect}
//           selectedId={selectedId}
//         />
//       </div>
//     </LoadScript>
//   );
// }
