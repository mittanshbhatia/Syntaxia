import Link from "next/link";
import { apsds } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--line)]">
      <div className="container grid gap-10 py-12 md:grid-cols-2 md:items-start">
        <div className="text-left text-[var(--ink)]">
          <p className="display text-3xl">APSDS</p>
          <p className="mt-3 text-sm font-medium">Grok</p>
          <a className="mt-2 block text-sm hover:opacity-70" href={`mailto:${apsds.email}`}>
            {apsds.email}
          </a>
          <p className="mt-3 text-sm">Home of the APSDS club</p>
        </div>

        <div className="md:text-right">
          <p className="eyebrow mx-auto md:ml-auto md:mr-0">Follow Us</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 md:justify-end">
            <a
              href={apsds.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--ink)] hover:opacity-70"
              aria-label={`Instagram @${apsds.instagram}`}
            >
              <InstagramIcon />
              @{apsds.instagram}
            </a>
            <a
              href={`mailto:${apsds.email}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--ink)] hover:opacity-70"
              aria-label={`Email ${apsds.email}`}
            >
              <MailIcon />
              {apsds.email}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)] md:justify-end">
            <Link className="hover:text-[var(--ink)]" href="/">
              Home
            </Link>
            <Link className="hover:text-[var(--ink)]" href="/apsds">
              APSDS
            </Link>
            <Link className="hover:text-[var(--ink)]" href="/join">
              Join
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
