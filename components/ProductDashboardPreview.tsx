import { openChapters } from "@/lib/content";

/** Honest product chrome — empty states and verified chapter count only. No invented metrics. */
export function ProductDashboardPreview({ compact = false }: { compact?: boolean }) {
  const chapterCount = openChapters.length;

  return (
    <div
      className={`product-preview overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] shadow-[0_28px_80px_rgba(15,23,42,0.08)] ${
        compact ? "rounded-md" : "rounded-[1.25rem]"
      }`}
      aria-label="Instructor dashboard preview"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <p className="ml-2 text-xs font-semibold text-[var(--muted)]">Instructor dashboard</p>
        </div>
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">Live product UI</p>
      </div>

      <div className={`grid gap-3 p-4 ${compact ? "" : "sm:grid-cols-[1.1fr_0.9fr]"}`}>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Active students" value="—" hint="Appears after members join" />
          <Metric label="School chapters" value={String(chapterCount)} hint="Verified campuses" />
          <Metric label="Submitted today" value="—" hint="From real submissions" />
          <Metric label="Need intervention" value="—" hint="From failing work" />
        </div>

        <div className="border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
            Misconception feed
          </p>
          <p className="mt-3 text-sm font-semibold text-[var(--ink)]">No tagged submissions yet</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            When students submit code, Syntaxia classifies common errors such as loop boundaries and
            off-by-one mistakes.
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full w-0 bg-[var(--brand)]" />
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="border-t border-[var(--line)] px-4 py-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
            Recent activity
          </p>
          <div className="mt-3 border border-dashed border-[var(--line)] bg-[var(--bg)] px-4 py-8 text-center">
            <p className="text-sm font-medium text-[var(--ink)]">Waiting for the first submission</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Activity from your chapter appears here — we do not invent sample students.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] p-3.5">
      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="display mt-2 text-3xl text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-[0.7rem] text-[var(--muted)]">{hint}</p>
    </div>
  );
}
