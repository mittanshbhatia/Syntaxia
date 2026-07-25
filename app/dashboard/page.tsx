import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { SignOutButton } from "@/components/SignOutButton";
import {
  getMemberChapters,
  getProfile,
  getSessionUser,
  getStaffRoles,
  hasAdminAccess,
} from "@/lib/auth";
import { dashboardSections } from "@/lib/content";

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
          <SignOutButton />
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

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardSections.map((section, index) => (
          <Reveal key={section} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
            <article className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-6 text-center">
              <h2 className="display text-2xl text-[var(--ink)]">{section}</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">Coming soon</p>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
