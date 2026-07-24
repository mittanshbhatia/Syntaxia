"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type ChapterOption = { id: string; short_name: string };

export function AssignStaffForm({ chapters }: { chapters: ChapterOption[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const [role, setRole] = useState<"director" | "instructor">("director");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .ilike("email", email.trim())
        .maybeSingle();

      if (profileError || !profile) {
        setMessage("No profile found for that email. They must sign up first.");
        return;
      }

      const { error } = await supabase.from("chapter_staff").upsert(
        {
          chapter_id: chapterId,
          user_id: profile.id,
          role,
        },
        { onConflict: "chapter_id,user_id" },
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(`Assigned ${email} as ${role}.`);
      setEmail("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-[1.5rem] border border-[var(--line)] p-5 md:grid-cols-[1.2fr_1fr_0.8fr_auto]">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="member@email.com"
        className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-white outline-none"
      />
      <select
        value={chapterId}
        onChange={(e) => setChapterId(e.target.value)}
        className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-white outline-none"
      >
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.short_name}
          </option>
        ))}
      </select>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "director" | "instructor")}
        className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-white outline-none"
      >
        <option value="director">Director</option>
        <option value="instructor">Instructor</option>
      </select>
      <button type="submit" disabled={pending} className="btn btn-primary px-4 py-2 text-sm">
        Assign
      </button>
      {message ? <p className="md:col-span-4 text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}
