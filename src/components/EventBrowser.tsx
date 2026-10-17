"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { EventWithState } from "@/lib/schema";
import { EventCard } from "./EventCard";

const STATUSES = [
  ["all", "All"],
  ["upcoming", "Upcoming"],
  ["past", "Past"],
] as const;

// Filters live in the URL (?status=upcoming&city=Lagos) so a filtered view can be shared.
export function EventBrowser({ events }: { events: EventWithState[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const status = params.get("status") ?? "all";
  const city = params.get("city") ?? "all";
  const cities = [...new Set(events.map((e) => e.city))].sort();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const visible = events.filter((e) => {
    const isUpcoming = e.state === "upcoming" || e.state === "live";
    if (status === "upcoming" && !isUpcoming) return false;
    if (status === "past" && e.state !== "past") return false;
    return city === "all" || e.city === city;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter by status" className="flex rounded-full border border-neutral-300 p-1 dark:border-neutral-700">
          {STATUSES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => update("status", value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                status === value ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only sm:not-sr-only">City</span>
          <select
            value={city}
            onChange={(e) => update("city", e.target.value)}
            className="rounded-full border border-neutral-300 bg-transparent px-4 py-2 dark:border-neutral-700"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-neutral-600 dark:text-neutral-400" aria-live="polite">
          {visible.length} {visible.length === 1 ? "event" : "events"}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          No events match these filters.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((e) => (
            <li key={e.slug} className="relative">
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
