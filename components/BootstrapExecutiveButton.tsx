"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function BootstrapExecutiveButton() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run() {
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/bootstrap-executive", { method: "POST" });
      const body = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setMessage(body.error ?? "Failed");
        return;
      }
      setMessage(body.message ?? "Done");
      router.refresh();
    });
  }

  return (
    <div className="rounded-[1.25rem] border border-dashed border-[var(--line)] p-5">
      <p className="text-sm text-[var(--muted)]">
        First-time setup: if no executives exist yet, claim executive access with your signed-in
        account.
      </p>
      <button type="button" disabled={pending} onClick={run} className="btn btn-ghost mt-4 px-4 py-2 text-sm">
        Become first executive
      </button>
      {message ? <p className="mt-3 text-sm text-[var(--brand-soft)]">{message}</p> : null}
    </div>
  );
}
