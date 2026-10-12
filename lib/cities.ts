export type City = {
  name: string;
  state: string;
  lat: number;
  lng: number;
  /** Cities where Translode runs its own depot. */
  hub?: boolean;
};

export const cities: City[] = [
  { name: "Lagos", state: "Lagos", lat: 6.5244, lng: 3.3792, hub: true },
  { name: "Abuja", state: "FCT", lat: 9.0765, lng: 7.3986, hub: true },
  { name: "Port Harcourt", state: "Rivers", lat: 4.8156, lng: 7.0498, hub: true },
  { name: "Kano", state: "Kano", lat: 12.0022, lng: 8.592, hub: true },
  { name: "Onitsha", state: "Anambra", lat: 6.1498, lng: 6.7857, hub: true },
  { name: "Ibadan", state: "Oyo", lat: 7.3775, lng: 3.947, hub: true },
  { name: "Aba", state: "Abia", lat: 5.1066, lng: 7.3667 },
  { name: "Abeokuta", state: "Ogun", lat: 7.1475, lng: 3.3619 },
  { name: "Akure", state: "Ondo", lat: 7.2571, lng: 5.2058 },
  { name: "Benin City", state: "Edo", lat: 6.335, lng: 5.6037 },
  { name: "Calabar", state: "Cross River", lat: 4.9757, lng: 8.3417 },
  { name: "Enugu", state: "Enugu", lat: 6.4584, lng: 7.5464 },
  { name: "Ilorin", state: "Kwara", lat: 8.4966, lng: 4.5421 },
  { name: "Jos", state: "Plateau", lat: 9.8965, lng: 8.8583 },
  { name: "Kaduna", state: "Kaduna", lat: 10.5105, lng: 7.4165 },
  { name: "Maiduguri", state: "Borno", lat: 11.8311, lng: 13.151 },
  { name: "Owerri", state: "Imo", lat: 5.4836, lng: 7.0333 },
  { name: "Sokoto", state: "Sokoto", lat: 13.0059, lng: 5.2476 },
  { name: "Uyo", state: "Akwa Ibom", lat: 5.0377, lng: 7.9128 },
  { name: "Warri", state: "Delta", lat: 5.5544, lng: 5.7932 },
];

export const cityNames = cities.map((c) => c.name).sort((a, b) => a.localeCompare(b));

export const findCity = (name: string) => cities.find((c) => c.name === name);

/** Straight-line distance in kilometres. */
export function haversineKm(a: City, b: City): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Roads are never straight. 1.25 is a fair average detour for Nigerian trunk routes. */
export function roadKm(from: string, to: string): number {
  const a = findCity(from);
  const b = findCity(to);
  if (!a || !b) return 0;
  return Math.round(haversineKm(a, b) * 1.25);
}

// Air freight gateways and the overseas cities Translode flies to.
export const gateways = ["Lagos", "Abuja", "Port Harcourt"] as const;

export type Lane = {
  city: string;
  country: string;
  /** Rate per kilogram, in kobo. */
  perKgKobo: number;
  days: string;
  lat: number;
  lng: number;
};

export const lanes: Lane[] = [
  { city: "Accra", country: "Ghana", perKgKobo: 420_000, days: "2 to 3 working days", lat: 5.6037, lng: -0.187 },
  { city: "Dubai", country: "United Arab Emirates", perKgKobo: 780_000, days: "3 to 5 working days", lat: 25.2048, lng: 55.2708 },
  { city: "Guangzhou", country: "China", perKgKobo: 890_000, days: "5 to 8 working days", lat: 23.1291, lng: 113.2644 },
  { city: "Houston", country: "United States", perKgKobo: 1_150_000, days: "5 to 8 working days", lat: 29.7604, lng: -95.3698 },
  { city: "Johannesburg", country: "South Africa", perKgKobo: 690_000, days: "3 to 5 working days", lat: -26.2041, lng: 28.0473 },
  { city: "London", country: "United Kingdom", perKgKobo: 950_000, days: "3 to 5 working days", lat: 51.5072, lng: -0.1276 },
];

export const findLane = (city: string) => lanes.find((l) => l.city === city);

/** Coordinates for any city we serve, at home or abroad. */
export function coordsFor(name: string): { lat: number; lng: number } | null {
  const c = findCity(name) ?? findLane(name);
  return c ? { lat: c.lat, lng: c.lng } : null;
}
