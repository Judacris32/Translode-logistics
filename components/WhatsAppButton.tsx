import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

/** Sits in the corner of every page. Most Nigerian customers would rather message than call. */
export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-lift transition-transform duration-200 hover:scale-105"
    >
      <MessageCircle size={26} aria-hidden />
      <span className="sr-only">Message us on WhatsApp (opens in a new tab)</span>
    </a>
  );
}
