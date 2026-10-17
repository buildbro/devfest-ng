import type { EventState } from "@/lib/schema";

const STYLES: Record<EventState, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200" },
  live: { label: "Happening now", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200" },
  past: { label: "Past", className: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  postponed: { label: "Postponed", className: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" },
};

export function StatusBadge({ state }: { state: EventState }) {
  const { label, className } = STYLES[state];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>;
}

export function SampleBadge() {
  return (
    <span className="rounded-full border border-dashed border-neutral-400 px-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
      Sample data
    </span>
  );
}
