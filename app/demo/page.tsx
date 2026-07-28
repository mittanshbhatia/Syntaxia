"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { demoAccounts, demoFeatures, demoWalkthrough, type DemoRole } from "@/lib/demo";
import { createClient } from "@/lib/supabase/client";

export default function DemoPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  function ensureAndEnter(role: DemoRole) {
    startTransition(async () => {
      setMessage(null);
      try {
        const ensureAll = await fetch("/api/demo/ensure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const seed = (await ensureAll.json()) as { error?: string; ok?: boolean };
        if (!ensureAll.ok || seed.error) {
          setMessage(seed.error ?? "Could not prepare demo accounts.");
          return;
        }

        const account = demoAccounts[role];
        const supabase = createClient();
        await supabase.auth.signOut();
        const { error } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password,
        });
        if (error) {
          setMessage(error.message);
          return;
        }
        setReady(true);
        setMessage(`Signed in as ${account.displayName}. Opening the live product…`);
        router.push(account.next);
        router.refresh();
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Demo login failed");
      }
    });
  }

  return (
    <main className="container py-14 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Live product demo</p>
        <h1 className="display mt-4 text-4xl text-[var(--ink)] sm:text-5xl">
          Use the real Syntaxia system.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Not a mock. These buttons create/sign into seeded demo accounts on the live product:
          placement, Monaco code workspace, AI coach hints, interventions, attendance, and admin
          controls.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Shared demo password: <code className="text-[var(--ink)]">{demoAccounts.student.password}</code>
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {(Object.keys(demoAccounts) as DemoRole[]).map((role) => {
          const account = demoAccounts[role];
          return (
            <button
              key={role}
              type="button"
              disabled={pending}
              onClick={() => ensureAndEnter(role)}
              className="border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition hover:border-[var(--brand)]"
            >
              <p className="font-semibold text-[var(--ink)]">
                Enter as {account.role === "pending" ? "pending student" : account.role}
              </p>
              <p className="mt-2 text-xs text-[var(--brand)]">{account.email}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">{account.blurb}</p>
            </button>
          );
        })}
      </div>

      {message ? (
        <p className="mt-6 text-center text-sm text-[var(--brand-soft)]">{message}</p>
      ) : null}
      {ready ? (
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          If nothing opens, go to{" "}
          <Link href="/dashboard" className="underline underline-offset-4">
            /dashboard
          </Link>
          .
        </p>
      ) : null}

      <section className="mt-16">
        <div className="text-center">
          <p className="eyebrow">Working features</p>
          <h2 className="display mt-4 text-3xl text-[var(--ink)]">Control surface checklist</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted)]">
            Everything below is wired to Supabase APIs and the member dashboard, not marketing
            cards.
          </p>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {demoFeatures.map((f) => (
            <Link
              key={f.id}
              href={f.href}
              className="border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition hover:border-[var(--brand)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-[var(--ink)]">{f.title}</h3>
                <span className="bg-[rgba(22,163,74,0.12)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#15803d]">
                  {f.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{f.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="eyebrow eyebrow-left">YC walkthrough</p>
        <h2 className="display mt-4 text-3xl text-[var(--ink)]">Four clicks to the real loop</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {demoWalkthrough.map((s) => (
            <div key={s.step} className="border-t border-[var(--line)] pt-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                {s.step}
              </p>
              <p className="mt-2 font-semibold text-[var(--ink)]">{s.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            disabled={pending}
            onClick={() => ensureAndEnter("student")}
          >
            {pending ? "Preparing…" : "Start student demo"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={pending}
            onClick={() => ensureAndEnter("director")}
          >
            Start director demo
          </button>
          <Link href="/admin" className="btn btn-ghost">
            Open admin controls
          </Link>
        </div>
      </section>
    </main>
  );
}
