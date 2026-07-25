import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md text-center">
        <p className="eyebrow">Welcome back</p>
        <h1 className="display section-title mt-4 text-4xl text-[var(--ink)]">Sign in</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Members need an account before requesting chapter access.
        </p>
      </div>
      <div className="mt-10">
        <AuthForm mode="signin" nextPath={nextPath} />
      </div>
    </main>
  );
}
