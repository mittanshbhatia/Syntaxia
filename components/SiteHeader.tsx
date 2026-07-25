"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/apsds", label: "APSDS" },
  { href: "/members", label: "Members" },
  { href: "/join", label: "Join" },
  { href: "/start", label: "Start" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setSignedIn(false);
        setShowDashboard(false);
        return;
      }
      setSignedIn(true);

      const [{ data: profile }, { data: staff }, { data: memberships }] = await Promise.all([
        supabase.from("profiles").select("global_role").eq("id", user.id).maybeSingle(),
        supabase.from("chapter_staff").select("id").eq("user_id", user.id).limit(1),
        supabase
          .from("chapter_memberships")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "approved")
          .limit(1),
      ]);

      if (!active) return;
      const validated =
        profile?.global_role === "executive" ||
        Boolean(staff?.length) ||
        Boolean(memberships?.length);
      setShowDashboard(validated);
    }

    void load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void load();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="nav-blur sticky top-0 z-50 border-b border-[var(--line)]">
      <div className="container flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="display text-[1.35rem] text-[var(--ink)] transition hover:opacity-80">
          Syntaxia
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[var(--ink)] md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!signedIn ? (
            <Link href="/auth/sign-in" className="btn btn-ghost hidden px-4 py-2 text-sm sm:inline-flex">
              Sign in
            </Link>
          ) : null}
          {showDashboard ? (
            <Link href="/dashboard" className="btn btn-primary px-4 py-2 text-sm">
              Dashboard
            </Link>
          ) : null}
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
                  className="block rounded-xl px-3 py-2.5 text-sm text-[var(--ink)] hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!signedIn ? (
              <li>
                <Link
                  href="/auth/sign-in"
                  className="block rounded-xl px-3 py-2.5 text-sm text-[var(--ink)] hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              </li>
            ) : null}
            {showDashboard ? (
              <li>
                <Link
                  href="/dashboard"
                  className="block rounded-xl px-3 py-2.5 text-sm text-[var(--ink)] hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
