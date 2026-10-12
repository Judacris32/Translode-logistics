// The business runs on Lagos time, so every date on the site is shown in it,
// whatever the visitor's own clock says.
const TZ = "Africa/Lagos";

const dayTime = new Intl.DateTimeFormat("en-NG", {
  timeZone: TZ,
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dayOnly = new Intl.DateTimeFormat("en-NG", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
const timeOnly = new Intl.DateTimeFormat("en-NG", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });
const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });

export const formatDayTime = (iso: string) => dayTime.format(new Date(iso));
export const formatDay = (iso: string) => dayOnly.format(new Date(iso));
export const formatTime = (iso: string) => timeOnly.format(new Date(iso));

/** "today", "tomorrow", or the weekday and date. */
export function relativeDay(iso: string, now = new Date()): string {
  const target = ymd.format(new Date(iso));
  const today = ymd.format(now);
  const tomorrow = ymd.format(new Date(now.getTime() + 86_400_000));
  const yesterday = ymd.format(new Date(now.getTime() - 86_400_000));
  if (target === today) return "today";
  if (target === tomorrow) return "tomorrow";
  if (target === yesterday) return "yesterday";
  return `on ${formatDay(iso)}`;
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toLocaleString("en-NG", { maximumFractionDigits: 1 })} tonnes`;
  return `${kg.toLocaleString("en-NG", { maximumFractionDigits: 1 })} kg`;
}
