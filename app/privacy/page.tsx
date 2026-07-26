import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Syntaxia privacy policy.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy policy" updated="July 26, 2026">
      <p>
        Syntaxia (&quot;we&quot;) provides software for schools, clubs, and after-school programs to run
        computer science education. This policy explains what we collect and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account information such as name, email, and organization affiliation.</li>
        <li>Program data such as chapter membership, cohort assignment, attendance, and role.</li>
        <li>Learning data such as diagnostic answers, lesson progress, code submissions, and hints.</li>
        <li>Billing information processed by our payment provider when you subscribe.</li>
        <li>Technical logs needed for security, reliability, and abuse prevention.</li>
      </ul>
      <h2>How we use information</h2>
      <ul>
        <li>To operate curriculum, placement, submissions, and instructor analytics.</li>
        <li>To communicate about your account, organization, and product changes.</li>
        <li>To secure the platform and prevent abuse.</li>
        <li>To improve Syntaxia using aggregated or de-identified insights where possible.</li>
      </ul>
      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell student data.</li>
        <li>We do not use student submissions for advertising.</li>
        <li>We do not train public models on identifiable student data without proper permission.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We share data with service providers that help us run Syntaxia (hosting, authentication, email,
        payments, error monitoring). Instructors and administrators in your organization can access
        student learning data as needed to teach. We may disclose information if required by law.
      </p>
      <h2>Retention and deletion</h2>
      <p>
        You may request export or deletion through your organization administrator or by emailing{" "}
        <a href={`mailto:${syntaxia.emails.privacy}`}>{syntaxia.emails.privacy}</a>. See also{" "}
        <Link href="/data-deletion">Data deletion</Link>.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${syntaxia.emails.privacy}`}>{syntaxia.emails.privacy}</a>
      </p>
    </LegalShell>
  );
}
