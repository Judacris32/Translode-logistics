import type { Metadata } from "next";
import { Accent, PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import type { ServiceType } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Get a price",
  description: "See what it costs to send a parcel, a truckload or air cargo with Translode Logistics. Every charge is listed.",
};

const isService = (v: unknown): v is ServiceType => v === "courier" || v === "haulage" || v === "freight";

export default function QuotePage({ searchParams }: { searchParams: { service?: string } }) {
  const initial = isService(searchParams.service) ? searchParams.service : "courier";

  return (
    <>
      <PageHero
        eyebrow="Instant estimate"
        image="/images/hero-quote.jpg"
        position="72% 60%"
        title={
          <>
            Get a <Accent>price</Accent>
          </>
        }
      >
        <p className="mt-4 max-w-[32rem] text-lg text-white/90">
          The price updates as you fill it in. When it looks right, send it to us and the depot will call to arrange
          pickup.
        </p>
      </PageHero>
      <section className="page relative z-10 -mt-16 pb-20 sm:-mt-24 sm:pb-28">
        <QuoteForm initialService={initial} />
      </section>
    </>
  );
}
