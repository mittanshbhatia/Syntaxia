import Link from "next/link";
import { ProductMocks } from "@/components/ProductMocks";
import {
  apsds,
  founders,
  founderStory,
  homepageProblem,
  howItWorks,
  openChapters,
  syntaxia,
  verifiedTraction,
  whyDifferent,
} from "@/lib/content";

export default function HomePage() {
  return (
    <main className="yc-home">
      <section className="border-b border-[var(--line)]">
        <div className="container py-20 text-center sm:py-28 lg:py-32">
          <p className="brand-mark text-[clamp(14rem,40vw,24rem)] text-[var(--ink)]">
            {syntaxia.name}
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-[clamp(0.925rem,2.25vw,1.7rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--ink)]">
            {syntaxia.tagline}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--muted)] sm:text-xl">
            {syntaxia.headline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${syntaxia.emails.sales}?subject=${encodeURIComponent("Syntaxia demo request")}`}
              className="btn btn-primary"
            >
              Request a demo
            </a>
            <Link href="/start" className="btn btn-ghost">
              Start a chapter
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 text-center sm:py-24">
          <p className="eyebrow">The problem</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(1.8rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            {homepageProblem.title}
          </h2>
          <div className="mx-auto mt-8 max-w-lg space-y-3 text-lg text-[var(--muted)]">
            {homepageProblem.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="scroll-mt-24 border-b border-[var(--line)]">
        <div className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Product</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
              {syntaxia.wedge}
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Student, teacher, and parent views of the same loop.
            </p>
          </div>
          <div className="mt-12">
            <ProductMocks />
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/demo" className="btn btn-primary">
              Enter live product demo
            </Link>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
              Four steps. No folders.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={step.id} className="border border-[var(--line)] bg-[var(--bg)] p-6 text-left">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--ink)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Why we&apos;re different</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
              Actually useful.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whyDifferent.map((item) => (
              <div key={item.title} className="border-t border-[var(--line)] pt-5 text-left">
                <h3 className="text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="traction" className="scroll-mt-24 border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Trusted by</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
              Proof over adjectives.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verifiedTraction.homepageProof.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-[var(--muted)]">
            Chapters: {openChapters.map((c) => c.shortName).join(" · ")}.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="container grid items-center gap-10 py-20 lg:grid-cols-2 sm:py-24">
          <div className="text-left">
            <p className="eyebrow eyebrow-left">Built from real classrooms</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
              {founderStory.title}
            </h2>
            <p className="mt-5 max-w-xl text-[var(--muted)]">{founderStory.body}</p>
            <p className="mt-4 max-w-xl text-sm text-[var(--muted)]">{founders[0]?.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apsds" className="btn btn-ghost">
                See APSDS
              </Link>
              <Link href="/demo" className="btn btn-ghost">
                Explore Syntaxia
              </Link>
            </div>
          </div>
          <div className="overflow-hidden border border-[var(--line)] bg-black">
            <video
              className="aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={apsds.video.label}
            >
              <source src={apsds.video.src} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container py-20 text-center sm:py-28">
          <h2 className="mx-auto max-w-3xl text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            Bring modern computer science to your school.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">
            Request a demo, or start a chapter this semester.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${syntaxia.emails.sales}?subject=${encodeURIComponent("Syntaxia demo request")}`}
              className="btn btn-primary"
            >
              Request a demo
            </a>
            <Link href="/start" className="btn btn-ghost">
              Start a chapter
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
