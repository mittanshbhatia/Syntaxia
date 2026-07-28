"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { classifyMisconceptions } from "@/lib/diagnostics/misconceptions";
import { getGradeTests, hasAutograder } from "@/lib/grading/catalog";
import { buildHarness, normalizeStdout, summarizeResults } from "@/lib/grading/harness";
import { getSocraticHints } from "@/lib/grading/hints";
import type { GradeReport } from "@/lib/grading/types";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center border border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--muted)]">
      Loading editor…
    </div>
  ),
});

type Props = {
  chapterId: string;
  materialId: string;
  promptId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type PyodideLike = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideLike>;
  }
}

async function ensurePyodide(): Promise<PyodideLike> {
  if (!window.loadPyodide) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>("script[data-pyodide]");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Pyodide")));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js";
      script.async = true;
      script.dataset.pyodide = "1";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide"));
      document.head.appendChild(script);
    });
  }
  if (!window.loadPyodide) throw new Error("Pyodide unavailable");
  return window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/",
  });
}

export function CodeEditorWorkspace({
  chapterId,
  materialId,
  promptId,
  value,
  onChange,
  placeholder,
}: Props) {
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const [tags, setTags] = useState<{ tag: string; label: string }[]>([]);
  const [report, setReport] = useState<GradeReport | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const [grading, setGrading] = useState(false);
  const pyodideRef = useRef<PyodideLike | null>(null);
  const canGrade = hasAutograder(materialId, promptId);

  const analyze = useCallback(() => {
    const found = classifyMisconceptions(value);
    setTags(found);
    if (!found.length) {
      setMessage("No common misconception patterns detected in this source.");
    } else {
      setMessage(null);
    }
  }, [value]);

  async function loadRuntime() {
    if (!pyodideRef.current) {
      setMessage("Loading in-browser Python runtime (WASM sandbox)…");
      pyodideRef.current = await ensurePyodide();
    }
    return pyodideRef.current;
  }

  async function runPython() {
    setRunning(true);
    setMessage(null);
    setStdout(null);
    setStderr(null);
    try {
      const pyodide = await loadRuntime();
      let out = "";
      let err = "";
      pyodide.setStdout({
        batched: (s) => {
          out += `${s}\n`;
        },
      });
      pyodide.setStderr({
        batched: (s) => {
          err += `${s}\n`;
        },
      });

      const wrapped = `
import sys
from io import StringIO
_stdin = ${JSON.stringify(stdin)}
sys.stdin = StringIO(_stdin)
${value}
`;
      await pyodide.runPythonAsync(wrapped);
      setStdout(out.trim() || "(no stdout)");
      setStderr(err.trim() || null);
      setTags(classifyMisconceptions(value));
      setMessage("Ran in your browser WASM sandbox (Pyodide). Not a remote multi-tenant jail, still isolated from our servers.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStderr(msg);
      setStdout(null);
      setTags(classifyMisconceptions(value));
      setMessage("Runtime error, see stderr.");
    } finally {
      setRunning(false);
    }
  }

  async function grade() {
    const tests = getGradeTests(materialId, promptId);
    if (!tests.length) return;
    setGrading(true);
    setMessage(null);
    setHintText(null);
    try {
      const pyodide = await loadRuntime();
      const outcomes: { id: string; passed: boolean; stdout: string; stderr: string }[] = [];
      let fatal: string | undefined;

      for (const test of tests) {
        let out = "";
        let err = "";
        pyodide.setStdout({
          batched: (s) => {
            out += `${s}\n`;
          },
        });
        pyodide.setStderr({
          batched: (s) => {
            err += `${s}\n`;
          },
        });
        try {
          await pyodide.runPythonAsync(buildHarness(value, test));
          const actual = normalizeStdout(out);
          const expected = normalizeStdout(test.expectedStdout);
          outcomes.push({
            id: test.id,
            passed: actual === expected && !err.trim(),
            stdout: actual,
            stderr: err.trim(),
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          fatal = msg;
          outcomes.push({ id: test.id, passed: false, stdout: "", stderr: msg });
        }
      }

      const next = summarizeResults(materialId, promptId, tests, outcomes, fatal);
      setReport(next);
      setTags(classifyMisconceptions(value));
      setStdout(`${next.passed}/${next.total} tests passed`);
      setStderr(fatal ?? null);
      setMessage(
        next.passed === next.total
          ? "All autograder tests passed."
          : "Some tests failed. Visible failures show a category, hidden cases stay hidden.",
      );
      setHintIndex(0);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessage(msg);
    } finally {
      setGrading(false);
    }
  }

  async function askHint() {
    setMessage(null);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          materialId,
          promptId,
          sourceCode: value,
          hintIndex,
          report,
          tags,
        }),
      });
      const data = (await res.json()) as {
        hint?: string;
        source?: "llm" | "rules";
        index?: number;
        total?: number;
        nextIndex?: number;
        error?: string;
      };
      if (!res.ok || !data.hint) {
        setHintText(data.error ?? "No hints available yet. Try Analyze or Grade first.");
        return;
      }
      setHintText(data.hint);
      setHintIndex(data.nextIndex ?? hintIndex);
      setMessage(
        `Hint ${(data.index ?? 0) + 1} of ${data.total ?? 1} · ${
          data.source === "llm" ? "AI coach (LLM)" : "AI coach (rules)"
        }`,
      );
    } catch {
      // Offline fallback
      const next = getSocraticHints({
        promptId,
        report,
        tags,
        hintIndex,
      });
      if (!next) {
        setHintText("No hints for this prompt yet, try Analyze or Grade first.");
        return;
      }
      setHintText(next.hint);
      setHintIndex(next.index + 1 >= next.total ? next.total - 1 : next.index + 1);
      setMessage(`Hint ${next.index + 1} of ${next.total} · AI coach (rules)`);
    }
  }

  async function submit() {
    setBusy(true);
    setMessage(null);
    try {
      const local = classifyMisconceptions(value);
      setTags(local);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          materialId,
          promptId,
          sourceCode: value,
          stdout,
          stderr,
          testsPassed: report?.passed ?? null,
          testsTotal: report?.total ?? null,
          gradeResults: report?.results ?? null,
        }),
      });
      const data = (await res.json()) as {
        misconceptionTags?: { tag: string; label: string }[];
        persisted?: boolean;
        error?: string;
      };
      if (data.misconceptionTags) setTags(data.misconceptionTags);
      setMessage(
        data.persisted
          ? "Submission saved with misconception tags" +
              (report ? ` · ${report.passed}/${report.total} tests` : "") +
              "."
          : data.error
            ? `Saved locally · sync pending (${data.error})`
            : "Submission recorded locally.",
      );
    } catch {
      setMessage("Could not submit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="overflow-hidden border border-[var(--line)]">
        <Monaco
          height="240px"
          language="python"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>
      {!value ? (
        <p className="text-xs text-[var(--muted)]">{placeholder ?? "# Write Python here"}</p>
      ) : null}

      <label className="block text-xs text-[var(--muted)]">
        Standard input (manual Run)
        <textarea
          className="field mt-1 min-h-[3rem] font-mono text-xs"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Optional stdin for Run"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-ghost px-4 py-2 text-sm"
          disabled={running || !value.trim()}
          onClick={() => void runPython()}
        >
          {running ? "Running…" : "Run"}
        </button>
        {canGrade ? (
          <button
            type="button"
            className="btn btn-ghost px-4 py-2 text-sm"
            disabled={grading || !value.trim()}
            onClick={() => void grade()}
          >
            {grading ? "Grading…" : "Grade"}
          </button>
        ) : null}
        <button type="button" className="btn btn-ghost px-4 py-2 text-sm" onClick={analyze}>
          Analyze
        </button>
        <button
          type="button"
          className="btn btn-ghost px-4 py-2 text-sm"
          onClick={() => void askHint()}
        >
          AI Hint
        </button>
        <button
          type="button"
          className="btn btn-primary btn-no-glow px-4 py-2 text-sm"
          disabled={busy || !value.trim()}
          onClick={() => void submit()}
        >
          {busy ? "Submitting…" : "Submit code"}
        </button>
      </div>

      {report ? (
        <div className="border border-[var(--line)] bg-[var(--bg)] p-3 text-sm">
          <p className="font-semibold text-[var(--ink)]">
            Autograder · {report.passed}/{report.total} passed
          </p>
          <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
            {report.results.map((r) => (
              <li key={r.id}>
                {r.passed ? "✓" : "✗"}{" "}
                {r.visibility === "hidden" ? "Hidden case" : r.category}
                {!r.passed && r.detail ? `, ${r.detail}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hintText ? (
        <div className="border border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.06)] p-3 text-sm text-[var(--ink)]">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
            AI coach
          </p>
          <p className="mt-1">{hintText}</p>
        </div>
      ) : null}

      {stdout ? (
        <pre className="overflow-x-auto border border-[var(--line)] bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">
          {stdout}
        </pre>
      ) : null}
      {stderr ? (
        <pre className="overflow-x-auto border border-[var(--line)] bg-[var(--bg)] p-3 text-xs text-[#b45309]">
          {stderr}
        </pre>
      ) : null}

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.tag}
              className="bg-[rgba(180,83,9,0.12)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#b45309]"
            >
              {t.label}
            </span>
          ))}
        </div>
      ) : null}

      {message ? <p className="text-sm text-[var(--brand-soft)]">{message}</p> : null}
    </div>
  );
}
