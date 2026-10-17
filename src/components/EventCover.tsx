import Image from "next/image";
import type { DevFestEvent } from "@/lib/schema";

const GRADIENTS = [
  "from-blue-500 to-indigo-700",
  "from-red-500 to-orange-600",
  "from-emerald-500 to-teal-700",
  "from-amber-400 to-orange-600",
];

function pick(slug: string) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

// Shows the cover photo, or a generated gradient with the city name when there isn't one yet.
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
        <Image src={event.coverImage.src} alt={event.coverImage.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div aria-hidden className={`flex aspect-[16/9] w-full items-end bg-gradient-to-br p-4 ${pick(event.slug)}`}>
      <span className="text-2xl font-bold tracking-tight text-white drop-shadow">{event.city}</span>
    </div>
  );
}
