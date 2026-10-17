import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About this unofficial DevFest Nigeria directory and how to contribute events or corrections.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 leading-7">
      <h1 className="text-3xl font-bold tracking-tight">About this site</h1>
      <p>
        DevFest Nigeria is a community-run directory of GDG DevFest events across Nigeria. It is <strong>unofficial</strong>: it is not
        affiliated with, endorsed by or sponsored by Google or any GDG chapter. Always confirm details and RSVP on the organiser&apos;s official
        page.
      </p>

      <h2 id="contribute" className="pt-4 text-2xl font-semibold">
        Contribute an event or a correction
      </h2>
      <p>
        Every event is one JSON file in <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">content/events/2026/</code>. To add or
        fix an event, edit or add a file named after the event&apos;s slug (for example <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">devfest-lagos-2026.json</code>)
        and open a pull request. The build validates every file, so a missing or malformed field is caught before it goes live.
      </p>
      <p>Set <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">lastVerifiedAt</code> to the date you checked the details, and remove <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">&quot;sample&quot;: true</code> only for real events.</p>
    </div>
  );
}
