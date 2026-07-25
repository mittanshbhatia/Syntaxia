"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ChapterRow, MembershipRow } from "@/lib/types";

type Props = {
  chapters: ChapterRow[];
  memberships: MembershipRow[];
  signedIn: boolean;
};

export function ChapterPicker({ chapters, memberships, signedIn }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const membershipByChapter = useMemo(() => {
    const map = new Map<string, MembershipRow>();
    memberships.forEach((m) => map.set(m.chapter_id, m));
    return map;
  }, [memberships]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter((chapter) =>
      [chapter.name, chapter.short_name, chapter.region ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [chapters, query]);

  function requestAccess(chapterId: string, slug: string) {
    if (!signedIn) {
      router.push(`/auth/sign-in?next=/members/${slug}`);
      return;
    }

    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      const existing = membershipByChapter.get(chapterId);
      if (existing) {
        router.push(`/members/${slug}`);
        return;
      }

      const { error: insertError } = await supabase.from("chapter_memberships").insert({
        chapter_id: chapterId,
        user_id: user.id,
        status: "pending",
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push(`/members/${slug}`);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Member access</p>
        <h1 className="display section-title mt-4 text-4xl text-[var(--ink)] sm:text-5xl lg:text-6xl">
          Where are you from?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Sign in, pick your chapter, then wait for an instructor to approve you before unlocking
          chapter content.
        </p>
        {!signedIn ? (
          <p className="mt-4 text-sm text-[var(--brand-soft)]">
            You need an account first.{" "}
            <Link href="/auth/sign-in" className="underline underline-offset-4 decoration-2">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4 decoration-2">
              create one
            </Link>
            .
          </p>
        ) : null}
      </div>

      <label className="mt-10 block">
        <span className="sr-only">Search chapters</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search school or region"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 text-white outline-none transition placeholder:text-[var(--muted)] focus:border-[rgba(var(--brand-soft-rgb),0.45)]"
        />
      </label>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {filtered.map((chapter) => {
          const membership = membershipByChapter.get(chapter.id);
          const isComing = chapter.status === "coming";

          return (
            <li key={chapter.id}>
              {isComing ? (
                <div className="chapter-card" data-status="coming">
                  <Header chapter={chapter} statusLabel="Coming" statusClass="coming" />
                  <p className="mt-4 text-sm text-[var(--muted)]">{chapter.blurb}</p>
                </div>
              ) : membership?.status === "approved" ? (
                <Link href={`/members/${chapter.slug}`} className="chapter-card block" data-status="open">
                  <Header chapter={chapter} statusLabel="Approved" statusClass="open" />
                  <p className="mt-4 text-sm text-[var(--muted)]">{chapter.blurb}</p>
                  <p className="mt-5 text-sm font-semibold text-white">Enter chapter →</p>
                </Link>
              ) : membership?.status === "pending" ? (
                <Link href={`/members/${chapter.slug}`} className="chapter-card block" data-status="open">
                  <Header chapter={chapter} statusLabel="Pending" statusClass="coming" />
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    Waiting for instructor approval.
                  </p>
                  <p className="mt-5 text-sm font-semibold text-white">View status →</p>
                </Link>
              ) : membership?.status === "rejected" ? (
                <div className="chapter-card" data-status="coming">
                  <Header chapter={chapter} statusLabel="Rejected" statusClass="coming" />
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    This request was rejected. Contact your chapter team.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => requestAccess(chapter.id, chapter.slug)}
                  className="chapter-card"
                  data-status="open"
                >
                  <Header chapter={chapter} statusLabel="Open" statusClass="open" />
                  <p className="mt-4 text-sm text-[var(--muted)]">{chapter.blurb}</p>
                  <p className="mt-5 text-sm font-semibold text-white">
                    {signedIn ? "Request access →" : "Sign in to request →"}
                  </p>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Header({
  chapter,
  statusLabel,
  statusClass,
}: {
  chapter: ChapterRow;
  statusLabel: string;
  statusClass: "open" | "coming";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="display text-xl text-white">{chapter.short_name}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{chapter.name}</p>
        <p className="mt-1 text-xs text-[var(--brand-soft)]">{chapter.region}</p>
      </div>
      <span className={`status-pill ${statusClass}`}>{statusLabel}</span>
    </div>
  );
}
