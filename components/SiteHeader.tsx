"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { createClient } from "@/lib/supabase/client";

const centerLinks = [
  { href: "/apsds", label: "APSDS" },
  { href: "/members", label: "Members" },
  { href: "/join", label: "Join" },
  { href: "/start", label: "Start" },
];

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const dashboardHref = isMember ? "/dashboard" : "/members";

  return (
    <>
      <header className="nav-blur sticky top-0 z-50 border-b border-[var(--line)]">
        <div className="container relative flex items-center justify-between gap-3 py-3.5">
          <Link href="/" className="display z-10 text-[1.35rem] text-white transition hover:opacity-80">
            Syntaxia
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-white md:flex"
            aria-label="Primary"
          >
            {centerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:opacity-70">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="z-10 flex items-center gap-2">
            {signedIn ? (
              <Link href={dashboardHref} className="btn btn-primary px-4 py-2 text-sm">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/sign-in" className="btn btn-ghost px-4 py-2 text-sm text-white">
                Sign in
              </Link>
            )}

            <button
              type="button"
              className="btn btn-ghost px-3 py-2 text-sm text-white"
              onClick={() => setSettingsOpen(true)}
            >
              Settings
            </button>

            {signedIn ? (
              <button
                type="button"
                className="account-avatar"
                aria-label="Account"
                title="Account"
              >
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
              className="btn btn-ghost px-3 py-2 text-sm text-white md:hidden"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              Menu
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="border-t border-[var(--line)] px-4 py-4 md:hidden" aria-label="Mobile">
            <ul className="space-y-1">
              {centerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
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
