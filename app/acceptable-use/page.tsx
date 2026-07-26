import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Acceptable use",
  description: "Syntaxia acceptable use policy.",
};

export default function AcceptableUsePage() {
  return (
    <LegalShell title="Acceptable use" updated="July 26, 2026">
      <p>Do not use Syntaxia to:</p>
      <ul>
        <li>Harass, cheat at scale, or share unauthorized contest materials.</li>
        <li>Probe, scrape, or attack the platform or code runners.</li>
        <li>Upload malware or attempt to escape isolated execution environments.</li>
        <li>Impersonate schools, instructors, or students.</li>
        <li>Collect or expose minors&apos; personal information beyond what the product requires.</li>
      </ul>
      <p>
        Report abuse to <a href={`mailto:${syntaxia.emails.support}`}>{syntaxia.emails.support}</a>.
      </p>
    </LegalShell>
  );
}
