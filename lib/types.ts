import type { ServiceType } from "./rates";

export type ShipmentStatus =
  | "booked"
  | "picked_up"
  | "at_origin_hub"
  | "in_transit"
  | "customs"
  | "at_destination_hub"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "cancelled";

export const statusLabels: Record<ShipmentStatus, string> = {
  booked: "Booked",
  picked_up: "Picked up",
  at_origin_hub: "At origin depot",
  in_transit: "On the road",
  customs: "In customs",
  at_destination_hub: "At destination depot",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Delayed",
  cancelled: "Cancelled",
};

export type TrackingEvent = {
  status: ShipmentStatus;
  location: string;
  note: string | null;
  occurredAt: string; // ISO timestamp
  /** Set when the scan happened at one of our depots. Used to draw the map. */
  lat?: number | null;
  lng?: number | null;
};

/** What anyone with a waybill number is allowed to see. No phone numbers or street addresses. */
export type PublicShipment = {
  trackingNumber: string;
  service: ServiceType;
  status: ShipmentStatus;
  originCity: string;
  destinationCity: string;
  destinationCountry: string;
  receiverFirstName: string;
  description: string;
  pieces: number;
  weightKg: number;
  bookedAt: string;
  eta: string | null;
  deliveredAt: string | null;
  signedBy: string | null;
  events: TrackingEvent[]; // newest first
};
