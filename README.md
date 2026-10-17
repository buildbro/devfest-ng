# devfest-ng

An unofficial landing page for GDG DevFest events in Nigeria (2026). Built with Next.js (App Router, Cache Components), TypeScript and Tailwind CSS.

Not affiliated with, endorsed by or sponsored by Google.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://devfest.ng`) in production for correct canonical, sitemap and calendar URLs.

## Adding or fixing an event

Each event is one JSON file: `content/events/<year>/<slug>.json`. The filename must match the `slug`. The schema is in
`src/lib/schema.ts` and is checked at build time, so a bad file fails the build instead of breaking a page.

- Upcoming / live / past is **derived from `startsAt` / `endsAt`** (Africa/Lagos time). Only set `status` to `postponed` or `cancelled` to override.
- Dates need a UTC offset, e.g. `2026-11-14T09:00:00+01:00`.
- Set `lastVerifiedAt` to the day you checked the details.
- Entries with `"sample": true` are placeholders and show a "Sample data" badge. **All current entries are samples**: replace them with real events and delete the flag.
- Photos: put 6–12 highlights in `gallery` (files in `public/` or Cloudinary URLs) and link the full album in `albumUrl`. Videos are YouTube IDs.

## Structure

```
content/events/2026/*.json     event data
src/lib/schema.ts              zod schema + types
src/lib/events.ts              load, validate, derive state (cached for 1 hour)
src/lib/dates.ts               Africa/Lagos date formatting
src/app/                       /, /events, /events/[slug], calendar.ics, about, sitemap, robots
src/components/                cards, filters, countdown, gallery, lite YouTube embed
```

## Notes

- Event state is computed inside a `'use cache'` function with `cacheLife('hours')`, so pages refresh hourly without a redeploy.
- `/events` filters (`?status=`, `?city=`) are client-side; the full list is in the static HTML for crawlers.
- Unknown event slugs show the 404 page with `noindex`, but the HTTP status is 200 once streaming starts (Next.js behavior with Cache Components).
