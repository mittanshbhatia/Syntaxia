"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { navLinks } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [hideCenterNav, setHideCenterNav] = useState(false);
  const menuId = useId();
  const accountId = useId();
  const brandRef = useRef<HTMLAnchorElement>(null);
  const centerRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

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
    if (!menuOpen && !accountOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    }
    function onPointer(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen, accountOpen]);

  useEffect(() => {
    const GAP = 28;

    function measure() {
      const brand = brandRef.current;
      const center = centerRef.current;
      const actions = actionsRef.current;
      if (!brand || !center || !actions) return;

      const centerStyle = window.getComputedStyle(center);
      if (centerStyle.display === "none") {
        setHideCenterNav(false);
        return;
      }

      const brandRight = brand.getBoundingClientRect().right;
      const actionsLeft = actions.getBoundingClientRect().left;
      const centerBox = center.getBoundingClientRect();
      const colliding =
        centerBox.left < brandRight + GAP || centerBox.right > actionsLeft - GAP;
      setHideCenterNav(colliding);
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    if (brandRef.current) ro.observe(brandRef.current);
    if (actionsRef.current) ro.observe(actionsRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [signedIn, menuOpen]);

  const dashboardHref = isMember ? "/dashboard" : "/members";
  const showMenuButton = true;
  const menuPanelVisible = menuOpen;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAccountOpen(false);
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <header className="nav-blur sticky top-0 z-50">
      <div className="container relative flex items-center justify-between gap-3 py-3.5">
        <Link
          ref={brandRef}
          href="/"
          className="display z-10 text-[1.35rem] text-[var(--ink)] transition hover:opacity-80"
        >
          Syntaxia
        </Link>

        <nav
          ref={centerRef}
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm text-[var(--ink)] lg:flex ${
            hideCenterNav ? "invisible pointer-events-none" : ""
          }`}
          aria-label="Primary"
          aria-hidden={hideCenterNav}
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </nav>

        <div ref={actionsRef} className="z-10 flex items-center gap-2">
          <Link href="/demo" className="btn btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
            Try demo
          </Link>
          <a
            href="mailto:founders@syntaxia.org?subject=Syntaxia%20pilot"
            className="btn btn-ghost hidden px-4 py-2 text-sm xl:inline-flex"
          >
            Email founders
          </a>

          {signedIn ? (
            <Link
              href={dashboardHref}
              className="btn btn-ghost hidden px-4 py-2 text-sm md:inline-flex"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              className="btn btn-ghost hidden px-4 py-2 text-sm md:inline-flex"
            >
              Sign in
            </Link>
          )}

          {signedIn ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                className="account-avatar"
                aria-label="Account menu"
                title="Account"
                aria-expanded={accountOpen}
                aria-controls={accountId}
                onClick={() => {
                  setAccountOpen((v) => !v);
                  setMenuOpen(false);
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <DefaultAvatar />
                )}
              </button>
              {accountOpen ? (
                <div
                  id={accountId}
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] min-w-[12rem] border border-[var(--line)] bg-[var(--bg)] py-1 shadow-lg"
                >
                  <Link
                    href={dashboardHref}
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--surface)]"
                    onClick={() => setAccountOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/members"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--surface)]"
                    onClick={() => setAccountOpen(false)}
                  >
                    Chapters
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-4 py-2.5 text-left text-sm text-[var(--ink)] hover:bg-[var(--surface)]"
                    onClick={() => void signOut()}
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {showMenuButton ? (
            <button
              type="button"
              className={`icon-btn ${hideCenterNav ? "" : "lg:hidden"}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => {
                setMenuOpen((v) => !v);
                setAccountOpen(false);
              }}
            >
              <MenuIcon open={menuOpen} />
            </button>
          ) : null}
        </div>
      </div>

      {menuPanelVisible ? (
        <div
          id={menuId}
          className={`border-t border-[var(--line)] bg-[var(--nav-bg)] px-4 py-4 ${
            hideCenterNav ? "" : "lg:hidden"
          }`}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="container flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              className="px-3 py-3 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
              onClick={() => setMenuOpen(false)}
            >
              Try demo
            </Link>
            <a
              href="mailto:founders@syntaxia.org?subject=Syntaxia%20pilot"
              className="px-3 py-3 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
              onClick={() => setMenuOpen(false)}
            >
              Email founders
            </a>
            <Link
              href={signedIn ? dashboardHref : "/auth/sign-in"}
              className="px-3 py-3 text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
              onClick={() => setMenuOpen(false)}
            >
              {signedIn ? "Dashboard" : "Sign in"}
            </Link>
            {signedIn ? (
              <button
                type="button"
                className="px-3 py-3 text-left text-sm font-medium text-[var(--ink)] hover:bg-[var(--surface)]"
                onClick={() => void signOut()}
              >
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
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

function DefaultAvatar() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#1f2bd5" />
      <circle cx="20" cy="15" r="7" fill="#ffffff" opacity="0.95" />
      <path d="M6 34c2.5-7 9-10 14-10s11.5 3 14 10" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}
