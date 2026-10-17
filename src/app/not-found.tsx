import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">We couldn&apos;t find that page or event.</p>
      <Link href="/events" className="mt-6 inline-block rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
        Browse all events
      </Link>
    </div>
  );
}
