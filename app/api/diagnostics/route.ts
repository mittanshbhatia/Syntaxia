import { NextResponse } from "next/server";
import { canAccessChapter, getSessionUser } from "@/lib/auth";
import {
  PYTHON_DIAGNOSTIC_SLUG,
  pythonDiagnosticQuestions,
  scoreDiagnostic,
} from "@/lib/diagnostics/questions";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: placement } = await supabase
    .from("placement_results")
    .select(
      "id, recommended_track, confidence, strengths, weaknesses, starting_lesson, instructor_override_track, created_at",
    )
    .eq("chapter_id", chapterId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    questions: pythonDiagnosticQuestions.map(({ key, concept, prompt, choices }) => ({
      key,
      concept,
      prompt,
      choices,
    })),
    placement,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    chapterId?: string;
    answers?: Record<string, number | null>;
  } | null;

  const chapterId = body?.chapterId;
  const answers = body?.answers ?? {};
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const result = scoreDiagnostic(answers);
  const supabase = await createClient();

  const { data: diagnostic } = await supabase
    .from("diagnostics")
    .select("id")
    .eq("slug", PYTHON_DIAGNOSTIC_SLUG)
    .maybeSingle();

  if (!diagnostic?.id) {
    // Tables may not be migrated yet — still return scored result for UX.
    return NextResponse.json({
      result,
      persisted: false,
      warning: "Diagnostic tables not found. Run supabase/phase4.sql.",
    });
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("diagnostic_attempts")
    .insert({
      diagnostic_id: diagnostic.id,
      chapter_id: chapterId,
      user_id: user.id,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return NextResponse.json(
      { error: attemptError?.message ?? "Could not create attempt", result, persisted: false },
      { status: 500 },
    );
  }

  const responseRows = pythonDiagnosticQuestions.map((q) => ({
    attempt_id: attempt.id,
    question_key: q.key,
    selected_index: answers[q.key] ?? null,
    is_correct: answers[q.key] === q.correctIndex,
  }));

  await supabase.from("diagnostic_responses").insert(responseRows);

  const { data: placement, error: placementError } = await supabase
    .from("placement_results")
    .insert({
      attempt_id: attempt.id,
      chapter_id: chapterId,
      user_id: user.id,
      recommended_track: result.recommendedTrack,
      confidence: result.confidence,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      starting_lesson: result.startingLesson,
    })
    .select(
      "id, recommended_track, confidence, strengths, weaknesses, starting_lesson, instructor_override_track, created_at",
    )
    .single();

  if (placementError) {
    return NextResponse.json(
      { error: placementError.message, result, persisted: false },
      { status: 500 },
    );
  }

  // Soft-update membership track if approved member and no override yet
  await supabase
    .from("chapter_memberships")
    .update({ track: result.recommendedTrack })
    .eq("chapter_id", chapterId)
    .eq("user_id", user.id)
    .eq("status", "approved")
    .is("track", null);

  return NextResponse.json({ result, placement, persisted: true });
}
