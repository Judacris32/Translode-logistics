"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Progress } from "@/lib/progress";
import type { ServiceType } from "@/lib/rates";
import { statusIcon, toneStyles, type Tone } from "./status";

/**
 * Origin to destination, one node per stage. The line fills once when the
 * card appears: it answers the question the visitor just asked.
 */
export function RouteProgress({
  progress,
  origin,
  destination,
  service,
  tone,
  compact = false,
}: {
  progress: Progress;
  origin: string;
  destination: string;
  service: ServiceType;
  tone: Tone;
  /** In a narrow space, name only the current stage. */
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const n = progress.steps.length;
  const current = progress.steps[progress.reached];
  const Icon = statusIcon(current.status, service);
  const fill = toneStyles[tone].fill;
  // Nodes sit at the centre of n equal columns, so the track runs between the first and last centres.
  const inset = `${100 / (2 * n)}%`;
  const fraction = n > 1 ? progress.reached / (n - 1) : 0;
  const currentRing = tone === "delayed" ? "bg-bad text-white" : tone === "delivered" ? "bg-good text-white" : "bg-amber text-ink";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
          <MapPin size={22} className="shrink-0 fill-brand-700 text-white" aria-hidden />
          {origin}
        </p>
        <p className="flex items-center gap-2 text-right text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
          {destination}
          <MapPin size={22} className="shrink-0 fill-brand-700 text-white" aria-hidden />
        </p>
      </div>

      <ol
        className="relative mt-6 grid"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        aria-label={`Progress from ${origin} to ${destination}`}
      >
        {/* Track and fill, drawn behind the nodes. */}
        <li aria-hidden className="pointer-events-none absolute top-[1.125rem] h-1.5 -translate-y-1/2 rounded-full bg-line" style={{ left: inset, right: inset }}>
          <motion.span
            className={`block h-full origin-left rounded-full ${fill}`}
            style={{ width: "100%" }}
            initial={reduce ? { scaleX: fraction } : { scaleX: 0 }}
            animate={{ scaleX: fraction }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </li>

        {progress.steps.map((s) => (
          <li key={s.label} className="relative flex flex-col items-center" aria-current={s.current ? "step" : undefined}>
            <span className="flex h-9 items-center justify-center">
              {s.current ? (
                <motion.span
                  className={`flex h-9 w-9 items-center justify-center rounded-full shadow-[0_0_0_5px_#fff,0_6px_14px_-4px_rgba(10,22,51,0.35)] ${currentRing}`}
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
                >
                  <Icon size={18} strokeWidth={2.4} aria-hidden />
                </motion.span>
              ) : (
                <span
                  className={`block h-4 w-4 rounded-full border-[3px] bg-white ${
                    s.done ? (tone === "delayed" ? "border-bad" : tone === "delivered" ? "border-good" : "border-brand-700") : "border-line"
                  }`}
                />
              )}
            </span>
            <span
              className={`mt-2.5 hidden whitespace-nowrap text-center text-[0.8125rem] leading-tight ${
                compact ? (s.current ? "sm:block" : "") : "sm:block"
              } ${
                s.current ? "font-bold text-ink" : s.done ? "font-medium text-slate" : "font-medium text-slate/55"
              }`}
            >
              {s.label}
              <span className="sr-only">{s.current ? " (now)" : s.done ? " (done)" : " (to come)"}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-sm font-semibold text-slate sm:hidden">
        Step {progress.reached + 1} of {n}: <span className="text-ink">{current.label}</span>
      </p>
    </div>
  );
}
