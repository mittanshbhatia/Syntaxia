import { NextResponse } from "next/server";
import { canAccessChapter, getProfile, getSessionUser, getStaffRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  const scope = new URL(request.url).searchParams.get("scope"); // self | chapter
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const profile = await getProfile();
  const staff = await getStaffRoles(user.id);
  const isStaff =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === chapterId);

  const supabase = await createClient();

  if (scope === "chapter") {
    if (!isStaff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { data, error } = await supabase
      .from("concept_mastery")
      .select("user_id, concept, mastery, updated_at")
      .eq("chapter_id", chapterId)
      .order("mastery", { ascending: true })
      .limit(200);
    if (error) return NextResponse.json({ rows: [], error: error.message });

    const userIds = [...new Set((data ?? []).map((r) => r.user_id as string))];
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, display_name, email").in("id", userIds)
      : { data: [] as { id: string; display_name: string | null; email: string | null }[] };
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

    return NextResponse.json({
      rows: (data ?? []).map((r) => ({
        ...r,
        display_name: byId.get(r.user_id)?.display_name ?? null,
        email: byId.get(r.user_id)?.email ?? null,
      })),
    });
  }

  const { data, error } = await supabase
    .from("concept_mastery")
    .select("concept, mastery, updated_at, evidence")
    .eq("chapter_id", chapterId)
    .eq("user_id", user.id)
    .order("concept");

  if (error) return NextResponse.json({ rows: [], error: error.message });
  return NextResponse.json({ rows: data ?? [] });
}
