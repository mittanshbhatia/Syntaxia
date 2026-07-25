import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { Reveal } from "@/components/Reveal";
import { apsds, openChapters, pillars, tracks } from "@/lib/content";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <HeroVideo />
        <div className="hero-copy">
          <Reveal>
            <h1 className="display hero-title text-white">
              <span>Where structure</span>
              <span>meets ambition</span>
            </h1>
          </Reveal>
          <Reveal delay={1}>
            <p className="hero-desc">
              Syntaxia is the home for APSDS chapters,
              <br />
              a growing network of school clubs teaching algorithmic thinking, projects, and competition prep.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <div className="hero-actions">
              <Link href="/join" className="btn btn-ghost">
                I want to join
              </Link>
              <Link href="/members" className="btn btn-primary">
                I&apos;m already a member
              </Link>
              <Link href="/start" className="btn btn-ghost">
                Start a chapter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="marquee border-y border-[var(--line)] py-6" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10">
              {[
                "Algorithmic thinking",
                "L1 Foundations",
                "L2 Practical",
                "L3 Advanced",
                "ACSL",
                "APCSA Prep",
                "Multi-school chapters",
                apsds.name,
              ].map((item) => (
                <span key={`${copy}-${item}`}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="container py-24">
        <Reveal>
          <p className="eyebrow">Three doors in</p>
          <h2 className="display mt-4 max-w-2xl text-4xl text-white sm:text-5xl">
            Tell us who you are — we&apos;ll take it from there.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {[
            {
              href: "/members",
              kicker: "Members",
              title: "Pick your chapter",
              body: "Choose your location and enter your chapter space. Learning tools come next.",
            },
            {
              href: "/join",
              kicker: "New students",
              title: "Join APSDS",
              body: "See open chapters, understand the tracks, and get started with placement.",
            },
            {
              href: "/start",
              kicker: "Founders",
              title: "Launch a campus",
              body: "Bring APSDS to your school with Syntaxia’s shared curriculum and support.",
            },
          ].map((item, index) => (
            <Reveal key={item.href} delay={(index + 1) as 1 | 2 | 3}>
              <Link href={item.href} className="tile block p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--mint)]">{item.kicker}</p>
                <h3 className="display relative z-10 mt-4 text-3xl text-white">{item.title}</h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                <p className="relative z-10 mt-8 text-sm font-semibold text-white">Continue →</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[rgba(255,255,255,0.015)]">
        <div className="container py-24">
          <Reveal>
            <p className="eyebrow">Flagship club</p>
            <h2 className="display mt-4 max-w-3xl text-4xl text-white sm:text-5xl">
              {apsds.name} — {apsds.tagline}
            </h2>
            <p className="mt-5 max-w-2xl text-[var(--muted)]">{apsds.mission}</p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
                <article className="rounded-[1.4rem] border border-[var(--line)] px-6 py-7 transition duration-500 hover:border-[rgba(var(--brand-soft-rgb),0.3)]">
                  <h3 className="display text-2xl text-white">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{pillar.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Link href="/apsds" className="btn btn-ghost mt-10">
              Explore APSDS
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="container py-24">
        <Reveal>
          <p className="eyebrow">Tracks</p>
          <h2 className="display mt-4 text-4xl text-white sm:text-5xl">Level up, not loop.</h2>
        </Reveal>
        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {tracks.map((track, index) => (
            <Reveal key={track.id} delay={(index + 1) as 1 | 2 | 3}>
              <article className="relative overflow-hidden rounded-[1.5rem] border border-[var(--line)] p-6">
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${track.accent}, transparent)` }}
                />
                <p className="display text-sm" style={{ color: track.accent }}>
                  {track.level}
                </p>
                <h3 className="display mt-3 text-3xl text-white">{track.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{track.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[radial-gradient(circle_at_top_left,rgba(var(--brand-rgb),0.18),transparent_45%),rgba(255,255,255,0.02)] p-8 sm:p-12">
            <p className="eyebrow">Open now</p>
            <h2 className="display mt-4 max-w-2xl text-4xl text-white">
              {openChapters.length} active chapter{openChapters.length === 1 ? "" : "s"} — more on the way.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              Members: pick your location. Founders: bring the next one online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/members" className="btn btn-primary">Choose your chapter</Link>
              <Link href="/start" className="btn btn-ghost">Start the next one</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
