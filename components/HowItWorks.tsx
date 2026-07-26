import { howItWorks } from "@/lib/content";

export function HowItWorks() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      {howItWorks.map((step, index) => (
        <article key={step.id} className="border-t border-[var(--line)] pt-5 text-left">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
            Step {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="display mt-3 text-2xl text-[var(--ink)]">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
          <div className="mt-4 border border-[var(--line)] bg-[var(--bg)] p-3">
            <StepPreview kind={step.preview} />
          </div>
        </article>
      ))}
    </div>
  );
}

/** UI chrome for the product loop — illustrative interface, not claimed live metrics. */
function StepPreview({ kind }: { kind: string }) {
  if (kind === "diagnostic") {
    return (
      <div className="space-y-2 text-xs">
        <p className="font-semibold text-[var(--ink)]">Sample question format</p>
        <p className="text-[var(--muted)]">What does `range(1, 5)` produce?</p>
        <div className="space-y-1">
          {["[1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4]"].map((opt, i) => (
            <div
              key={opt}
              className={`border px-2 py-1 ${i === 0 ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.08)]" : "border-[var(--line)]"}`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "placement") {
    return (
      <div className="space-y-2 text-xs">
        <p className="text-[var(--muted)]">Placement result fields</p>
        <p className="display text-xl text-[var(--ink)]">L1 · L2 · L3</p>
        <p className="text-[var(--muted)]">Track · starting lesson · confidence · strengths / weaknesses</p>
        <div className="h-1.5 bg-[var(--line)]">
          <div className="h-full w-1/3 bg-[var(--brand)]" />
        </div>
      </div>
    );
  }

  if (kind === "learn") {
    return (
      <div className="space-y-2 font-mono text-[0.7rem] text-[var(--ink)]">
        <p className="text-[var(--muted)]"># code workspace</p>
        <p>def solve(...):</p>
        <p className="pl-3">...</p>
        <p className="mt-2 text-[var(--muted)]">Run · Submit · misconception tags</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-xs">
      <p className="font-semibold text-[var(--ink)]">Intervention queue</p>
      <div className="border border-dashed border-[var(--line)] px-2 py-3 text-[var(--muted)]">
        Empty until real submissions and attendance need action
      </div>
    </div>
  );
}
