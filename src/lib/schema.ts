import { z } from "zod";

const isoWithOffset = z.iso.datetime({ offset: true });

const media = z.object({
  src: z.string(),
  alt: z.string(),
  credit: z.string().optional(),
});

export const eventSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    title: z.string().min(1),
    chapter: z.object({ name: z.string(), url: z.url().optional() }),
    city: z.string().min(1),
    state: z.string().min(1),
    summary: z.string().min(1),
    startsAt: isoWithOffset,
    endsAt: isoWithOffset,
    venue: z.object({
      name: z.string(),
      address: z.string(),
      mapUrl: z.url().optional(),
    }),
    rsvpUrl: z.url().optional(),
    // Manual override; otherwise upcoming/live/past is derived from the dates.
    status: z.enum(["scheduled", "postponed", "cancelled"]).default("scheduled"),
    coverImage: media.optional(),
    gallery: z.array(media).default([]),
    albumUrl: z.url().optional(),
    videos: z
      .array(z.object({ youtubeId: z.string().regex(/^[\w-]{11}$/), title: z.string() }))
      .default([]),
    speakers: z
      .array(z.object({ name: z.string(), title: z.string().optional(), url: z.url().optional() }))
      .default([]),
    hashtag: z.string().optional(),
    lastVerifiedAt: z.iso.date(),
    // Placeholder entries that are not real events. Shown with a "Sample" badge.
    sample: z.boolean().default(false),
  })
  .refine((e) => new Date(e.endsAt) > new Date(e.startsAt), {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  });

export type DevFestEvent = z.infer<typeof eventSchema>;
export type EventState = "upcoming" | "live" | "past" | "postponed" | "cancelled";
export type EventWithState = DevFestEvent & { state: EventState };
