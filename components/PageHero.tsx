import Image from "next/image";
import type { ReactNode } from "react";

/**
 * The photograph band at the top of every page. The hero pictures are
 * composed with the subject on the right, so the headline sits on the
 * darkened left. On phones the whole picture is darkened instead.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  image,
  position = "70% 50%",
  size = "md",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  image: string;
  /** Focal point of the photograph, as a CSS object-position. */
  position?: string;
  size?: "md" | "lg";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: position }} />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,18,44,0.96) 0%, rgba(8,18,44,0.88) 30%, rgba(8,18,44,0.5) 52%, rgba(8,18,44,0.08) 78%, rgba(8,18,44,0) 100%), linear-gradient(180deg, rgba(6,14,36,0.7) 0%, rgba(6,14,36,0) 30%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{ background: "linear-gradient(180deg, rgba(8,18,44,0.9) 0%, rgba(8,18,44,0.8) 55%, rgba(8,18,44,0.62) 100%)" }}
      />

      <div className={`page pt-[7.75rem] ${size === "lg" ? "pb-36 sm:pb-48 sm:pt-44" : "pb-28 sm:pb-36 sm:pt-36"}`}>
        <div className="max-w-[40rem]">
          <p className="eyebrow-light">{eyebrow}</p>
          <h1 className={`h-display mt-3 ${size === "lg" ? "text-[clamp(2.5rem,6vw,4.5rem)]" : "text-[clamp(2.25rem,5vw,3.75rem)]"}`}>
            {title}
          </h1>
          {children}
        </div>
      </div>

      {/* The curved edge where the band meets the page. */}
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[-1px] h-8 w-full sm:h-14">
        <path d="M0,0 Q720,120 1440,0 L1440,80 L0,80 Z" fill="#F3F6FB" />
      </svg>
    </section>
  );
}

export const Accent = ({ children }: { children: ReactNode }) => <span className="text-amber">{children}</span>;
