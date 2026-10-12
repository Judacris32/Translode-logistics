import { MapPin, Package, Phone, Weight } from "lucide-react";
import { coordsFor } from "@/lib/cities";
import { formatDayTime, formatTime, formatWeight, relativeDay } from "@/lib/format";
import { progressFor } from "@/lib/progress";
import { serviceLabels } from "@/lib/rates";
import { site, telHref } from "@/lib/site";
import { statusLabels, type PublicShipment } from "@/lib/types";
import { MapToggle } from "./MapToggle";
import { RouteProgress } from "./RouteProgress";
import type { MapPoint } from "./ShipmentMap";
import { statusIcon, toneFor, toneStyles } from "./status";

function headline(s: PublicShipment): { title: string; detail: string } {
  if (s.status === "delivered" && s.deliveredAt) {
    const who = s.signedBy ? `, signed by ${s.signedBy}` : "";
    return { title: "Delivered", detail: `${cap(relativeDay(s.deliveredAt))} at ${formatTime(s.deliveredAt)}${who}` };
  }
  if (s.status === "cancelled") return { title: "Cancelled", detail: "Cancelled before it moved" };
  const eta = s.eta ? `Expected ${relativeDay(s.eta)} by ${formatTime(s.eta)}` : "We will confirm the arrival time shortly";
  if (s.status === "exception") return { title: "Delayed", detail: eta.replace("Expected", "Now expected") };
  return { title: statusLabels[s.status], detail: eta };
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

function mapPoints(s: PublicShipment): MapPoint[] {
  const points: MapPoint[] = [];
  const from = coordsFor(s.originCity);
  const to = coordsFor(s.destinationCity);
  if (from) points.push({ ...from, label: s.originCity, kind: "start" });
  const seen = new Set<string>();
  for (const e of [...s.events].reverse()) {
    if (e.lat == null || e.lng == null) continue;
    const key = `${e.lat},${e.lng}`;
    if (seen.has(key)) continue;
    seen.add(key);
    points.push({ lat: e.lat, lng: e.lng, label: e.location, kind: "stop" });
  }
  if (to) points.push({ ...to, label: s.destinationCity, kind: "end" });
  return points;
}

export function Waybill({ shipment }: { shipment: PublicShipment }) {
  const tone = toneFor(shipment.status);
  const styles = toneStyles[tone];
  const { title, detail } = headline(shipment);
  const StatusIcon = statusIcon(shipment.status, shipment.service);
  const abroad = shipment.destinationCountry !== "Nigeria";
  const latest = shipment.events[0];

  return (
    <article className="card !rounded-3xl !shadow-lift" aria-label={`Waybill ${shipment.trackingNumber}`}>
      {/* Who and what */}
      <header className="flex flex-col gap-5 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 sm:h-16 sm:w-16">
            <Package size={28} strokeWidth={2.2} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="num text-[1.35rem] leading-tight sm:text-2xl">{shipment.trackingNumber}</p>
            <p className="mt-1 text-[0.95rem] text-slate">
              {serviceLabels[shipment.service]} waybill, booked {formatDayTime(shipment.bookedAt)}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-4 rounded-2xl border px-5 py-4 lg:min-w-[18rem] ${styles.pill}`} role="status">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles.badge}`}>
            <StatusIcon size={22} strokeWidth={2.2} aria-hidden />
          </span>
          <div>
            <p className={`text-lg font-extrabold leading-tight tracking-[-0.01em] ${styles.title}`}>{title}</p>
            <p className="mt-0.5 text-[0.95rem] font-medium text-ink">{detail}</p>
          </div>
        </div>
      </header>

      {tone === "delayed" && latest?.note && (
        <p className="mx-6 -mt-2 mb-6 rounded-xl border border-bad-200 bg-bad-50 px-5 py-4 text-[0.95rem] sm:mx-9 sm:mb-8">
          <span className="font-bold text-bad">What happened: </span>
          {latest.note}
        </p>
      )}

      <div className="border-t border-dashed border-line px-6 pt-8 sm:px-9">
        <RouteProgress
          progress={progressFor(shipment)}
          origin={shipment.originCity}
          destination={shipment.destinationCity}
          service={shipment.service}
          tone={tone}
        />

        {/* The parcel itself */}
        <dl className="mt-8 grid gap-x-6 gap-y-5 rounded-2xl bg-mist p-5 sm:grid-cols-[1.4fr_1fr_1fr] sm:divide-x sm:divide-line sm:p-6">
          <Fact icon={<Package size={20} aria-hidden />} label="Contents" value={shipment.description} />
          <Fact
            icon={<Weight size={20} aria-hidden />}
            label={shipment.pieces > 1 ? `Weight, ${shipment.pieces.toLocaleString("en-NG")} pieces` : "Weight"}
            value={<span className="num">{formatWeight(shipment.weightKg)}</span>}
            padded
          />
          <Fact
            icon={<MapPin size={20} aria-hidden />}
            label="Going to"
            value={abroad ? `${shipment.receiverFirstName}, ${shipment.destinationCountry}` : shipment.receiverFirstName}
            padded
          />
        </dl>
      </div>

      {/* Every scan */}
      <div className="mt-9 border-t border-dashed border-line px-6 pb-6 pt-8 sm:px-9 sm:pb-9">
        <MapToggle points={mapPoints(shipment)} />

        <ol className="mt-6">
          {shipment.events.map((e, i) => {
            const first = i === 0;
            const last = i === shipment.events.length - 1;
            const late = e.status === "exception";
            const Icon = statusIcon(e.status, shipment.service);
            return (
              <li key={`${e.occurredAt}-${i}`} className="relative grid grid-cols-[1.25rem_1fr] gap-x-4 sm:gap-x-6">
                {/* The rail that joins one scan to the next. */}
                {!last && (
                  <span
                    aria-hidden
                    className={`absolute left-[0.5rem] top-8 h-full sm:top-11 w-[3px] rounded-full ${first ? (late ? "bg-bad-200" : "bg-amber/60") : "bg-brand-100"}`}
                  />
                )}
                <span
                  aria-hidden
                  className={`relative mt-[1.15rem] block sm:mt-[1.85rem] h-[1.125rem] w-[1.125rem] rounded-full border-[3px] bg-white ${
                    first ? (late ? "border-bad" : "border-amber") : "border-brand-200"
                  }`}
                />
                <div className={`grid gap-x-5 gap-y-2 py-4 sm:grid-cols-[10.5rem_3rem_1fr] sm:items-center ${last ? "" : "border-b border-dashed border-line"}`}>
                  <time dateTime={e.occurredAt} className="text-[0.95rem] font-medium text-slate">
                    {formatDayTime(e.occurredAt)}
                  </time>
                  <span
                    aria-hidden
                    className={`hidden h-12 w-12 items-center justify-center rounded-full sm:flex ${
                      first ? (late ? "bg-bad-50 text-bad" : "bg-amber-100 text-amber-700") : "bg-brand-50 text-brand-700"
                    }`}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[1.02rem]">
                      <span className="font-bold">{statusLabels[e.status]},</span> <span className="text-slate">{e.location}</span>
                    </p>
                    {e.note && <p className="mt-0.5 max-w-[36rem] text-[0.95rem] text-slate">{e.note}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:items-center sm:p-6">
          <Phone size={26} className="mt-0.5 shrink-0 text-brand-700 sm:mt-0" aria-hidden />
          <div>
            <p className="font-bold text-brand-700">Something not right with this shipment?</p>
            <p className="mt-0.5 text-[0.95rem] text-slate">
              Call the depot on{" "}
              <a href={telHref} className="num text-link">
                {site.phone}
              </a>{" "}
              and quote the waybill number.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Fact({ icon, label, value, padded }: { icon: React.ReactNode; label: string; value: React.ReactNode; padded?: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${padded ? "sm:pl-6" : ""}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-[0_1px_2px_rgba(10,22,51,0.08)]">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="label">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  );
}
