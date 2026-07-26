import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Student privacy",
  description: "How Syntaxia handles student and minor data.",
};

export default function StudentPrivacyPage() {
  return (
    <LegalShell title="Student privacy" updated="July 26, 2026">
      <p>
        Many Syntaxia users are minors. We collect the minimum personal information needed to operate a
        CS program and give organizations tools to manage consent and deletion.
      </p>
      <ul>
        <li>Prefer school-controlled or parent-aware accounts where appropriate.</li>
        <li>Support grade/age range instead of unnecessary identifiers.</li>
        <li>Allow data export and deletion requests.</li>
        <li>Do not sell student data or use submissions for advertising.</li>
        <li>Explain when AI providers receive assignment context for hints.</li>
      </ul>
      <p>
        Related: <Link href="/privacy">Privacy policy</Link> ·{" "}
        <Link href="/data-deletion">Data deletion</Link> ·{" "}
        <a href={`mailto:${syntaxia.emails.privacy}`}>{syntaxia.emails.privacy}</a>
      </p>
    </LegalShell>
  );
}
