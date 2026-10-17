import { getEvent, getEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) return new Response("Not found", { status: 404 });

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DevFest Nigeria//Unofficial//EN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@devfest-ng`,
    `DTSTAMP:${utc(event.lastVerifiedAt + "T00:00:00Z")}`,
    `DTSTART:${utc(event.startsAt)}`,
    `DTEND:${utc(event.endsAt)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(`${event.venue.name}, ${event.venue.address}`)}`,
    `DESCRIPTION:${escape(event.summary)}`,
    `URL:${SITE_URL}/events/${event.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
