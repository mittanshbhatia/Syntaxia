import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getMaterial, SECTION_KEYS, type MaterialSection } from "@/lib/curriculum/catalog";
import { createClient } from "@/lib/supabase/server";

type Gate =
  | { ok: true; userId: string; admin: SupabaseClient; isExecutive: boolean; directorChapters: string[] }
  | { ok: false; response: NextResponse };

async function requireVisibilityManager(): Promise<Gate> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("global_role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: staff } = await supabase
    .from("chapter_staff")
    .select("chapter_id, role")
    .eq("user_id", user.id);

  const isExecutive = profile?.global_role === "executive";
  const directorChapters = (staff ?? [])
    .filter((row) => row.role === "director")
    .map((row) => row.chapter_id as string);

  if (!isExecutive && directorChapters.length === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Only executives and chapter directors can change visibility" },
        { status: 403 },
      ),
    };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Missing Supabase service role" }, { status: 500 }),
    };
  }

  return {
    ok: true,
    userId: user.id,
    isExecutive,
    directorChapters,
    admin: createServiceClient(url, serviceKey),
  };
}

function canManageChapter(gate: Extract<Gate, { ok: true }>, chapterId: string) {
  return gate.isExecutive || gate.directorChapters.includes(chapterId);
}

export async function GET(request: Request) {
  const gate = await requireVisibilityManager();
  if (!gate.ok) return gate.response;

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }
  if (!canManageChapter(gate, chapterId)) {
    return NextResponse.json({ error: "Forbidden for this chapter" }, { status: 403 });
  }

  const [{ data: materials }, { data: sections }] = await Promise.all([
    gate.admin
      .from("chapter_material_visibility")
      .select("material_id, visible_to_members")
      .eq("chapter_id", chapterId),
    gate.admin
      .from("chapter_section_visibility")
      .select("section_key, visible_to_members")
      .eq("chapter_id", chapterId),
  ]);

  return NextResponse.json({
    materials: materials ?? [],
    sections: sections ?? [],
  });
}

export async function POST(request: Request) {
  const gate = await requireVisibilityManager();
  if (!gate.ok) return gate.response;

  const body = (await request.json()) as {
    chapterId?: string;
    kind?: "material" | "section";
    id?: string;
    visible?: boolean;
  };

  if (!body.chapterId || !body.kind || !body.id || typeof body.visible !== "boolean") {
    return NextResponse.json(
      { error: "chapterId, kind, id, and visible are required" },
      { status: 400 },
    );
  }

  if (!canManageChapter(gate, body.chapterId)) {
    return NextResponse.json({ error: "Forbidden for this chapter" }, { status: 403 });
  }

  if (body.kind === "material") {
    if (!getMaterial(body.id)) {
      return NextResponse.json({ error: "Unknown material" }, { status: 400 });
    }
    const { error } = await gate.admin.from("chapter_material_visibility").upsert(
      {
        chapter_id: body.chapterId,
        material_id: body.id,
        visible_to_members: body.visible,
        updated_at: new Date().toISOString(),
        updated_by: gate.userId,
      },
      { onConflict: "chapter_id,material_id" },
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (!SECTION_KEYS.includes(body.id as MaterialSection)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  }

  const { error } = await gate.admin.from("chapter_section_visibility").upsert(
    {
      chapter_id: body.chapterId,
      section_key: body.id,
      visible_to_members: body.visible,
      updated_at: new Date().toISOString(),
      updated_by: gate.userId,
    },
    { onConflict: "chapter_id,section_key" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
