import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { EventCard } from "@/components/EventCard";
import { formatDateRange, formatTime } from "@/lib/dates";
import { getEvents, isUpcoming } from "@/lib/events";

export default async function Home() {
  const events = await getEvents();
  const upcoming = events.filter(isUpcoming);
  const past = events.filter((e) => e.state === "past");
  const next = upcoming[0];
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

          {next ? (
            <div className="mt-10 max-w-2xl rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm uppercase tracking-wide opacity-80">{next.state === "live" ? "Happening now" : "Next up"}</p>
              <h2 className="mt-1 text-2xl font-semibold">{next.title}</h2>
              <p className="mt-1 opacity-90">
                {formatDateRange(next.startsAt, next.endsAt)} · {formatTime(next.startsAt)} WAT · {next.venue.name}
              </p>
              {next.state === "upcoming" && (
                <div className="mt-4">
                  <Countdown target={next.startsAt} />
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/events/${next.slug}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-neutral-100">
                  Event details
                </Link>
                {next.rsvpUrl && (
                  <a href={next.rsvpUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                    RSVP
                  </a>
                )}
              </div>
            </div>
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
