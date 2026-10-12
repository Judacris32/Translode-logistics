import type { ServiceType } from "./rates";
import type { PublicShipment, ShipmentStatus } from "./types";

// The stops a shipment passes through, in order, for each service.
const stages: Record<ServiceType, { status: ShipmentStatus; label: string }[]> = {
  courier: [
    { status: "booked", label: "Booked" },
    { status: "picked_up", label: "Picked up" },
    { status: "at_origin_hub", label: "At depot" },
    { status: "in_transit", label: "On the road" },
    { status: "at_destination_hub", label: "Arrived" },
    { status: "out_for_delivery", label: "With rider" },
    { status: "delivered", label: "Delivered" },
  ],
  haulage: [
    { status: "booked", label: "Booked" },
    { status: "picked_up", label: "Loaded" },
    { status: "in_transit", label: "On the road" },
    { status: "delivered", label: "Offloaded" },
  ],
  freight: [
    { status: "booked", label: "Booked" },
    { status: "picked_up", label: "Picked up" },
    { status: "at_origin_hub", label: "At depot" },
    { status: "in_transit", label: "In the air" },
    { status: "customs", label: "Customs" },
    { status: "out_for_delivery", label: "With rider" },
    { status: "delivered", label: "Delivered" },
  ],
};

export type Step = { label: string; status: ShipmentStatus; done: boolean; current: boolean };

export type Progress = {
  steps: Step[];
  /** Index of the furthest step reached. */
  reached: number;
};

export function progressFor(shipment: PublicShipment): Progress {
  const list = stages[shipment.service];
  const seen = new Set(shipment.events.map((e) => e.status));
  let reached = 0;
  list.forEach((s, i) => {
    if (seen.has(s.status)) reached = i;
  });
  return {
    steps: list.map((s, i) => ({ ...s, done: i <= reached, current: i === reached })),
    reached,
  };
}
