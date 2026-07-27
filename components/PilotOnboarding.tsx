"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { pricingPlans, startSteps, syntaxia } from "@/lib/content";

type OrgType = "school" | "club" | "tutoring" | "nonprofit" | "other";
type Track = "l1" | "l2" | "l3";

const orgTypes: { id: OrgType; label: string }[] = [
  { id: "school", label: "School" },
  { id: "club", label: "Student club / chapter" },
  { id: "tutoring", label: "Tutoring / after-school" },
  { id: "nonprofit", label: "Nonprofit" },
  { id: "other", label: "Other" },
];

export function PilotOnboarding({ signedIn }: { signedIn: boolean }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("club");
  const [students, setStudents] = useState("30");
  const [track, setTrack] = useState<Track>("l1");
  const [planId, setPlanId] = useState("founding");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [invites, setInvites] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const steps = useMemo(
    () => ["Organization", "Program", "Plan", "Invites", "Submit"],
    [],
  );

  function submit() {
    if (!signedIn) {
      setMessage("Create an account or sign in, then return here to submit the pilot.");
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const inviteEmails = invites
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          orgType,
          estimatedStudents: Number(students) || undefined,
          track,
          planId,
          contactName,
          contactEmail,
          notes,
          inviteEmails,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        hint?: string;
        organization?: { id: string };
      };
      if (!res.ok) {
        setMessage(data.error ?? data.hint ?? "Could not save pilot request.");
        return;
      }
      setOrgId(data.organization?.id ?? null);
      setStep(steps.length - 1);
      setMessage("Pilot request saved. Founders will follow up by email, Stripe checkout ships next.");
    });
  }

  return (
    <div className="mt-12 border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              step === i
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {step === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              Organization name
              <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block text-sm sm:col-span-2">
              Type
              <select
                className="field mt-1"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as OrgType)}
              >
                {orgTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Your name
              <input
                className="field mt-1"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Contact email
              <input
                className="field mt-1"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Estimated students
              <input
                className="field mt-1"
                value={students}
                onChange={(e) => setStudents(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Starting track
              <select
                className="field mt-1"
                value={track}
                onChange={(e) => setTrack(e.target.value as Track)}
              >
                <option value="l1">L1 Foundations</option>
                <option value="l2">L2 Practical</option>
                <option value="l3">L3 Advanced</option>
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              Notes / launch window
              <textarea
                className="field mt-1 min-h-[5rem]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Fall 2026 after-school cohort"
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {pricingPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setPlanId(plan.id)}
                className={`border p-4 text-left ${
                  planId === plan.id
                    ? "border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.06)]"
                    : "border-[var(--line)]"
                }`}
              >
                <p className="font-semibold text-[var(--ink)]">{plan.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {plan.price}
                  {plan.cadence}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">{plan.blurb}</p>
              </button>
            ))}
            <p className="sm:col-span-2 text-sm text-[var(--muted)]">
              Payment method / Stripe checkout is next on the roadmap. Submitting stores a pending
              pilot, no charge yet.
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <label className="block text-sm">
            Invite instructors (emails, comma or newline separated)
            <textarea
              className="field mt-1 min-h-[6rem]"
              value={invites}
              onChange={(e) => setInvites(e.target.value)}
              placeholder="coach@school.edu"
            />
          </label>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>
              <span className="font-semibold text-[var(--ink)]">{name || ", "}</span> · {orgType} · ~
              {students} students · {track.toUpperCase()} · plan {planId}
            </p>
            <p>Contact: {contactName || ", "} &lt;{contactEmail || ", "}&gt;</p>
            {orgId ? <p className="text-[var(--brand)]">Saved organization id: {orgId}</p> : null}
            <p>
              Prefer email?{" "}
              <a
                className="font-semibold text-[var(--ink)] underline underline-offset-4"
                href={`mailto:${syntaxia.emails.founders}?subject=${encodeURIComponent("Syntaxia pilot")}`}
              >
                {syntaxia.emails.founders}
              </a>
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={pending || Boolean(orgId)}
            onClick={submit}
          >
            {pending ? "Submitting…" : orgId ? "Submitted" : "Submit pilot request"}
          </button>
        )}
        {!signedIn ? (
          <Link href="/auth/sign-up" className="btn btn-ghost">
            Create account
          </Link>
        ) : null}
      </div>

      {message ? <p className="mt-4 text-sm text-[var(--brand-soft)]">{message}</p> : null}

      <div className="mt-10 grid gap-4 border-t border-[var(--line)] pt-8 md:grid-cols-3">
        {startSteps.map((s, i) => (
          <div key={s.title} className="border-t border-[var(--line)] pt-4 md:border-0 md:pt-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 font-semibold text-[var(--ink)]">{s.title}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
