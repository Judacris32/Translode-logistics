"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPin, X } from "lucide-react";
import type { MapPoint } from "./ShipmentMap";

const ShipmentMap = dynamic(() => import("./ShipmentMap"), {
  ssr: false,
  loading: () => <div className="h-[20rem] w-full animate-pulse rounded-2xl bg-brand-100 sm:h-[24rem]" />,
});

/** Heading row of the history section, with the button that opens the map beneath it. */
export function MapToggle({ points }: { points: MapPoint[] }) {
  const [open, setOpen] = useState(false);
  const canMap = points.filter((p) => p.kind !== "stop").length === 2;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="h-card">Tracking history</h2>
        {canMap && (
          <button
            type="button"
            className="btn btn-ghost !min-h-[2.75rem] !px-4"
            aria-expanded={open}
            aria-controls="shipment-map"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden /> : <MapPin size={18} className="text-brand-700" aria-hidden />}
            {open ? "Hide map" : "View on map"}
          </button>
        )}
      </div>

      {open && (
        <div id="shipment-map" className="mt-5">
          <div className="overflow-hidden rounded-2xl border border-line">
            <ShipmentMap points={points} />
          </div>
          <p className="mt-2.5 text-sm text-slate">
            Blue is where it started, amber is where it is going, and the white dots are our depots that have scanned
            it. The dotted line joins the two cities; it is not the road taken.
          </p>
        </div>
      )}
    </>
  );
}
