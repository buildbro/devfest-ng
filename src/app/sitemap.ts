import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/events` },
    { url: `${SITE_URL}/about` },
    ...events.map((e) => ({ url: `${SITE_URL}/events/${e.slug}`, lastModified: e.lastVerifiedAt })),
  ];
}
