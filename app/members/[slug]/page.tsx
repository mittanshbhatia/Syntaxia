import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { SignOutButton } from "@/components/SignOutButton";
import { canAccessChapter, getChapterBySlug, getProfile, getSessionUser } from "@/lib/auth";
import { tracks } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapterBySlug(slug);
  if (!chapter) return { title: "Chapter" };
  return { title: `${chapter.short_name} · Members` };
}

export default async function ChapterMemberPage({ params }: Props) {
  const { slug } = await params;
  const chapter = await getChapterBySlug(slug);
  if (!chapter || chapter.status !== "open") notFound();

  const user = await getSessionUser();
  if (!user) {
    redirect(`/auth/sign-in?next=/members/${slug}`);
  }

  const access = await canAccessChapter(chapter.id, user.id);
  const profile = await getProfile();

  if (!access.ok) {
    const status = access.reason;
    return (
      <main className="container py-16 sm:py-24">
        <Link href="/members" className="text-sm text-[var(--muted)] hover:text-white">
          ← All chapters
        </Link>
        <h1 className="display mt-8 text-5xl text-white">{chapter.short_name}</h1>
        <p className="mt-3 text-[var(--muted)]">{chapter.name}</p>

        <div className="mt-10 max-w-xl rounded-[1.75rem] border border-[var(--line)] p-8">
          {status === "none" ? (
            <>
              <h2 className="display text-2xl text-white">Request access first</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Go back and request membership for this chapter. An instructor must approve you.
              </p>
              <Link href="/members" className="btn btn-primary mt-6">
                Choose chapter
              </Link>
            </>
          ) : status === "pending" ? (
            <>
              <h2 className="display text-2xl text-white">Waiting for approval</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Your request is pending. A chapter director or instructor needs to approve you
                before you can access lessons and quizzes.
              </p>
              <p className="mt-4 text-sm text-[var(--brand-soft)]">
                Signed in as {profile?.email ?? user.email}
              </p>
              <div className="mt-6 flex gap-2">
                <Link href="/members" className="btn btn-ghost">
                  Back
                </Link>
                <SignOutButton />
              </div>
            </>
          ) : status === "rejected" ? (
            <>
              <h2 className="display text-2xl text-white">Request rejected</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Contact your chapter team if this was a mistake.
              </p>
            </>
          ) : (
            <>
              <h2 className="display text-2xl text-white">Sign in required</h2>
              <Link href="/auth/sign-in" className="btn btn-primary mt-6">
                Sign in
              </Link>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16 sm:py-24">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/members" className="text-sm text-[var(--muted)] transition hover:text-white">
            ← All chapters
          </Link>
          <SignOutButton />
        </div>
        <p className="eyebrow mt-8">{chapter.region}</p>
        <h1 className="display mt-4 text-5xl text-white sm:text-6xl">{chapter.short_name}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{chapter.name}</p>
        <p className="mt-5 max-w-2xl text-[var(--muted)]">{chapter.blurb}</p>
      </Reveal>

      <Reveal delay={1}>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[radial-gradient(circle_at_top,rgba(var(--brand-rgb),0.16),transparent_40%),var(--surface)] p-8 sm:p-10 text-center">
          <p className="display text-3xl text-[var(--ink)]">You&apos;re approved</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Open your dashboard for the chapter directory and curriculum for {chapter.short_name}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              Open dashboard
            </Link>
          </div>
        </div>
      </Reveal>

      <section className="mt-14">
        <Reveal>
          <h2 className="display text-3xl text-white">Tracks</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {tracks.map((track, index) => (
            <Reveal key={track.id} delay={(index + 1) as 1 | 2 | 3}>
              <article className="rounded-[1.35rem] border border-[var(--line)] p-5">
                <p className="display text-sm" style={{ color: track.accent }}>
                  {track.level}
                </p>
                <h3 className="display mt-2 text-2xl text-white">{track.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{track.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
