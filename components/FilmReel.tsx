import { apsds } from "@/lib/content";

type Props = {
  className?: string;
};

/** Autoplaying muted film (no controls, no captions). */
export function FilmReel({ className = "" }: Props) {
  return (
    <div className={className}>
      <div className="film">
        <div className="film-scrim" />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="aspect-video object-cover"
          aria-label={apsds.video.label}
        >
          <source src={apsds.video.src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
