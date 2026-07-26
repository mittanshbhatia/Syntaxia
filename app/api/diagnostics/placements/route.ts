import { NextResponse } from "next/server";
import { canManageVisibility, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const allowed = await canManageVisibility(user.id, chapterId);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: placements, error } = await supabase
    .from("placement_results")
    .select(
      "id, user_id, recommended_track, instructor_override_track, confidence, starting_lesson, created_at",
    )
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ placements: [], error: error.message });

  const userIds = Array.from(new Set((placements ?? []).map((p) => p.user_id)));
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, email, display_name").in("id", userIds)
    : { data: [] as { id: string; email: string | null; display_name: string | null }[] };

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  const enriched = (placements ?? []).map((p) => ({
    ...p,
    email: byId.get(p.user_id)?.email ?? null,
    display_name: byId.get(p.user_id)?.display_name ?? null,
  }));

  return NextResponse.json({ placements: enriched });
}
