import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { pricingPlans, syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Syntaxia pricing for community chapters, after-school programs, schools, and founding pilots.",
};

export default function PricingPage() {
  return (
    <main className="container py-16 sm:py-24">
      <Reveal>
        <div className="max-w-3xl text-left">
          <p className="eyebrow eyebrow-left">Pricing</p>
          <h1 className="display mt-4 text-4xl text-[var(--ink)] sm:text-5xl">
            Founding prices. Honest features.
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Start free if you are an approved student-led chapter. Paid plans unlock diagnostics,
            instructor ops, and multi-cohort tools. Stripe checkout is coming — email founders to
            pilot now. Anything still shipping is labeled as such.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {pricingPlans.map((plan) => (
          <article
            key={plan.id}
            className={`border p-6 text-left sm:p-8 ${
              plan.featured
                ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.06)]"
                : "border-[var(--line)] bg-[var(--surface)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="display text-3xl text-[var(--ink)]">{plan.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{plan.blurb}</p>
              </div>
              {plan.featured ? (
                <span className="bg-[var(--brand)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--bg)]">
                  Popular
                </span>
              ) : null}
            </div>
            <p className="mt-6">
              <span className="display text-4xl text-[var(--ink)]">{plan.price}</span>
              {plan.cadence ? (
                <span className="ml-1 text-sm text-[var(--muted)]">{plan.cadence}</span>
              ) : null}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              {plan.features.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
            <div className="mt-8">
              {plan.href.startsWith("mailto:") ? (
                <a href={plan.href} className="btn btn-primary">
                  {plan.cta}
                </a>
              ) : (
                <Link href={plan.href} className="btn btn-primary">
                  {plan.cta}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/demo" className="btn btn-ghost">
          Try demo
        </Link>
        <a href={`mailto:${syntaxia.emails.founders}`} className="btn btn-ghost">
          {syntaxia.emails.founders}
        </a>
      </div>
    </main>
  );
}
