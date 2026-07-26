import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Tour Syntaxia product surfaces with empty states — no invented metrics. Sign in for real chapter data.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
