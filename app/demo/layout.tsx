import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Tour Syntaxia’s diagnose → place → learn → intervene loop with verified product facts — no invented student metrics.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
