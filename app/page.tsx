import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Factory,
  Moon,
  PenLine,
  Scale,
  Ship,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";
import { NetworkSection } from "@/components/NetworkSection";
import { Accent, PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { serviceIcons } from "@/components/ServiceIcon";
import { TrackForm } from "@/components/TrackForm";
import { TrackingPreview } from "@/components/TrackingPreview";
import { cities, lanes } from "@/lib/cities";
import { formatNaira } from "@/lib/money";
import { serviceHref, services } from "@/lib/services";
import { site } from "@/lib/site";

const journey: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: CalendarCheck,
    title: "Book a pickup",
    body: "Online or by phone. Tell us what it is, how heavy, and where it is going. Before noon means we come today.",
  },
  {
    icon: Scale,
    title: "We collect and weigh",
    body: "Our courier or truck comes to you. We weigh it in front of you and your waybill number arrives by SMS before we leave.",
  },
  {
    icon: Moon,
    title: "It travels overnight",
    body: "Trucks leave our depots every evening. Each depot scans it in and out, so the waybill always says where it last was.",
  },
  {
    icon: PenLine,
    title: "Delivered and signed for",
    body: "We call ahead. The receiver signs, and you get a message with the name and the time.",
  },
];

const promises = [
  "A waybill number by SMS before we leave your door",
  "A scan at every depot, with the time and a note from the person who handled it",
  "A call before delivery, and the name of whoever signed",
];

const customers: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Store,
    title: "Market traders",
    body: "Cartons from Onitsha, Aba and Kano to your customers in Lagos by morning, each one numbered and signed for.",
  },
  {
    icon: ShoppingBag,
    title: "Online sellers",
    body: "Keep stock at our depot. We pack each order as it comes in and collect payment on delivery if you want it.",
  },
  {
    icon: Factory,
    title: "Manufacturers",
    body: "Regular truckloads to your distributors on a fixed schedule, with one monthly invoice.",
  },
  {
    icon: Ship,
    title: "Importers and exporters",
    body: "From the ship or the aircraft to your warehouse door, with the customs paperwork done alongside you.",
  },
];

