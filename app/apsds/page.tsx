import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { apsds, openChapters, pillars, tracks } from "@/lib/content";

export const metadata: Metadata = {
  title: "APSDS",
  description: apsds.mission,
};

export default function ApsdsPage() {
  return (
    <main className="apsds-page">
      <div className="apsds-video-bg" aria-hidden>
        <video autoPlay muted loop playsInline preload="auto">
          <source src={apsds.video.src} type="video/mp4" />
        </video>
        <div className="apsds-video-scrim" />
      </div>

      <div className="apsds-content">
        <section className="container py-20 text-center sm:py-28">
          <Reveal>
            <p className="eyebrow apsds-eyebrow">
              SYNTAXIA&apos;S FLAGSHIP PROGRAM
            </p>
            <div className="mt-8 flex justify-center">
              <Image
                src="/brand/APSDS_Logo.svg"
                alt="APSDS"
                width={520}
                height={220}
                className="apsds-logo h-auto w-full max-w-[28rem] object-contain"
                priority
              />
            </div>
            <h1 className="apsds-full-name mt-5 mx-auto max-w-3xl">
              The <strong>Algorithmic Problem Solving and Data Structures</strong> Club
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--apsds-muted)]">{apsds.tagline}</p>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--apsds-muted)]">{apsds.mission}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--apsds-muted)]">
              {apsds.relationship}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn btn-primary apsds-btn">
                See Syntaxia
              </Link>
              <Link href="/join" className="btn btn-ghost apsds-btn-ghost">
                Join a chapter
              </Link>
              <Link href="/demo" className="btn btn-ghost apsds-btn-ghost">
                Try demo
              </Link>
            </div>
          </Reveal>
        </section>

        <section className="container pb-16 text-center">
          <Reveal>
            <p className="eyebrow eyebrow-center apsds-eyebrow">Active chapters</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold text-[var(--apsds-ink)]">
              {openChapters.map((c) => (
                <span
                  key={c.id}
                  className="border border-[var(--apsds-line)] bg-[var(--apsds-surface)] px-4 py-2"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="border-y border-[var(--apsds-line)] bg-[var(--apsds-surface)]">
          <div className="container grid gap-4 py-20 md:grid-cols-3">
            {tracks.map((track, index) => (
              <Reveal key={track.id} delay={(index + 1) as 1 | 2 | 3}>
                <article className="border border-[var(--apsds-line)] bg-[rgba(8,12,40,0.55)] p-6 text-center">
                  <p className="display text-sm" style={{ color: track.accent }}>
                    {track.level}
                  </p>
                  <h2 className="display mt-3 text-3xl text-[var(--apsds-ink)]">{track.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--apsds-muted)]">
                    {track.summary}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container py-20 text-center">
          <Reveal>
            <h2 className="display section-title mx-auto max-w-2xl text-4xl text-[var(--apsds-ink)]">
              Why chapters choose APSDS
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
                <article className="border-t border-[var(--apsds-line)] pt-6 text-center">
                  <h3 className="display text-2xl text-[var(--apsds-ink)]">{pillar.title}</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--apsds-muted)]">
                    {pillar.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="btn btn-primary apsds-btn">
              Start a chapter
            </Link>
            <Link href="/" className="btn btn-ghost apsds-btn-ghost">
              Back to Syntaxia product
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
