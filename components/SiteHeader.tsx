"use client";

import Link from "next/link";
import { useState } from "react";
import { syntaxia } from "@/lib/content";

const links = [
  { href: "/apsds", label: "APSDS" },
  { href: "/members", label: "Members" },
  { href: "/join", label: "Join" },
  { href: "/start", label: "Start" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-blur sticky top-0 z-50 border-b border-[var(--line)]">
      <div className="container flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="display text-[1.35rem] text-white transition hover:text-[var(--brand-soft)]">
          {syntaxia.name}
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/auth/sign-in" className="btn btn-ghost hidden px-4 py-2 text-sm sm:inline-flex">
            Sign in
          </Link>
          <Link href="/members" className="btn btn-primary px-4 py-2 text-sm">
            Members
          </Link>
          <button
            type="button"
            className="btn btn-ghost px-3 py-2 text-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-[var(--line)] px-4 py-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
