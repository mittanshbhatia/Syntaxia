"use client";

import { useMemo, useState, useTransition } from "react";
import {
  curriculumCatalog,
  SECTION_KEYS,
  SECTION_META,
  type MaterialSection,
} from "@/lib/curriculum/catalog";

type ChapterOption = { id: string; short_name: string; name: string };

type Props = {
  chapters: ChapterOption[];
  initialChapterId: string;
  initialMaterials: Record<string, boolean>;
  initialSections: Record<string, boolean>;
};

export function VisibilityControls({
  chapters,
  initialChapterId,
  initialMaterials,
  initialSections,
}: Props) {
  const [chapterId, setChapterId] = useState(initialChapterId);
  const [materials, setMaterials] = useState(initialMaterials);
  const [sections, setSections] = useState(initialSections);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const defaults = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const item of curriculumCatalog) map[item.id] = item.defaultVisible;
    return map;
  }, []);

  function materialVisible(id: string) {
    return id in materials ? materials[id] : defaults[id];
  }

  function sectionVisible(key: MaterialSection) {
    return key in sections ? sections[key] : true;
  }

  async function loadChapter(nextId: string) {
    setChapterId(nextId);
    setMessage(null);
    const res = await fetch(`/api/admin/visibility?chapterId=${encodeURIComponent(nextId)}`);
    if (!res.ok) {
      setMessage("Could not load visibility for that chapter.");
      return;
    }
    const data = (await res.json()) as {
      materials: { material_id: string; visible_to_members: boolean }[];
      sections: { section_key: string; visible_to_members: boolean }[];
    };
    const nextMaterials: Record<string, boolean> = {};
    for (const row of data.materials) nextMaterials[row.material_id] = row.visible_to_members;
    const nextSections: Record<string, boolean> = {};
    for (const row of data.sections) nextSections[row.section_key] = row.visible_to_members;
    setMaterials(nextMaterials);
    setSections(nextSections);
  }

  function toggle(kind: "material" | "section", id: string, visible: boolean) {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/admin/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, kind, id, visible }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setMessage(data?.error ?? "Update failed.");
        return;
      }
      if (kind === "material") {
        setMaterials((prev) => ({ ...prev, [id]: visible }));
      } else {
        setSections((prev) => ({ ...prev, [id]: visible }));
      }
      setMessage(visible ? "Now visible to members." : "Hidden from members.");
    });
  }

  return (
    <div className="space-y-6 border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow eyebrow-left">Member visibility</p>
          <h2 className="display mt-3 text-2xl text-[var(--ink)]">What members can see</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Hide sections or individual items for pop quizzes and timed releases. Staff and
            executives still see everything.
          </p>
        </div>
        {chapters.length > 1 ? (
          <label className="text-sm text-[var(--muted)]">
            Chapter
            <select
              className="field mt-1 min-w-[12rem]"
              value={chapterId}
              disabled={pending}
              onChange={(e) => void loadChapter(e.target.value)}
            >
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.short_name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {message ? <p className="text-sm text-[var(--brand-soft)]">{message}</p> : null}

      <div className="space-y-8">
        {SECTION_KEYS.map((section) => {
          const items = curriculumCatalog.filter((m) => m.section === section);
          if (!items.length) return null;
          const open = sectionVisible(section);
          return (
            <div key={section} className="border border-[var(--line)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="display text-xl text-[var(--ink)]">{SECTION_META[section].label}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {SECTION_META[section].description}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  className={`btn px-3 py-2 text-xs ${open ? "btn-primary btn-no-glow" : "btn-ghost"}`}
                  onClick={() => toggle("section", section, !open)}
                >
                  {open ? "Section visible" : "Section hidden"}
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {items.map((item) => {
                  const visible = materialVisible(item.id);
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                        <p className="text-xs text-[var(--muted)]">{item.summary}</p>
                      </div>
                      <button
                        type="button"
                        disabled={pending || !open}
                        className={`btn px-3 py-1.5 text-xs ${visible ? "btn-primary btn-no-glow" : "btn-ghost"}`}
                        onClick={() => toggle("material", item.id, !visible)}
                      >
                        {visible ? "Visible" : "Hidden"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
