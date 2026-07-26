import { curriculumCatalog } from "@/lib/curriculum/catalog";
import { pythonDiagnosticQuestions } from "@/lib/diagnostics/questions";
import { openChapters, tracks } from "@/lib/content";

/**
 * Hero product panel with verified product facts only —
 * chapters, tracks, and published curriculum items. No invented student metrics.
 */
export function ProductDashboardPreview({ compact = false }: { compact?: boolean }) {
  const materialCount = curriculumCatalog.length;
  const diagnosticCount = pythonDiagnosticQuestions.length;

  return (
    <div
      className={`product-preview overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] shadow-[0_28px_80px_rgba(15,23,42,0.08)] ${
        compact ? "rounded-md" : "rounded-[1.25rem]"
      }`}
      aria-label="Syntaxia product overview"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <p className="ml-2 text-xs font-semibold text-[var(--muted)]">Syntaxia · program console</p>
        </div>
        <p className="rounded-full bg-[rgba(var(--brand-rgb),0.1)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
          Live product
        </p>
      </div>

      <div className={`grid gap-3 p-4 ${compact ? "" : "sm:grid-cols-[1.05fr_0.95fr]"}`}>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="School chapters" value={String(openChapters.length)} hint="BISV · Lynbrook · Harker" />
          <Metric label="Curriculum tracks" value={String(tracks.length)} hint="L1 · L2 · L3" />
          <Metric label="Materials published" value={String(materialCount)} hint="In-app APSDS catalog" />
          <Metric
            label="Placement diagnostic"
            value={String(diagnosticCount)}
            hint="Python foundations questions"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex-1 border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">Tracks</p>
            <div className="mt-3 space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between gap-2 border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: track.accent }}
                      aria-hidden
                    />
                    <span className="text-sm font-semibold text-[var(--ink)]">
                      {track.level} · {track.name}
                    </span>
                  </div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                    Live
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="border-t border-[var(--line)] px-4 py-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
            What instructors operate
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "Diagnostic placement → L1 / L2 / L3",
              "Curriculum + visibility controls",
              "Code submit · misconception tags",
              "Cohorts · attendance · interventions",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Student counts and submission totals appear after your chapter is active — we only show
            verified product facts here.
          </p>
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
      <p className="mt-1 text-[0.7rem] leading-snug text-[var(--muted)]">{hint}</p>
    </div>
  );
}