export default function HomePage() {
  const depots = cities.filter((c) => c.hub);
  const [main, extra] = [services.slice(0, 3), services.slice(3)];

  const facts = [
    { value: "2016", label: "Moving goods since" },
    { value: String(depots.length), label: "Depots of our own" },
    { value: String(cities.length), label: "Nigerian cities served" },
    { value: String(lanes.length), label: "Countries reached by air" },
  ];

  return (
    <>
      <PageHero
        size="lg"
        eyebrow="Courier, haulage and freight"
        image="/images/hero-home.jpg"
        position="62% 60%"
        title={
          <>
            Send it today. Know where it is <Accent>tonight.</Accent>
          </>
        }
      >
        <p className="mt-5 max-w-[33rem] text-lg text-white/90">
          Parcels, truckloads and cargo from Lagos to {cities.length} cities across Nigeria and the world beyond. Every
          scan goes on your waybill the minute it happens.
        </p>
        <div className="mt-8 max-w-[36rem]">
          <TrackForm id="hero-waybill" />
          <p className="mt-3.5 text-[0.95rem] text-white/85">
            No waybill yet? Try ours:{" "}
            <Link href={`/track?n=${site.sampleWaybill}`} className="num text-amber underline decoration-amber/50 underline-offset-4 hover:decoration-amber">
              {site.sampleWaybill}
            </Link>
          </p>
        </div>
      </PageHero>

      {/* Services, lifted over the edge of the photograph. */}
      <section className="page relative z-10 -mt-16 sm:-mt-28" aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">
          What we move
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {main.map((s) => {
            const Icon = serviceIcons[s.id];
            return (
              <article key={s.id} className="card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <Photo src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/10] w-full [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
                <div className="relative flex flex-1 flex-col p-6 pt-9">
                  <span className="absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber text-ink shadow-amber">
                    <Icon size={26} aria-hidden />
                  </span>
                  <h3 className="h-card text-2xl">
                    <Link href={serviceHref(s)} className="after:absolute after:inset-0 after:content-['']">
                      {s.name}
                    </Link>
                  </h3>
                  <p className="mt-1 font-semibold text-brand-700">{s.line}</p>
                  <p className="mt-3 flex-1 text-[0.95rem] text-slate">
                    {s.facts[0].value}. {s.facts[1].value}.
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
                    <p>
                      <span className="label block">Price</span>
                      <span className="font-bold">{s.facts[2].value}</span>
                    </p>
                    <span aria-hidden className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {extra.map((s) => {
            const Icon = serviceIcons[s.id];
            return (
              <article key={s.id} className="card group relative grid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:grid-cols-[0.85fr_1fr]">
                <Photo src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(min-width: 768px) 25vw, 100vw" className="min-h-[11rem] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
                <div className="p-6">
                  <span className="icon-tile !h-11 !w-11">
                    <Icon size={21} aria-hidden />
                  </span>
                  <h3 className="h-card mt-3 text-2xl">
                    <Link href={`/services#${s.id}`} className="after:absolute after:inset-0 after:content-['']">
                      {s.name}
                    </Link>
                  </h3>
                  <p className="mt-1 font-semibold text-brand-700">{s.line}</p>
                  <p className="mt-2 text-[0.95rem] text-slate">{s.facts[0].value}.</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* The company in four facts. Every number comes from the data this site runs on. */}
      <section className="page pt-14 sm:pt-20" aria-label="Translode at a glance">
        <dl className="grid grid-cols-2 gap-y-8 rounded-3xl bg-navy-900 px-6 py-9 text-white sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse px-2 lg:px-8 lg:first:pl-0">
              <dt className="mt-1 text-[0.95rem] text-white/75">{f.label}</dt>
              <dd className="num text-4xl font-extrabold tracking-[-0.03em] text-amber sm:text-5xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Tracking, shown with a real sample waybill */}
      <section className="page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Real-time tracking</p>
          <h2 className="h-section mt-3">You should never have to call to ask where it is.</h2>
          <p className="mt-5 max-w-[32rem] text-lg text-slate">
            Every hand your shipment passes through records it on a tablet. You and your receiver see the same waybill
            we do.
          </p>
          <ul className="mt-7 space-y-4">
            {promises.map((p) => (
              <li key={p} className="flex gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-good-50 text-good">
                  <Check size={15} strokeWidth={3} aria-hidden />
                </span>
                <span className="max-w-[30rem]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <Photo
            src="/images/tracking.jpg"
            alt="A depot supervisor in a hard hat checks shipment routes on a tablet while a truck is loaded behind her"
            position="40% 35%"
            className="aspect-[16/10] w-full rounded-3xl"
          />
          <TrackingPreview className="relative z-10 mx-3 -mt-14 sm:mx-6 sm:-mt-20 lg:ml-auto lg:mr-6 lg:w-[80%]" />
        </div>
      </section>

      {/* How it moves: a real sequence, so it is numbered. */}
      <section className="bg-white">
        <div className="page grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">How it works</p>
            <h2 className="h-section mt-3">From your door to theirs.</h2>
            <Photo
              src="/images/packing.jpg"
              alt="A Translode packer tapes a carton shut at the depot, a scanner and waybill beside her"
              position="38% 45%"
              className="mt-8 aspect-[4/3] w-full rounded-3xl"
            />
          </div>
          <ol className="relative lg:pt-6">
            {journey.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[3.5rem_1fr] gap-x-5 pb-10 last:pb-0 sm:gap-x-7">
                {i < journey.length - 1 && <span aria-hidden className="absolute left-[1.6875rem] top-14 h-full w-0.5 bg-brand-100" />}
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_0_0_6px_#fff]">
                  <step.icon size={24} aria-hidden />
                </span>
                <div className="pt-1">
                  <p className="num text-sm text-amber-700">Step {i + 1}</p>
                  <h3 className="h-card mt-0.5">{step.title}</h3>
                  <p className="mt-2 max-w-[32rem] text-slate">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who uses us */}
      <section className="page py-20 sm:py-28">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">Who we move for</p>
            <h2 className="h-section mt-3">Built around how Nigerian business actually ships.</h2>
          </div>
          <p className="max-w-[34rem] text-lg text-slate lg:justify-self-end">
            A trader with ten cartons and a factory with ten trucks need different things. These are the four kinds of
            customer we see most.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          <Photo
            src="/images/sorting.jpg"
            alt="A depot worker lifts a labelled carton onto the sorting line while a forklift unloads a container behind him"
            position="45% 40%"
            className="min-h-[20rem] rounded-3xl"
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {customers.map((c) => (
              <li key={c.title} className="card p-6">
                <span className="icon-tile">
                  <c.icon size={22} aria-hidden />
                </span>
                <h3 className="h-card mt-4">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] text-slate">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NetworkSection />

      {/* Abroad: the air freight lanes, straight from the price list. */}
      <section className="page py-20 sm:py-28">
        <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-card lg:grid-cols-[1fr_1.05fr]">
          <div className="relative min-h-[18rem]">
            <Image src="/images/global.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" style={{ objectPosition: "35% 50%" }} />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,18,44,0.1) 30%, rgba(8,18,44,0.88) 100%)" }} />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
              <p className="eyebrow-light">Beyond Nigeria</p>
              <h2 className="h-section mt-2">By air from Lagos, to the door abroad.</h2>
            </div>
          </div>
          <div className="p-6 sm:p-9">
            <table className="w-full text-left">
              <caption className="sr-only">Air freight destinations, transit times and price per kilogram</caption>
              <thead>
                <tr className="label border-b border-line">
                  <th scope="col" className="pb-3 font-semibold">Destination</th>
                  <th scope="col" className="hidden pb-3 font-semibold sm:table-cell">Door to door</th>
                  <th scope="col" className="pb-3 text-right font-semibold">Per kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-line">
                {lanes.map((l) => (
                  <tr key={l.city}>
                    <th scope="row" className="py-3.5 font-bold">
                      {l.city}
                      <span className="block text-sm font-medium text-slate">
                        {l.country}
                        <span className="sm:hidden">, {l.days}</span>
                      </span>
                    </th>
                    <td className="hidden py-3.5 text-slate sm:table-cell">{l.days}</td>
                    <td className="num py-3.5 text-right">{formatNaira(l.perKgKobo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quote?service=freight" className="btn btn-brand">
                Price an air shipment
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/services#sea" className="btn btn-ghost">
                Shipping by sea
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Price */}
      <section className="page pb-20 sm:pb-28">
        <div className="relative isolate grid overflow-hidden rounded-[2rem] bg-navy-900 text-white lg:grid-cols-[1.1fr_0.9fr]">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(45% 80% at 0% 0%, rgba(47,95,227,0.4), transparent 65%)" }} />
          <div className="p-8 sm:p-12 lg:py-16">
            <p className="eyebrow-light">Ready when you are</p>
            <h2 className="h-section mt-3">Know the price before you book.</h2>
            <p className="mt-4 max-w-[30rem] text-lg text-white/85">
              Choose the two cities and the weight. The price shows as you type, with every charge listed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quote" className="btn btn-amber !px-7">
                Get a price
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/contact" className="btn btn-outline-light !rounded-xl">
                Talk to the depot
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
