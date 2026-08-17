"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  SiteContentField,
  SiteContentKey,
  SiteContentMap,
} from "@/lib/site-content";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ProposedChange = {
  key: SiteContentKey;
  value: string;
  reason: string;
};

type Props = {
  fields: readonly SiteContentField[];
  initialContent: SiteContentMap;
};

const EXAMPLE_PROMPTS = [
  "Make the hero more direct for school leaders.",
  "Shorten the product section without changing its meaning.",
  "Give the closing call to action more urgency.",
];

const AI_EDITOR_BRIEF = `You are helping an executive edit Syntaxia's homepage copy. Keep the current facts intact, do not invent metrics or claims, and return a short field-by-field proposal for review. The editable fields are hero copy, problem, product, how it works, differentiation, proof, founder story, and the closing call to action.`;

const AI_SHORTCUTS = [
  { label: "ChatGPT", href: `https://chatgpt.com/?q=${encodeURIComponent(AI_EDITOR_BRIEF)}` },
  { label: "Gemini", href: "https://gemini.google.com/app" },
  { label: "Claude", href: "https://claude.ai/new" },
  { label: "Grok", href: "https://grok.com/" },
] as const;

export function ExecutiveSiteEditor({ fields, initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Tell me what you want to change on the homepage. I will prepare a field-by-field proposal, and nothing goes live until you approve it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [proposal, setProposal] = useState<ProposedChange[]>([]);
  const [busy, setBusy] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortcutNotice, setShortcutNotice] = useState<string | null>(null);

  const fieldsByKey = useMemo(
    () => new Map(fields.map((field) => [field.key, field])),
    [fields],
  );

  async function requestProposal(message: string) {
    const trimmed = message.trim();
    if (trimmed.length < 2 || busy || publishing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setProposal([]);
    setError(null);
    setBusy(true);

    try {
      const response = await fetch("/api/admin/site-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "propose",
          message: trimmed,
          history: nextMessages.slice(-8).map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        changes?: ProposedChange[];
      };

      if (!response.ok) throw new Error(result.error || "Unable to prepare edits");

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.message || "I prepared the following changes for review.",
        },
      ]);
      setProposal(result.changes ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to prepare edits");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestProposal(input);
  }

  async function publishProposal() {
    if (!proposal.length || publishing || busy) return;
    setPublishing(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/site-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", changes: proposal }),
      });
      const result = (await response.json()) as {
        error?: string;
        content?: SiteContentMap;
      };

      if (!response.ok || !result.content) {
        throw new Error(result.error || "Unable to publish edits");
      }

      const publishedCount = proposal.length;
      setContent(result.content);
      setProposal([]);
      setMessages((current) => [
        ...current,
        {
          id: `published-${Date.now()}`,
          role: "assistant",
          content: `${publishedCount} ${publishedCount === 1 ? "change is" : "changes are"} now live on the homepage.`,
        },
      ]);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Unable to publish edits");
    } finally {
      setPublishing(false);
    }
  }

  async function openAiShortcut(href: string, label: string) {
    try {
      await navigator.clipboard.writeText(AI_EDITOR_BRIEF);
      setShortcutNotice(`The Syntaxia editing brief was copied. Paste it into ${label} if it is not already filled in.`);
    } catch {
      setShortcutNotice(`Open ${label}, then describe the homepage copy change you want to make.`);
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-left">Executive AI editor</p>
          <h2 className="mt-4 text-left text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Edit homepage copy with ChatGPT
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            The assistant can change only the approved copy fields below. Every proposal stays in
            draft until an executive publishes it.
          </p>
        </div>
        <Link href="/" target="_blank" rel="noreferrer" className="btn btn-ghost px-4 py-2 text-sm">
          Open live homepage
        </Link>
      </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <div className="border border-[var(--line)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Website assistant</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Executive access only</p>
            </div>
            <span className="border border-[rgba(var(--brand-soft-rgb),0.45)] bg-[rgba(var(--brand-rgb),0.16)] px-2.5 py-1 text-xs text-[var(--brand-soft)]">
              Review required
            </span>
          </div>

          <div className="max-h-[34rem] min-h-[22rem] space-y-4 overflow-y-auto p-5" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] border p-4 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto border-[rgba(var(--brand-soft-rgb),0.4)] bg-[rgba(var(--brand-rgb),0.16)] text-[var(--ink)]"
                    : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]"
                }`}
              >
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                  {message.role === "user" ? "You" : "Syntaxia editor"}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {busy ? (
              <div className="max-w-[88%] border border-[var(--line)] bg-[var(--bg)] p-4 text-sm text-[var(--muted)]">
                Preparing a safe proposal…
              </div>
            ) : null}
          </div>

          <div className="border-t border-[var(--line)] p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={busy || publishing}
                  onClick={() => void requestProposal(prompt)}
                  className="border border-[var(--line)] px-3 py-2 text-left text-xs text-[var(--muted)] transition hover:border-[var(--line-2)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <label htmlFor="executive-editor-prompt" className="sr-only">
                Describe the website changes you want
              </label>
              <textarea
                id="executive-editor-prompt"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="Example: Make the hero clearer for principals while keeping the current factual claims."
                className="field min-h-28 resize-y"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[var(--muted)]">{input.length}/2000</p>
                <button
                  type="submit"
                  disabled={busy || publishing || input.trim().length < 2}
                  className="btn btn-primary px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Preparing…" : "Prepare edits"}
                </button>
              </div>
            </form>
            {error ? <p className="form-error mt-3 text-sm">{error}</p> : null}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-[var(--line)] p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Use your own AI account</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Open a private chat with your preferred provider. Syntaxia does not receive your
              account credentials or chat history.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {AI_SHORTCUTS.map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => void openAiShortcut(shortcut.href, shortcut.label)}
                  className="btn btn-ghost px-3 py-2 text-sm"
                >
                  Open {shortcut.label}
                </button>
              ))}
            </div>
            {shortcutNotice ? (
              <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]" role="status">
                {shortcutNotice}
              </p>
            ) : null}
          </div>

          <div className="border border-[var(--line)] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Draft proposal</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {proposal.length ? `${proposal.length} changes awaiting approval` : "No pending changes"}
                </p>
              </div>
              {proposal.length ? (
                <button
                  type="button"
                  onClick={() => setProposal([])}
                  className="text-xs font-semibold text-[var(--muted)] underline underline-offset-4"
                >
                  Discard
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              {proposal.map((change) => {
                const field = fieldsByKey.get(change.key);
                return (
                  <article key={change.key} className="border border-[var(--line)] bg-[var(--surface)] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-soft)]">
                      {field?.section}
                    </p>
                    <h3 className="mt-2 text-left text-sm font-semibold text-[var(--ink)]">
                      {field?.label ?? change.key}
                    </h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                          Current
                        </p>
                        <p className="mt-1 text-[var(--muted)] line-through decoration-[var(--danger)]">
                          {content[change.key]}
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--success)]">
                          Proposed
                        </p>
                        <p className="mt-1 text-[var(--ink)]">{change.value}</p>
                      </div>
                    </div>
                    <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs leading-relaxed text-[var(--muted)]">
                      {change.reason}
                    </p>
                  </article>
                );
              })}
              {!proposal.length ? (
                <p className="border border-dashed border-[var(--line)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                  Ask the assistant for a change to generate a reviewable proposal.
                </p>
              ) : null}
            </div>

            {proposal.length ? (
              <button
                type="button"
                disabled={publishing || busy}
                onClick={() => void publishProposal()}
                className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishing ? "Publishing…" : `Publish ${proposal.length} ${proposal.length === 1 ? "change" : "changes"}`}
              </button>
            ) : null}
          </div>

          <div className="border border-[var(--line)] p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Editable homepage fields</p>
            <div className="mt-4 space-y-3">
              {fields.map((field) => (
                <div key={field.key} className="border-t border-[var(--line)] pt-3 first:border-0 first:pt-0">
                  <p className="text-sm text-[var(--ink)]">{field.label}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{field.section}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
