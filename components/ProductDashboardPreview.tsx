import { curriculumCatalog } from "@/lib/curriculum/catalog";
import { pythonDiagnosticQuestions } from "@/lib/diagnostics/questions";
import { openChapters, tracks } from "@/lib/content";

/**
 * Hero product panel with verified product facts only , 
 * chapters, tracks, and published curriculum items. No invented student metrics.
 */
export function ProductDashboardPreview({ compact = false }: { compact?: boolean }) {
  const materialCount = curriculumCatalog.length;
  const diagnosticCount = pythonDiagnosticQuestions.length;

  return (
    <div
      className={`product-preview overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] ${
        compact ? "" : ""
      }`}
      aria-label="Syntaxia product overview"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#ff5f57]" />
          <span className="h-2 w-2 bg-[#febc2e]" />
          <span className="h-2 w-2 bg-[#28c840]" />
          <p className="ml-2 text-xs font-semibold text-[var(--muted)]">Syntaxia · program console</p>
        </div>
        <p className="bg-[rgba(var(--brand-rgb),0.12)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
          Live product
        </p>
      </div>

      <div className={`grid gap-0 ${compact ? "" : "sm:grid-cols-[1fr_1.05fr]"}`}>
        <div className="border-b border-[var(--line)] p-4 sm:border-b-0 sm:border-r">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
            Verified program surface
          </p>
          <div className="mt-4 space-y-4">
            <MetricRow label="School chapters" value={String(openChapters.length)} hint="BISV · Lynbrook · Harker" />
            <MetricRow label="Curriculum tracks" value={String(tracks.length)} hint="L1 · L2 · L3" />
            <MetricRow label="Materials published" value={String(materialCount)} hint="In-app APSDS catalog" />
            <MetricRow
              label="Placement questions"
              value={String(diagnosticCount)}
              hint="Python foundations diagnostic"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 border-b border-[var(--line)] p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
              Tracks live today
            </p>
            <div className="mt-3 space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between gap-2 border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2"
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

          {!compact ? (
            <div className="p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                Instructor loop
              </p>
              <ol className="mt-3 space-y-2 text-sm text-[var(--ink)]">
                <li>1. Place with diagnostic + override</li>
                <li>2. Publish materials by visibility</li>
                <li>3. Review submissions & tags</li>
                <li>4. Mark attendance · clear interventions</li>
              </ol>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="mt-0.5 text-[0.7rem] text-[var(--muted)]">{hint}</p>
      </div>
      <p className="display text-3xl text-[var(--ink)]">{value}</p>
    </div>
  );
}
