import Link from "next/link";
import { site } from "@/lib/site";

export function LogoMark({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 40" className={className} aria-hidden fill="#FDB515">
      {/* A T at speed: slanted crossbar and stem, two streaks trailing behind. */}
      <path d="M11 3h34l-4.2 10H6.8z" />
      <path d="M22.6 15.5h10.2L24.4 37H14.2z" />
      <path d="M3.4 16.5h14l-1.9 4.6h-14z" opacity="0.85" />
      <path d="M0 24.6h11.4l-1.9 4.6H-1.9z" opacity="0.6" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 text-white" aria-label={`${site.name} home`}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.4rem] font-extrabold tracking-[-0.03em]">{site.shortName}</span>
        <span className="mt-1 text-[0.9rem] font-medium text-white/75">Logistics</span>
      </span>
    </Link>
  );
}
