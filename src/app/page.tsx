import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { EventCard } from "@/components/EventCard";
import { HeroEventScroll } from "@/components/HeroEventScroll";
import { formatDate, formatTime, getDayKey } from "@/lib/dates";
import { getEvents, isUpcoming } from "@/lib/events";

export default async function Home() {
  const events = await getEvents();
  const upcoming = events.filter(isUpcoming);
  const past = events.filter((e) => e.state === "past");

  // Group the earliest upcoming/live events by their date (in Africa/Lagos time)
  const firstUpcoming = upcoming[0];
  const nextDayKey = firstUpcoming ? getDayKey(firstUpcoming.startsAt) : null;
  const nextEvents = firstUpcoming
    ? upcoming.filter((e) => getDayKey(e.startsAt) === nextDayKey)
    : [];

  const cities = [...new Set(events.map((e) => e.city))].sort();

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest opacity-80">GDG DevFest · Nigeria · 2026</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Every DevFest in Nigeria, in one place.</h1>
          <p className="mt-5 max-w-2xl text-lg opacity-90">
            Dates, venues, RSVP links, photos and videos for GDG DevFest events across the country.
          </p>

          {nextEvents.length > 0 ? (
            <HeroEventScroll
              title={nextEvents.some((e) => e.state === "live") ? "Happening now" : "Next up"}
              subtitle={
                nextEvents.length > 1
                  ? `${nextEvents.length} events on ${formatDate(firstUpcoming.startsAt, { weekday: true })}`
                  : formatDate(firstUpcoming.startsAt, { weekday: true })
              }
              count={nextEvents.length}
            >
              {nextEvents.map((event) => (
                <div
                  key={event.slug}
                  className={`flex flex-col justify-between rounded-2xl bg-white/10 p-5 backdrop-blur transition hover:bg-white/15 border border-white/10 ${
                    nextEvents.length > 1
                      ? "flex-none w-[68vw] sm:w-[55vw] md:w-[46vw] lg:w-[400px] snap-start"
                      : "w-full"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                        {event.city}, {event.state}
                      </span>
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                        {formatTime(event.startsAt)} WAT
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold leading-snug">{event.title}</h2>
                    <p className="mt-1 text-sm opacity-90 line-clamp-2">
                      {event.venue.name} · {event.venue.address}
                    </p>
                    {event.state === "upcoming" && (
                      <div className="mt-3">
                        <Countdown target={event.startsAt} />
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/events/${event.slug}`}
                      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-800 hover:bg-neutral-100"
                    >
                      Event details
                    </Link>
                    {event.rsvpUrl && (
                      <a
                        href={event.rsvpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/60 px-4 py-2 text-xs font-semibold hover:bg-white/10"
                      >
                        RSVP
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </HeroEventScroll>
          ) : (
            <p className="mt-10 rounded-2xl bg-white/10 p-5">No upcoming events are listed right now. Check back soon.</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-14">
        <section aria-labelledby="upcoming-heading">
          <div className="mb-6 flex items-end justify-between">
            <h2 id="upcoming-heading" className="text-2xl font-bold tracking-tight">
              Upcoming events
            </h2>
            <Link href="/events?status=upcoming" className="text-sm font-medium underline">
              View all
            </Link>
          </div>
          {upcoming.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.slice(0, 6).map((e) => (
                <li key={e.slug} className="relative">
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">Nothing scheduled yet.</p>
          )}
        </section>

        {past.length > 0 && (
          <section aria-labelledby="past-heading">
            <div className="mb-6 flex items-end justify-between">
              <h2 id="past-heading" className="text-2xl font-bold tracking-tight">
                Recent highlights
              </h2>
              <Link href="/events?status=past" className="text-sm font-medium underline">
                View all
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.slice(0, 3).map((e) => (
                <li key={e.slug} className="relative">
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="mb-4 text-2xl font-bold tracking-tight">
            Cities
          </h2>
          <ul className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c}>
                <Link href={`/events?city=${encodeURIComponent(c)}`} className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
