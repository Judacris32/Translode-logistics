import demo from "@/data/demo.json";
import type { ServiceType } from "./rates";
import type { PublicShipment, ShipmentStatus } from "./types";

const HOUR = 3_600_000;

/**
 * Builds the same public record the database returns, from data/demo.json.
 * Times in that file are relative ("6 hours ago"), so the demo never goes stale.
 */
export function demoShipment(trackingNumber: string, now = Date.now()): PublicShipment | null {
  const s = demo.shipments.find((x) => x.trackingNumber === trackingNumber);
  if (!s) return null;

  const events = [...s.events]
    .sort((a, b) => a.hoursAgo - b.hoursAgo)
    .map((e) => {
      const hub = demo.hubs.find((h) => h.code === e.hub);
      return {
        status: e.status as ShipmentStatus,
        location: e.location,
        note: e.note,
        occurredAt: new Date(now - e.hoursAgo * HOUR).toISOString(),
        lat: hub?.lat ?? null,
        lng: hub?.lng ?? null,
      };
    });

  const latest = events[0];
  const oldest = events[events.length - 1];
  const delivered = events.find((e) => e.status === "delivered");

  return {
    trackingNumber: s.trackingNumber,
    service: s.service as ServiceType,
    status: latest.status,
    originCity: s.originCity,
    destinationCity: s.destinationCity,
    destinationCountry: s.destinationCountry,
    receiverFirstName: s.receiverName.split(" ")[0],
    description: s.description,
    pieces: s.pieces,
    weightKg: s.weightGrams / 1000,
    bookedAt: oldest.occurredAt,
    eta: delivered ? null : new Date(now + s.etaHours * HOUR).toISOString(),
    deliveredAt: delivered?.occurredAt ?? null,
    signedBy: s.signedBy,
    events,
  };
}

export const demoWaybills = demo.shipments.map((s) => s.trackingNumber);
