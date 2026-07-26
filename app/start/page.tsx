import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getSessionUser } from "@/lib/auth";
import { startSteps, syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start a pilot",
  description:
    "Pilot Syntaxia with one cohort: diagnose, place, submit, intervene. Email founders to start.",
};

export default async function StartPage() {
  const user = await getSessionUser();

  return (
    <main>
      <div className="container py-16 text-left sm:py-24">
        <Reveal>
          <p className="eyebrow eyebrow-left">Pilots</p>
          <h1 className="display section-title mt-4 max-w-3xl text-4xl text-[var(--ink)] sm:text-6xl">
            Start with one cohort.
          </h1>
          <p className="mt-5 max-w-2xl text-[var(--muted)]">
            You do not need a full-school rollout. Email founders, tour the demo, then run diagnose →
            place → submit → intervene on a single group.
          </p>
        </Reveal>

        {!user ? (
          <p className="mt-6 max-w-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
            Optional:{" "}
            <Link href="/auth/sign-up" className="font-semibold text-[var(--ink)] underline underline-offset-4">
              create an account
            </Link>{" "}
            to explore materials after the call. Pilots start by email — not a form wall.
          </p>
        ) : null}

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {startSteps.map((step, index) => (
            <Reveal key={step.title} delay={(index + 1) as 1 | 2 | 3}>
              <article className="border-t border-[var(--line)] pt-5 text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="display mt-3 text-2xl text-[var(--ink)]">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <div className="mt-16 border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-10">
            <h2 className="display text-3xl text-[var(--ink)]">Ready?</h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
              Include organization type, estimated students, and launch window. We reply from{" "}
              {syntaxia.emails.founders}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`mailto:${syntaxia.emails.founders}?subject=${encodeURIComponent("Syntaxia pilot")}`}
                className="btn btn-primary"
              >
                Email founders
              </a>
              <Link href="/demo" className="btn btn-ghost">
                Try demo
              </Link>
              <Link href="/pricing" className="btn btn-ghost">
                View pricing
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
