import Link from "next/link";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductDashboardPreview } from "@/components/ProductDashboardPreview";
import { Reveal } from "@/components/Reveal";
import {
  apsds,
  founderStory,
  founders,
  openChapters,
  problemPoints,
  productFeatures,
  syntaxia,
  verifiedTraction,
} from "@/lib/content";

export default function HomePage() {
  return (
    <main className="product-home">
      <section className="hero-product border-b border-[var(--line)]">
        <div className="container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-24">
          <div className="text-left">
            <p className="brand-mark hero-rise text-[clamp(3.4rem,9vw,5.6rem)] text-[var(--ink)]">
              {syntaxia.name}
            </p>
            <h1 className="hero-rise-2 mt-5 max-w-xl text-left text-[clamp(1.55rem,3.2vw,2.15rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--ink)]">
              {syntaxia.headline}
            </h1>
            <p className="hero-rise-3 mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {syntaxia.description}
            </p>
            <p className="hero-rise-3 mt-3 text-sm font-medium text-[var(--ink)]">{syntaxia.icp}</p>
            <div className="hero-rise-3 mt-9 flex flex-wrap gap-3">
              <Link href="/demo" className="btn btn-primary">
                Try the live demo
              </Link>
              <a
                href={`mailto:${syntaxia.emails.founders}?subject=${encodeURIComponent("Syntaxia pilot")}`}
                className="btn btn-ghost"
              >
                Email founders
              </a>
            </div>
            <p className="hero-rise-3 mt-6 text-sm text-[var(--muted)]">{verifiedTraction.proofLine}</p>
          </div>
          <div className="hero-rise-2">
            <ProductDashboardPreview />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container flex flex-col items-start gap-5 py-9 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">Dogfooding on APSDS chapters at</p>
          <div className="flex flex-wrap gap-2">
            {openChapters.map((c) => (
              <span
                key={c.id}
                className="border border-[var(--line)] bg-[var(--bg)] px-4 py-1.5 text-sm font-semibold text-[var(--ink)]"
              >
                {c.shortName}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 sm:py-24">
        <Reveal>
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Problem</p>
            <h2 className="display section-title mt-4 max-w-3xl text-left text-4xl text-[var(--ink)] sm:text-5xl">
              Most CS programs still run on folders and hope.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              Leveled tracks break when placement is manual, work never gets submitted in one place, and
              instructors cannot see who is stuck before the next meeting.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {problemPoints.map((point, index) => (
            <Reveal key={point.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
              <div className="border-t border-[var(--line)] pt-5 text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-3 text-2xl text-[var(--ink)]">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 sm:py-24">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">How it works</p>
              <h2 className="display section-title mt-4 max-w-3xl text-left text-4xl text-[var(--ink)] sm:text-5xl">
                Diagnose. Place. Learn. Intervene.
              </h2>
              <p className="mt-4 max-w-2xl text-[var(--muted)]">
                The product loop is assignment → submit → analyze → improve, with the instructor queue
                closing the loop.
              </p>
            </div>
          </Reveal>
          <div className="mt-12">
            <HowItWorks />
          </div>
        </div>
      </section>

      <section id="product" className="container scroll-mt-24 py-20 sm:py-24">
        <Reveal>
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Product</p>
            <h2 className="display section-title mt-4 max-w-3xl text-left text-4xl text-[var(--ink)] sm:text-5xl">
              See who is stuck — and what to do next.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              Verified product surface only. Student counts appear after your chapter is active; we do
              not invent them for marketing.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
              <article className="feature-card h-full border border-[var(--line)] bg-[var(--surface)] p-6 text-left">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="display text-2xl text-[var(--ink)]">{feature.title}</h3>
                  <StatusBadge status={feature.status} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{feature.body}</p>
                {"note" in feature && feature.note ? (
                  <p className="mt-3 text-xs font-medium text-[var(--brand)]">{feature.note}</p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/demo" className="btn btn-primary">
            Tour the product
          </Link>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container grid gap-12 py-20 lg:grid-cols-2 lg:items-center sm:py-24">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">Wedge</p>
              <h2 className="display section-title mt-4 text-left text-4xl text-[var(--ink)] sm:text-5xl">
                {founderStory.title}
              </h2>
              <p className="mt-5 leading-relaxed text-[var(--muted)]">{founderStory.body}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{apsds.relationship}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/apsds" className="btn btn-ghost">
                  Explore APSDS
                </Link>
                <Link href="/start" className="btn btn-ghost">
                  Start a pilot
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border-t border-[var(--line)] pt-5 text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Before Syntaxia
                </p>
                <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  {founderStory.before.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-[var(--brand)] pt-5 text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                  With Syntaxia
                </p>
                <ul className="mt-4 space-y-3 text-sm text-[var(--ink)]">
                  {founderStory.after.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container py-20 sm:py-24">
        <Reveal>
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Founders</p>
            <h2 className="display section-title mt-4 text-left text-4xl text-[var(--ink)] sm:text-5xl">
              Domain experts shipping software.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              We run the program we sell for. That is the unfair advantage — not invented logos.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {founders.map((person) => (
            <article
              key={person.name}
              className="border border-[var(--line)] bg-[var(--surface)] p-6 text-left sm:p-8"
            >
              <p className="display text-3xl text-[var(--ink)]">{person.name}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--brand)]">{person.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{person.bio}</p>
            </article>
          ))}
          <article className="border border-dashed border-[var(--line)] bg-[var(--bg)] p-6 text-left sm:p-8">
            <p className="display text-3xl text-[var(--ink)]">APSDS operators</p>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">Chapter staff & instructors</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              Weekly feedback from live meetings at {openChapters.map((c) => c.shortName).join(", ")}{" "}
              drives what we ship next — placement overrides, attendance rosters, intervention queue.
            </p>
          </article>
        </div>
      </section>

      <section id="traction" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 sm:py-24">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">Traction</p>
              <h2 className="display section-title mt-4 text-left text-4xl text-[var(--ink)] sm:text-5xl">
                Early, real, and specific.
              </h2>
              <p className="mt-3 text-sm font-medium text-[var(--ink)]">{verifiedTraction.stage}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Updated {verifiedTraction.updated}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {verifiedTraction.items.map((item) => (
              <div key={item.label} className="border-t border-[var(--line)] pt-5 text-left">
                <p className="display text-4xl text-[var(--ink)]">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                <p className="mt-2 text-xs leading-snug text-[var(--muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-[var(--muted)]">{verifiedTraction.honesty}</p>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="container flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center sm:py-20">
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Pricing</p>
            <h2 className="display section-title mt-4 text-left text-3xl text-[var(--ink)] sm:text-4xl">
              Community free. Program $199/mo. Founding pilots $750/semester.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
              Stripe checkout is coming online. Email us to start a pilot today — we keep feature claims
              honest (autograding is still shipping).
            </p>
          </div>
          <Link href="/pricing" className="btn btn-primary shrink-0">
            View pricing
          </Link>
        </div>
      </section>

      <section className="container py-20 sm:py-24">
        <Reveal>
          <div className="grid gap-8 border border-[var(--line)] bg-[var(--surface)] p-8 text-left sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow eyebrow-left">Trust</p>
              <h2 className="display section-title mt-4 text-left text-3xl text-[var(--ink)]">
                Built for programs that teach minors.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                Minimum necessary data, role-scoped access, deletion requests, and clear rules for student
                submissions. We do not sell student data.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:justify-center">
              <Link href="/privacy" className="btn btn-ghost justify-start">
                Privacy policy
              </Link>
              <Link href="/student-privacy" className="btn btn-ghost justify-start">
                Student privacy
              </Link>
              <Link href="/security" className="btn btn-ghost justify-start">
                Security
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 text-left sm:py-24">
          <h2 className="display max-w-3xl text-4xl text-[var(--ink)] sm:text-5xl">
            Tour the product. Then email founders.
          </h2>
          <p className="mt-4 max-w-xl text-[var(--muted)]">
            Demo uses verified product facts — empty where student data would live. Sign in to take the
            diagnostic, create cohorts, and submit code.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="btn btn-primary">
              Try demo
            </Link>
            <a
              href={`mailto:${syntaxia.emails.founders}?subject=${encodeURIComponent("Syntaxia pilot")}`}
              className="btn btn-ghost"
            >
              Email founders
            </a>
            <Link href="/start" className="btn btn-ghost">
              Pilot checklist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }: { status: "live" | "partial" | "soon" }) {
  const label =
    status === "live" ? "Live" : status === "partial" ? "Partial" : "Coming soon";
  const className =
    status === "live"
      ? "bg-[rgba(22,163,74,0.12)] text-[#15803d]"
      : status === "partial"
        ? "bg-[rgba(var(--brand-rgb),0.1)] text-[var(--brand)]"
        : "bg-[var(--line)] text-[var(--muted)]";
  return (
    <span
      className={`shrink-0 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}
