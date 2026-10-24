import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCover } from "@/components/EventCover";
import { Gallery } from "@/components/Gallery";
import { LiteYouTube } from "@/components/LiteYouTube";
import { SampleBadge, StatusBadge } from "@/components/StatusBadge";
import { formatDateRange, formatTimeRange } from "@/lib/dates";
import { getEvent, getEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return {};
  const when = formatDateRange(event.startsAt, event.endsAt);
  const coverUrl = event.coverImage?.src ?? `/api/covers/${event.slug}.svg`;
  return {
    title: event.title,
    description: `${event.title}: ${when}, ${event.venue.name}, ${event.city}. ${event.summary}`,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      images: [{ url: coverUrl, alt: `${event.title} thumbnail` }],
    },
  };
}

const SCHEMA_STATUS = {
  upcoming: "EventScheduled",
  live: "EventScheduled",
  past: "EventScheduled",
  postponed: "EventPostponed",
  cancelled: "EventCancelled",
} as const;

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const canRsvp = (event.state === "upcoming" || event.state === "live") && event.rsvpUrl;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: `https://schema.org/${SCHEMA_STATUS[event.state]}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: { "@type": "PostalAddress", streetAddress: event.venue.address, addressLocality: event.city, addressRegion: event.state, addressCountry: "NG" },
    },
    organizer: { "@type": "Organization", name: event.chapter.name, url: event.chapter.url },
    url: `${SITE_URL}/events/${event.slug}`,
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Link href="/events" className="text-sm font-medium underline">
        ← All events
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl">
        <EventCover event={event} priority sizes="(min-width: 896px) 896px, 100vw" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <StatusBadge state={event.state} />
        {event.sample && <SampleBadge />}
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
      <p className="mt-1 text-neutral-600 dark:text-neutral-400">
        Organised by {event.chapter.url ? <a href={event.chapter.url} target="_blank" rel="noopener noreferrer" className="underline">{event.chapter.name}</a> : event.chapter.name}
      </p>

      <dl className="mt-6 grid gap-4 rounded-2xl border border-neutral-200 p-5 sm:grid-cols-3 dark:border-neutral-800">
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Date</dt>
          <dd className="mt-1 font-medium">{formatDateRange(event.startsAt, event.endsAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Time</dt>
          <dd className="mt-1 font-medium">{formatTimeRange(event.startsAt, event.endsAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Venue</dt>
          <dd className="mt-1 font-medium">{event.venue.name}</dd>
          <dd className="text-sm text-neutral-600 dark:text-neutral-400">{event.venue.address}</dd>
          {event.venue.mapUrl && (
            <dd className="mt-1 text-sm">
              <a href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View on map
              </a>
            </dd>
          )}
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {canRsvp && (
          <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            RSVP
          </a>
        )}
        {(event.state === "upcoming" || event.state === "live") && (
          <a href={`/events/${event.slug}/calendar.ics`} className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
            Add to calendar
          </a>
        )}
        {event.state === "postponed" && <p className="text-sm text-amber-700 dark:text-amber-300">This event has been postponed. A new date has not been announced.</p>}
        {event.state === "cancelled" && <p className="text-sm text-red-700 dark:text-red-300">This event has been cancelled.</p>}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="mt-2 max-w-prose leading-7">{event.summary}</p>
        {event.hashtag && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{event.hashtag}</p>}
      </section>

      {event.speakers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Speakers</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {event.speakers.map((s) => (
              <li key={s.name} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
                <p className="font-medium">{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.name}</a> : s.name}</p>
                {s.title && <p className="text-sm text-neutral-600 dark:text-neutral-400">{s.title}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {event.gallery.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">Photos</h2>
          <Gallery photos={event.gallery} albumUrl={event.albumUrl} />
        </section>
      )}

      {event.videos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">Videos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {event.videos.map((v) => (
              <LiteYouTube key={v.youtubeId} youtubeId={v.youtubeId} title={v.title} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 text-sm text-neutral-500">
        Last verified {event.lastVerifiedAt}. Something wrong?{" "}
        <Link href="/about#contribute" className="underline">
          Report a correction
        </Link>
        .
      </p>
    </article>
  );
}
