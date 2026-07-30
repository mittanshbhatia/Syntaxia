import Link from "next/link";

type ChapterOption = {
  id: string;
  slug: string;
  short_name: string;
};

type Props = {
  chapters: ChapterOption[];
  selectedSlug: string;
  /** Path without query, e.g. `/dashboard` or `/dashboard/program` */
  basePath: string;
};

export function SegmentedChapterControl({ chapters, selectedSlug, basePath }: Props) {
  if (chapters.length < 2) return null;

  return (
    <div className="segmented-control" role="tablist" aria-label="Choose organization">
      {chapters.map((chapter) => {
        const active = chapter.slug === selectedSlug;
        return (
          <Link
            key={chapter.id}
            href={`${basePath}?chapter=${chapter.slug}`}
            role="tab"
            aria-selected={active}
            className={`segmented-control-item${active ? " is-active" : ""}`}
          >
            {chapter.short_name}
          </Link>
        );
      })}
    </div>
  );
}
