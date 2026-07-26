"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductDashboardPreview } from "@/components/ProductDashboardPreview";
import { curriculumCatalog } from "@/lib/curriculum/catalog";
import { pythonDiagnosticQuestions } from "@/lib/diagnostics/questions";
import { openChapters, tracks } from "@/lib/content";

type Role = "student" | "instructor" | "director";

const roles: { id: Role; label: string; blurb: string }[] = [
  {
    id: "student",
    label: "Student view",
    blurb: "Placement diagnostic, leveled tracks, and the code workspace.",
  },
  {
    id: "instructor",
    label: "Instructor view",
    blurb: "Program console with verified product facts and teaching controls.",
  },
  {
    id: "director",
    label: "Program-director view",
    blurb: "Verified chapters, tracks, and ops tools you unlock after signing in.",
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
          Tour Syntaxia with real product facts.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Chapters, tracks, and curriculum counts are verified. Per-student activity appears after you
          sign in to a chapter — we do not invent it for the tour.
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
          <p className="display text-3xl text-[var(--ink)]">
            {pythonDiagnosticQuestions.length}-question diagnostic
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Python foundations → recommended L1 / L2 / L3 after you join a chapter.
          </p>
        </Card>
        <Card title="Tracks">
          {tracks.map((t) => (
            <Row key={t.id} label={`${t.level} · ${t.name}`} value="Available" />
          ))}
        </Card>
      </div>
      <Card title="Code workspace">
        <pre className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--ink)]">{`# Monaco editor in dashboard materials
# Run Python in-browser · Submit · misconception tags
`}</pre>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Open any code assignment after signing in to write, run, and submit real work.
        </p>
      </Card>
    </div>
  );
}

function InstructorDemo() {
  return (
    <div className="space-y-4">
      <ProductDashboardPreview />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Teaching surfaces">
          <Row label="Materials catalog" value={`${curriculumCatalog.length} items`} />
          <Row label="Visibility controls" value="Admin" />
          <Row label="Intervention queue" value="Program tools" />
        </Card>
        <Card title="Next actions">
          <Row label="Approve members" value="Admin" />
          <Row label="Create cohort" value="Program tools" />
          <Row label="Take attendance" value="Program tools" />
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
          <Row key={c.id} label={c.shortName} value="Open" />
        ))}
      </Card>
      <Card title="Tracks">
        {tracks.map((t) => (
          <Row key={t.id} label={t.level} value={t.name} />
        ))}
      </Card>
      <Card title="Organization">
        <Row label="Flagship program" value="APSDS" />
        <Row label="Platform" value="Syntaxia" />
        <Row label="Billing" value="Pricing page" />
      </Card>
      <div className="lg:col-span-3">
        <Card title="Verified product counts">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric value={String(openChapters.length)} label="School chapters" />
            <Metric value={String(tracks.length)} label="Curriculum tracks" />
            <Metric value={String(curriculumCatalog.length)} label="Materials published" />
          </div>
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
