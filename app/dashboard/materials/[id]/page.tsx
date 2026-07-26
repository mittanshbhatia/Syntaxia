import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  canAccessChapter,
  getMemberChapters,
  getProfile,
  getSessionUser,
  getStaffRoles,
} from "@/lib/auth";
import { getMaterial, SECTION_META } from "@/lib/curriculum/catalog";
import { getMaterialBody, googleDocPreviewUrl } from "@/lib/curriculum/view";
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

  const body = getMaterialBody(material);
  const previewUrl = googleDocPreviewUrl(material.driveUrl);
  const memberCanSee = isMaterialVisible(material, visibility, false);
  const hiddenFromMembers = asStaff && !memberCanSee;
  const backHref = `/dashboard?chapter=${selected.slug}`;

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

      <div className="mt-6 flex flex-wrap gap-3">
        {material.driveUrl ? (
          <a
            href={material.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-no-glow"
          >
            Open in Drive
          </a>
        ) : null}
        {material.assetUrl ? (
          <a href={material.assetUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
            Open file
          </a>
        ) : null}
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

      {previewUrl ? (
        <div className="mt-10 overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
          <iframe
            title={`${material.title} preview`}
            src={previewUrl}
            className="h-[70vh] w-full bg-white"
            loading="lazy"
          />
        </div>
      ) : null}

      {body ? (
        <article className="mt-10 border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <pre className="whitespace-pre-wrap font-[family-name:var(--font-dm)] text-sm leading-relaxed text-[var(--ink)]">
            {body}
          </pre>
        </article>
      ) : null}

      {!body && !material.assetUrl && !previewUrl ? (
        <p className="mt-10 max-w-2xl text-sm text-[var(--muted)]">
          This item is linked to APSDS Drive. Use Open in Drive to view the full files.
        </p>
      ) : null}
    </main>
  );
}
