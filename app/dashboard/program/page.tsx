import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AttendancePanel } from "@/components/AttendancePanel";
import { CohortManager } from "@/components/CohortManager";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { InterventionQueue } from "@/components/InterventionQueue";
import { MasteryPanel } from "@/components/MasteryPanel";
import { PlacementOverridePanel } from "@/components/PlacementOverridePanel";
import { SegmentedChapterControl } from "@/components/SegmentedChapterControl";
import {
  canManageVisibility,
  getMemberChapters,
  getSessionUser,
  getStaffRoles,
  getProfile,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Program tools",
  description: "Diagnostics, placement, cohorts, attendance, and interventions.",
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
  const profile = await getProfile();
  const staff = await getStaffRoles(user.id);
  const isStaffViewer =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === selected.id);

  return (
    <main className="container py-16 sm:py-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow eyebrow-left">Program</p>
        <Link href={`/dashboard?chapter=${selected.slug}`} className="btn btn-ghost px-4 py-2 text-sm">
          Back to materials
        </Link>
      </div>
      <h1 className="display mt-6 text-left text-4xl text-[var(--ink)] sm:text-5xl">
        {selected.short_name} · placement & operations
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Diagnostic placement, cohorts, attendance meetings, and an intervention queue fed by real
        chapter activity.
      </p>

      <div className="mt-6 flex justify-center sm:justify-start">
        <SegmentedChapterControl
          chapters={memberChapters}
          selectedSlug={selected.slug}
          basePath="/dashboard/program"
        />
      </div>

      <div className="mt-10 space-y-8">
        <DiagnosticQuiz chapterId={selected.id} />
        <MasteryPanel chapterId={selected.id} staffView={false} />
        {isStaffViewer ? (
          <>
            <MasteryPanel chapterId={selected.id} staffView />
            <InterventionQueue chapterId={selected.id} chapterSlug={selected.slug} />
          </>
        ) : null}
        {canEdit ? <PlacementOverridePanel chapterId={selected.id} /> : null}
        <CohortManager chapterId={selected.id} canEdit={canEdit} />
        <AttendancePanel chapterId={selected.id} canEdit={canEdit} />
      </div>
    </main>
  );
}
