import Link from "next/link";
import { apsds, syntaxia } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--line)]">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-3xl text-white">{syntaxia.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            Home for APSDS chapters — learning hubs coming soon for every open location.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
          <Link className="hover:text-white" href="/apsds">APSDS</Link>
          <Link className="hover:text-white" href="/members">Members</Link>
          <Link className="hover:text-white" href="/join">Join</Link>
          <Link className="hover:text-white" href="/start">Start</Link>
          <a className="hover:text-white" href={`mailto:${syntaxia.email}`}>{syntaxia.email}</a>
          <a className="hover:text-white" href={apsds.instagramUrl} target="_blank" rel="noreferrer">
            @{apsds.instagram}
          </a>
        </div>
      </div>
    </footer>
  );
}
