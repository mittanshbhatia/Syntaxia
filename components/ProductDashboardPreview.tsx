export function ProductDashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`product-preview overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] shadow-[0_24px_80px_rgba(0,0,0,0.12)] ${
        compact ? "rounded-md" : "rounded-lg"
      }`}
      aria-label="Synthetic instructor dashboard preview"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <p className="ml-2 text-xs font-semibold text-[var(--muted)]">Instructor dashboard · Demo org</p>
        </div>
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">Synthetic data</p>
      </div>

      <div className={`grid gap-3 p-4 ${compact ? "" : "sm:grid-cols-[1.1fr_0.9fr]"}`}>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Active students" value="84" />
          <Metric label="Cohorts" value="3" />
          <Metric label="Submitted today" value="17" />
          <Metric label="Need intervention" value="8" tone="warn" />
        </div>

        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
            Most common misconception
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--ink)]">Loop boundaries</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            8 students repeatedly fail off-by-one cases on `range()` and while-loop exits.
          </p>
          <div className="mt-3 h-2 overflow-hidden bg-[var(--line)]">
            <div className="h-full w-[68%] bg-[var(--brand)]" />
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="border-t border-[var(--line)] px-4 py-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
            Recent student activity
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            {[
              { who: "Student A", what: "Submitted L1 · Loops quiz", when: "2m ago" },
              { who: "Student B", what: "Requested hint · list indexing", when: "6m ago" },
              { who: "Student C", what: "Passed 4/5 tests · functions", when: "11m ago" },
              { who: "Student D", what: "Marked inactive · 2 absences", when: "18m ago" },
            ].map((row) => (
              <li
                key={row.who}
                className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0"
              >
                <span>
                  <span className="font-medium text-[var(--ink)]">{row.who}</span>
                  <span className="text-[var(--muted)]"> · {row.what}</span>
                </span>
                <span className="shrink-0 text-xs text-[var(--muted)]">{row.when}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) {
  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p
        className={`display mt-2 text-3xl ${tone === "warn" ? "text-[#b45309]" : "text-[var(--ink)]"}`}
      >
        {value}
      </p>
    </div>
  );
}
