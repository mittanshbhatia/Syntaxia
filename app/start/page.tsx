import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { startSteps, syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start a chapter",
  description: "Launch an APSDS chapter with Syntaxia.",
};

export default function StartPage() {
  return (
    <main className="container py-20 sm:py-28">
      <Reveal>
        <p className="eyebrow">Founders</p>
        <h1 className="display mt-4 max-w-3xl text-5xl text-white sm:text-6xl">
          Start the next chapter.
        </h1>
        <p className="mt-5 max-w-xl text-[var(--muted)]">
          Syntaxia gives new campuses shared curriculum, placement, competitions, and a clear
          launch path — you build the local community.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {startSteps.map((step, index) => (
          <Reveal key={step.title} delay={(index + 1) as 1 | 2 | 3}>
            <article className="tile p-6">
              <p className="display text-sm text-[var(--mint)]">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="display relative z-10 mt-4 text-2xl text-white">{step.title}</h2>
              <p className="relative z-10 mt-3 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={2}>
        <div className="mt-16 rounded-[2rem] border border-[var(--line)] p-8 sm:p-10">
          <h2 className="display text-3xl text-white">Ready to launch?</h2>
          <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
            Email us your school, estimated term, and instructor leads. We&apos;ll send the playbook.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${syntaxia.email}?subject=${encodeURIComponent("New APSDS chapter")}`}
              className="btn btn-primary"
            >
              Propose a chapter
            </a>
            <Link href="/apsds" className="btn btn-ghost">
              Review APSDS
            </Link>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
