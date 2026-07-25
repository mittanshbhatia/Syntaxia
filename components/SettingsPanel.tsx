"use client";

import { useTheme } from "@/components/ThemeProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsPanel({ open, onClose }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div
        className={`settings-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`settings-panel ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-label="Settings"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="display text-2xl text-[var(--ink)]">Settings</p>
          <button type="button" className="btn btn-ghost px-3 py-2 text-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-8 space-y-4">
          <p className="eyebrow !mx-0">Appearance</p>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Theme</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Dark is the default look.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn px-3 py-2 text-xs ${theme === "dark" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                type="button"
                className={`btn px-3 py-2 text-xs ${theme === "light" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
