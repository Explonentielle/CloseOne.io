// "use client";

// import { GoogleMap, Marker } from "@react-google-maps/api";

// interface MapProps {
//   center: { lat: number; lng: number };
//   points: {
//     id: number;
//     name: string;
//     lat: number;
//     lng: number;
//   }[];
//   onSelect?: (id: number) => void;
//   selectedId?: number | null;
// }

// const containerStyle = {
//   width: "100%",
//   height: "100%",
// };

// export default function Map({
//   center,
//   points,
//   onSelect,
//   selectedId,
// }: MapProps) {
//   const dotColor = (id: number) => (selectedId === id ? "#0EFF9C" : "#A0A0A0");

//   return (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={6}
//       options={{
//         disableDefaultUI: true,
//         zoomControl: true,
//       }}
//     >
//       {points.map((p) => (
//         <Marker
//           key={p.id}
//           position={{ lat: p.lat, lng: p.lng }}
//           onClick={() => onSelect?.(p.id)}
//           icon={{
//             path: google.maps.SymbolPath.CIRCLE,
//             scale: 7,
//             fillColor: dotColor(p.id),
//             fillOpacity: 1,
//             strokeWeight: 0,
//           }}
//         />
//       ))}
//     </GoogleMap>
//   );
// }
