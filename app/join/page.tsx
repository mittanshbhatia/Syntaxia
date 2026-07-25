import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getSessionUser } from "@/lib/auth";
import { apsds, openChapters, tracks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find a Chapter",
  description: "Find an open APSDS chapter. Free for students. Placement into L1, L2, and L3.",
};

export default async function JoinPage() {
  const user = await getSessionUser();

  return (
    <main>
      {!user ? (
        <div className="join-banner">
          You must first have an account in order to join a chapter. Click{" "}
          <Link href="/auth/sign-up" className="underline underline-offset-4 decoration-2">
            here
          </Link>{" "}
          to create an account, or{" "}
          <Link href="/auth/sign-in" className="underline underline-offset-4 decoration-2">
            Sign in
          </Link>
          .
        </div>
      ) : null}

      <section className="join-hero min-h-[70vh]">
        <div className="join-hero-video" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="auto">
            <source src={apsds.video.src} type="video/mp4" />
          </video>
        </div>
        <div className="join-hero-cut" aria-hidden="true" />
        <div className="container join-hero-copy grid min-h-[70vh] place-items-center py-20">
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <p className="eyebrow">Join</p>
              <h1 className="display section-title mt-4 text-5xl text-white sm:text-6xl">
                Find a Chapter
              </h1>
              <p className="mt-5 text-[var(--muted)]">
                Free for students · Placement into L1, L2, and L3.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="#chapters" className="btn btn-primary">
                  See open locations
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="chapters" className="border-t border-[var(--line)]">
        <div className="container py-20">
          <Reveal>
            <p className="eyebrow">Open chapters</p>
            <h2 className="display section-title mt-4 text-3xl text-[var(--ink)]">Find your school</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openChapters.map((chapter) => (
              <Reveal key={chapter.id}>
                <Link
                  href={`/join/${chapter.slug}`}
                  className="school-card"
                  style={{ backgroundImage: `url(${chapter.logo})` }}
                >
                  <div className="school-card-body">
                    <div className="flex items-center justify-between gap-3">
                      <p className="display text-2xl text-white">{chapter.shortName}</p>
                      <span className="status-pill open">Open</span>
                    </div>
                    <p className="mt-2 text-sm text-white/85">{chapter.name}</p>
                    {chapter.founding ? (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        Founding school · Executive capital
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-white/70">{chapter.region}</p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="eyebrow mt-16">Tracks</p>
            <h2 className="display section-title mt-4 text-3xl text-[var(--ink)]">L1, L2, and L3</h2>
          </Reveal>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {tracks.map((track, index) => (
              <Reveal key={track.id} delay={(index + 1) as 1 | 2 | 3}>
                <article className="rounded-[1.35rem] border border-[var(--line)] p-5 text-center">
                  <p className="display text-sm text-[var(--brand)]">{track.level}</p>
                  <h3 className="display mt-2 text-2xl text-[var(--ink)]">{track.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{track.summary}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
