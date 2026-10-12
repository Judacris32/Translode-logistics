"use client";

import { motion, useReducedMotion } from "framer-motion";
import { arc, depots, lagos, MAP, nearestDepot, towns } from "@/lib/nigeria-map";

// Where each depot's name sits relative to its dot, so names never collide.
const label: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  Lagos: { dx: -6, dy: 44, anchor: "middle" },
  Ibadan: { dx: -8, dy: -22, anchor: "middle" },
  Abuja: { dx: 22, dy: 8, anchor: "start" },
  Kano: { dx: 22, dy: 8, anchor: "start" },
  Onitsha: { dx: 22, dy: 9, anchor: "start" },
  "Port Harcourt": { dx: 20, dy: 26, anchor: "start" },
};

// Each trunk route bows a little differently so the lines fan out of Lagos.
const bend: Record<string, number> = { Kano: -0.14, Abuja: -0.12, Onitsha: -0.1, "Port Harcourt": -0.2, Ibadan: 0 };

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The routes, depots and towns, drawn over the map artwork in the same
 * coordinates. The trunk routes draw themselves out of Lagos once, when the
 * section scrolls into view.
 */
export function NetworkRoutes() {
  const reduce = useReducedMotion();
  const trunks = depots.filter((d) => d.name !== "Lagos");
  const view = `${-MAP.pad} ${-MAP.pad} ${MAP.width + MAP.pad * 2} ${MAP.height + MAP.pad * 2 + MAP.depth - MAP.pad}`;

  return (
    <motion.svg
      viewBox={view}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-labelledby="network-title network-desc"
      initial={reduce ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
    >
      <title id="network-title">Translode depots and routes across Nigeria</title>
      <desc id="network-desc">
        Trucks run every night from Lagos to depots in {trunks.map((d) => d.name).join(", ")}. Vans from each depot
        reach {towns.map((t) => t.name).join(", ")}.
      </desc>
      <defs>
        <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <radialGradient id="town-halo">
          <stop offset="0" stopColor="#BFD6FF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5B9BFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="depot-halo">
          <stop offset="0" stopColor="#FDB515" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FDB515" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Van runs: each town to its nearest depot. */}
      <motion.g variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.8, delay: reduce ? 0 : 1.5 } } }}>
        {towns.map((t, i) => {
          const d = nearestDepot(t);
          return <path key={t.name} d={arc(d, t, i % 2 ? 0.16 : -0.16).d} fill="none" stroke="#CFE0FF" strokeOpacity="0.5" strokeWidth="1.2" />;
        })}
        {towns.map((t) => (
          <g key={t.name}>
            <circle cx={t.x} cy={t.y} r="11" fill="url(#town-halo)" />
            <circle cx={t.x} cy={t.y} r="3.6" fill="#EAF2FF">
              <title>{t.name}</title>
            </circle>
          </g>
        ))}
      </motion.g>

      {/* Trunk routes out of Lagos: a soft glow underneath, the line on top. */}
      {trunks.map((d, i) => {
        const a = arc(lagos, d, bend[d.name] ?? -0.12);
        const draw = {
          hidden: { pathLength: 0, opacity: 0 },
          shown: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease, delay: reduce ? 0 : 0.25 + i * 0.14 } },
        };
        return (
          <g key={d.name}>
            <motion.path d={a.d} fill="none" stroke="#FDB515" strokeWidth="9" strokeOpacity="0.45" strokeLinecap="round" filter="url(#route-glow)" variants={draw} />
            <motion.path d={a.d} fill="none" stroke="#FDB515" strokeWidth="3.6" strokeLinecap="round" variants={draw} />
            {d.name !== "Ibadan" && (
              <motion.path
                d="M-8 -6.5L7 0L-8 6.5L-4.5 0Z"
                fill="#FDB515"
                transform={`translate(${a.mid.x} ${a.mid.y}) rotate(${a.mid.angle})`}
                variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.3, delay: reduce ? 0 : 0.95 + i * 0.14 } } }}
              />
            )}
          </g>
        );
      })}

      {/* Depots */}
      {depots.map((d, i) => {
        const home = d.name === "Lagos";
        const l = label[d.name] ?? { dx: 20, dy: 8, anchor: "start" as const };
        return (
          <motion.g
            key={d.name}
            variants={{
              hidden: { opacity: 0 },
              shown: { opacity: 1, transition: { duration: 0.45, delay: reduce ? 0 : home ? 0.05 : 1.0 + i * 0.1 } },
            }}
          >
            <circle cx={d.x} cy={d.y} r={home ? 34 : 24} fill="url(#depot-halo)" />
            <circle cx={d.x} cy={d.y} r={home ? 14 : 11} fill="#FDB515" />
            {home && <circle cx={d.x} cy={d.y} r="6.5" fill="#FFF6DB" />}
            <text
              x={d.x + l.dx}
              y={d.y + l.dy}
              textAnchor={l.anchor}
              fill="#FFFFFF"
              fontSize={home ? 30 : 25}
              fontWeight="800"
              letterSpacing="-0.4"
              paintOrder="stroke"
              stroke="#0A1633"
              strokeOpacity="0.55"
              strokeWidth="5"
              strokeLinejoin="round"
            >
              {d.name}
            </text>
          </motion.g>
        );
      })}
    </motion.svg>
  );
}
