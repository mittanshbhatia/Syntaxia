"use client";

import { useMemo, useState, useTransition } from "react";
import type { LessonModule } from "@/lib/curriculum/lessons";
import { CodeEditorWorkspace } from "@/components/CodeEditorWorkspace";

type Props = {
  chapterId: string;
  materialId: string;
  lesson: LessonModule;
  initialAnswers: Record<string, string>;
};

export function MaterialWorkspace({ chapterId, materialId, lesson, initialAnswers }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const promptCount = lesson.prompts.length;
  const filledCount = useMemo(
    () => lesson.prompts.filter((p) => (answers[p.id] ?? "").trim().length > 0).length,
    [answers, lesson.prompts],
  );

  function save() {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/materials/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, materialId, answers }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setMessage(data?.error ?? "Could not save answers.");
        return;
      }
      setMessage("Saved on Syntaxia.");
    });
  }

  return (
    <div className="mt-10 space-y-8">
      <article className="border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-sm leading-relaxed text-[var(--muted)] whitespace-pre-wrap">{lesson.intro}</p>
        <div className="mt-8 space-y-8">
          {lesson.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="display text-2xl text-[var(--ink)]">{section.heading}</h2>
              <pre className="mt-3 whitespace-pre-wrap font-[family-name:var(--font-dm)] text-sm leading-relaxed text-[var(--ink)]">
                {section.body}
              </pre>
            </section>
          ))}
        </div>
      </article>

      {promptCount > 0 ? (
        <section className="border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow eyebrow-left">Your answers</p>
              <h2 className="display mt-3 text-2xl text-[var(--ink)]">Work on Syntaxia</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Type everything here. Progress saves to your chapter account ({filledCount}/
                {promptCount} started).
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-no-glow"
              disabled={pending}
              onClick={save}
            >
              {pending ? "Saving…" : "Save answers"}
            </button>
          </div>

          {message ? <p className="mt-4 text-sm text-[var(--brand-soft)]">{message}</p> : null}

          <div className="mt-6 space-y-5">
            {lesson.prompts.map((prompt, index) => (
              <div key={prompt.id} className="border border-[var(--line)] p-4">
                <label className="block" htmlFor={prompt.id}>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-soft)]">
                    {index + 1}. {prompt.label}
                  </span>
                  <span className="mt-2 block text-sm text-[var(--ink)]">{prompt.prompt}</span>
                </label>
                {prompt.kind === "short" ? (
                  <input
                    id={prompt.id}
                    className="field mt-3"
                    value={answers[prompt.id] ?? ""}
                    placeholder={prompt.placeholder ?? "Type your answer"}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))
                    }
                  />
                ) : prompt.kind === "code" ? (
                  <CodeEditorWorkspace
                    chapterId={chapterId}
                    materialId={materialId}
                    promptId={prompt.id}
                    value={answers[prompt.id] ?? ""}
                    placeholder={prompt.placeholder ?? "# Type your code here"}
                    onChange={(next) => setAnswers((prev) => ({ ...prev, [prompt.id]: next }))}
                  />
                ) : (
                  <textarea
                    id={prompt.id}
                    className="field mt-3 min-h-[7rem]"
                    value={answers[prompt.id] ?? ""}
                    placeholder={prompt.placeholder ?? "Type your answer"}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="btn btn-primary btn-no-glow"
              disabled={pending}
              onClick={save}
            >
              {pending ? "Saving…" : "Save answers"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
