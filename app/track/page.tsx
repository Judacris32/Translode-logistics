import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, SearchX, WifiOff } from "lucide-react";
import { Accent, PageHero } from "@/components/PageHero";
import { TrackForm } from "@/components/TrackForm";
import { Waybill } from "@/components/Waybill";
import { site } from "@/lib/site";
import { supabaseConfigured } from "@/lib/supabase/public";
import { trackShipment } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Track a shipment",
  description: "Enter your Translode waybill number to see where your shipment is and when it will arrive.",
};

// Tracking is always live, never cached.
export const dynamic = "force-dynamic";

export default async function TrackPage({ searchParams }: { searchParams: { n?: string | string[] } }) {
  const raw = Array.isArray(searchParams.n) ? searchParams.n[0] : searchParams.n;
  const query = raw?.trim() ?? "";
  const result = query ? await trackShipment(query) : null;

  return (
    <>
      <PageHero
        eyebrow="Real-time tracking"
        image="/images/hero-track.jpg"
        position="68% 55%"
        title={
          <>
            Track a <Accent>shipment</Accent>
          </>
        }
      >
        <p className="mt-4 max-w-[30rem] text-lg text-white/90">
          Your waybill number is on the SMS we sent at pickup. It starts with{" "}
          <span className="font-bold text-amber">{site.trackingPrefix}</span>.
        </p>
        <div className="mt-7 max-w-[36rem]">
          <TrackForm defaultValue={result?.state === "found" ? result.shipment.trackingNumber : query} />
        </div>
      </PageHero>

      <section className="page relative z-10 -mt-16 pb-20 sm:-mt-24 sm:pb-28" aria-live="polite">
        {!result && (
          <Notice icon={<PackageSearch size={28} aria-hidden />} title="Enter a waybill number to begin">
            To see what tracking looks like, open our sample waybill{" "}
            <Link href={`/track?n=${site.sampleWaybill}`} className="num text-link">
              {site.sampleWaybill}
            </Link>
            .
          </Notice>
        )}

        {result?.state === "found" && (
          <div className="mx-auto max-w-[58rem]">
            <Waybill shipment={result.shipment} />
            {!supabaseConfigured && (
              <p className="mt-5 text-center text-sm text-slate">Demo site. This shipment is sample data.</p>
            )}
          </div>
        )}

        {result?.state === "invalid" && (
          <Notice icon={<SearchX size={28} aria-hidden />} title="That does not look like a waybill number" tone="bad">
            A Translode waybill looks like <span className="num text-ink">{site.sampleWaybill}</span>: the letters{" "}
            {site.trackingPrefix}, two letters for the service, then eight digits. Check the SMS we sent and enter it
            again.
          </Notice>
        )}

        {result?.state === "not_found" && (
          <Notice icon={<SearchX size={28} aria-hidden />} title={`We have no shipment numbered ${result.waybill}`} tone="bad">
            Check each digit against the SMS we sent. If it was booked in the last few minutes, give it a moment and
            search again. Still nothing? Call the depot on <span className="num text-ink">{site.phone}</span>.
          </Notice>
        )}

        {result?.state === "error" && (
          <Notice icon={<WifiOff size={28} aria-hidden />} title="Tracking is not answering right now" tone="bad">
            The fault is on our side, not with your waybill. Search again in a minute, or call the depot on{" "}
            <span className="num text-ink">{site.phone}</span> and we will look it up for you.
          </Notice>
        )}
      </section>
    </>
  );
}

function Notice({
  icon,
  title,
  children,
  tone = "plain",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "plain" | "bad";
}) {
  return (
    <div className="card mx-auto flex max-w-[58rem] flex-col gap-5 !rounded-3xl p-7 !shadow-lift sm:flex-row sm:items-center sm:p-9">
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
          tone === "bad" ? "bg-bad-50 text-bad" : "bg-brand-50 text-brand-700"
        }`}
      >
        {icon}
      </span>
      <div>
        <h2 className="h-card">{title}</h2>
        <p className="mt-1.5 max-w-[40rem] text-slate">{children}</p>
      </div>
    </div>
  );
}
