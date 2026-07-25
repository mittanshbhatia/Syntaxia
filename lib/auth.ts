import { createClient } from "@/lib/supabase/server";
import type { ChapterRow, MembershipRow, ProfileRow, StaffRow } from "@/lib/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, display_name, global_role")
    .eq("id", user.id)
    .maybeSingle();

  return data as ProfileRow | null;
}

export async function listChapters(): Promise<ChapterRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapters")
    .select("id, slug, name, short_name, region, status, blurb")
    .order("short_name");
  return (data as ChapterRow[]) ?? [];
}

export async function getChapterBySlug(slug: string): Promise<ChapterRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapters")
    .select("id, slug, name, short_name, region, status, blurb")
    .eq("slug", slug)
    .maybeSingle();
  return data as ChapterRow | null;
}

export async function getMembership(
  chapterId: string,
  userId: string,
): Promise<MembershipRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapter_memberships")
    .select("id, chapter_id, user_id, status, track, requested_at, reviewed_at, reviewed_by")
    .eq("chapter_id", chapterId)
    .eq("user_id", userId)
    .maybeSingle();
  return data as MembershipRow | null;
}

export async function getStaffRoles(userId: string): Promise<StaffRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapter_staff")
    .select("id, chapter_id, user_id, role")
    .eq("user_id", userId);
  return (data as StaffRow[]) ?? [];
}

export async function canAccessChapter(chapterId: string, userId: string) {
  const profile = await getProfile();
  if (!profile || profile.id !== userId) return { ok: false as const, reason: "auth" as const };
  if (profile.global_role === "executive") return { ok: true as const, reason: "executive" as const };

  const staff = await getStaffRoles(userId);
  if (staff.some((s) => s.chapter_id === chapterId)) {
    return { ok: true as const, reason: "staff" as const };
  }

  const membership = await getMembership(chapterId, userId);
  if (!membership) return { ok: false as const, reason: "none" as const, membership: null };
  if (membership.status === "approved") {
    return { ok: true as const, reason: "approved" as const, membership };
  }
  return { ok: false as const, reason: membership.status, membership };
}

/** Chapters the user can open in Dashboard (approved / staff / executive). */
export async function getApprovedChapterAccess(userId: string) {
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile || profile.id !== userId) return [];

  const chapters = await listChapters();
  if (profile.global_role === "executive") {
    return chapters
      .filter((c) => c.status === "open")
      .map((chapter) => ({ chapter, reason: "executive" as const }));
  }

  const staff = await getStaffRoles(userId);
  const staffIds = new Set(staff.map((s) => s.chapter_id));

  const { data: memberships } = await supabase
    .from("chapter_memberships")
    .select("chapter_id, status")
    .eq("user_id", userId)
    .eq("status", "approved");

  const approvedIds = new Set((memberships ?? []).map((m) => m.chapter_id as string));

  return chapters
    .filter((c) => c.status === "open" && (staffIds.has(c.id) || approvedIds.has(c.id)))
    .map((chapter) => ({
      chapter,
      reason: staffIds.has(chapter.id) ? ("staff" as const) : ("approved" as const),
    }));
}

/** Directory of approved members for a chapter the viewer can access. */
export async function getChapterDirectory(chapterId: string, viewerId: string) {
  const access = await canAccessChapter(chapterId, viewerId);
  if (!access.ok) return [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];

  const { createClient: createServiceClient } = await import("@supabase/supabase-js");
  const admin = createServiceClient(url, key);

  const { data: memberships } = await admin
    .from("chapter_memberships")
    .select("user_id")
    .eq("chapter_id", chapterId)
    .eq("status", "approved");

  const ids = Array.from(new Set((memberships ?? []).map((m) => m.user_id as string)));
  if (!ids.length) return [];

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, display_name, global_role")
    .in("id", ids)
    .order("display_name");

  return (profiles as ProfileRow[]) ?? [];
}

export async function canEditCurriculum(userId: string) {
  const profile = await getProfile();
  return Boolean(profile && profile.id === userId && profile.global_role === "executive");
}
