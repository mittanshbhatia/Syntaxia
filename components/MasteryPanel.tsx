"use client";

import { useEffect, useState } from "react";

type Row = {
  concept: string;
  mastery: number;
  updated_at?: string;
  user_id?: string;
  display_name?: string | null;
  email?: string | null;
};

export function MasteryPanel({
  chapterId,
  staffView,
}: {
  chapterId: string;
  staffView: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const scope = staffView ? "chapter" : "self";
      const res = await fetch(
        `/api/mastery?chapterId=${encodeURIComponent(chapterId)}&scope=${scope}`,
      );
      const data = (await res.json()) as { rows?: Row[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load mastery.");
        return;
      }
      setRows(data.rows ?? []);
      setError(null);
    })();
  }, [chapterId, staffView]);

  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-6 text-left sm:p-8">
      <p className="eyebrow eyebrow-left">Mastery</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">
        {staffView ? "Chapter concept mastery" : "Your concept mastery"}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Updated from diagnostics and graded code submissions. Empty until those events exist, we do
        not invent scores.
      </p>

      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}

      {!rows.length && !error ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          No mastery rows yet. Complete the placement diagnostic or Grade + Submit a Python Starter
          exercise.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => {
            const key = `${r.user_id ?? "self"}-${r.concept}`;
            const label = staffView
              ? `${r.display_name || r.email || "Student"} · ${r.concept}`
              : r.concept;
            return (
              <li key={key} className="border border-[var(--line)] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold capitalize text-[var(--ink)]">{label}</p>
                  <p className="display text-xl text-[var(--ink)]">{Math.round(Number(r.mastery))}</p>
                </div>
                <div className="mt-2 h-1.5 bg-[var(--line)]">
                  <div
                    className="h-full bg-[var(--brand)]"
                    style={{ width: `${Math.max(4, Math.min(100, Number(r.mastery)))}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
