import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Accent, PageHero } from "@/components/PageHero";
import { site, telHref } from "@/lib/site";
import { topics, type Topic } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, message or visit Translode Logistics at the Mile 2 depot in Lagos.",
};

const ways = [
  { icon: Phone, title: "Call the depot", body: "The fastest way to reach a person.", href: telHref, action: site.phone, num: true },
  {
    icon: MessageCircle,
    title: "Message on WhatsApp",
    body: "Send a photo of what you are shipping.",
    href: `https://wa.me/${site.whatsapp}`,
    action: "Open WhatsApp",
  },
  { icon: Mail, title: "Send an email", body: "For accounts, invoices and paperwork.", href: `mailto:${site.email}`, action: site.email },
];

export default function ContactPage({ searchParams }: { searchParams: { topic?: string } }) {
  const initialTopic: Topic = searchParams.topic && searchParams.topic in topics ? (searchParams.topic as Topic) : "general";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        image="/images/hero-contact.jpg"
        position="60% 22%"
        title={
          <>
            Reach the <Accent>depot</Accent>
          </>
        }
      >
        <p className="mt-4 max-w-[30rem] text-lg text-white/90">
          A person answers. Have your waybill number ready if you are asking about a shipment.
        </p>
      </PageHero>

      <section className="page relative z-10 -mt-16 sm:-mt-24">
        <ul className="grid gap-5 md:grid-cols-3">
          {ways.map((w) => (
            <li key={w.title} className="card group flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="icon-tile !h-14 !w-14 transition-colors duration-300 group-hover:bg-amber-100 group-hover:text-amber-700">
                <w.icon size={25} aria-hidden />
              </span>
              <h2 className="h-card mt-5">{w.title}</h2>
              <p className="mt-1.5 flex-1 text-slate">{w.body}</p>
              <a href={w.href} className={`text-link mt-5 self-start break-all ${w.num ? "num" : ""}`}>
                {w.action}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="page grid items-start gap-6 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr]">
        <div className="card relative !rounded-3xl p-7 !shadow-lift sm:p-10">
          <ContactForm initialTopic={initialTopic} />
        </div>

        <div className="space-y-6">
          <div className="card !rounded-3xl p-7 sm:p-8">
            <h2 className="h-card text-2xl">Visit the head depot</h2>
            <address className="mt-5 space-y-5 not-italic">
              <p className="flex gap-4">
                <span className="icon-tile !h-11 !w-11">
                  <MapPin size={20} aria-hidden />
                </span>
                <span>
                  <span className="label block">Address</span>
                  <span className="font-semibold">{site.address}</span>
                </span>
              </p>
              <p className="flex gap-4">
                <span className="icon-tile !h-11 !w-11">
                  <Clock size={20} aria-hidden />
                </span>
                <span>
                  <span className="label block">Open</span>
                  <span className="font-semibold">{site.hours}</span>
                </span>
              </p>
            </address>
            <p className="mt-5 text-slate">
              Our other depots are on the{" "}
              <Link href="/about#depots" className="text-link">
                About page
              </Link>
              .
            </p>
          </div>

          <div className="relative isolate overflow-hidden rounded-3xl bg-navy-900 p-7 text-white sm:p-8">
            <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(60% 90% at 100% 0%, rgba(253,181,21,0.28), transparent 60%)" }} />
            <h2 className="h-card text-2xl">No need to call for these</h2>
            <p className="mt-2 text-white/85">A price and a tracking update are both a minute away.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quote" className="btn btn-amber">
                Get a price
              </Link>
              <Link href="/track" className="btn btn-outline-light !rounded-xl">
                Track a shipment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
