import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CohortManager } from "@/components/CohortManager";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import {
  canManageVisibility,
  getMemberChapters,
  getSessionUser,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Program tools",
  description: "Diagnostics, placement, and cohorts.",
};

type Props = {
  searchParams: Promise<{ chapter?: string }>;
};

export default async function ProgramPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/sign-in?next=/dashboard/program");

  const memberChapters = await getMemberChapters(user.id);
  if (!memberChapters.length) redirect("/members");

  const params = await searchParams;
  const selected =
    memberChapters.find((c) => c.slug === params.chapter) ?? memberChapters[0];
  const canEdit = await canManageVisibility(user.id, selected.id);

  return (
    <main className="container py-16 sm:py-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow eyebrow-left">Program</p>
        <Link href={`/dashboard?chapter=${selected.slug}`} className="btn btn-ghost px-4 py-2 text-sm">
          Back to materials
        </Link>
      </div>
      <h1 className="display mt-6 text-left text-4xl text-[var(--ink)] sm:text-5xl">
        {selected.short_name} · placement & cohorts
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Complete the diagnostic to get a track recommendation. Staff can create cohorts for weekly
        instruction and attendance.
      </p>

      {memberChapters.length > 1 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {memberChapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/dashboard/program?chapter=${chapter.slug}`}
              className={`btn px-3 py-2 text-xs ${
                chapter.id === selected.id ? "btn-primary btn-no-glow" : "btn-ghost"
              }`}
            >
              {chapter.short_name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-10 space-y-8">
        <DiagnosticQuiz chapterId={selected.id} />
        <CohortManager chapterId={selected.id} canEdit={canEdit} />
      </div>
    </main>
  );
}
