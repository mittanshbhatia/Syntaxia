"use client";

import { useEffect, useState } from "react";

type Props = {
  chapterId: string;
  chapterName: string;
  canEdit: boolean;
};

type CurriculumRow = {
  id: string;
  title: string;
  body: string;
};

export function CurriculumPanel({ chapterId, chapterName, canEdit }: Props) {
  const [items, setItems] = useState<CurriculumRow[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/curriculum?chapterId=${encodeURIComponent(chapterId)}`);
      const data = (await res.json()) as { items?: CurriculumRow[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load curriculum");
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!canEdit) return;
    setError(null);
    const res = await fetch("/api/curriculum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, title, body }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not save");
      return;
    }
    setTitle("");
    setBody("");
    await load();
  }

  return (
    <div>
      <p className="eyebrow">Curriculum</p>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--muted)]">
        {canEdit
          ? `Executives can edit curriculum for ${chapterName}.`
          : `Read-only curriculum for ${chapterName}. Edit access is executive-only.`}
      </p>

      {loading ? <p className="mt-4 text-center text-sm text-[var(--muted)]">Loading…</p> : null}
      {error ? <p className="mt-4 text-center text-sm text-red-400">{error}</p> : null}

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-[var(--line)] px-4 py-3">
            <p className="text-center font-semibold text-[var(--ink)]">{item.title}</p>
            <p className="mt-1 text-center text-sm text-[var(--muted)]">{item.body}</p>
          </li>
        ))}
        {!loading && !items.length ? (
          <li className="rounded-2xl border border-[var(--line)] px-4 py-3 text-center text-sm text-[var(--muted)]">
            No curriculum items yet.
          </li>
        ) : null}
      </ul>

      {canEdit ? (
        <form onSubmit={onSave} className="mt-5 space-y-3">
          <input
            className="field"
            placeholder="Unit title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="field min-h-24"
            placeholder="Notes / outline"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Add curriculum item
          </button>
        </form>
      ) : null}
    </div>
  );
}
