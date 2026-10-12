import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, Package, Plus, Wallet, X } from "lucide-react";
import { Accent, PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { serviceIcons } from "@/components/ServiceIcon";
import { serviceHref, services } from "@/lib/services";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Courier, haulage, air freight, sea freight and warehousing from Translode Logistics: what each one carries, what is included and what it costs.",
};

const factIcon = [Package, Clock, Wallet];

const refused = [
  "Cash, cheques made out to cash, and jewellery",
  "Firearms, ammunition and explosives",
  "Illegal drugs, and medicines without a prescription or NAFDAC number",
  "Fuel, gas cylinders and other things that burn or leak",
  "Live animals",
  "Fresh or frozen food, unless we have agreed it with you first",
];

const questions = [
  {
    q: "How do I pay?",
    a: "By transfer or card when you book, or in cash at pickup. Businesses that send every week can ask for a monthly account.",
  },
  {
    q: "What if nobody is there to receive it?",
    a: "We call first. If there is no answer, we note it on the waybill, try again the next working day, and call you, the sender, before a third attempt.",
  },
  {
    q: "What happens if something is lost or damaged?",
    a: "Tell the depot within 48 hours of delivery. Every parcel is covered up to ₦50,000. Above that, declare the value when you book and we cover the declared amount for a small fee.",
  },
  {
    q: "Can the receiver pay?",
    a: "Yes, for courier within Nigeria. Choose pay on delivery when you book and we collect before handing over.",
  },
  {
    q: "Do you clear goods at the port for me?",
    a: "Yes. For sea freight we prepare the Form M and PAAR with you, pay duty on your behalf from funds you send, and clear at Apapa or Tin Can. You get copies of every receipt.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        image="/images/hero-services.jpg"
        position="68% 60%"
        title={
          <>
            Five ways to <Accent>move it</Accent>
          </>
        }
      >
        <p className="mt-4 max-w-[32rem] text-lg text-white/90">
          One envelope across Lagos, thirty tonnes to Kano, or a container from Guangzhou. Here is what each service
          carries, what comes with it, and where the price starts.
        </p>
        <ul className="mt-7 flex max-w-[34rem] flex-wrap gap-2.5">
          {services.map((s) => {
            const Icon = serviceIcons[s.id];
            return (
              <li key={s.id}>
                <a href={`#${s.id}`} className="btn btn-outline-light !min-h-[2.75rem] bg-navy-900/40 !px-4 backdrop-blur-sm">
                  <Icon size={17} aria-hidden />
                  {s.name}
                </a>
              </li>
            );
          })}
        </ul>
      </PageHero>

      <div className="page relative z-10 -mt-16 space-y-8 pb-10 sm:-mt-24">
        {services.map((s, i) => {
          const Icon = serviceIcons[s.id];
          return (
            <section key={s.id} id={s.id} className="card scroll-mt-28 overflow-hidden !rounded-3xl !shadow-lift" aria-labelledby={`${s.id}-title`}>
              <div className="grid lg:grid-cols-2">
                <Photo
                  src={s.photo.src}
                  alt={s.photo.alt}
                  position={s.photo.position}
                  priority={i === 0}
                  className={`min-h-[16rem] sm:min-h-[20rem] lg:min-h-[28rem] ${i % 2 === 1 ? "lg:order-2" : ""}`}
                />
                <div className="p-7 sm:p-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-ink shadow-amber">
                    <Icon size={24} aria-hidden />
                  </span>
                  <h2 id={`${s.id}-title`} className="h-section mt-5">
                    {s.name}
                  </h2>
                  <p className="mt-1.5 text-lg font-bold text-brand-700">{s.line}</p>
                  <p className="mt-4 text-slate">{s.body}</p>
                  <dl className="mt-7 space-y-4">
                    {s.facts.map((f, j) => {
                      const FIcon = factIcon[j];
                      return (
                        <div key={f.label} className="flex items-start gap-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-brand-700">
                            <FIcon size={19} aria-hidden />
                          </span>
                          <div>
                            <dt className="label">{f.label}</dt>
                            <dd className="font-semibold">{f.value}</dd>
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>

              <div className="grid gap-8 border-t border-dashed border-line p-7 sm:grid-cols-2 sm:p-10">
                <div>
                  <h3 className="h-card">People send</h3>
                  <ul className="mt-4 space-y-3">
                    {s.carries.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Package size={19} className="mt-1 shrink-0 text-amber-700" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="h-card">The price includes</h3>
                  <ul className="mt-4 space-y-3">
                    {s.included.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-good-50 text-good">
                          <Check size={15} strokeWidth={3} aria-hidden />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:col-span-2">
                  <Link href={serviceHref(s)} className="btn btn-brand">
                    {s.action}
                    <ArrowRight size={18} aria-hidden />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="page grid gap-8 py-16 sm:py-20 lg:grid-cols-2">
        <div className="card !rounded-3xl p-7 sm:p-10">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">What we will not carry</h2>
          <p className="mt-2 text-slate">For the safety of our staff and everyone else&rsquo;s goods.</p>
          <ul className="mt-6 space-y-3.5">
            {refused.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bad-50 text-bad">
                  <X size={15} strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card !rounded-3xl p-7 sm:p-10">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">Before you book</h2>
          <div className="mt-5 divide-y divide-line">
            {questions.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-transform duration-200 group-open:rotate-45">
                    <Plus size={18} aria-hidden />
                  </span>
                </summary>
                <p className="mt-2.5 max-w-[34rem] text-slate">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 text-slate">
            Something else? Call{" "}
            <a href={telHref} className="num text-link">
              {site.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
