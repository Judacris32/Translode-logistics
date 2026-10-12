import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { demoShipment } from "@/lib/demo";
import { progressFor } from "@/lib/progress";
import { site } from "@/lib/site";
import { statusLabels } from "@/lib/types";
import { RouteProgress } from "./RouteProgress";
import { statusIcon, toneFor, toneStyles } from "./status";

/** A real waybill from the sample data, shown small on the home page. */
export function TrackingPreview({ className = "" }: { className?: string }) {
  const s = demoShipment(site.sampleWaybill);
  if (!s) return null;
  const tone = toneFor(s.status);
  const styles = toneStyles[tone];
  const Icon = statusIcon(s.status, s.service);

  return (
    <div className={`card !rounded-3xl p-6 !shadow-lift sm:p-7 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Package size={24} aria-hidden />
          </span>
          <div>
            <p className="label">Sample waybill</p>
            <p className="num text-lg leading-tight">{s.trackingNumber}</p>
          </div>
        </div>
        <p className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold ${styles.pill} ${styles.title}`}>
          <Icon size={17} aria-hidden />
          {statusLabels[s.status]}
        </p>
      </div>

      <div className="mt-6">
        <RouteProgress progress={progressFor(s)} origin={s.originCity} destination={s.destinationCity} service={s.service} tone={tone} compact />
      </div>

      <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-[0.95rem] text-slate">
        <span className="font-bold text-ink">Latest scan:</span> {s.events[0].note}
      </p>

      <Link href={`/track?n=${s.trackingNumber}`} className="btn btn-brand mt-5 w-full sm:w-auto">
        Open this waybill
        <ArrowRight size={18} aria-hidden />
      </Link>
    </div>
  );
}
