import { cities } from "@/lib/cities";

// Plots each city by its real latitude and longitude. It is a route diagram,
// not a map: no borders, just where the trucks go.
const W = 640;
const H = 520;
const PAD = 46;
const LNG = [2.6, 13.6];
const LAT = [4.3, 13.5];

const x = (lng: number) => PAD + ((lng - LNG[0]) / (LNG[1] - LNG[0])) * (W - PAD * 2);
const y = (lat: number) => PAD + ((LAT[1] - lat) / (LAT[1] - LAT[0])) * (H - PAD * 2);

// Where each depot's name sits relative to its dot, so labels never collide.
const labelOffset: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  Lagos: { dx: 0, dy: 32, anchor: "middle" },
  Ibadan: { dx: 4, dy: -17, anchor: "middle" },
  Abuja: { dx: 17, dy: 6, anchor: "start" },
  Kano: { dx: 17, dy: 6, anchor: "start" },
  Onitsha: { dx: 0, dy: -17, anchor: "middle" },
  "Port Harcourt": { dx: 0, dy: 32, anchor: "middle" },
};

export function NetworkMap() {
  const lagos = cities.find((c) => c.name === "Lagos")!;
  const hubs = cities.filter((c) => c.hub);
  const others = cities.filter((c) => !c.hub);
  const nearestHub = (c: (typeof cities)[number]) =>
    hubs.reduce((best, h) =>
      (h.lat - c.lat) ** 2 + (h.lng - c.lng) ** 2 < (best.lat - c.lat) ** 2 + (best.lng - c.lng) ** 2 ? h : best,
    );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="network-title network-desc">
      <title id="network-title">Translode depots and the cities they serve</title>
      <desc id="network-desc">
        Trunk routes run from Lagos to depots in {hubs.filter((h) => h.name !== "Lagos").map((h) => h.name).join(", ")}.
        Vans from each depot reach {others.map((c) => c.name).join(", ")}.
      </desc>

      {/* Feeder runs: each town to its nearest depot. */}
      {others.map((c) => {
        const h = nearestHub(c);
        return (
          <line key={`f-${c.name}`} x1={x(c.lng)} y1={y(c.lat)} x2={x(h.lng)} y2={y(h.lat)} stroke="#C9D6F8" strokeOpacity="0.45" strokeWidth="1.25" strokeDasharray="3 5" />
        );
      })}

      {/* Trunk routes out of Lagos. */}
      {hubs
        .filter((h) => h.name !== "Lagos")
        .map((h) => (
          <line key={`t-${h.name}`} x1={x(lagos.lng)} y1={y(lagos.lat)} x2={x(h.lng)} y2={y(h.lat)} stroke="#FDB515" strokeWidth="2.5" strokeLinecap="round" />
        ))}

      {others.map((c) => (
        <circle key={c.name} cx={x(c.lng)} cy={y(c.lat)} r="4.5" fill="#C9D6F8">
          <title>{c.name}</title>
        </circle>
      ))}

      {hubs.map((h) => {
        const o = labelOffset[h.name] ?? { dx: 14, dy: 5, anchor: "start" as const };
        return (
          <g key={h.name}>
            <circle cx={x(h.lng)} cy={y(h.lat)} r="16" fill="#FDB515" fillOpacity="0.18" />
            <circle cx={x(h.lng)} cy={y(h.lat)} r="8" fill="#FDB515" stroke="#060E24" strokeWidth="3" />
            <text x={x(h.lng) + o.dx} y={y(h.lat) + o.dy} textAnchor={o.anchor} fill="#FFFFFF" fontSize="17" fontWeight="700">
              {h.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
