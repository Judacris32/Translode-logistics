"use client";

import { useEffect, useRef } from "react";

export type MapPoint = { lat: number; lng: number; label: string; kind: "start" | "stop" | "end" };

/**
 * Origin, destination and the depots that have scanned the shipment.
 * Loaded only when the visitor opens the map, so the tracking page stays light.
 */
export default function ShipmentMap({ points }: { points: MapPoint[] }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;

      map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 12,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const ends = points.filter((p) => p.kind !== "stop");
      if (ends.length === 2) {
        L.polyline(
          ends.map((p) => [p.lat, p.lng] as [number, number]),
          { color: "#14349A", weight: 3, dashArray: "2 9", lineCap: "round" },
        ).addTo(map);
      }

      for (const p of points) {
        const cls = p.kind === "end" ? "map-pin map-pin--end" : p.kind === "stop" ? "map-pin map-pin--stop" : "map-pin";
        const size = p.kind === "stop" ? 12 : 18;
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({ className: "", html: `<span class="${cls}" style="display:block"></span>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }),
          title: p.label,
          alt: p.label,
          keyboard: false,
        })
          .bindTooltip(p.label, { direction: "top", offset: [0, -8], permanent: p.kind !== "stop" })
          .addTo(map);
      }

      map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])), { padding: [48, 48], maxZoom: 9 });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points]);

  return <div ref={el} className="h-[20rem] w-full sm:h-[24rem]" role="application" aria-label="Map of this shipment's route" />;
}
