import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live product demo",
  description:
    "Enter seeded Syntaxia demo accounts and use the real product: placement, code workspace, AI coach, interventions, and admin controls.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
