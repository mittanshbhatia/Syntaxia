import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms",
  description: "Syntaxia terms of service.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of service" updated="July 26, 2026">
      <p>
        By using Syntaxia you agree to these terms. If you are accepting on behalf of a school or
        organization, you represent that you have authority to bind that organization.
      </p>
      <h2>The service</h2>
      <p>
        Syntaxia provides software for operating computer science programs, including curriculum
        delivery, memberships, diagnostics, submissions, and analytics. Features marked Coming soon are
        not guaranteed for a specific date.
      </p>
      <h2>Accounts and acceptable use</h2>
      <p>
        Keep credentials secure. Do not attempt to access other organizations&apos; data, abuse code
        execution, spam invitations, or disrupt the service. See{" "}
        <Link href="/acceptable-use">Acceptable use</Link>.
      </p>
      <h2>Customer content</h2>
      <p>
        Organizations own their curriculum customizations and student learning records they upload or
        generate in Syntaxia, subject to student privacy obligations. You grant us a limited license to
        host and process that content to provide the product.
      </p>
      <h2>Payments</h2>
      <p>
        Paid plans, pilots, and refunds are governed by the order, invoice, or checkout terms presented
        at purchase. Failed payments may lead to feature suspension.
      </p>
      <h2>Disclaimer</h2>
      <p>
        The service is provided as available. We do not warrant uninterrupted operation or that
        automated grading and AI hints are error-free.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${syntaxia.emails.founders}`}>{syntaxia.emails.founders}</a>
      </p>
    </LegalShell>
  );
}
