// Brand and contact details live here so the whole site can be renamed in one place.
// The phone numbers and email below are placeholders. Replace them before launch.

export const site = {
  name: "Translode Logistics",
  shortName: "Translode",
  legalName: "Translode Logistics Limited",
  tagline: "Reliable transport. Real connections. Across Nigeria and beyond.",
  description:
    "Courier, haulage and air freight from Lagos to cities across Nigeria and abroad. Book a pickup, track a waybill, or get a price in a minute.",
  url: "https://translode-logistics.vercel.app",
  phone: "+234 800 000 0000",
  whatsapp: "2348000000000",
  email: "hello@translode.example",
  address: "Plot 14, Oshodi–Apapa Expressway, Mile 2, Lagos",
  hours: "Monday to Saturday, 7am to 7pm",
  trackingPrefix: "TRL",
  sampleWaybill: "TRL-CR-20418836",
} as const;

export const telHref = `tel:${site.phone.replace(/\s/g, "")}`;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track a shipment" },
  { href: "/quote", label: "Get a price" },
  { href: "/about", label: "About" },
] as const;
