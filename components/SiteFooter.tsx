import Link from "next/link";
import { footerLinks, syntaxia } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer mt-8 border-t border-[var(--line)]">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="footer-copy text-left">
          <p className="text-2xl font-semibold tracking-tight">{syntaxia.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            The AI-native computer science learning platform. APSDS is our first deployment.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/demo" className="btn btn-primary px-4 py-2 text-sm">
              Enter demo
            </Link>
            <a href={`mailto:${syntaxia.emails.sales}`} className="btn btn-ghost px-4 py-2 text-sm">
              Request a demo
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Company
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[var(--muted)] transition hover:text-[var(--ink)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Email
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <a className="hover:text-[var(--ink)]" href={`mailto:${syntaxia.emails.founders}`}>
                {syntaxia.emails.founders}
              </a>
            </li>
            <li>
              <a className="hover:text-[var(--ink)]" href={`mailto:${syntaxia.emails.sales}`}>
                {syntaxia.emails.sales}
              </a>
            </li>
            <li>
              <a className="hover:text-[var(--ink)]" href={`mailto:${syntaxia.emails.support}`}>
                {syntaxia.emails.support}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
