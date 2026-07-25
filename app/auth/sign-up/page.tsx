import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md text-center">
        <p className="eyebrow">Create account</p>
        <h1 className="display section-title mt-4 text-4xl text-[var(--ink)]">Join Syntaxia</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          After signing up, pick your chapter and wait for instructor approval.
        </p>
      </div>
      <div className="mt-10">
        <AuthForm mode="signup" nextPath="/dashboard" />
      </div>
    </main>
  );
}
