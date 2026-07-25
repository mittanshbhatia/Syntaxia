import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getSessionUser } from "@/lib/auth";
import { startSteps, syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start a chapter",
  description: "Launch an APSDS chapter with Syntaxia.",
};

export default async function StartPage() {
  const user = await getSessionUser();

  return (
    <main>
      {!user ? (
        <div className="join-banner">
          You must first have an account in order to start a chapter. Click{" "}
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

      <div className="container py-20 text-center sm:py-28">
        <Reveal>
          <p className="eyebrow">Founders</p>
          <h1 className="display section-title mt-4 mx-auto max-w-3xl text-5xl text-[var(--ink)] sm:text-6xl">
            Start the next chapter.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">
            Syntaxia gives new campuses shared curriculum, placement, competitions, and a clear launch
            path. You build the local community.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {startSteps.map((step, index) => (
            <Reveal key={step.title} delay={(index + 1) as 1 | 2 | 3}>
              <article className="tile p-6 text-center">
                <p className="display text-sm text-[var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="display relative z-10 mt-4 text-2xl text-[var(--ink)]">{step.title}</h2>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <div className="mt-16 rounded-[2rem] border border-[var(--line)] p-8 sm:p-10">
            <h2 className="display section-title text-3xl text-[var(--ink)]">Ready to launch?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted)]">
              Email us your school, estimated term, and instructor leads. We&apos;ll send the playbook.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
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
      </div>
    </main>
  );
}
