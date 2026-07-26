import { NextResponse } from "next/server";
import { canAccessChapter, getSessionUser } from "@/lib/auth";
import { getMaterial } from "@/lib/curriculum/catalog";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const chapterId = url.searchParams.get("chapterId");
  const materialId = url.searchParams.get("materialId");
  if (!chapterId || !materialId) {
    return NextResponse.json({ error: "chapterId and materialId required" }, { status: 400 });
  }

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("material_responses")
    .select("answers, updated_at")
    .eq("chapter_id", chapterId)
    .eq("material_id", materialId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    answers: (data?.answers as Record<string, string> | null) ?? {},
    updatedAt: data?.updated_at ?? null,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    chapterId?: string;
    materialId?: string;
    answers?: Record<string, string>;
  };

  if (!body.chapterId || !body.materialId || !body.answers || typeof body.answers !== "object") {
    return NextResponse.json(
      { error: "chapterId, materialId, and answers are required" },
      { status: 400 },
    );
  }

  if (!getMaterial(body.materialId)) {
    return NextResponse.json({ error: "Unknown material" }, { status: 400 });
  }

  const access = await canAccessChapter(body.chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.answers)) {
    if (typeof value === "string") clean[key] = value.slice(0, 20000);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("material_responses").upsert(
    {
      chapter_id: body.chapterId,
      material_id: body.materialId,
      user_id: user.id,
      answers: clean,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "chapter_id,material_id,user_id" },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
