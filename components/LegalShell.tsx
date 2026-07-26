export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="container max-w-3xl py-16 text-left sm:py-24">
      <p className="eyebrow eyebrow-left">Legal</p>
      <h1 className="display mt-4 text-4xl text-[var(--ink)]">{title}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Updated {updated}</p>
      <div className="legal-prose mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)] [&_a]:text-[var(--brand)] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--ink)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
