import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardMaterials } from "@/components/DashboardMaterials";
import { SegmentedChapterControl } from "@/components/SegmentedChapterControl";
import { SignOutButton } from "@/components/SignOutButton";
import {
  canManageVisibility,
  getMemberChapters,
  getProfile,
  getSessionUser,
  getStaffRoles,
  hasAdminAccess,
} from "@/lib/auth";
import {
  getChapterVisibility,
  groupedVisibleMaterials,
  isMaterialVisible,
} from "@/lib/visibility";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "APSDS member dashboard.",
};

type Props = {
  searchParams: Promise<{ chapter?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/sign-in?next=/dashboard");

  const profile = await getProfile();
  const memberChapters = await getMemberChapters(user.id);
  if (!memberChapters.length) {
    redirect("/members");
  }

  const params = await searchParams;
  const selected =
    memberChapters.find((c) => c.slug === params.chapter) ?? memberChapters[0];

  const admin = await hasAdminAccess(user.id);
  const staff = await getStaffRoles(user.id);
  const isStaffViewer =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === selected.id);
  const canControl = await canManageVisibility(user.id, selected.id);
  const visibility = await getChapterVisibility(selected.id);
  const groups = groupedVisibleMaterials(visibility, isStaffViewer).filter(
    (group) => group.materials.length > 0,
  );
  const materials = groups.flatMap((group) => group.materials);
  const hiddenMaterialIds = materials
    .filter((material) => isStaffViewer && !isMaterialVisible(material, visibility, false))
    .map((material) => material.id);

  return (
    <main className="container py-16 sm:py-24">
      {admin ? (
        <div className="admin-access-banner mb-8">
          Your account has admin access. Click{" "}
          <Link href="/admin" className="font-semibold underline underline-offset-4 decoration-2">
            here
          </Link>{" "}
          to see more.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow eyebrow-left">Dashboard</p>
        <div className="flex flex-wrap gap-2">
          {canControl ? (
            <Link
              href="/admin#visibility"
              className="btn btn-primary btn-no-glow px-4 py-2 text-sm"
            >
              Control member visibility
            </Link>
          ) : null}
          <Link
            href={`/dashboard/program?chapter=${selected.slug}`}
            className="btn btn-ghost px-4 py-2 text-sm"
          >
            Placement & cohorts
          </Link>
          <SignOutButton />
        </div>
      </div>

      <h1 className="display section-title mt-6 text-5xl text-[var(--ink)]">
        {selected.short_name}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">{selected.name}</p>
      <p className="mx-auto mt-2 text-center text-sm text-[var(--muted)]">
        Signed in as{" "}
        <span className="text-[var(--ink)]">{profile?.email ?? user.email}</span>
        {staff.length ? " · Chapter staff" : ""}
        {profile?.global_role === "executive" ? " · Executive" : ""}
        {isStaffViewer ? " · Viewing all materials" : " · Viewing unhidden materials"}
      </p>

      <div className="mt-6 flex justify-center">
        <SegmentedChapterControl
          chapters={memberChapters}
          selectedSlug={selected.slug}
          basePath="/dashboard"
        />
      </div>

      {materials.length ? (
        <DashboardMaterials
          materials={materials}
          chapterSlug={selected.slug}
          isStaffViewer={isStaffViewer}
          hiddenMaterialIds={hiddenMaterialIds}
        />
      ) : (
        <p className="mx-auto mt-14 max-w-xl text-center text-sm text-[var(--muted)]">
          No materials are visible for this chapter yet. Executives and chapter directors can
          unhide items in Admin → Member visibility.
        </p>
      )}
    </main>
  );
}
