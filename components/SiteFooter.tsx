import { apsds, syntaxia } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--line)]">
      <div className="container grid gap-10 py-12 md:grid-cols-2 md:items-start">
        <div className="text-left text-white">
          <p className="display text-3xl">{syntaxia.name}</p>
          <p className="mt-3 text-sm">Home of the APSDS Club.</p>
        </div>

        <div className="md:text-right">
          <p className="eyebrow md:!ml-auto md:!mr-0">Follow Us</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-white md:justify-end">
            <a
              href={apsds.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:opacity-70"
            >
              <InstagramIcon />
              @{apsds.instagram}
            </a>
            <a
              href={`mailto:${apsds.email}`}
              className="inline-flex items-center gap-2 text-sm hover:opacity-70"
            >
              <MailIcon />
              {apsds.email}
            </a>
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
