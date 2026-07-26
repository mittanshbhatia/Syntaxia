"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductDashboardPreview } from "@/components/ProductDashboardPreview";
import { openChapters } from "@/lib/content";

type Role = "student" | "instructor" | "director";

const roles: { id: Role; label: string; blurb: string }[] = [
  {
    id: "student",
    label: "Student view",
    blurb: "Placement, lessons, code workspace, and progress — empty until you join a chapter.",
  },
  {
    id: "instructor",
    label: "Instructor view",
    blurb: "Dashboard chrome for submissions, curriculum controls, and interventions.",
  },
  {
    id: "director",
    label: "Program-director view",
    blurb: "Verified chapters plus empty cohorts and analytics until you create them.",
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
        <p className="eyebrow eyebrow-left">Product tour</p>
        <h1 className="display mt-4 text-4xl text-[var(--ink)] sm:text-5xl">
          See the product surfaces — without invented numbers.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          This tour shows the real UI layout with empty states. Metrics fill in from your chapter after
          you sign in. No sample students or fake analytics.
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`rounded-[1rem] border p-5 text-left transition ${
              role === r.id
                ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.08)] shadow-[0_12px_40px_rgba(31,43,213,0.12)]"
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
        <Link href="/auth/sign-up" className="btn btn-primary">
          Create an account
        </Link>
        <Link href="/start" className="btn btn-ghost">
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
          <Empty
            title="No diagnostic yet"
            body="After you join a chapter, take the Python foundations diagnostic under Placement & cohorts."
          />
        </Card>
        <Card title="Progress">
          <Row label="Lessons completed" value="—" />
          <Row label="Assignments passed" value="—" />
          <Row label="Hints used" value="—" />
        </Card>
      </div>
      <Card title="Code workspace">
        <pre className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--muted)]">{`# Your assignment code appears here
# Monaco editor · submit · misconception tags
`}</pre>
        <Empty
          className="mt-4"
          title="No submission yet"
          body="Open a dashboard material with a code prompt to write and submit real work."
        />
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
          <Empty title="Queue empty" body="Student code submissions for your chapter show up here." />
        </Card>
        <Card title="Curriculum controls">
          <Row label="Visibility tools" value="Admin → Member visibility" />
          <Row label="Materials" value="Dashboard sections" />
          <Row label="Placement override" value="Coming with staff tools" />
        </Card>
      </div>
    </div>
  );
}

function DirectorDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Verified chapters">
        {openChapters.map((c) => (
          <Row key={c.id} label={c.shortName} value={c.status === "open" ? "Open" : c.status} />
        ))}
      </Card>
      <Card title="Cohorts">
        <Empty title="No cohorts yet" body="Create cohorts from Dashboard → Placement & cohorts after signing in as staff." />
      </Card>
      <Card title="Organization">
        <Row label="Plan" value="APSDS flagship / Community" />
        <Row label="Billing" value="Not connected yet" />
        <Row label="Approvals" value="Live in Admin" />
      </Card>
      <div className="lg:col-span-3">
        <Card title="Org analytics">
          <div className="grid gap-3 sm:grid-cols-4">
            <Metric value="—" label="Active students" />
            <Metric value="—" label="Weekly active" />
            <Metric value="—" label="Submissions / week" />
            <Metric value="—" label="Need support" />
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Analytics populate from real memberships, attendance, and submissions — never seeded samples.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] p-5 text-left shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Empty({
  title,
  body,
  className = "",
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={`border border-dashed border-[var(--line)] bg-[var(--bg)] px-4 py-6 text-center ${className}`}>
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{body}</p>
    </div>
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
    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
      <p className="display text-3xl text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
