import { NextResponse } from "next/server";
import { canAccessChapter, getSessionUser, getStaffRoles, getProfile } from "@/lib/auth";
import { classifyMisconceptions } from "@/lib/diagnostics/misconceptions";
import { applyMasteryFromGrade } from "@/lib/mastery/update";
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
  const profile = await getProfile();
  const staff = await getStaffRoles(user.id);
  const isStaff =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === chapterId);

  let query = supabase
    .from("code_submissions")
    .select(
      "id, material_id, prompt_id, user_id, source_code, stdout, stderr, tests_passed, tests_total, misconception_tags, created_at",
    )
    .eq("chapter_id", chapterId)
    .eq("material_id", materialId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!isStaff) query = query.eq("user_id", user.id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ submissions: [], error: error.message });
  return NextResponse.json({ submissions: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    chapterId?: string;
    materialId?: string;
    promptId?: string;
    sourceCode?: string;
    stdout?: string;
    stderr?: string;
    testsPassed?: number | null;
    testsTotal?: number | null;
  } | null;

  if (!body?.chapterId || !body.materialId || typeof body.sourceCode !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const access = await canAccessChapter(body.chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const code = body.sourceCode.slice(0, 50000);
  const tags = classifyMisconceptions(code);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("code_submissions")
    .insert({
      chapter_id: body.chapterId,
      material_id: body.materialId,
      prompt_id: body.promptId ?? "main",
      user_id: user.id,
      source_code: code,
      stdout: body.stdout?.slice(0, 10000) ?? null,
      stderr: body.stderr?.slice(0, 10000) ?? null,
      tests_passed: body.testsPassed ?? null,
      tests_total: body.testsTotal ?? null,
      misconception_tags: tags,
    })
    .select(
      "id, misconception_tags, created_at, tests_passed, tests_total, stdout, stderr",
    )
    .single();

  if (
    typeof body.testsPassed === "number" &&
    typeof body.testsTotal === "number" &&
    body.testsTotal > 0 &&
    body.promptId
  ) {
    try {
      await applyMasteryFromGrade({
        chapterId: body.chapterId,
        userId: user.id,
        materialId: body.materialId,
        promptId: body.promptId,
        passed: body.testsPassed,
        total: body.testsTotal,
        tags,
      });
    } catch {
      // Mastery table may not be migrated yet.
    }
  }

  if (error) {
    return NextResponse.json({
      submission: null,
      misconceptionTags: tags,
      persisted: false,
      error: error.message,
    });
  }

  return NextResponse.json({ submission: data, misconceptionTags: tags, persisted: true });
}
