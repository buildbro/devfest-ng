import Image from "next/image";
import type { DevFestEvent } from "@/lib/schema";

// Shows the cover photo, or the official DevFest logo with the event's city name.
export function EventCover({
  event,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  event: Pick<DevFestEvent, "slug" | "city" | "coverImage">;
  priority?: boolean;
  sizes?: string;
}) {
  if (event.coverImage) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={event.coverImage.src}
          alt={event.coverImage.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/covers/${event.slug}.svg`}
        alt={`DevFest ${event.city} 2026`}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
      />
    </div>
  );
}
