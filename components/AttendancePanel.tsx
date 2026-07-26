"use client";

import { useEffect, useState, useTransition } from "react";

type Cohort = { id: string; name: string; track: string };
type Meeting = { id: string; meeting_date: string; label: string | null };

export function AttendancePanel({
  chapterId,
  canEdit,
}: {
  chapterId: string;
  canEdit: boolean;
}) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState("Weekly meeting");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/cohorts?chapterId=${encodeURIComponent(chapterId)}`);
      const data = (await res.json()) as { cohorts?: Cohort[] };
      const list = data.cohorts ?? [];
      setCohorts(list);
      if (list[0]) setCohortId(list[0].id);
    })();
  }, [chapterId]);

  useEffect(() => {
    if (!cohortId) {
      setMeetings([]);
      return;
    }
    void (async () => {
      const res = await fetch(`/api/attendance?cohortId=${encodeURIComponent(cohortId)}`);
      const data = (await res.json()) as { meetings?: Meeting[] };
      setMeetings(data.meetings ?? []);
    })();
  }, [cohortId]);

  function createMeeting() {
    if (!cohortId) return;
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cohortId, meetingDate: date, label }),
      });
      const data = (await res.json()) as { error?: string; meeting?: Meeting };
      if (!res.ok) {
        setMessage(data.error ?? "Could not save meeting.");
        return;
      }
      setMessage("Meeting saved. Mark present / late / absent / excused next (per-student roster coming).");
      if (data.meeting) setMeetings((prev) => [data.meeting as Meeting, ...prev.filter((m) => m.id !== data.meeting!.id)]);
    });
  }

  return (
    <section className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] p-6 text-left shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <p className="eyebrow eyebrow-left">Attendance</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">Meeting history</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Create meetings per cohort. Status values supported: present, late, absent, excused.
      </p>

      {!cohorts.length ? (
        <p className="mt-6 text-sm text-[var(--muted)]">Create a cohort first to take attendance.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <select
              className="field"
              value={cohortId}
              onChange={(e) => setCohortId(e.target.value)}
            >
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.track})
                </option>
              ))}
            </select>
            <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input
              className="field sm:col-span-2"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Meeting label"
            />
            {canEdit ? (
              <button
                type="button"
                className="btn btn-primary btn-no-glow sm:col-span-2"
                disabled={pending}
                onClick={createMeeting}
              >
                {pending ? "Saving…" : "Save meeting"}
              </button>
            ) : null}
          </div>

          {meetings.length ? (
            <ul className="mt-6 space-y-2">
              {meetings.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between border border-[var(--line)] px-4 py-3 text-sm"
                >
                  <span className="font-medium text-[var(--ink)]">{m.meeting_date}</span>
                  <span className="text-[var(--muted)]">{m.label ?? "Meeting"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">No meetings recorded for this cohort.</p>
          )}
        </>
      )}

      {message ? <p className="mt-4 text-sm text-[var(--brand-soft)]">{message}</p> : null}
    </section>
  );
}
