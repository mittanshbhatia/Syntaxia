"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SECTION_KEYS,
  SECTION_META,
  type CurriculumMaterial,
  type MaterialSection,
} from "@/lib/curriculum/catalog";

type Props = {
  materials: CurriculumMaterial[];
  chapterSlug: string;
  isStaffViewer: boolean;
  hiddenMaterialIds: string[];
};

export function DashboardMaterials({
  materials,
  chapterSlug,
  isStaffViewer,
  hiddenMaterialIds,
}: Props) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<MaterialSection | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const hidden = useMemo(() => new Set(hiddenMaterialIds), [hiddenMaterialIds]);

  useEffect(() => {
    if (!filterOpen) return;
    function onPointer(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFilterOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((material) => {
      if (section !== "all" && material.section !== section) return false;
      if (!q) return true;
      return material.title.toLowerCase().includes(q);
    });
  }, [materials, query, section]);

  const filterLabel = section === "all" ? "All types" : SECTION_META[section].label;

  return (
    <div className="mt-10">
      <div className="dashboard-toolbar">
        <label className="dashboard-search">
          <span className="sr-only">Search materials</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title"
            className="dashboard-search-input"
          />
        </label>

        <div className="dashboard-filter" ref={filterRef}>
          <button
            type="button"
            className="btn btn-ghost dashboard-filter-btn"
            aria-expanded={filterOpen}
            aria-haspopup="listbox"
            onClick={() => setFilterOpen((v) => !v)}
          >
            {filterLabel}
            <span aria-hidden>▾</span>
          </button>
          {filterOpen ? (
            <ul className="dashboard-filter-menu" role="listbox">
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={section === "all"}
                  className={section === "all" ? "is-active" : ""}
                  onClick={() => {
                    setSection("all");
                    setFilterOpen(false);
                  }}
                >
                  All types
                </button>
              </li>
              {SECTION_KEYS.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={section === key}
                    className={section === key ? "is-active" : ""}
                    onClick={() => {
                      setSection(key);
                      setFilterOpen(false);
                    }}
                  >
                    {SECTION_META[key].label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((material) => {
          const hiddenFromMembers = isStaffViewer && hidden.has(material.id);
          const href = `/dashboard/materials/${material.id}?chapter=${chapterSlug}`;

          return (
            <Link
              key={material.id}
              href={href}
              className="material-card group block border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[rgba(var(--brand-rgb),0.45)] hover:bg-[var(--surface-2)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-soft)]">
                  {SECTION_META[material.section].label}
                </span>
                {material.track !== "all" ? (
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-soft)]">
                    {material.track.toUpperCase()}
                  </span>
                ) : null}
                {hiddenFromMembers ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Hidden from members
                  </span>
                ) : null}
              </div>
              <h3 className="display mt-2 text-xl text-[var(--ink)]">{material.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{material.summary}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--brand-soft)] group-hover:underline">
                View material →
              </p>
            </Link>
          );
        })}
      </div>

      {!filtered.length ? (
        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-[var(--muted)]">
          No materials match this search
          {section !== "all" ? ` in ${SECTION_META[section].label}` : ""}.
        </p>
      ) : null}
    </div>
  );
}
