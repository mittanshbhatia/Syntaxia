import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CurriculumPanel } from "@/components/CurriculumPanel";
import { Reveal } from "@/components/Reveal";
import { SignOutButton } from "@/components/SignOutButton";
import {
  getApprovedChapterAccess,
  getChapterDirectory,
  getProfile,
  getSessionUser,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "APSDS member dashboard.",
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/sign-in?next=/dashboard");

  const profile = await getProfile();
  const access = await getApprovedChapterAccess(user.id);
  if (!access.length) {
    redirect("/members");
  }

  const isExecutive = profile?.global_role === "executive";
  const directories = await Promise.all(
    access.map(async (entry) => ({
      ...entry,
      members: await getChapterDirectory(entry.chapter.id, user.id),
    })),
  );

  return (
    <main className="container py-16 sm:py-24">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">Member dashboard</p>
          <SignOutButton />
        </div>
        <h1 className="display section-title mt-6 text-5xl text-[var(--ink)]">Welcome back</h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">
          Signed in as {profile?.email ?? user.email}
        </p>
      </Reveal>

      <div className="mt-12 space-y-10">
        {directories.map((entry) => (
          <Reveal key={entry.chapter.id}>
            <section className="rounded-[1.75rem] border border-[var(--line)] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="display text-3xl text-[var(--ink)]">{entry.chapter.short_name}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{entry.chapter.name}</p>
                </div>
                <Link href={`/members/${entry.chapter.slug}`} className="btn btn-ghost px-4 py-2 text-sm">
                  Chapter hub
                </Link>
              </div>

              <div className="mt-8">
                <p className="eyebrow">Chapter directory</p>
                <ul className="mt-4 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)]">
                  {entry.members.length ? (
                    entry.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                      >
                        <span className="text-[var(--ink)]">
                          {member.display_name || member.email || "Member"}
                        </span>
                        <span className="text-[var(--muted)]">{member.email}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-center text-sm text-[var(--muted)]">
                      No approved members yet.
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-8">
                <CurriculumPanel
                  chapterId={entry.chapter.id}
                  chapterName={entry.chapter.short_name}
                  canEdit={isExecutive}
                />
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
