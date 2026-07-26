import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Try Syntaxia as a student, instructor, or program director — no account required.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
