"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductDashboardPreview } from "@/components/ProductDashboardPreview";
import { curriculumCatalog } from "@/lib/curriculum/catalog";
import { pythonDiagnosticQuestions } from "@/lib/diagnostics/questions";
import { openChapters, syntaxia, tracks } from "@/lib/content";

type Role = "student" | "instructor" | "director";

const roles: { id: Role; label: string; blurb: string }[] = [
  {
    id: "student",
    label: "Student",
    blurb: "Diagnostic → track → code workspace.",
  },
  {
    id: "instructor",
    label: "Instructor",
    blurb: "Program console and teaching controls.",
  },
  {
    id: "director",
    label: "Director",
    blurb: "Chapters, tracks, and org surface.",
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
          Walk the loop without invented students.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Chapters, tracks, and catalog counts are verified. Per-student activity only appears after you
          sign into a real chapter.
        </p>
      </div>

      <div className="mt-10 grid gap-2 sm:grid-cols-3">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`border p-5 text-left transition ${
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
        <Link href="/auth/sign-up" className="btn btn-primary">
          Create an account
        </Link>
        <a
          href={`mailto:${syntaxia.emails.founders}?subject=${encodeURIComponent("Syntaxia pilot")}`}
          className="btn btn-ghost"
        >
          Email founders
        </a>
        <Link href="/pricing" className="btn btn-ghost">
          View pricing
        </Link>
      </div>
    </main>
  );
}

function StudentDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Panel title="01 · Placement">
          <p className="display text-3xl text-[var(--ink)]">
            {pythonDiagnosticQuestions.length}-question diagnostic
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Python foundations → recommended L1 / L2 / L3 after you join a chapter. Instructors can
            override.
          </p>
        </Panel>
        <Panel title="02 · Tracks">
          {tracks.map((t) => (
            <Row key={t.id} label={`${t.level} · ${t.name}`} value="Available" />
          ))}
        </Panel>
      </div>
      <Panel title="03 · Code workspace">
        <pre className="overflow-x-auto border border-[var(--line)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--ink)]">{`# Monaco in dashboard materials
def solve(nums):
    # write · run (Pyodide) · submit
    return nums
`}</pre>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Open any code assignment after signing in to write, run in-browser, tag misconceptions, and
          submit.
        </p>
      </Panel>
    </div>
  );
}

function InstructorDemo() {
  return (
    <div className="space-y-6">
      <ProductDashboardPreview />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Teaching surfaces">
          <Row label="Materials catalog" value={`${curriculumCatalog.length} items`} />
          <Row label="Visibility controls" value="Admin" />
          <Row label="Intervention queue" value="Program tools" />
          <Row label="Attendance roster" value="Program tools" />
        </Panel>
        <Panel title="Weekly actions">
          <Row label="Approve members" value="Admin" />
          <Row label="Create cohort" value="Program tools" />
          <Row label="Override placement" value="Program tools" />
          <Row label="Take attendance" value="Program tools" />
        </Panel>
      </div>
    </div>
  );
}

function DirectorDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel title="Verified chapters">
        {openChapters.map((c) => (
          <Row key={c.id} label={c.shortName} value={c.name.includes("BASIS") ? "Founding" : "Open"} />
        ))}
      </Panel>
      <Panel title="Tracks">
        {tracks.map((t) => (
          <Row key={t.id} label={t.level} value={t.name} />
        ))}
      </Panel>
      <Panel title="Organization">
        <Row label="Flagship program" value="APSDS" />
        <Row label="Platform" value="Syntaxia" />
        <Row label="Billing" value="Pricing page" />
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-5 text-left">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2.5 text-sm last:border-0">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium text-[var(--ink)]">{value}</span>
    </div>
  );
}
