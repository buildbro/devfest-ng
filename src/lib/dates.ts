// All dates are shown in Nigerian time, regardless of server or visitor locale.
const TZ = "Africa/Lagos";
const LOCALE = "en-NG";

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });

export function formatDate(iso: string, opts: { weekday?: boolean } = {}) {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TZ,
    weekday: opts.weekday ? "short" : undefined,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, day: "numeric", month: "short" }).format(
    new Date(iso),
  );
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateRange(startsAt: string, endsAt: string) {
  if (dayKey.format(new Date(startsAt)) === dayKey.format(new Date(endsAt))) {
    return formatDate(startsAt, { weekday: true });
  }
  return `${formatShortDate(startsAt)} – ${formatDate(endsAt)}`;
}

export function formatTimeRange(startsAt: string, endsAt: string) {
  return `${formatTime(startsAt)} – ${formatTime(endsAt)} WAT`;
}
