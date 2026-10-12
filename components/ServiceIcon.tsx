import { Bike, Plane, Ship, Truck, Warehouse, type LucideIcon } from "lucide-react";
import type { ServiceId } from "@/lib/services";

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  courier: Bike,
  haulage: Truck,
  freight: Plane,
  sea: Ship,
  warehousing: Warehouse,
};
