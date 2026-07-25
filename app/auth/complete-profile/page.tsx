"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Shown after Google OAuth when a username/display name is still needed. */
export default function CompleteProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/sign-in");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      const name =
        profile?.display_name ||
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        "";
      if (name && name !== user.email?.split("@")[0]) {
        router.replace("/dashboard");
        return;
      }
      setUsername(name || "");
      setLoading(false);
    })();
  }, [router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Please choose a username with at least 2 characters.");
      setSaving(false);
      return;
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name: trimmed, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    await supabase.auth.updateUser({ data: { display_name: trimmed } });
    router.replace("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="container py-24 text-center">
        <p className="text-[var(--muted)]">Loading…</p>
      </main>
    );
  }

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md text-center">
        <p className="eyebrow">Finish setup</p>
        <h1 className="display section-title mt-4 text-4xl text-[var(--ink)]">Choose a username</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          You signed in with Google. Add a username to finish creating your account.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 text-left">
          <label className="block">
            <span className="mb-2 block text-sm text-[var(--muted)]">Username</span>
            <input
              className="field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              minLength={2}
            />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving ? "Saving…" : "Continue to dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
