"use client";

import { useEffect, useState, useTransition } from "react";

type Cohort = {
  id: string;
  name: string;
  track: string;
  status: string;
  meeting_schedule: string | null;
  start_date: string | null;
  end_date: string | null;
  current_lesson: string | null;
};

export function CohortManager({
  chapterId,
  canEdit,
}: {
  chapterId: string;
  canEdit: boolean;
}) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [track, setTrack] = useState<"l1" | "l2" | "l3">("l1");
  const [schedule, setSchedule] = useState("Wed 3:30–4:30pm");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/cohorts?chapterId=${encodeURIComponent(chapterId)}`);
      const data = (await res.json()) as { cohorts?: Cohort[]; error?: string };
      setCohorts(data.cohorts ?? []);
      if (data.error) setError(data.error);
    })();
  }, [chapterId]);

  function create() {
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          name,
          track,
          meetingSchedule: schedule,
        }),
      });
      const data = (await res.json()) as { error?: string; cohort?: Cohort };
      if (!res.ok) {
        setError(data.error ?? "Could not create cohort.");
        return;
      }
      setName("");
      if (data.cohort) setCohorts((prev) => [data.cohort as Cohort, ...prev]);
      else {
        const reload = await fetch(`/api/cohorts?chapterId=${encodeURIComponent(chapterId)}`);
        const next = (await reload.json()) as { cohorts?: Cohort[] };
        setCohorts(next.cohorts ?? []);
      }
    });
  }

  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-6 text-left sm:p-8">
      <p className="eyebrow eyebrow-left">Cohorts</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">Instructional groups</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Smaller units inside a chapter, e.g. BISV · L1 Foundations · Fall 2026.
      </p>

      {cohorts.length ? (
        <ul className="mt-6 space-y-3">
          {cohorts.map((c) => (
            <li key={c.id} className="border border-[var(--line)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[var(--ink)]">{c.name}</p>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                  {c.track} · {c.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {c.meeting_schedule ?? "Schedule TBD"}
                {c.current_lesson ? ` · Current: ${c.current_lesson}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-[var(--muted)]">No cohorts yet.</p>
      )}

      {canEdit ? (
        <div className="mt-6 grid gap-3 border border-[var(--line)] p-4 sm:grid-cols-2">
          <input
            className="field"
            placeholder="BISV · L1 Foundations · Fall 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="field"
            value={track}
            onChange={(e) => setTrack(e.target.value as "l1" | "l2" | "l3")}
          >
            <option value="l1">L1 Foundations</option>
            <option value="l2">L2 Practical</option>
            <option value="l3">L3 Advanced</option>
          </select>
          <input
            className="field sm:col-span-2"
            placeholder="Meeting schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary btn-no-glow sm:col-span-2"
            disabled={pending || !name.trim()}
            onClick={create}
          >
            {pending ? "Creating…" : "Create cohort"}
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-[#b45309]">{error}</p> : null}
    </section>
  );
}
