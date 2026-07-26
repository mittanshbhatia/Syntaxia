"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductDashboardPreview } from "@/components/ProductDashboardPreview";

type Role = "student" | "instructor" | "director";

const roles: { id: Role; label: string; blurb: string }[] = [
  {
    id: "student",
    label: "Student demo",
    blurb: "Assigned track, lesson, submission, progress, and hint history.",
  },
  {
    id: "instructor",
    label: "Instructor demo",
    blurb: "Progress, misconceptions, pending submissions, and intervention queue.",
  },
  {
    id: "director",
    label: "Program-director demo",
    blurb: "Chapters, cohorts, instructors, memberships, billing, and org analytics.",
  },
];

export default function DemoPage() {
  const [role, setRole] = useState<Role>("instructor");
  const panel = useMemo(() => {
    if (role === "student") return <StudentDemo />;
    if (role === "director") return <DirectorDemo />;
    return <InstructorDemo />;
  }, [role]);

  return (
    <main className="container py-14 sm:py-20">
      <div className="max-w-3xl text-left">
        <p className="eyebrow eyebrow-left">Live demo</p>
        <h1 className="display mt-4 text-4xl text-[var(--ink)] sm:text-5xl">
          Try Syntaxia without creating an account.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Synthetic data only. No email verification, chapter request, or approval wait. Demo resets
          periodically.
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`border p-4 text-left transition ${
              role === r.id
                ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.08)]"
                : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-2)]"
            }`}
          >
            <p className="font-semibold text-[var(--ink)]">{r.label}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{r.blurb}</p>
          </button>
        ))}
      </div>

      <div className="mt-8">{panel}</div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/start" className="btn btn-primary">
          Start a pilot
        </Link>
        <Link href="/pricing" className="btn btn-ghost">
          View pricing
        </Link>
      </div>
    </main>
  );
}

function StudentDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <Card title="Placement">
          <p className="display text-3xl text-[var(--ink)]">L1 · Foundations</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Starting lesson: Variables & types · Confidence 74%</p>
        </Card>
        <Card title="Progress">
          <Row label="Lessons completed" value="6 / 18" />
          <Row label="Assignments passed" value="4 / 7" />
          <Row label="Hints used" value="3" />
        </Card>
      </div>
      <Card title="Current assignment · Sum to n">
        <pre className="overflow-x-auto border border-[var(--line)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--ink)]">{`def sum_to(n):
    total = 0
    for i in range(1, n):  # off-by-one
        total += i
    return total
`}</pre>
        <p className="mt-3 text-sm text-[#b45309]">Tests 2/4 failed · category: loop boundaries</p>
        <div className="mt-4 border border-[var(--line)] bg-[var(--surface)] p-3 text-sm">
          <p className="font-semibold text-[var(--ink)]">Hint history</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[var(--muted)]">
            <li>What did you expect `range(1, n)` to include?</li>
            <li>Failing category: off-by-one on the upper bound.</li>
            <li>Look at the end of your loop range.</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}

function InstructorDemo() {
  return (
    <div className="space-y-4">
      <ProductDashboardPreview />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pending submissions">
          <Row label="L1 · Loops quiz" value="9 waiting" />
          <Row label="L2 · Lists project" value="4 waiting" />
          <Row label="L3 · Recursion warmup" value="2 waiting" />
        </Card>
        <Card title="Curriculum controls">
          <Row label="Published this week" value="Loops · Part 2" />
          <Row label="Visible to L1 only" value="Yes" />
          <Row label="Answers unlocked for staff" value="Yes" />
        </Card>
      </div>
    </div>
  );
}

function DirectorDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Chapters">
        <Row label="BISV" value="Active" />
        <Row label="Lynbrook" value="Active" />
        <Row label="Harker" value="Active" />
      </Card>
      <Card title="Cohorts">
        <Row label="BISV · L1 Fall 2026" value="28 students" />
        <Row label="BISV · L2 Fall 2026" value="19 students" />
        <Row label="Lynbrook · L1" value="22 students" />
      </Card>
      <Card title="Organization">
        <Row label="Instructors" value="6" />
        <Row label="Membership approvals" value="5 pending" />
        <Row label="Plan" value="Community (APSDS)" />
        <Row label="Billing" value="N/A · flagship program" />
      </Card>
      <div className="lg:col-span-3">
        <Card title="Org analytics (synthetic)">
          <div className="grid gap-3 sm:grid-cols-4">
            <Metric value="84" label="Active students" />
            <Metric value="61%" label="Weekly active" />
            <Metric value="146" label="Submissions / week" />
            <Metric value="8" label="Need support" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-5 text-left">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2 text-sm last:border-0">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium text-[var(--ink)]">{value}</span>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--bg)] p-4">
      <p className="display text-3xl text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
