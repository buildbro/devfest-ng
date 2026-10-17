"use client";

import { useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  const id = setInterval(notify, 1000);
  return () => clearInterval(id);
};
const getNow = () => Math.floor(Date.now() / 1000);
const getServerNow = () => null;

export function Countdown({ target }: { target: string }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  // Reserve the space during prerender so the layout doesn't jump after hydration.
  if (now === null) return <div className="h-20" aria-hidden />;

  const left = Math.max(0, Date.parse(target) / 1000 - now);
  const parts = [
    ["Days", Math.floor(left / 86400)],
    ["Hours", Math.floor((left % 86400) / 3600)],
    ["Minutes", Math.floor((left % 3600) / 60)],
    ["Seconds", Math.floor(left % 60)],
  ] as const;

  return (
    <div className="flex gap-3" role="timer" aria-label="Time until the event starts">
      {parts.map(([label, value]) => (
        <div key={label} className="min-w-16 rounded-xl bg-white/15 px-3 py-2 text-center backdrop-blur">
          <div className="text-2xl font-bold tabular-nums">{String(value).padStart(2, "0")}</div>
          <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
        </div>
      ))}
    </div>
  );
}
