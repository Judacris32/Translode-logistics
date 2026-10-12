"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { nav, site, telHref } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the menu after a link takes the visitor to a new page.
  useEffect(() => setOpen(false), [pathname]);

  // Clear over the hero photograph, solid once the page scrolls under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,box-shadow] duration-300 ${
        solid ? "bg-navy-900/95 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="page flex h-[4.75rem] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`relative py-2 text-[0.95rem] font-semibold transition-colors hover:text-amber ${
                  current ? "text-amber" : "text-white"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-amber transition-transform duration-300 ${
                    current ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={telHref} className="num flex items-center gap-2 text-[0.95rem] hover:text-amber">
            <Phone size={17} aria-hidden />
            {site.phone}
          </a>
          <Link href="/contact" className="btn btn-outline-light !min-h-[2.75rem]">
            Contact us
            <ArrowRight size={17} aria-hidden />
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-white/10 lg:hidden">
          <ul className="page pb-6 pt-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block border-b border-white/10 py-3.5 text-lg font-bold aria-[current=page]:text-amber"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-5 flex flex-col gap-3">
              <Link href="/contact" className="btn btn-amber">
                Contact us
              </Link>
              <a href={telHref} className="num flex items-center justify-center gap-2 py-2 text-white/85">
                <Phone size={17} aria-hidden />
                {site.phone}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
