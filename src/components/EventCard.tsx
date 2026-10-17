import Link from "next/link";
import { formatDateRange, formatTime } from "@/lib/dates";
import type { EventWithState } from "@/lib/schema";
import { EventCover } from "./EventCover";
import { SampleBadge, StatusBadge } from "./StatusBadge";

// The whole card is clickable via the title link's ::after overlay; the parent must be `relative`.
export function EventCard({ event }: { event: EventWithState }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <EventCover event={event} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge state={event.state} />
          {event.sample && <SampleBadge />}
        </div>
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 hover:underline">
            {event.title}
          </Link>
        </h3>
        <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          <p>{formatDateRange(event.startsAt, event.endsAt)}</p>
          <p>{formatTime(event.startsAt)} WAT</p>
          <p>
            {event.venue.name}, {event.city}
          </p>
        </div>
      </div>
    </article>
  );
}
