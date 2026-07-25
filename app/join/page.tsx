import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { apsds, openChapters, tracks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find a Chapter",
  description: "Find an open APSDS chapter. Free for students. Placement into L1, L2, and L3.",
};

export default function JoinPage() {
  return (
    <main>
      <section className="join-hero min-h-[70vh]">
        <div className="join-hero-video" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="auto">
            <source src={apsds.video.src} type="video/mp4" />
          </video>
        </div>
        <div className="join-hero-cut" aria-hidden="true" />
        <div className="container join-hero-copy grid min-h-[70vh] items-center py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="eyebrow">Join</p>
              <h1 className="display section-title mt-4 text-5xl text-[var(--ink)] sm:text-6xl lg:text-left">
                Find a Chapter
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-center text-[var(--muted)] lg:mx-0 lg:text-left">
                Free for students. Placement into L1, L2, and L3.
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href={`mailto:${apsds.email}?subject=${encodeURIComponent("Join APSDS")}`}
                  className="btn btn-primary"
                >
                  Email to join
                </a>
                <Link href="#chapters" className="btn btn-ghost">
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
                  href={`/members/${chapter.slug}`}
                  className="school-card"
                  style={{ backgroundImage: `url(${chapter.logo})` }}
                >
                  <div className="school-card-body">
                    <div className="flex items-center justify-between gap-3">
                      <p className="display text-2xl text-white">{chapter.shortName}</p>
                      <span className="status-pill open">Open</span>
                    </div>
                    <p className="mt-2 text-sm text-white/85">{chapter.name}</p>
                    <p className="mt-1 text-xs text-white/70">{chapter.region}</p>
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
                <article className="rounded-[1.35rem] border border-[var(--line)] p-5">
                  <p className="display text-center text-sm text-[var(--brand)]">{track.level}</p>
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
