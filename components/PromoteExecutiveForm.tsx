"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function PromoteExecutiveForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", email.trim())
        .maybeSingle();

      if (!profile) {
        setMessage("No profile found. User must sign up first.");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ global_role: "executive" })
        .eq("id", profile.id);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(`Promoted ${email} to executive.`);
      setEmail("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="executive@email.com"
        className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none"
      />
      <button type="submit" disabled={pending} className="btn btn-ghost px-4 py-2 text-sm">
        Make executive
      </button>
      {message ? <p className="w-full text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}
