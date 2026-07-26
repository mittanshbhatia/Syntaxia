"use client";

import { useEffect, useState, useTransition } from "react";

type Question = {
  key: string;
  concept: string;
  prompt: string;
  choices: string[];
};

type Placement = {
  recommended_track?: string;
  confidence?: number;
  strengths?: string[];
  weaknesses?: string[];
  starting_lesson?: string;
  instructor_override_track?: string | null;
};

type Result = {
  recommendedTrack: string;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  startingLesson: string;
  score: number;
  total: number;
};

export function DiagnosticQuiz({ chapterId }: { chapterId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/diagnostics?chapterId=${encodeURIComponent(chapterId)}`);
      const data = (await res.json()) as {
        questions?: Question[];
        placement?: Placement | null;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not load diagnostic.");
        return;
      }
      setQuestions(data.questions ?? []);
      setPlacement(data.placement ?? null);
    })();
  }, [chapterId]);

  function submit() {
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, answers }),
      });
      const data = (await res.json()) as {
        result?: Result;
        placement?: Placement;
        error?: string;
        warning?: string;
      };
      if (data.result) setResult(data.result);
      if (data.placement) setPlacement(data.placement);
      if (data.error || data.warning) setError(data.error ?? data.warning ?? null);
    });
  }

  const display = result
    ? {
        track: result.recommendedTrack,
        confidence: result.confidence,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        lesson: result.startingLesson,
        score: `${result.score}/${result.total}`,
      }
    : placement
      ? {
          track: placement.instructor_override_track ?? placement.recommended_track ?? "—",
          confidence: placement.confidence ?? 0,
          strengths: placement.strengths ?? [],
          weaknesses: placement.weaknesses ?? [],
          lesson: placement.starting_lesson ?? "—",
          score: null as string | null,
        }
      : null;

  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-6 text-left sm:p-8">
      <p className="eyebrow eyebrow-left">Placement</p>
      <h2 className="display mt-3 text-3xl text-[var(--ink)]">Python foundations diagnostic</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        18 questions across variables, types, conditionals, loops, functions, lists, debugging, and
        algorithms. Instructors can override the recommendation later.
      </p>

      {display ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Recommended track" value={String(display.track).toUpperCase()} />
          <Stat label="Confidence" value={`${display.confidence}%`} />
          <Stat label="Starting lesson" value={display.lesson} />
          <Stat label="Score" value={display.score ?? "Saved"} />
        </div>
      ) : null}

      {display?.strengths?.length || display?.weaknesses?.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="border border-[var(--line)] p-3 text-sm">
            <p className="font-semibold text-[var(--ink)]">Strengths</p>
            <p className="mt-1 text-[var(--muted)]">
              {(display.strengths ?? []).join(", ") || "None flagged"}
            </p>
          </div>
          <div className="border border-[var(--line)] p-3 text-sm">
            <p className="font-semibold text-[var(--ink)]">Weaknesses</p>
            <p className="mt-1 text-[var(--muted)]">
              {(display.weaknesses ?? []).join(", ") || "None flagged"}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-8 space-y-5">
        {questions.map((q, index) => (
          <fieldset key={q.key} className="border border-[var(--line)] p-4">
            <legend className="px-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
              {index + 1}. {q.concept}
            </legend>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink)]">{q.prompt}</p>
            <div className="mt-3 space-y-2">
              {q.choices.map((choice, i) => (
                <label
                  key={choice}
                  className={`flex cursor-pointer items-start gap-2 border px-3 py-2 text-sm ${
                    answers[q.key] === i
                      ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.08)]"
                      : "border-[var(--line)]"
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name={q.key}
                    checked={answers[q.key] === i}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.key]: i }))}
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-[#b45309]">{error}</p> : null}

      <div className="mt-6">
        <button
          type="button"
          className="btn btn-primary btn-no-glow"
          disabled={pending || questions.length === 0}
          onClick={submit}
        >
          {pending ? "Scoring…" : "Submit diagnostic"}
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--bg)] p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}
