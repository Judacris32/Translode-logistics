import {
  Ban,
  Bike,
  FileText,
  Package,
  PackageCheck,
  Plane,
  ShieldCheck,
  TriangleAlert,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { ServiceType } from "@/lib/rates";
import type { ShipmentStatus } from "@/lib/types";

const icons: Record<ShipmentStatus, LucideIcon> = {
  booked: FileText,
  picked_up: Package,
  at_origin_hub: Warehouse,
  in_transit: Truck,
  customs: ShieldCheck,
  at_destination_hub: Warehouse,
  out_for_delivery: Bike,
  delivered: PackageCheck,
  exception: TriangleAlert,
  cancelled: Ban,
};

/** The picture for a scan. Air freight flies, so "in transit" is a plane. */
export function statusIcon(status: ShipmentStatus, service: ServiceType): LucideIcon {
  if (status === "in_transit" && service === "freight") return Plane;
  if (status === "out_for_delivery" && service === "haulage") return Truck;
  return icons[status];
}

export type Tone = "moving" | "waiting" | "delivered" | "delayed" | "stopped";

export function toneFor(status: ShipmentStatus): Tone {
  if (status === "delivered") return "delivered";
  if (status === "exception") return "delayed";
  if (status === "cancelled") return "stopped";
  if (status === "booked" || status === "customs") return "waiting";
  return "moving";
}

export const toneStyles: Record<Tone, { pill: string; badge: string; title: string; fill: string }> = {
  moving: { pill: "bg-good-50 border-good-200", badge: "bg-good-200/70 text-good", title: "text-good", fill: "bg-brand-700" },
  delivered: { pill: "bg-good-50 border-good-200", badge: "bg-good-200/70 text-good", title: "text-good", fill: "bg-good" },
  waiting: { pill: "bg-amber-50 border-amber-100", badge: "bg-amber-100 text-amber-700", title: "text-amber-700", fill: "bg-brand-700" },
  delayed: { pill: "bg-bad-50 border-bad-200", badge: "bg-bad-200/70 text-bad", title: "text-bad", fill: "bg-bad" },
  stopped: { pill: "bg-mist border-line", badge: "bg-line text-slate", title: "text-slate", fill: "bg-slate" },
};
