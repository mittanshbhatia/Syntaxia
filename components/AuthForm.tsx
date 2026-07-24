"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm({ mode, nextPath = "/members" }: { mode: Mode; nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const origin = window.location.origin;
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        // If confirmations are off, session may already exist.
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.push(nextPath);
          router.refresh();
          return;
        }
        setMessage(
          "Account created. If email confirmation is on, check your inbox — then sign in.",
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(nextPath);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      {mode === "signup" ? (
        <label className="block">
          <span className="mb-2 block text-sm text-[var(--muted)]">Display name</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-white outline-none focus:border-[rgba(155,180,255,0.45)]"
            placeholder="Your name"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm text-[var(--muted)]">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-white outline-none focus:border-[rgba(155,180,255,0.45)]"
          placeholder="you@school.edu"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-[var(--muted)]">Password</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-white outline-none focus:border-[rgba(155,180,255,0.45)]"
          placeholder="At least 6 characters"
        />
      </label>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--mint)]">{message}</p> : null}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <Link
              href="/auth/sign-up"
              className="text-white underline decoration-[var(--brand)] underline-offset-4"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-white underline decoration-[var(--brand)] underline-offset-4"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
