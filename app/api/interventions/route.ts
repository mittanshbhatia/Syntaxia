import { NextResponse } from "next/server";
import { canAccessChapter, getSessionUser, getStaffRoles, getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const profile = await getProfile();
  const staff = await getStaffRoles(user.id);
  const isStaff =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === chapterId);
  if (!isStaff) return NextResponse.json({ items: [] });

  const supabase = await createClient();
  const items: {
    id: string;
    kind: string;
    title: string;
    detail: string;
    href?: string;
  }[] = [];

  const { count: pendingMembers } = await supabase
    .from("chapter_memberships")
    .select("id", { count: "exact", head: true })
    .eq("chapter_id", chapterId)
    .eq("status", "pending");

  if ((pendingMembers ?? 0) > 0) {
    items.push({
      id: "pending-members",
      kind: "membership",
      title: `${pendingMembers} membership request${pendingMembers === 1 ? "" : "s"} pending`,
      detail: "Review and approve in Admin.",
      href: "/admin",
    });
  }

  const { data: tagged } = await supabase
    .from("code_submissions")
    .select("id, material_id, misconception_tags, created_at, user_id")
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false })
    .limit(40);

  const tagCounts = new Map<string, number>();
  for (const row of tagged ?? []) {
    const tags = (row.misconception_tags as { label?: string; tag?: string }[]) ?? [];
    for (const t of tags) {
      const label = t.label ?? t.tag ?? "Tagged issue";
      tagCounts.set(label, (tagCounts.get(label) ?? 0) + 1);
    }
  }

  for (const [label, count] of Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    items.push({
      id: `tag-${label}`,
      kind: "misconception",
      title: `${count} submission${count === 1 ? "" : "s"} · ${label}`,
      detail: "Open materials to review student code.",
      href: `/dashboard?chapter=`,
    });
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentSubs } = await supabase
    .from("code_submissions")
    .select("id", { count: "exact", head: true })
    .eq("chapter_id", chapterId)
    .gte("created_at", weekAgo);

  if ((recentSubs ?? 0) === 0) {
    items.push({
      id: "no-subs",
      kind: "empty",
      title: "No code submissions this week",
      detail: "Assign a material with a code prompt, or wait for students to submit.",
    });
  }

  return NextResponse.json({ items });
}
