import Image from "next/image";
import type { DevFestEvent } from "@/lib/schema";

export function Gallery({ photos, albumUrl }: { photos: DevFestEvent["gallery"]; albumUrl?: string }) {
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((p) => (
          <li key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
            {p.credit && (
              <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{p.credit}</span>
            )}
          </li>
        ))}
      </ul>
      {albumUrl && (
        <a href={albumUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-blue-700 underline dark:text-blue-300">
          See the full album →
        </a>
      )}
    </div>
  );
}
