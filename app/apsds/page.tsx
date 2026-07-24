import type { Metadata } from "next";
import Link from "next/link";
import { FilmReel } from "@/components/FilmReel";
import { Reveal } from "@/components/Reveal";
import { apsds, pillars, tracks } from "@/lib/content";

export const metadata: Metadata = {
  title: "APSDS",
  description: apsds.mission,
};

export default function ApsdsPage() {
  return (
    <main>
      <section className="container py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow">Promoted by Syntaxia</p>
          <h1 className="display mt-5 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">
            {apsds.name}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">{apsds.tagline}</p>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{apsds.mission}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/join" className="btn btn-primary">Join a chapter</Link>
            <Link href="/members" className="btn btn-ghost">I&apos;m a member</Link>
          </div>
        </Reveal>
      </section>

      <section className="container pb-20">
        <Reveal>
          <FilmReel />
        </Reveal>
      </section>

      <section className="border-y border-[var(--line)]">
        <div className="container grid gap-4 py-20 md:grid-cols-3">
          {tracks.map((track, index) => (
            <Reveal key={track.id} delay={(index + 1) as 1 | 2 | 3}>
              <article className="rounded-[1.5rem] border border-[var(--line)] p-6">
                <p className="display text-sm" style={{ color: track.accent }}>{track.level}</p>
                <h2 className="display mt-3 text-3xl text-white">{track.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{track.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <Reveal>
          <h2 className="display max-w-2xl text-4xl text-white">Why chapters choose APSDS</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
              <article className="border-t border-[var(--line)] pt-6">
                <h3 className="display text-2xl text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{pillar.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
