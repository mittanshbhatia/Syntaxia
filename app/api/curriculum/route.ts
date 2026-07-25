import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { canAccessChapter, canEditCurriculum, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createServiceClient(url, key);
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("curriculum_items")
    .select("id, title, body")
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: true });

  if (error) {
    // Table may not exist yet on older projects.
    return NextResponse.json({ items: [], error: error.message }, { status: 200 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await canEditCurriculum(user.id))) {
    return NextResponse.json(
      { error: "Only executives can change curriculum. Chapter directors have read-only access." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as { chapterId?: string; title?: string; body?: string };
  if (!body.chapterId || !body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "chapterId, title, body required" }, { status: 400 });
  }

  const admin = service();
  if (!admin) return NextResponse.json({ error: "Missing service role" }, { status: 500 });

  const { error } = await admin.from("curriculum_items").insert({
    chapter_id: body.chapterId,
    title: body.title.trim(),
    body: body.body.trim(),
    created_by: user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
