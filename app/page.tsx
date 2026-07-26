import Link from "next/link";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductDashboardPreview } from "@/components/ProductDashboardPreview";
import { Reveal } from "@/components/Reveal";
import {
  apsds,
  founderStory,
  openChapters,
  productFeatures,
  syntaxia,
  testimonials,
  verifiedTraction,
} from "@/lib/content";

export default function HomePage() {
  return (
    <main className="product-home">
      {/* 1. Product-focused hero */}
      <section className="border-b border-[var(--line)]">
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">Syntaxia</p>
              <h1 className="display mt-5 max-w-xl text-left text-[clamp(2.4rem,5vw,3.8rem)] leading-[0.98] text-[var(--ink)]">
                {syntaxia.tagline}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                Syntaxia gives schools, clubs, and after-school programs structured curriculum, student
                placement, code submissions, chapter management, and instructor analytics in one platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="btn btn-primary">
                  Try the live demo
                </Link>
                <Link href="/start" className="btn btn-ghost">
                  Start a pilot
                </Link>
              </div>
              <p className="mt-5 text-sm text-[var(--muted)]">{verifiedTraction.proofLine}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <ProductDashboardPreview />
          </Reveal>
        </div>
      </section>

      {/* 2. Trusted-by / chapter proof */}
      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">Powering APSDS chapters at</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[var(--ink)]">
            {openChapters.map((c) => (
              <span key={c.id}>{c.shortName}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product dashboard screenshot */}
      <section id="product" className="container scroll-mt-24 py-20">
        <Reveal>
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Product</p>
            <h2 className="display section-title mt-4 max-w-3xl text-left text-4xl text-[var(--ink)] sm:text-5xl">
              See who is stuck — and what to do next.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              The instructor dashboard turns curriculum, submissions, and chapter ops into one operating
              view. Numbers below are synthetic demo data.
            </p>
          </div>
        </Reveal>
        <div className="mt-10">
          <ProductDashboardPreview />
        </div>
      </section>

      {/* 4. How it works */}
      <section id="solutions" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">How Syntaxia works</p>
              <h2 className="display section-title mt-4 max-w-3xl text-left text-4xl text-[var(--ink)] sm:text-5xl">
                Diagnose. Place. Learn. Intervene.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* 5. Features */}
      <section className="container py-20">
        <Reveal>
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Capabilities</p>
            <h2 className="display section-title mt-4 max-w-3xl text-left text-4xl text-[var(--ink)] sm:text-5xl">
              Everything needed to run a serious CS program.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={(Math.min(index + 1, 3)) as 1 | 2 | 3}>
              <article className="h-full border border-[var(--line)] bg-[var(--surface)] p-6 text-left">
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
        <div className="mt-10 flex justify-start">
          <Link href="/demo" className="btn btn-primary">
            Try demo
          </Link>
        </div>
      </section>

      {/* 6. Workflow */}
      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container grid gap-10 py-20 lg:grid-cols-2">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">Student workflow</p>
              <h2 className="display section-title mt-4 text-left text-3xl text-[var(--ink)] sm:text-4xl">
                Assignment → submit → feedback → improve.
              </h2>
              <ol className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <li>1. Open the assigned lesson inside Syntaxia.</li>
                <li>2. Write and submit code (run & autograde expanding).</li>
                <li>3. See failing categories, not just a red X.</li>
                <li>4. Request Socratic hints before a full solution.</li>
              </ol>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">Instructor workflow</p>
              <h2 className="display section-title mt-4 text-left text-3xl text-[var(--ink)] sm:text-4xl">
                Actions, not vanity charts.
              </h2>
              <ol className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <li>1. Review the intervention queue each meeting.</li>
                <li>2. Assign remediation or change track.</li>
                <li>3. Track attendance and inactive students.</li>
                <li>4. Publish the next lesson with visibility controls.</li>
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. APSDS founder story */}
      <section className="container py-20">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="text-left">
              <p className="eyebrow eyebrow-left">APSDS</p>
              <h2 className="display section-title mt-4 text-left text-4xl text-[var(--ink)] sm:text-5xl">
                {founderStory.title}
              </h2>
              <p className="mt-5 text-[var(--muted)] leading-relaxed">{founderStory.body}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{apsds.relationship}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/apsds" className="btn btn-ghost">
                  Explore APSDS
                </Link>
                <Link href="/join" className="btn btn-ghost">
                  Join a chapter
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[var(--line)] bg-[var(--surface)] p-5 text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">Before</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  {founderStory.before.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.06)] p-5 text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">After</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
                  {founderStory.after.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 8. Verified traction */}
      <section id="results" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20">
          <Reveal>
            <div className="text-left">
              <p className="eyebrow eyebrow-left">Results</p>
              <h2 className="display section-title mt-4 text-left text-4xl text-[var(--ink)] sm:text-5xl">
                Verified traction only.
              </h2>
              <p className="mt-3 text-sm text-[var(--muted)]">Updated {verifiedTraction.updated}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {verifiedTraction.items.map((item) => (
              <article key={item.label} className="border border-[var(--line)] bg-[var(--bg)] p-6 text-left">
                <p className="display text-4xl text-[var(--ink)]">{item.value}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.label}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-[var(--muted)]">
            We do not publish estimated market size, projected ARR, interest-only school lists, or total
            signups as if they were active users.
          </p>
        </div>
      </section>

      {/* 9. Testimonials / case quotes */}
      <section className="container py-20">
        <Reveal>
          <div className="text-left">
            <p className="eyebrow eyebrow-left">From the network</p>
            <h2 className="display section-title mt-4 text-left text-4xl text-[var(--ink)] sm:text-5xl">
              Specific outcomes over vague praise.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Quotes are role-attributed until named permissions are on file. Replace with full names once
              approved.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.role + t.organization}
              className="border border-[var(--line)] bg-[var(--surface)] p-6 text-left"
            >
              <p className="text-sm leading-relaxed text-[var(--ink)]">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-5 text-sm text-[var(--muted)]">
                <p className="font-semibold text-[var(--ink)]">{t.role}</p>
                <p>{t.organization}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* 10. Pricing teaser */}
      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="container flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center">
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Pricing</p>
            <h2 className="display section-title mt-4 text-left text-3xl text-[var(--ink)] sm:text-4xl">
              Community free. Program $199/mo. Founding pilots $750/semester.
            </h2>
          </div>
          <Link href="/pricing" className="btn btn-primary shrink-0">
            View pricing
          </Link>
        </div>
      </section>

      {/* 11. Security / privacy */}
      <section className="container py-20">
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

      {/* 12. Final CTA */}
      <section className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 text-left">
          <h2 className="display max-w-3xl text-4xl text-[var(--ink)] sm:text-5xl">
            Try the product in under a minute.
          </h2>
          <p className="mt-4 max-w-xl text-[var(--muted)]">
            No account, no email verify, no approval wait. Pick a demo role and click through the loop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="btn btn-primary">
              Try demo
            </Link>
            <a
              href={`mailto:${syntaxia.emails.founders}?subject=Syntaxia%20pilot`}
              className="btn btn-ghost"
            >
              Email founders
            </a>
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
    <span className={`shrink-0 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  );
}
