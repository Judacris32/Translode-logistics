import { findLane, roadKm } from "./cities";
import { naira, roundUpTo, type Kobo } from "./money";

export type ServiceType = "courier" | "haulage" | "freight";

export const serviceLabels: Record<ServiceType, string> = {
  courier: "Courier",
  haulage: "Haulage",
  freight: "Air freight",
};

export type TruckSize = "5t" | "15t" | "30t";

export const trucks: Record<TruckSize, { label: string; perKmKobo: Kobo; minimumKobo: Kobo }> = {
  "5t": { label: "5-tonne box truck", perKmKobo: naira(850), minimumKobo: naira(120_000) },
  "15t": { label: "15-tonne truck", perKmKobo: naira(1_350), minimumKobo: naira(220_000) },
  "30t": { label: "30-tonne flatbed or 40ft container", perKmKobo: naira(1_800), minimumKobo: naira(350_000) },
};

export type QuoteInput = {
  service: ServiceType;
  origin: string;
  destination: string;
  /** Courier and freight only. */
  weightKg?: number;
  /** Haulage only. */
  truck?: TruckSize;
};

export type QuoteLine = { label: string; kobo: Kobo };

export type QuoteResult =
  | { ok: true; totalKobo: Kobo; lines: QuoteLine[]; transit: string; distanceKm?: number }
  | { ok: false; error: string };

const COURIER = {
  sameCityKobo: naira(2_000),
  baseKobo: naira(3_000),
  perKmKobo: naira(3),
  includedKg: 2,
  extraKgKobo: naira(450),
  maxKg: 70,
};

const FREIGHT = {
  minKg: 5,
  maxKg: 1_000,
  handlingKobo: naira(15_000),
  // Extra per kg to bring cargo to Lagos first when it flies from another gateway.
  feederPerKgKobo: naira(600),
};

function courierTransit(km: number): string {
  if (km === 0) return "Same day if booked before noon";
  if (km <= 300) return "Next day";
  if (km <= 750) return "1 to 2 days";
  return "2 to 3 days";
}

function haulageTransit(km: number): string {
  // A loaded truck covers roughly 450 km in a driving day.
  const days = Math.ceil(km / 450);
  return days <= 1 ? "1 day after loading" : `${days - 1} to ${days} days after loading`;
}

export function estimate(input: QuoteInput): QuoteResult {
  const { service, origin, destination } = input;
  if (!origin || !destination) return { ok: false, error: "Choose where it is going from and to." };

  if (service === "courier") {
    const kg = Number(input.weightKg);
    if (!Number.isFinite(kg) || kg <= 0) return { ok: false, error: "Enter the weight in kilograms." };
    if (kg > COURIER.maxKg) {
      return { ok: false, error: `Courier takes parcels up to ${COURIER.maxKg} kg. For heavier loads, choose haulage.` };
    }
    const km = roadKm(origin, destination);
    const billableKg = Math.ceil(kg);
    const extraKg = Math.max(0, billableKg - COURIER.includedKg);
    const lines: QuoteLine[] = [];
    if (origin === destination) {
      lines.push({ label: `Delivery within ${origin}`, kobo: COURIER.sameCityKobo });
    } else {
      lines.push({ label: "Pickup and handling", kobo: COURIER.baseKobo });
      lines.push({ label: `Line-haul, about ${km.toLocaleString("en-NG")} km`, kobo: km * COURIER.perKmKobo });
    }
    if (extraKg > 0) {
      lines.push({ label: `${extraKg} kg above the first ${COURIER.includedKg} kg`, kobo: extraKg * COURIER.extraKgKobo });
    }
    const total = roundUpTo(sum(lines), 50);
    return { ok: true, totalKobo: total, lines, transit: courierTransit(km), distanceKm: km };
  }

  if (service === "haulage") {
    if (origin === destination) {
      return { ok: false, error: "Haulage prices are for trips between cities. For moves within one city, call us." };
    }
    const truck = trucks[input.truck ?? "15t"];
    const km = roadKm(origin, destination);
    const byDistance = km * truck.perKmKobo;
    const lines: QuoteLine[] =
      byDistance >= truck.minimumKobo
        ? [{ label: `${truck.label}, about ${km.toLocaleString("en-NG")} km`, kobo: byDistance }]
        : [{ label: `${truck.label}, minimum trip charge`, kobo: truck.minimumKobo }];
    const total = roundUpTo(sum(lines), 1_000);
    return { ok: true, totalKobo: total, lines, transit: haulageTransit(km), distanceKm: km };
  }

  // Air freight.
  const lane = findLane(destination);
  if (!lane) return { ok: false, error: "We do not fly to that city yet. Call us and we will find a route." };
  const kg = Number(input.weightKg);
  if (!Number.isFinite(kg) || kg <= 0) return { ok: false, error: "Enter the weight in kilograms." };
  if (kg > FREIGHT.maxKg) {
    return { ok: false, error: "Air freight takes up to 1,000 kg a booking. For heavier cargo, call the depot for a sea freight price." };
  }
  const billableKg = Math.max(FREIGHT.minKg, Math.ceil(kg));
  const lines: QuoteLine[] = [
    { label: `${billableKg} kg to ${lane.city}`, kobo: billableKg * lane.perKgKobo },
    { label: "Export handling and documents", kobo: FREIGHT.handlingKobo },
  ];
  if (origin !== "Lagos") {
    lines.push({ label: `Feeder from ${origin} to Lagos`, kobo: billableKg * FREIGHT.feederPerKgKobo });
  }
  const total = roundUpTo(sum(lines), 100);
  return { ok: true, totalKobo: total, lines, transit: lane.days };
}

const sum = (lines: QuoteLine[]) => lines.reduce((t, l) => t + l.kobo, 0);
