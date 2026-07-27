import type { Metadata } from "next";
import Link from "next/link";
import { PilotOnboarding } from "@/components/PilotOnboarding";
import { Reveal } from "@/components/Reveal";
import { getSessionUser } from "@/lib/auth";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start a pilot",
  description:
    "Native Syntaxia pilot onboarding: organization, track, plan, and instructor invites, no Google Form.",
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
            Native onboarding replaces the old Google Form. Tell us your organization, pick a plan,
            invite instructors, and submit. Stripe checkout comes next, no charge on submit.
          </p>
        </Reveal>

        {!user ? (
          <p className="mt-6 max-w-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
            You can fill the form now.{" "}
            <Link href="/auth/sign-up" className="font-semibold text-[var(--ink)] underline underline-offset-4">
              Create an account
            </Link>{" "}
            or{" "}
            <Link href="/auth/sign-in" className="font-semibold text-[var(--ink)] underline underline-offset-4">
              sign in
            </Link>{" "}
            before the final submit so we can attach the request to your user.
          </p>
        ) : null}

        <PilotOnboarding signedIn={Boolean(user)} />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/demo" className="btn btn-ghost">
            Try demo
          </Link>
          <a
            href={`mailto:${syntaxia.emails.founders}?subject=${encodeURIComponent("Syntaxia pilot")}`}
            className="btn btn-ghost"
          >
            Email founders
          </a>
        </div>
      </div>
    </main>
  );
}
