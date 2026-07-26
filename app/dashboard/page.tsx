import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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
          <SignOutButton />
        </div>
      </div>

      <h1 className="display section-title mt-6 text-5xl text-[var(--ink)]">
        {selected.short_name}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">{selected.name}</p>
      <p className="mx-auto mt-2 text-center text-sm text-[var(--muted)]">
        Signed in as {profile?.email ?? user.email}
        {staff.length ? " · Chapter staff" : ""}
        {profile?.global_role === "executive" ? " · Executive" : ""}
        {isStaffViewer ? " · Viewing all materials" : " · Viewing unhidden materials"}
      </p>

      {memberChapters.length > 1 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {memberChapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/dashboard?chapter=${chapter.slug}`}
              className={`btn px-3 py-2 text-xs ${
                chapter.id === selected.id ? "btn-primary btn-no-glow" : "btn-ghost"
              }`}
            >
              {chapter.short_name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-14 space-y-14">
        {groups.map((group) => (
          <section key={group.section} id={group.section}>
            <div className="eyebrow-center">
              <p className="eyebrow">{SECTION_META[group.section].label}</p>
            </div>
            <h2 className="display section-title mt-4 text-3xl text-[var(--ink)]">
              {SECTION_META[group.section].label}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[var(--muted)]">
              {SECTION_META[group.section].description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.materials.map((material) => {
                const memberCanSee = isMaterialVisible(material, visibility, false);
                const hiddenFromMembers = isStaffViewer && !memberCanSee;
                const href = `/dashboard/materials/${material.id}?chapter=${selected.slug}`;

                return (
                  <Link
                    key={material.id}
                    href={href}
                    className="material-card group block border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[rgba(var(--brand-rgb),0.45)] hover:bg-[var(--surface-2)]"
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
                    <p className="mt-4 text-sm font-semibold text-[var(--brand-soft)] group-hover:underline">
                      View material →
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {!groups.length ? (
          <p className="mx-auto max-w-xl text-center text-sm text-[var(--muted)]">
            No materials are visible for this chapter yet. Executives and chapter directors can
            unhide items in Admin → Member visibility.
          </p>
        ) : null}
      </div>
    </main>
  );
}
