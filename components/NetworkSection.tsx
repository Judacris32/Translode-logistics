import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { MAP, towns } from "@/lib/nigeria-map";
import { NetworkRoutes } from "./NetworkRoutes";

/** "Our network": the evening convoy photograph with the route map of Nigeria over it. */
export function NetworkSection() {
  const names = towns.map((t) => t.name);
  const mapRatio = `${MAP.width + MAP.pad * 2} / ${MAP.height + MAP.pad * 2 + MAP.depth - MAP.pad}`;

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white" aria-labelledby="network-heading">
      <Image
        src="/images/network.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[62%_100%] lg:object-[50%_25%]"
      />
      {/* Dark on the left for the words, clear on the right for the picture. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,14,36,0.97) 0%, rgba(6,14,36,0.93) 30%, rgba(6,14,36,0.62) 48%, rgba(6,14,36,0.12) 68%, rgba(6,14,36,0) 100%), linear-gradient(180deg, rgba(6,14,36,0.55) 0%, rgba(6,14,36,0) 22%, rgba(6,14,36,0) 82%, rgba(6,14,36,0.5) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 lg:hidden"
        style={{ background: "linear-gradient(180deg, rgba(6,14,36,0.95) 0%, rgba(6,14,36,0.88) 45%, rgba(6,14,36,0.55) 100%)" }}
      />

      <div className="page grid items-center gap-10 py-20 sm:py-24 lg:min-h-[46rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-4 lg:py-20">
        <div className="max-w-[36rem]">
          <p className="eyebrow-light flex items-center gap-4">
            Our network
            <span aria-hidden className="h-px w-16 bg-amber/70" />
          </p>
          <h2 id="network-heading" className="h-display mt-5 text-[clamp(2.25rem,4.3vw,3.6rem)]">
            <span className="sm:block">Six depots. </span>
            <span className="text-amber sm:block sm:whitespace-nowrap">Trucks out of Lagos </span>
            <span className="sm:block">every evening.</span>
          </h2>
          <p className="mt-6 max-w-[31rem] text-lg text-white/90">
            The amber lines are our own trucks, running nightly between depots. From each depot, vans go on to the
            towns around it.
          </p>

          <h3 className="mt-9 flex items-center gap-4 text-lg font-bold text-amber">
            Beyond the depots
            <span aria-hidden className="h-px w-12 bg-white/30" />
          </h3>
          <div className="mt-4 flex items-start gap-4">
            <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber text-ink">
              <MapPin size={24} strokeWidth={2.4} />
            </span>
            <p className="max-w-[23rem] text-white/85">
              {names.slice(0, -1).join(", ")} and {names[names.length - 1]}.
            </p>
          </div>

          <Link href="/about#depots" className="btn btn-amber mt-9 !min-h-[3.5rem] !px-7 !text-base">
            Find a depot
            <ArrowRight size={20} strokeWidth={2.6} aria-hidden />
          </Link>
        </div>

        {/* The map artwork, with the live routes drawn over it in the same coordinates. */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:-mr-4 lg:-mt-10 lg:max-w-none lg:self-start xl:-mr-10" style={{ aspectRatio: mapRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/nigeria-map.svg" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
          <NetworkRoutes />
        </div>
      </div>
    </section>
  );
}
