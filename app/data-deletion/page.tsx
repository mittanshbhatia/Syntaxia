import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { syntaxia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Data deletion",
  description: "Request deletion of Syntaxia account or student data.",
};

export default function DataDeletionPage() {
  return (
    <LegalShell title="Data deletion" updated="July 26, 2026">
      <p>
        To delete an account or student learning records, ask your organization administrator or email{" "}
        <a href={`mailto:${syntaxia.emails.privacy}`}>{syntaxia.emails.privacy}</a> from the address on
        the account. Include the organization name and whether you need full account deletion or specific
        student records.
      </p>
      <p>
        We will verify authority, remove or anonymize personal data that is no longer required, and retain
        only what we must keep for security, legal, or billing obligations.
      </p>
    </LegalShell>
  );
}
