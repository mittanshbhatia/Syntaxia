"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  kind: string;
  title: string;
  detail: string;
  href?: string;
};

export function InterventionQueue({ chapterId, chapterSlug }: { chapterId: string; chapterSlug: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/interventions?chapterId=${encodeURIComponent(chapterId)}`);
      const data = (await res.json()) as { items?: Item[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load interventions.");
        return;
      }
      setItems(data.items ?? []);
    })();
  }, [chapterId]);

  return (
    <section className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] p-6 text-left shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <p className="eyebrow eyebrow-left">Interventions</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">Action queue</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Built from real pending memberships and tagged code submissions — empty when nothing needs
        action.
      </p>

      {error ? <p className="mt-4 text-sm text-[#b45309]">{error}</p> : null}

      {items.length ? (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{item.detail}</p>
              </div>
              {item.href ? (
                <Link
                  href={item.href.includes("chapter=") ? `/dashboard?chapter=${chapterSlug}` : item.href}
                  className="btn btn-ghost px-3 py-2 text-xs"
                >
                  Open
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 border border-dashed border-[var(--line)] bg-[var(--bg)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--ink)]">Nothing in the queue</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Staff see membership requests and misconception tags here as they appear.
          </p>
        </div>
      )}
    </section>
  );
}
