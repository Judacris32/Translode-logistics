import { demoShipment } from "./demo";
import { publicClient, supabaseConfigured } from "./supabase/public";
import type { PublicShipment } from "./types";

/**
 * Accepts what people actually type: lower case, spaces, missing dashes.
 * Returns the canonical form (TRL-CR-20418836) or null if it cannot be a waybill.
 */
export function normaliseWaybill(input: string): string | null {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = raw.match(/^TRL(CR|HL|FR)(\d{8})$/);
  return m ? `TRL-${m[1]}-${m[2]}` : null;
}

export type TrackResult =
  | { state: "found"; shipment: PublicShipment }
  | { state: "invalid" }
  | { state: "not_found"; waybill: string }
  | { state: "error" };

export async function trackShipment(input: string): Promise<TrackResult> {
  const waybill = normaliseWaybill(input);
  if (!waybill) return { state: "invalid" };

  if (!supabaseConfigured) {
    const shipment = demoShipment(waybill);
    return shipment ? { state: "found", shipment } : { state: "not_found", waybill };
  }

  const { data, error } = await publicClient().rpc("track_shipment", { p_tracking: waybill });
  if (error) {
    console.error("track_shipment failed:", error.message);
    return { state: "error" };
  }
  return data ? { state: "found", shipment: data as PublicShipment } : { state: "not_found", waybill };
}
