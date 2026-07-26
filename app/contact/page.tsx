import type { Metadata } from "next";
import Link from "next/link";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Syntaxia founders, support, sales, or privacy.",
};

export default function ContactPage() {
  return (
    <main className="container max-w-3xl py-16 text-left sm:py-24">
      <p className="eyebrow eyebrow-left">Contact</p>
      <h1 className="display mt-4 text-4xl text-[var(--ink)]">Talk to Syntaxia.</h1>
      <p className="mt-4 text-[var(--muted)]">
        Use company addresses below. APSDS chapter Instagram remains a community channel, not the primary
        company inbox.
      </p>
      <ul className="mt-10 space-y-4 text-sm">
        {(
          [
            ["Founders / pilots", syntaxia.emails.founders],
            ["Support", syntaxia.emails.support],
            ["Sales", syntaxia.emails.sales],
            ["Privacy", syntaxia.emails.privacy],
          ] as const
        ).map(([label, email]) => (
          <li key={email} className="border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
            <a className="mt-1 inline-block text-[var(--brand)] underline" href={`mailto:${email}`}>
              {email}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/demo" className="btn btn-primary">
          Try demo
        </Link>
        <Link href="/pricing" className="btn btn-ghost">
          Pricing
        </Link>
      </div>
    </main>
  );
}
