import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { getSessionUser } from "@/lib/auth";
import { getMarketingChapter } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getMarketingChapter(slug);
  if (!chapter) return { title: "Chapter" };
  return { title: `Join ${chapter.shortName}` };
}

export default async function JoinChapterPage({ params }: Props) {
  const { slug } = await params;
  const chapter = getMarketingChapter(slug);
  if (!chapter || chapter.status !== "open") notFound();

  const user = await getSessionUser();
  const joinHref = user
    ? `/members?chapter=${chapter.slug}`
    : `/auth/sign-up?next=${encodeURIComponent(`/members?chapter=${chapter.slug}`)}`;

  return (
    <main>
      <section
        className="chapter-hero"
        style={{ backgroundImage: `url(${chapter.logo})` }}
      >
        <div className="chapter-hero-scrim" />
        <div className="container relative z-10 py-24 text-center">
          <Reveal>
            <p className="eyebrow">{chapter.region}</p>
            <h1 className="display section-title mt-4 text-5xl text-white sm:text-6xl">
              {chapter.shortName}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-white/85">{chapter.name}</p>
            {chapter.founding ? (
              <p className="mx-auto mt-4 max-w-xl text-sm font-semibold uppercase tracking-[0.14em] text-white">
                Founding school of APSDS · Executive capital campus
              </p>
            ) : null}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
              {chapter.blurb}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href={joinHref} className="btn btn-primary">
                Join this chapter
              </Link>
              <Link href="/join" className="btn btn-ghost text-white">
                All chapters
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
