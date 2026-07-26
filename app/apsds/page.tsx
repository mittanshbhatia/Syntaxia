import type { Metadata } from "next";
import Image from "next/image";
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
      <section className="container py-20 text-center sm:py-28">
        <Reveal>
          <div className="mx-auto flex justify-center">
            <Image
              src="/brand/APSDS_Logo.svg"
              alt="APSDS"
              width={520}
              height={220}
              className="h-auto w-full max-w-[28rem] object-contain"
              priority
            />
          </div>
          <div className="eyebrow-center mt-4">
            <p className="eyebrow">by Syntaxia</p>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--muted)]">{apsds.tagline}</p>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">{apsds.mission}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/join" className="btn btn-primary">
              Join a chapter
            </Link>
            <Link href="/members" className="btn btn-ghost">
              I&apos;m a member
            </Link>
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
              <article className="p-6 text-center">
                <p className="display text-sm" style={{ color: track.accent }}>
                  {track.level}
                </p>
                <h2 className="display mt-3 text-3xl text-[var(--ink)]">{track.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{track.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container py-20 text-center">
        <Reveal>
          <h2 className="display section-title mx-auto max-w-2xl text-4xl text-[var(--ink)]">
            Why chapters choose APSDS
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
              <article className="border-t border-[var(--line)] pt-6 text-center">
                <h3 className="display text-2xl text-[var(--ink)]">{pillar.title}</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
