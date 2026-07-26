"use client";

import { useEffect, useState, useTransition } from "react";

type PlacementRow = {
  id: string;
  user_id: string;
  recommended_track: string;
  instructor_override_track: string | null;
  confidence: number;
  starting_lesson: string | null;
  email?: string | null;
  display_name?: string | null;
};

export function PlacementOverridePanel({ chapterId }: { chapterId: string }) {
  const [rows, setRows] = useState<PlacementRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/diagnostics/placements?chapterId=${encodeURIComponent(chapterId)}`);
      const data = (await res.json()) as { placements?: PlacementRow[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load placements.");
        return;
      }
      setRows(data.placements ?? []);
      setError(null);
    })();
  }, [chapterId]);

  function override(placementId: string, overrideTrack: "l1" | "l2" | "l3") {
    startTransition(async () => {
      const res = await fetch("/api/diagnostics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placementId, overrideTrack }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Override failed.");
        return;
      }
      const reload = await fetch(`/api/diagnostics/placements?chapterId=${encodeURIComponent(chapterId)}`);
      const next = (await reload.json()) as { placements?: PlacementRow[] };
      setRows(next.placements ?? []);
    });
  }

  return (
    <section className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] p-6 text-left shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <p className="eyebrow eyebrow-left">Staff</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">Placement overrides</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Review diagnostic recommendations and set the track students should follow.
      </p>

      {error ? <p className="mt-4 text-sm text-[#b45309]">{error}</p> : null}

      {rows.length ? (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="border border-[var(--line)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--ink)]">
                    {row.display_name || row.email || row.user_id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Recommended {row.recommended_track.toUpperCase()} · {row.confidence}% confidence
                    {row.starting_lesson ? ` · ${row.starting_lesson}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Active track:{" "}
                    {(row.instructor_override_track ?? row.recommended_track).toUpperCase()}
                    {row.instructor_override_track ? " (overridden)" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["l1", "l2", "l3"] as const).map((track) => (
                    <button
                      key={track}
                      type="button"
                      className="btn btn-ghost px-3 py-1.5 text-xs"
                      disabled={pending}
                      onClick={() => override(row.id, track)}
                    >
                      Set {track.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 border border-dashed border-[var(--line)] bg-[var(--bg)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--ink)]">No placements yet</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            When members complete the diagnostic, they appear here for override.
          </p>
        </div>
      )}
    </section>
  );
}
