"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm({ mode, nextPath = "/dashboard" }: { mode: Mode; nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.push(nextPath);
          router.refresh();
          return;
        }
        setMessage(
          "Account created. Check your inbox for a verification email from Syntaxia. Do not reply to that email, then sign in.",
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

  async function signInWithGoogle() {
    setError(null);
    setOauthLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/auth/complete-profile")}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        disabled={oauthLoading || loading}
        className="btn btn-ghost w-full"
      >
        {oauthLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" ? (
          <label className="block">
            <span className="mb-2 block text-sm text-[var(--muted)]">Display name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="field"
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
            className="field"
            placeholder="Your email"
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
            className="field"
            placeholder="At least 6 characters"
          />
        </label>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-[var(--brand-soft)]">{message}</p> : null}

        <button type="submit" disabled={loading || oauthLoading} className="btn btn-primary w-full">
          {loading ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--muted)]">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <Link
              href="/auth/sign-up"
              className="text-[var(--ink)] underline underline-offset-4 decoration-2 decoration-[var(--brand)]"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-[var(--ink)] underline underline-offset-4 decoration-2 decoration-[var(--brand)]"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
