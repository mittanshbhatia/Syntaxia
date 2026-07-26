import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { SignOutButton } from "@/components/SignOutButton";
import {
  canManageVisibility,
  getMemberChapters,
  getProfile,
  getSessionUser,
  getStaffRoles,
  hasAdminAccess,
} from "@/lib/auth";
import { SECTION_META } from "@/lib/curriculum/catalog";
import { getChapterVisibility, groupedVisibleMaterials } from "@/lib/visibility";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "APSDS member dashboard.",
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/sign-in?next=/dashboard");

  const profile = await getProfile();
  const memberChapters = await getMemberChapters(user.id);
  if (!memberChapters.length) {
    redirect("/members");
  }

  const admin = await hasAdminAccess(user.id);
  const staff = await getStaffRoles(user.id);
  const primary = memberChapters[0];
  const isStaffViewer =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === primary.id);
  const canControl = await canManageVisibility(user.id, primary.id);
  const visibility = await getChapterVisibility(primary.id);
  const groups = groupedVisibleMaterials(visibility, isStaffViewer);

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

      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow eyebrow-left">Dashboard</p>
          <div className="flex flex-wrap gap-2">
            {canControl ? (
              <Link href="/admin#visibility" className="btn btn-primary btn-no-glow px-4 py-2 text-sm">
                Control member visibility
              </Link>
            ) : null}
            <SignOutButton />
          </div>
        </div>
        <h1 className="display section-title mt-6 text-5xl text-[var(--ink)]">
          {primary.short_name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">
          {primary.name}
          {memberChapters.length > 1
            ? ` · Also in ${memberChapters
                .slice(1)
                .map((c) => c.short_name)
                .join(", ")}`
            : ""}
        </p>
        <p className="mx-auto mt-2 text-center text-sm text-[var(--muted)]">
          Signed in as {profile?.email ?? user.email}
          {staff.length ? " · Chapter staff" : ""}
          {profile?.global_role === "executive" ? " · Executive" : ""}
        </p>
      </Reveal>

      <div className="mt-14 space-y-14">
        {groups.map((group) => (
          <section key={group.section} id={group.section}>
            <Reveal>
              <div className="eyebrow-center">
                <p className="eyebrow">{SECTION_META[group.section].label}</p>
              </div>
              <h2 className="display section-title mt-4 text-3xl text-[var(--ink)]">
                {SECTION_META[group.section].label}
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[var(--muted)]">
                {SECTION_META[group.section].description}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.materials.map((material, index) => {
                const hiddenFromMembers =
                  isStaffViewer &&
                  !(material.id in visibility.materials
                    ? visibility.materials[material.id]
                    : material.defaultVisible);
                return (
                  <Reveal key={material.id} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
                    <Link
                      href={`/dashboard/materials/${material.id}`}
                      className="block border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:bg-[var(--surface-2)]"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {material.track !== "all" ? (
                          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-soft)]">
                            {material.track.toUpperCase()}
                          </span>
                        ) : null}
                        {hiddenFromMembers ? (
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                            Hidden from members
                          </span>
                        ) : null}
                      </div>
                      <h3 className="display mt-2 text-xl text-[var(--ink)]">{material.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {material.summary}
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
              {!group.materials.length ? (
                <p className="text-sm text-[var(--muted)] sm:col-span-2 lg:col-span-3">
                  No items in this section yet.
                </p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
