import Image from "next/image";

/**
 * A photograph that fills its box. `position` is the focal point, so the
 * subject stays in frame when a wide picture is cropped to a tall box.
 */
export function Photo({
  src,
  alt,
  className = "",
  position = "50% 50%",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-navy-800 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
