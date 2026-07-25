import type { Metadata } from "next";
import Link from "next/link";
import { FilmReel } from "@/components/FilmReel";
import { Reveal } from "@/components/Reveal";
import { apsds, joinSteps, openChapters, tracks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join",
  description: "Join an open APSDS chapter through Syntaxia.",
};

export default function JoinPage() {
  return (
    <main>
      <section className="container grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="eyebrow">Join</p>
            <h1 className="display mt-4 text-5xl text-white sm:text-6xl">
              Find a chapter. Start leveling up.
            </h1>
            <p className="mt-5 max-w-lg text-[var(--muted)]">
              Free for students. Placement into L1–L3. Weekly teaching that actually sticks.
            </p>
          </Reveal>

          <ol className="mt-12 space-y-6">
            {joinSteps.map((step, index) => (
              <Reveal key={step.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
                <li className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="display text-[var(--brand-soft)]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 className="display text-2xl text-white">{step.title}</h2>
                    <p className="mt-2 text-sm text-[var(--muted)]">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={2}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={`mailto:${apsds.email}?subject=${encodeURIComponent("Join APSDS")}`} className="btn btn-primary">
                Email to join
              </a>
              <Link href="/members" className="btn btn-ghost">See open locations</Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <FilmReel />
        </Reveal>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="container py-20">
          <Reveal>
            <h2 className="display text-3xl text-white">Open chapters</h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {openChapters.map((chapter) => (
              <Reveal key={chapter.id}>
                <Link href={`/members/${chapter.slug}`} className="tile block p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="display text-2xl text-white">{chapter.shortName}</p>
                    <span className="status-pill open">Open</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{chapter.name}</p>
                  <p className="mt-1 text-xs text-[var(--brand-soft)]">{chapter.region}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 className="display mt-16 text-3xl text-white">Tracks</h2>
          </Reveal>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {tracks.map((track, index) => (
              <Reveal key={track.id} delay={(index + 1) as 1 | 2 | 3}>
                <article className="rounded-[1.35rem] border border-[var(--line)] p-5">
                  <p className="display text-sm" style={{ color: track.accent }}>{track.level}</p>
                  <h3 className="display mt-2 text-2xl text-white">{track.name}</h3>
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
