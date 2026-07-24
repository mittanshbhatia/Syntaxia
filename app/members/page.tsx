import type { Metadata } from "next";
import Link from "next/link";
import { ChapterPicker } from "@/components/ChapterPicker";
import { SignOutButton } from "@/components/SignOutButton";
import { getProfile, getSessionUser, listChapters } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { MembershipRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Members",
  description: "Select your APSDS chapter and request access.",
};

export default async function MembersPage() {
  const user = await getSessionUser();
  const profile = await getProfile();
  const chapters = await listChapters();
  const supabase = await createClient();

  let memberships: MembershipRow[] = [];
  if (user) {
    const { data } = await supabase
      .from("chapter_memberships")
      .select("id, chapter_id, user_id, status, track, requested_at, reviewed_at, reviewed_by")
      .eq("user_id", user.id);
    memberships = (data as MembershipRow[]) ?? [];
  }

  const staff = user
    ? ((
        await supabase.from("chapter_staff").select("id, chapter_id, user_id, role").eq("user_id", user.id)
      ).data ?? [])
    : [];

  const canAdmin = profile?.global_role === "executive" || staff.length > 0;

  return (
    <main className="container py-16 sm:py-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[var(--muted)]">
          {user ? (
            <>Signed in as <span className="text-white">{profile?.email ?? user.email}</span></>
          ) : (
            "Not signed in"
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canAdmin ? (
            <Link href="/admin" className="btn btn-ghost px-4 py-2 text-sm">
              Admin panel
            </Link>
          ) : null}
          {user ? <SignOutButton /> : <Link href="/auth/sign-in" className="btn btn-primary px-4 py-2 text-sm">Sign in</Link>}
        </div>
      </div>

      <ChapterPicker chapters={chapters} memberships={memberships} signedIn={Boolean(user)} />
    </main>
  );
}
