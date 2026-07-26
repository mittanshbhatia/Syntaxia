"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { navLinks } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

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
        setIsMember(false);
        setAvatarUrl(null);
        return;
      }

      setSignedIn(true);
      setAvatarUrl(user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null);

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
      setIsMember(
        profile?.global_role === "executive" ||
          Boolean(staff?.length) ||
          Boolean(memberships?.length),
      );
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

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const dashboardHref = isMember ? "/dashboard" : "/members";

  return (
    <>
      <header className="nav-blur sticky top-0 z-50 border-b border-[var(--line)]">
        <div className="container relative flex items-center justify-between gap-3 py-3.5">
          <Link href="/" className="display z-10 text-[1.35rem] text-[var(--ink)] transition hover:opacity-80">
            Syntaxia
          </Link>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm text-[var(--ink)] lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:opacity-70">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="z-10 flex items-center gap-2">
            <Link href="/demo" className="btn btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
              Try demo
            </Link>

            {signedIn ? (
              <Link href={dashboardHref} className="btn btn-ghost hidden px-4 py-2 text-sm md:inline-flex">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/sign-in" className="btn btn-ghost hidden px-4 py-2 text-sm md:inline-flex">
                Sign in
              </Link>
            )}

            <button
              type="button"
              className="icon-btn"
              aria-label="Settings"
              title="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <GearIcon />
            </button>

            {signedIn ? (
              <button type="button" className="account-avatar" aria-label="Account" title="Account">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <DefaultAvatar />
                )}
              </button>
            ) : null}

            <button
              type="button"
              className="icon-btn lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div
            id={menuId}
            className="border-t border-[var(--line)] bg-[var(--nav-bg)] px-4 py-4 lg:hidden"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="container flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm px-3 py-3 text-sm font-medium hover:bg-[var(--surface)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/demo"
                className="rounded-sm px-3 py-3 text-sm font-medium hover:bg-[var(--surface)]"
                onClick={() => setMenuOpen(false)}
              >
                Try demo
              </Link>
              <Link
                href={signedIn ? dashboardHref : "/auth/sign-in"}
                className="rounded-sm px-3 py-3 text-sm font-medium hover:bg-[var(--surface)]"
                onClick={() => setMenuOpen(false)}
              >
                {signedIn ? "Dashboard" : "Sign in"}
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 13.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.86 1 1.51 1H19a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DefaultAvatar() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#1f2bd5" />
      <circle cx="20" cy="15" r="7" fill="#ffffff" opacity="0.95" />
      <path d="M6 34c2.5-7 9-10 14-10s11.5 3 14 10" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}
