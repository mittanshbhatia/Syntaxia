import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BootstrapExecutiveButton } from "@/components/BootstrapExecutiveButton";
import { MembershipActions } from "@/components/MembershipActions";
import { RoleManager } from "@/components/RoleManager";
import { SignOutButton } from "@/components/SignOutButton";
import { getProfile, getSessionUser, listChapters } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  description: "Syntaxia admin panel for executives and chapter directors.",
};

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/sign-in?next=/admin");

  const profile = await getProfile();
  const supabase = await createClient();
  const chapters = await listChapters();
  const chapterById = new Map(chapters.map((c) => [c.id, c]));

  const { data: myStaff } = await supabase
    .from("chapter_staff")
    .select("id, chapter_id, role")
    .eq("user_id", user.id);

  const staffChapterIds = (myStaff ?? []).map((row) => row.chapter_id as string);
  const isExecutive = profile?.global_role === "executive";
  const isDirector = (myStaff ?? []).some((row) => row.role === "director");
  const isInstructor = (myStaff ?? []).some((row) => row.role === "instructor");
  const canReview = isExecutive || isDirector;

  if (!isExecutive && staffChapterIds.length === 0) {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("global_role", "executive");

    if ((count ?? 0) > 0) {
      redirect("/");
    }

    return (
      <main className="container py-16 sm:py-20">
        <p className="eyebrow">Admin setup</p>
        <h1 className="display section-title mt-3 text-4xl text-[var(--ink)]">
          Claim executive access
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--muted)]">
          No executives exist yet. If this is first-time setup, claim executive access below, then
          assign chapter directors.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <BootstrapExecutiveButton />
        </div>
      </main>
    );
  }

  let membershipQuery = supabase
    .from("chapter_memberships")
    .select("id, status, requested_at, chapter_id, user_id")
    .order("requested_at", { ascending: false });

  if (!isExecutive) {
    membershipQuery = membershipQuery.in("chapter_id", staffChapterIds);
  }

  const { data: membershipRows } = await membershipQuery;
  const memberIds = Array.from(new Set((membershipRows ?? []).map((m) => m.user_id as string)));

  const { data: memberProfiles } = memberIds.length
    ? await supabase.from("profiles").select("id, email, display_name").in("id", memberIds)
    : { data: [] as { id: string; email: string | null; display_name: string | null }[] };

  const profileById = new Map((memberProfiles ?? []).map((p) => [p.id, p]));

  const membershipViews = (membershipRows ?? []).map((row) => ({
    id: row.id as string,
    status: row.status as string,
    requested_at: row.requested_at as string,
    chapter: chapterById.get(row.chapter_id as string) ?? null,
    profile: profileById.get(row.user_id as string) ?? null,
  }));

  const pendingCount = membershipViews.filter((m) => m.status === "pending").length;
  const visibleChapters = isExecutive
    ? chapters
    : chapters.filter((c) => staffChapterIds.includes(c.id));

  return (
    <main className="container py-16 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="w-full text-center">
          <h1 className="text-center text-4xl font-bold uppercase tracking-[0.22em] text-[var(--ink)] sm:text-6xl">
            Admin Panel
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted)]">
            {isExecutive
              ? "View every member profile, edit curriculum, and manage all chapters. Executives cannot be removed by chapter directors."
              : isDirector
                ? "View members in your chapter only. Approve students. Curriculum is read-only. You cannot remove executives or other directors."
                : "View members in your chapter only. Curriculum is read-only. Instructors cannot remove members or staff."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard" className="btn btn-ghost px-4 py-2 text-sm">
            Dashboard
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Chapters in view" value={String(visibleChapters.length)} />
        <Stat label="Memberships" value={String(membershipViews.length)} />
        <Stat label="Pending approvals" value={String(pendingCount)} />
      </div>

      {isExecutive ? (
        <section className="mt-14 space-y-10">
          <div>
            <p className="eyebrow">Chapters</p>
            <h2 className="display section-title mt-4 text-2xl text-[var(--ink)]">All campuses</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {chapters.map((chapter) => (
                <article key={chapter.id} className="rounded-[1.25rem] border border-[var(--line)] p-4 text-center">
                  <p className="display text-xl text-[var(--ink)]">{chapter.short_name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{chapter.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-[var(--brand-soft)]">
                    {chapter.status}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <RoleManager />
        </section>
      ) : null}

      <section className="mt-14">
        <p className="eyebrow">Membership</p>
        <h2 className="display section-title mt-4 text-2xl text-[var(--ink)]">Membership requests</h2>
        {!canReview && isInstructor ? (
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--muted)]">
            Instructors can view requests but cannot approve, reject, or remove members.
          </p>
        ) : null}
        <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-[var(--line)]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Chapter</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {membershipViews.map((row) => (
                <tr key={row.id} className="border-b border-[var(--line)] align-top">
                  <td className="px-4 py-3">
                    <p className="text-[var(--ink)]">{row.profile?.display_name ?? "-"}</p>
                    <p className="text-[var(--muted)]">{row.profile?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.chapter?.short_name}</td>
                  <td className="px-4 py-3 capitalize text-[var(--ink)]">{row.status}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(row.requested_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {canReview ? (
                      <MembershipActions membershipId={row.id} status={row.status} />
                    ) : (
                      <span className="text-[var(--muted)]">View only</span>
                    )}
                  </td>
                </tr>
              ))}
              {membershipViews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-[var(--muted)]">
                    No membership requests yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--line)] p-5 text-center">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="display mt-2 text-3xl text-[var(--ink)]">{value}</p>
    </div>
  );
}
