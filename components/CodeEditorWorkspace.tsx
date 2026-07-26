"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { classifyMisconceptions } from "@/lib/diagnostics/misconceptions";

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
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const pyodideRef = useRef<PyodideLike | null>(null);

  const analyze = useCallback(() => {
    const found = classifyMisconceptions(value);
    setTags(found);
    if (!found.length) {
      setMessage("No common misconception patterns detected in this source.");
    }
  }, [value]);

  async function runPython() {
    setRunning(true);
    setMessage(null);
    setStdout(null);
    setStderr(null);
    try {
      if (!pyodideRef.current) {
        setMessage("Loading in-browser Python runtime…");
        pyodideRef.current = await ensurePyodide();
      }
      const pyodide = pyodideRef.current;
      let out = "";
      let err = "";
      pyodide.setStdout({ batched: (s) => { out += `${s}\n`; } });
      pyodide.setStderr({ batched: (s) => { err += `${s}\n`; } });

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
      setMessage("Ran in your browser via Pyodide (not a remote sandbox). Server isolation still coming.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStderr(msg);
      setStdout(null);
      setTags(classifyMisconceptions(value));
      setMessage("Runtime error — see stderr.");
    } finally {
      setRunning(false);
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
          ? "Submission saved with misconception tags."
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
      <div className="overflow-hidden rounded-lg border border-[var(--line)]">
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
        Standard input
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
        <button type="button" className="btn btn-ghost px-4 py-2 text-sm" onClick={analyze}>
          Analyze
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

      {stdout ? (
        <pre className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">
          {stdout}
        </pre>
      ) : null}
      {stderr ? (
        <pre className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 text-xs text-[#b45309]">
          {stderr}
        </pre>
      ) : null}

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.tag}
              className="rounded-full bg-[rgba(180,83,9,0.12)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#b45309]"
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
