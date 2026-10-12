import Link from "next/link";
import { Accent, PageHero } from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Page not found"
      image="/images/hero-track.jpg"
      position="68% 55%"
      title={
        <>
          Wrong <Accent>turn</Accent>
        </>
      }
    >
      <p className="mt-4 max-w-[30rem] text-lg text-white/90">
        There is no page at this address. If you were looking for a shipment, tracking is the place to go.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 pb-6">
        <Link href="/track" className="btn btn-amber">
          Track a shipment
        </Link>
        <Link href="/" className="btn btn-outline-light !rounded-xl">
          Go to the home page
        </Link>
      </div>
    </PageHero>
  );
}
