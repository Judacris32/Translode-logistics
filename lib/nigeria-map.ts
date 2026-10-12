import { cities, type City } from "./cities";

/**
 * Places real coordinates on the Nigeria map artwork (public/images/nigeria-map.svg).
 * The artwork is 744 x 600 units and spans the country's extreme points, so a
 * straight-line fit from longitude and latitude lands every city in its own state.
 */
export const MAP = { width: 744, height: 600, pad: 24, depth: 36 } as const;

const LNG = [2.668, 14.678] as const; // westernmost and easternmost points of Nigeria
const LAT = [4.27, 13.892] as const; // southernmost and northernmost

export const mapX = (lng: number) => ((lng - LNG[0]) / (LNG[1] - LNG[0])) * MAP.width;
export const mapY = (lat: number) => ((LAT[1] - lat) / (LAT[1] - LAT[0])) * MAP.height;

export type MapCity = City & { x: number; y: number };

const place = (c: City): MapCity => ({ ...c, x: mapX(c.lng), y: mapY(c.lat) });

export const depots = cities.filter((c) => c.hub).map(place);
export const towns = cities.filter((c) => !c.hub).map(place);
export const lagos = depots.find((c) => c.name === "Lagos")!;

export function nearestDepot(town: MapCity): MapCity {
  return depots.reduce((best, d) => ((d.x - town.x) ** 2 + (d.y - town.y) ** 2 < (best.x - town.x) ** 2 + (best.y - town.y) ** 2 ? d : best));
}

/** A gently bowed line from a to b. `bend` is how far it bows, as a share of its length. */
export function arc(a: { x: number; y: number }, b: { x: number; y: number }, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const cx = mx - (b.y - a.y) * bend;
  const cy = my + (b.x - a.x) * bend;
  // Point and direction halfway along, for the arrowhead.
  const hx = 0.25 * a.x + 0.5 * cx + 0.25 * b.x;
  const hy = 0.25 * a.y + 0.5 * cy + 0.25 * b.y;
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  const r = (n: number) => Math.round(n * 10) / 10;
  return { d: `M${r(a.x)} ${r(a.y)}Q${r(cx)} ${r(cy)} ${r(b.x)} ${r(b.y)}`, mid: { x: r(hx), y: r(hy), angle: r(angle) } };
}
