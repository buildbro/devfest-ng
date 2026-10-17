import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="DevFest Nigeria home">
          <Image src="/img/logo.svg" alt="DevFest Nigeria" width={3800} height={1096} priority className="h-10 w-auto" />
        </Link>
        <nav className="flex gap-5 text-sm font-medium">
          <Link href="/events" className="hover:underline">
            Events
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          An unofficial community directory of DevFest events in Nigeria. Not affiliated with, endorsed by or sponsored by Google.
          Google, GDG and DevFest are trademarks of their respective owners.
        </p>
        <p>
          Spotted a mistake or have an event to add?{" "}
          <Link href="/about#contribute" className="underline">
            Tell us how to contribute
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
