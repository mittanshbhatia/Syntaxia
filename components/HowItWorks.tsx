import { howItWorks } from "@/lib/content";

export function HowItWorks() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {howItWorks.map((step, index) => (
        <article key={step.id} className="border border-[var(--line)] bg-[var(--surface)] p-4 text-left">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
            Step {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="display mt-2 text-2xl text-[var(--ink)]">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
          <div className="mt-4 border border-[var(--line)] bg-[var(--bg)] p-3">
            <StepPreview kind={step.preview} />
          </div>
        </article>
      ))}
    </div>
  );
}

function StepPreview({ kind }: { kind: string }) {
  if (kind === "diagnostic") {
    return (
      <div className="space-y-2 text-xs">
        <p className="font-semibold text-[var(--ink)]">Q14 · Loops</p>
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
        <p className="text-[var(--muted)]">Recommended track</p>
        <p className="display text-xl text-[var(--ink)]">L1 · Foundations</p>
        <p className="text-[var(--muted)]">Start: Variables & types · Confidence 72%</p>
        <div className="h-1.5 bg-[var(--line)]">
          <div className="h-full w-[72%] bg-[var(--brand)]" />
        </div>
      </div>
    );
  }

  if (kind === "learn") {
    return (
      <div className="space-y-2 font-mono text-[0.7rem] text-[var(--ink)]">
        <p className="text-[var(--muted)]"># assignment.py</p>
        <p>def sum_to(n):</p>
        <p className="pl-3">total = 0</p>
        <p className="pl-3">for i in range(1, n):</p>
        <p className="pl-6">total += i</p>
        <p className="pl-3">return total</p>
        <p className="mt-2 text-[#b45309]">Tests 2/4 · loop boundary</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-xs">
      <p className="font-semibold text-[var(--ink)]">Intervention queue</p>
      {[
        "5 students · loop boundaries",
        "3 ready for L2 promotion",
        "2 inactive this week",
      ].map((item) => (
        <div key={item} className="flex items-center justify-between border border-[var(--line)] px-2 py-1">
          <span className="text-[var(--muted)]">{item}</span>
          <span className="font-semibold text-[var(--brand)]">Act</span>
        </div>
      ))}
    </div>
  );
}
