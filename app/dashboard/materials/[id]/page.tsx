import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MaterialWorkspace } from "@/components/MaterialWorkspace";
import {
  canAccessChapter,
  getMemberChapters,
  getProfile,
  getSessionUser,
  getStaffRoles,
} from "@/lib/auth";
import { getMaterial, SECTION_META } from "@/lib/curriculum/catalog";
import { getLesson } from "@/lib/curriculum/lessons";
import { getMaterialBody } from "@/lib/curriculum/view";
import { createClient } from "@/lib/supabase/server";
import { getChapterVisibility, isMaterialVisible } from "@/lib/visibility";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ chapter?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const material = getMaterial(id);
  return {
    title: material?.title ?? "Material",
    description: material?.summary,
  };
}

export default async function MaterialPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const material = getMaterial(id);
  if (!material) notFound();

  const user = await getSessionUser();
  if (!user) {
    redirect(
      `/auth/sign-in?next=${encodeURIComponent(
        `/dashboard/materials/${id}${query.chapter ? `?chapter=${query.chapter}` : ""}`,
      )}`,
    );
  }

  const profile = await getProfile();
  const memberChapters = await getMemberChapters(user.id);
  if (!memberChapters.length) redirect("/members");

  const selected =
    memberChapters.find((c) => c.slug === query.chapter) ?? memberChapters[0];

  const access = await canAccessChapter(selected.id, user.id);
  if (!access.ok) redirect("/members");

  const staff = await getStaffRoles(user.id);
  const asStaff =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === selected.id);
  const visibility = await getChapterVisibility(selected.id);

  if (!isMaterialVisible(material, visibility, asStaff)) {
    redirect(`/dashboard?chapter=${selected.slug}`);
  }

  const lesson = getLesson(material.id);
  const body = getMaterialBody(material);
  const memberCanSee = isMaterialVisible(material, visibility, false);
  const hiddenFromMembers = asStaff && !memberCanSee;
  const backHref = `/dashboard?chapter=${selected.slug}`;

  const supabase = await createClient();
  const { data: responseRow } = await supabase
    .from("material_responses")
    .select("answers")
    .eq("chapter_id", selected.id)
    .eq("material_id", material.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const initialAnswers = (responseRow?.answers as Record<string, string> | null) ?? {};

  return (
    <main className="container py-16 sm:py-24">
      <Link href={backHref} className="btn btn-ghost px-4 py-2 text-sm">
        Back to dashboard
      </Link>

      <p className="eyebrow eyebrow-left mt-8">{SECTION_META[material.section].label}</p>
      <h1 className="display mt-4 max-w-3xl text-4xl text-[var(--ink)] sm:text-5xl">
        {material.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">{material.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-soft)]">
        <span>{selected.short_name}</span>
        {material.track !== "all" ? <span>{material.track.toUpperCase()}</span> : null}
        {hiddenFromMembers ? <span className="text-[var(--muted)]">Hidden from members</span> : null}
        {asStaff ? <span className="text-[var(--muted)]">Staff view</span> : null}
      </div>

      {material.assetUrl ? (
        <div className="mt-10 border border-[var(--line)] bg-[var(--surface)] p-4">
          <Image
            src={material.assetUrl}
            alt={material.title}
            width={1200}
            height={1600}
            className="mx-auto h-auto w-full max-w-3xl"
            priority
          />
        </div>
      ) : null}

      {lesson ? (
        <MaterialWorkspace
          chapterId={selected.id}
          materialId={material.id}
          lesson={lesson}
          initialAnswers={initialAnswers}
        />
      ) : body ? (
        <article className="mt-10 border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <pre className="whitespace-pre-wrap font-[family-name:var(--font-dm)] text-sm leading-relaxed text-[var(--ink)]">
            {body}
          </pre>
        </article>
      ) : (
        <p className="mt-10 max-w-2xl text-sm text-[var(--muted)]">
          This material is being prepared for Syntaxia.
        </p>
      )}
    </main>
  );
}
