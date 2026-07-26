import { conceptsForPrompt } from "@/lib/grading/catalog";
import { createClient } from "@/lib/supabase/server";

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n * 100) / 100));
}

/**
 * Adjust concept mastery from a graded submission.
 * Pass ratio boosts; failures and misconception tags pull down slightly.
 */
export async function applyMasteryFromGrade(opts: {
  chapterId: string;
  userId: string;
  materialId: string;
  promptId: string;
  passed: number;
  total: number;
  tags: { tag: string }[];
}) {
  const concepts = conceptsForPrompt(opts.materialId, opts.promptId);
  if (!concepts.length || opts.total <= 0) return;

  const ratio = opts.passed / opts.total;
  const delta = ratio >= 1 ? 12 : ratio >= 0.67 ? 6 : ratio >= 0.34 ? 2 : -4;
  const tagPenalty = Math.min(8, opts.tags.length * 2);
  const supabase = await createClient();

  for (const concept of concepts) {
    const { data: existing } = await supabase
      .from("concept_mastery")
      .select("id, mastery, evidence")
      .eq("chapter_id", opts.chapterId)
      .eq("user_id", opts.userId)
      .eq("concept", concept)
      .maybeSingle();

    const prev = Number(existing?.mastery ?? 40);
    const next = clamp(prev + delta - (ratio < 1 ? tagPenalty * 0.25 : 0));
    const evidence = Array.isArray(existing?.evidence) ? [...existing.evidence] : [];
    evidence.push({
      at: new Date().toISOString(),
      materialId: opts.materialId,
      promptId: opts.promptId,
      passed: opts.passed,
      total: opts.total,
      delta,
    });

    if (existing?.id) {
      await supabase
        .from("concept_mastery")
        .update({
          mastery: next,
          evidence: evidence.slice(-20),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("concept_mastery").insert({
        chapter_id: opts.chapterId,
        user_id: opts.userId,
        concept,
        mastery: next,
        evidence: evidence.slice(-20),
      });
    }
  }
}

export async function applyMasteryFromDiagnostic(opts: {
  chapterId: string;
  userId: string;
  byConcept: Record<string, { correct: number; total: number }>;
}) {
  const supabase = await createClient();
  for (const [concept, stats] of Object.entries(opts.byConcept)) {
    if (!stats.total) continue;
    const ratio = stats.correct / stats.total;
    const seed = clamp(35 + ratio * 55);

    const { data: existing } = await supabase
      .from("concept_mastery")
      .select("id, mastery")
      .eq("chapter_id", opts.chapterId)
      .eq("user_id", opts.userId)
      .eq("concept", concept)
      .maybeSingle();

    if (existing?.id) {
      const blended = clamp(Number(existing.mastery) * 0.6 + seed * 0.4);
      await supabase
        .from("concept_mastery")
        .update({ mastery: blended, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("concept_mastery").insert({
        chapter_id: opts.chapterId,
        user_id: opts.userId,
        concept,
        mastery: seed,
        evidence: [{ at: new Date().toISOString(), source: "diagnostic", ...stats }],
      });
    }
  }
}
