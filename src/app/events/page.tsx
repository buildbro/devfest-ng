import type { Metadata } from "next";
import { Suspense } from "react";
import { EventBrowser } from "@/components/EventBrowser";
import { EventCard } from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "All DevFest events in Nigeria, 2026",
  description: "Browse upcoming and past DevFest events across Nigeria. Filter by city or status.",
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">DevFest events, 2026</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">Upcoming events first, then past events, newest first.</p>
      {/* useSearchParams inside EventBrowser needs a Suspense boundary. The fallback is the full unfiltered
          list, so crawlers and no-JS visitors still get every event in the static HTML. */}
      <Suspense
        fallback={
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <li key={e.slug} className="relative">
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        }
      >
        <EventBrowser events={events} />
      </Suspense>
    </div>
  );
}
