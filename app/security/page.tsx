import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Security",
  description: "Syntaxia security overview.",
};

export default function SecurityPage() {
  return (
    <LegalShell title="Security" updated="July 26, 2026">
      <p>
        We protect Syntaxia with role-based access, encrypted transport, and least-privilege service
        credentials. Student submissions and grades are scoped so learners cannot read each other&apos;s
        private work.
      </p>
      <h2>Practices</h2>
      <ul>
        <li>HTTPS everywhere.</li>
        <li>Supabase row-level security for multi-tenant chapter data.</li>
        <li>Service-role keys never shipped to the browser.</li>
        <li>Rate limits on authentication, invitations, and future code execution.</li>
        <li>Isolated runners planned for student code (network disabled, time/memory limits).</li>
      </ul>
      <h2>Report a vulnerability</h2>
      <p>
        Email <a href={`mailto:${syntaxia.emails.founders}`}>{syntaxia.emails.founders}</a> with details.
        Please do not publicly disclose before we can remediate.
      </p>
    </LegalShell>
  );
}
