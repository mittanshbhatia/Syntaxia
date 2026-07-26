import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import {
  getMemberChapters,
  getProfile,
  getSessionUser,
  getStaffRoles,
} from "@/lib/auth";
import { getMaterial, SECTION_META } from "@/lib/curriculum/catalog";
import { materialBodies } from "@/lib/curriculum/bodies";
import { getChapterVisibility, isMaterialVisible } from "@/lib/visibility";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const material = getMaterial(id);
  return {
    title: material?.title ?? "Material",
    description: material?.summary,
  };
}

export default async function MaterialPage({ params }: Props) {
  const { id } = await params;
  const material = getMaterial(id);
  if (!material) notFound();

  const user = await getSessionUser();
  if (!user) redirect(`/auth/sign-in?next=/dashboard/materials/${id}`);

  const profile = await getProfile();
  const memberChapters = await getMemberChapters(user.id);
  if (!memberChapters.length) redirect("/members");

  const primary = memberChapters[0];
  const staff = await getStaffRoles(user.id);
  const asStaff =
    profile?.global_role === "executive" || staff.some((s) => s.chapter_id === primary.id);
  const visibility = await getChapterVisibility(primary.id);

  if (!isMaterialVisible(material, visibility, asStaff)) {
    redirect("/dashboard");
  }

  const body = material.bodyKey ? materialBodies[material.bodyKey] : null;
  const hiddenFromMembers =
    asStaff &&
    !(material.id in visibility.materials
      ? visibility.materials[material.id]
      : material.defaultVisible);

  return (
    <main className="container py-16 sm:py-24">
      <Reveal>
        <Link href="/dashboard" className="btn btn-ghost px-4 py-2 text-sm">
          Back to dashboard
        </Link>
        <p className="eyebrow eyebrow-left mt-8">{SECTION_META[material.section].label}</p>
        <h1 className="display mt-4 max-w-3xl text-4xl text-[var(--ink)] sm:text-5xl">
          {material.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">{material.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-soft)]">
          {material.track !== "all" ? <span>{material.track.toUpperCase()}</span> : null}
          {hiddenFromMembers ? <span className="text-[var(--muted)]">Hidden from members</span> : null}
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
      </Reveal>

      {material.assetUrl ? (
        <div className="mt-10 border border-[var(--line)] bg-[var(--surface)] p-4">
          <Image
            src={material.assetUrl}
            alt={material.title}
            width={1200}
            height={1600}
            className="mx-auto h-auto w-full max-w-3xl"
          />
        </div>
      ) : null}

      {body ? (
        <article className="mt-10 border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <pre className="whitespace-pre-wrap font-[family-name:var(--font-dm)] text-sm leading-relaxed text-[var(--ink)]">
            {body}
          </pre>
        </article>
      ) : !material.assetUrl ? (
        <p className="mt-10 max-w-2xl text-sm text-[var(--muted)]">
          Full files live in the APSDS Drive. Use Open in Drive for slides, code, worksheets, and
          videos tied to this item.
        </p>
      ) : null}
    </main>
  );
}
