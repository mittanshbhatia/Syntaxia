"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type Cohort = { id: string; name: string; track: string };
type Meeting = { id: string; meeting_date: string; label: string | null };
type Member = { id: string; email: string | null; display_name: string | null };
type RecordRow = {
  id: string;
  meeting_id: string;
  user_id: string;
  status: "present" | "late" | "absent" | "excused";
  note: string | null;
};

const STATUSES = ["present", "late", "absent", "excused"] as const;

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
  const [members, setMembers] = useState<Member[]>([]);
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState("Weekly meeting");
  const [draft, setDraft] = useState<Record<string, (typeof STATUSES)[number]>>({});
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

  async function reloadAttendance(nextCohortId: string) {
    const res = await fetch(`/api/attendance?cohortId=${encodeURIComponent(nextCohortId)}`);
    const data = (await res.json()) as {
      meetings?: Meeting[];
      records?: RecordRow[];
      members?: Member[];
    };
    const nextMeetings = data.meetings ?? [];
    setMeetings(nextMeetings);
    setRecords(data.records ?? []);
    setMembers(data.members ?? []);
    setSelectedMeetingId((prev) => {
      if (prev && nextMeetings.some((m) => m.id === prev)) return prev;
      return nextMeetings[0]?.id ?? null;
    });
  }

  useEffect(() => {
    if (!cohortId) {
      setMeetings([]);
      setRecords([]);
      setMembers([]);
      setSelectedMeetingId(null);
      return;
    }
    void reloadAttendance(cohortId);
  }, [cohortId]);

  useEffect(() => {
    if (!selectedMeetingId) {
      setDraft({});
      return;
    }
    const next: Record<string, (typeof STATUSES)[number]> = {};
    for (const m of members) {
      const existing = records.find((r) => r.meeting_id === selectedMeetingId && r.user_id === m.id);
      if (existing) next[m.id] = existing.status;
    }
    setDraft(next);
  }, [selectedMeetingId, members, records]);

  const selectedMeeting = useMemo(
    () => meetings.find((m) => m.id === selectedMeetingId) ?? null,
    [meetings, selectedMeetingId],
  );

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
      setMessage("Meeting saved. Mark each student below.");
      await reloadAttendance(cohortId);
      if (data.meeting) setSelectedMeetingId(data.meeting.id);
    });
  }

  function saveRoster() {
    if (!cohortId || !selectedMeeting) return;
    startTransition(async () => {
      setMessage(null);
      const bodyRecords = Object.entries(draft).map(([userId, status]) => ({
        userId,
        status,
      }));
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cohortId,
          meetingDate: selectedMeeting.meeting_date,
          label: selectedMeeting.label ?? undefined,
          records: bodyRecords,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMessage(data.error ?? "Could not save attendance.");
        return;
      }
      setMessage("Attendance saved.");
      await reloadAttendance(cohortId);
    });
  }

  return (
    <section className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] p-6 text-left shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <p className="eyebrow eyebrow-left">Attendance</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">Meeting roster</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Create a meeting, then mark present / late / absent / excused for approved chapter members.
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
            <div className="mt-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                Meetings
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {meetings.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMeetingId(m.id)}
                    className={`border px-3 py-2 text-sm transition ${
                      selectedMeetingId === m.id
                        ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.08)] font-semibold text-[var(--ink)]"
                        : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-2)]"
                    }`}
                  >
                    {m.meeting_date}
                    {m.label ? ` · ${m.label}` : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">No meetings recorded for this cohort.</p>
          )}

          {selectedMeeting ? (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Roster · {selectedMeeting.meeting_date}
                </p>
                {canEdit && members.length ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-no-glow"
                    disabled={pending || !Object.keys(draft).length}
                    onClick={saveRoster}
                  >
                    {pending ? "Saving…" : "Save attendance"}
                  </button>
                ) : null}
              </div>

              {!members.length ? (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  No approved chapter members yet. Approve students in Admin to build the roster.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {members.map((m) => {
                    const name = m.display_name?.trim() || m.email || "Student";
                    const status = draft[m.id];
                    return (
                      <li
                        key={m.id}
                        className="flex flex-col gap-2 border border-[var(--line)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{name}</p>
                          {m.email && m.display_name ? (
                            <p className="text-xs text-[var(--muted)]">{m.email}</p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              disabled={!canEdit || pending}
                              onClick={() => setDraft((prev) => ({ ...prev, [m.id]: s }))}
                              className={`rounded-md border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider transition ${
                                status === s
                                  ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.12)] text-[var(--brand)]"
                                  : "border-[var(--line)] text-[var(--muted)]"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : null}
        </>
      )}

      {message ? <p className="mt-4 text-sm text-[var(--brand-soft)]">{message}</p> : null}
    </section>
  );
}
