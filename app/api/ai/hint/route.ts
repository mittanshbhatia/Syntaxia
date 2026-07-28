import { NextResponse } from "next/server";
import { getSocraticHints } from "@/lib/grading/hints";
import type { GradeReport } from "@/lib/grading/types";
import { createClient } from "@/lib/supabase/server";

type Body = {
  chapterId?: string;
  materialId?: string;
  promptId: string;
  sourceCode?: string;
  hintIndex?: number;
  report?: GradeReport | null;
  tags?: { tag: string; label: string }[];
};

async function llmHint(opts: {
  promptId: string;
  sourceCode?: string;
  report?: GradeReport | null;
  tags?: { tag: string; label: string }[];
}): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const failed = (opts.report?.results ?? [])
    .filter((r) => !r.passed && r.visibility === "visible")
    .map((r) => r.category)
    .slice(0, 4);

  const system =
    "You are Syntaxia's Socratic CS coach for high-school students. Give ONE short hint (1-2 sentences). Never give the full solution or paste complete working code. Ask a guiding question or point at the misconception.";

  const user = [
    `Prompt id: ${opts.promptId}`,
    opts.tags?.length ? `Misconception tags: ${opts.tags.map((t) => t.label).join(", ")}` : null,
    failed.length ? `Failed visible categories: ${failed.join(", ")}` : null,
    opts.report?.runtimeError ? `Runtime error: ${opts.report.runtimeError}` : null,
    opts.sourceCode ? `Student code:\n\`\`\`python\n${opts.sourceCode.slice(0, 2500)}\n\`\`\`` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  if (!body.promptId) {
    return NextResponse.json({ error: "promptId required" }, { status: 400 });
  }

  const hintIndex = body.hintIndex ?? 0;
  const rule = getSocraticHints({
    promptId: body.promptId,
    report: body.report,
    tags: body.tags,
    hintIndex,
  });

  let hint = rule?.hint ?? null;
  let source: "llm" | "rules" = "rules";
  const total = rule?.total ?? 1;
  const index = rule?.index ?? 0;

  const llm = await llmHint({
    promptId: body.promptId,
    sourceCode: body.sourceCode,
    report: body.report,
    tags: body.tags,
  });
  if (llm) {
    hint = llm;
    source = "llm";
  }

  if (!hint) {
    return NextResponse.json({
      hint: "Try running Grade or Analyze first so the coach can see what failed.",
      source: "rules",
      index: 0,
      total: 1,
    });
  }

  // Persist hint event when signed in
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && body.chapterId && body.materialId) {
      await supabase.from("hint_events").insert({
        chapter_id: body.chapterId,
        user_id: user.id,
        material_id: body.materialId,
        prompt_id: body.promptId,
        hint_index: index,
      });
    }
  } catch {
    // hint_events table may be missing on older DBs
  }

  return NextResponse.json({
    hint,
    source,
    index,
    total,
    nextIndex: Math.min(index + 1, Math.max(total - 1, 0)),
  });
}
