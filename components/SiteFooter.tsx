import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { services } from "@/lib/services";
import { site, telHref } from "@/lib/site";
import { Logo } from "./Logo";

const company = [
  { href: "/track", label: "Track a shipment" },
  { href: "/quote", label: "Get a price" },
  { href: "/about", label: "About us" },
  { href: "/about#depots", label: "Find a depot" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white/75">
      <div className="page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-[19rem] text-[0.95rem]">{site.tagline}</p>
        </div>

        <nav aria-label="Services">
          <h2 className="font-bold text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services#${s.id}`} className="transition-colors hover:text-amber">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="font-bold text-white">Find your way</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-amber">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-bold text-white">Reach the depot</h2>
          <address className="mt-4 space-y-3 text-[0.95rem] not-italic">
            <p className="flex gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-amber" aria-hidden />
              {site.address}
            </p>
            <p className="flex gap-3">
              <Phone size={18} className="mt-1 shrink-0 text-amber" aria-hidden />
              <a href={telHref} className="num hover:text-amber">
                {site.phone}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail size={18} className="mt-1 shrink-0 text-amber" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-amber">
                {site.email}
              </a>
            </p>
            <p className="flex gap-3">
              <Clock size={18} className="mt-1 shrink-0 text-amber" aria-hidden />
              {site.hours}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page flex flex-col gap-2 py-6 text-[0.8125rem] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <p>A demonstration project by JayDev Studio. The company, people and shipments shown here are fictional.</p>
        </div>
      </div>
    </footer>
  );
}
