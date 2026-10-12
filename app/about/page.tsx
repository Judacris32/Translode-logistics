import type { Metadata } from "next";
import Link from "next/link";
import { Anchor, ArrowRight, ClipboardCheck, Eye, Plane, UserCheck, Warehouse, type LucideIcon } from "lucide-react";
import { Accent, PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import demo from "@/data/demo.json";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Translode Logistics started with one bus between Onitsha Main Market and Lagos. This is who we are and where to find us.",
};

const kind = {
  depot: { label: "Depot", icon: Warehouse },
  port: { label: "Port desk", icon: Anchor },
  airport: { label: "Airport desk", icon: Plane },
} as const;

// In order of time, so this one is a numbered list.
const milestones = [
  { year: "2016", title: "One bus", body: "Two brothers start a nightly run between Onitsha Main Market and Lagos, with a ledger and a phone." },
  { year: "2018", title: "The Mile 2 depot", body: "We take a yard on the Oshodi–Apapa Expressway and hire our first sorting crew." },
  { year: "2019", title: "Abuja and Port Harcourt", body: "Two more depots open, and the first trucks painted in our blue go on the road." },
  { year: "2021", title: "Tracking goes online", body: "The ledger becomes a waybill anyone can look up from a phone." },
  { year: "2022", title: "Kano and the long haul", body: "A depot in Sabon Gari, and 30-tonne trucks for full loads to the north." },
  { year: "2024", title: "Beyond Nigeria", body: "Desks open at the Ikeja cargo terminal and at Apapa port for air and sea freight." },
];

const principles: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Eye,
    title: "You see what we see",
    body: "There is one record of your shipment, and you are looking at it. We have no second, private version.",
  },
  {
    icon: ClipboardCheck,
    title: "Counted in front of you",
    body: "We weigh and count at pickup with you watching, and again at delivery with the receiver.",
  },
  {
    icon: UserCheck,
    title: "Our own people",
    body: "Drivers, couriers and sorters are on our payroll, trained by us, and answer to a depot manager you can call.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        image="/images/hero-about.jpg"
        position="72% 55%"
        title={
          <>
            It started with <Accent>one bus</Accent>
          </>
        }
      >
        <p className="mt-4 max-w-[30rem] text-lg text-white/90">
          In 2016, two brothers, one Hiace and the road between Onitsha Main Market and Lagos.
        </p>
      </PageHero>

      <section className="page relative z-10 -mt-16 sm:-mt-24">
        <div className="card grid overflow-hidden !rounded-3xl !shadow-lift lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-5 p-7 sm:p-10">
            <h2 className="h-section">How we got here</h2>
            <p className="text-slate">
              Traders in Onitsha needed their goods in Lagos by morning, and the buses that carried them kept no record
              of who sent what. Cartons went missing and nobody could say where. So we wrote every carton in a ledger,
              gave the sender a number, and phoned when it arrived.
            </p>
            <p className="text-slate">
              That ledger is now the waybill on this website. The idea has not changed: if we are holding your goods,
              you should be able to see where they are without calling anyone.
            </p>
            <p className="text-slate">
              Today we run our own depots in six cities, trucks between them every night, a desk at Apapa port and
              another at the cargo terminal in Ikeja.
            </p>
          </div>
          <Photo
            src="/images/team.jpg"
            alt="Four Translode depot staff in hard hats and reflective vests go through the day's loads on a tablet in the yard"
            position="50% 35%"
            priority
            className="min-h-[18rem]"
          />
        </div>
      </section>

      <section className="page py-16 sm:py-24">
        <p className="eyebrow">How we work</p>
        <h2 className="h-section mt-3 max-w-[22ch]">Three habits we have kept since the ledger.</h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((p) => (
            <li key={p.title} className="card p-7">
              <span className="icon-tile !h-14 !w-14">
                <p.icon size={25} aria-hidden />
              </span>
              <h3 className="h-card mt-5">{p.title}</h3>
              <p className="mt-2 text-slate">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white">
        <div className="page grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">The road so far</p>
            <h2 className="h-section mt-3">From one bus to six depots.</h2>
            <Photo
              src="/images/sorting.jpg"
              alt="A depot worker lifts a labelled carton onto the sorting line while a forklift unloads a container behind him"
              position="45% 40%"
              className="mt-8 aspect-[4/3] w-full rounded-3xl"
            />
          </div>
          <ol className="lg:pt-4">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative grid grid-cols-[4.5rem_1fr] gap-x-5 pb-9 last:pb-0 sm:gap-x-7">
                {i < milestones.length - 1 && <span aria-hidden className="absolute left-[2.1875rem] top-10 h-full w-0.5 bg-brand-100" />}
                <span className="num relative flex h-10 w-[4.5rem] items-center justify-center rounded-full bg-amber-100 text-sm text-amber-700 shadow-[0_0_0_6px_#fff]">
                  {m.year}
                </span>
                <div className="pt-1.5">
                  <h3 className="h-card">{m.title}</h3>
                  <p className="mt-1.5 max-w-[32rem] text-slate">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="depots" className="page scroll-mt-28 py-16 sm:py-24">
        <p className="eyebrow">Our network</p>
        <h2 className="h-section mt-3">Where to find us</h2>
        <p className="mt-3 max-w-[36rem] text-slate">
          Every depot takes drop-offs and holds parcels for collection. Open {site.hours}.
        </p>
        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demo.hubs.map((h) => {
            const k = kind[h.kind as keyof typeof kind];
            return (
              <li key={h.code} className="card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="icon-tile !h-11 !w-11">
                  <k.icon size={20} aria-hidden />
                </span>
                <p className="mt-4 text-lg font-bold leading-tight">{h.name}</p>
                <p className="mt-1 text-[0.95rem] text-slate">
                  {h.city}
                  {h.state === h.city ? "" : `, ${h.state}`}
                </p>
                <p className="num mt-3 inline-block rounded-full bg-mist px-2.5 py-1 text-xs text-brand-700">
                  {k.label} {h.code}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="page pb-20 sm:pb-24">
        <div className="relative isolate grid overflow-hidden rounded-[2rem] bg-navy-900 text-white lg:grid-cols-[1.1fr_0.9fr]">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(45% 80% at 0% 0%, rgba(47,95,227,0.4), transparent 65%)" }} />
          <div className="p-8 sm:p-12 lg:py-16">
            <h2 className="h-section">Talk to the head depot</h2>
            <p className="mt-4 max-w-[30rem] text-lg text-white/85">
              Questions about a shipment, a monthly account, or a route we do not list yet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-amber">
                Contact us
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/quote" className="btn btn-outline-light !rounded-xl">
                Get a price
              </Link>
            </div>
          </div>
          <Photo
            src="/images/manager.jpg"
            alt="A Translode depot manager stands smiling with his arms folded in front of the truck yard"
            position="38% 25%"
            className="min-h-[18rem] lg:min-h-0"
          />
        </div>
      </section>
    </>
  );
}
