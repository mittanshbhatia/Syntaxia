"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  global_role: "executive" | "member";
  created_at: string;
};

type Staff = {
  id: string;
  chapter_id: string;
  user_id: string;
  role: "director" | "instructor";
};

type Chapter = {
  id: string;
  slug: string;
  short_name: string;
  name: string;
};

export function RoleManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [selectedChapter, setSelectedChapter] = useState<Record<string, string>>({});
  const [selectedRole, setSelectedRole] = useState<Record<string, "director" | "instructor">>({});

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/roles");
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load roles");
      return;
    }
    setProfiles(body.profiles ?? []);
    setStaff(body.staff ?? []);
    setChapters(body.chapters ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const staffByUser = useMemo(() => {
    const map = new Map<string, Staff[]>();
    staff.forEach((row) => {
      const list = map.get(row.user_id) ?? [];
      list.push(row);
      map.set(row.user_id, list);
    });
    return map;
  }, [staff]);

  const chapterName = useMemo(() => {
    const map = new Map(chapters.map((c) => [c.id, c.short_name]));
    return (id: string) => map.get(id) ?? "Chapter";
  }, [chapters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) =>
      [p.email ?? "", p.display_name ?? "", p.global_role].join(" ").toLowerCase().includes(q),
    );
  }, [profiles, query]);

  function run(action: string, payload: Record<string, string>) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Action failed");
        return;
      }
      setMessage("Updated.");
      await load();
    });
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="display text-2xl text-[var(--ink)]">People & roles</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Search anyone who signed up, make them an executive, or assign them as a chapter
          director/instructor for a specific school.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email"
        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] outline-none focus:border-[rgba(var(--brand-soft-rgb),0.45)]"
      />

      {error ? <p className="form-error text-sm">{error}</p> : null}
      {message ? <p className="form-success text-sm">{message}</p> : null}

      <div className="space-y-3">
        {filtered.map((person) => {
          const assignments = staffByUser.get(person.id) ?? [];
          const chapterId = selectedChapter[person.id] ?? chapters[0]?.id ?? "";
          const role = selectedRole[person.id] ?? "director";

          return (
            <article
              key={person.id}
              className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="display text-xl text-[var(--ink)]">
                    {person.display_name || person.email || "User"}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{person.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--brand-soft)]">
                    {person.global_role}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {person.global_role === "executive" ? (
                    <button
                      type="button"
                      disabled={pending}
                      className="btn btn-ghost px-3 py-1.5 text-xs"
                      onClick={() => run("unset_executive", { userId: person.id })}
                    >
                      Remove executive
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      className="btn btn-primary px-3 py-1.5 text-xs"
                      onClick={() => run("set_executive", { userId: person.id })}
                    >
                      Make executive
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  Chapter roles
                </p>
                {assignments.length ? (
                  <ul className="mt-2 space-y-2">
                    {assignments.map((row) => (
                      <li
                        key={row.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
                      >
                        <span className="text-[var(--ink)]">
                          {chapterName(row.chapter_id)} · {row.role}
                        </span>
                        <button
                          type="button"
                          disabled={pending}
                          className="text-[var(--muted)] hover:text-[var(--ink)]"
                          onClick={() => run("remove_staff", { staffId: row.id })}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">No chapter staff roles yet.</p>
                )}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_0.8fr_auto]">
                <select
                  value={chapterId}
                  onChange={(e) =>
                    setSelectedChapter((prev) => ({ ...prev, [person.id]: e.target.value }))
                  }
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none"
                >
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.short_name} ,  {chapter.name}
                    </option>
                  ))}
                </select>
                <select
                  value={role}
                  onChange={(e) =>
                    setSelectedRole((prev) => ({
                      ...prev,
                      [person.id]: e.target.value as "director" | "instructor",
                    }))
                  }
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none"
                >
                  <option value="director">Chapter director</option>
                  <option value="instructor">Instructor</option>
                </select>
                <button
                  type="button"
                  disabled={pending || !chapterId}
                  className="btn btn-ghost px-4 py-2 text-sm"
                  onClick={() =>
                    run("assign_staff", {
                      userId: person.id,
                      chapterId,
                      role,
                    })
                  }
                >
                  Assign
                </button>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No signed-up users yet. Have people create accounts first, then assign roles here.
          </p>
        ) : null}
      </div>
    </section>
  );
}
