// All money is stored and calculated in kobo (integer). 100 kobo = 1 naira.
// Never do price maths on floating-point naira values.

export type Kobo = number;

export const naira = (n: number): Kobo => Math.round(n * 100);

export function formatNaira(kobo: Kobo, opts: { round?: boolean } = {}): string {
  const whole = Math.trunc(kobo / 100);
  const frac = Math.abs(kobo % 100);
  const grouped = whole.toLocaleString("en-NG");
  if (opts.round || frac === 0) return `₦${grouped}`;
  return `₦${grouped}.${String(frac).padStart(2, "0")}`;
}

/** Round a kobo amount up to the nearest multiple of `stepNaira` naira. */
export function roundUpTo(kobo: Kobo, stepNaira: number): Kobo {
  const step = stepNaira * 100;
  return Math.ceil(kobo / step) * step;
}
