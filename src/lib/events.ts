import fs from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import { eventSchema, type DevFestEvent, type EventState, type EventWithState } from "./schema";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

function loadEvents(): DevFestEvent[] {
  const events: DevFestEvent[] = [];
  for (const year of fs.readdirSync(EVENTS_DIR)) {
    const yearDir = path.join(EVENTS_DIR, year);
    for (const file of fs.readdirSync(yearDir).filter((f) => f.endsWith(".json"))) {
      const result = eventSchema.safeParse(JSON.parse(fs.readFileSync(path.join(yearDir, file), "utf8")));
      if (!result.success) {
        throw new Error(`Invalid event file ${year}/${file}:\n${result.error.message}`);
      }
      if (`${result.data.slug}.json` !== file) {
        throw new Error(`Event file ${year}/${file} must be named after its slug "${result.data.slug}"`);
      }
      events.push(result.data);
    }
  }
  const slugs = new Set<string>();
  for (const e of events) {
    if (slugs.has(e.slug)) throw new Error(`Duplicate event slug: ${e.slug}`);
    slugs.add(e.slug);
  }
  return events;
}

function getState(e: DevFestEvent, now: number): EventState {
  if (e.status !== "scheduled") return e.status;
  if (now < Date.parse(e.startsAt)) return "upcoming";
  if (now <= Date.parse(e.endsAt)) return "live";
  return "past";
}

/**
 * Every event with its derived state. Cached for an hour so "now" is computed
 * at cache-fill time instead of during prerender, and the lists refresh
 * themselves as events start and finish.
 *
 * Order: live/upcoming soonest first, then postponed/cancelled, then past newest first.
 */
export async function getEvents(): Promise<EventWithState[]> {
  "use cache";
  cacheLife("hours");

  const now = Date.now();
  const rank = (s: EventState) => (s === "live" || s === "upcoming" ? 0 : s === "past" ? 2 : 1);
  return loadEvents()
    .map((e) => ({ ...e, state: getState(e, now) }))
    .sort((a, b) => {
      const byRank = rank(a.state) - rank(b.state);
      if (byRank) return byRank;
      const diff = Date.parse(a.startsAt) - Date.parse(b.startsAt);
      return a.state === "past" ? -diff : diff;
    });
}

export async function getEvent(slug: string) {
  return (await getEvents()).find((e) => e.slug === slug);
}

export const isUpcoming = (e: EventWithState) => e.state === "upcoming" || e.state === "live";
