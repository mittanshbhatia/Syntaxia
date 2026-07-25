import { apsds } from "@/lib/content";

/** Full-bleed muted background film for the home hero. */
export function HeroVideo() {
  return (
    <div className="hero-video" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/brand/APSDS_Logo_Black_Background.png"
      >
        <source src={apsds.video.src} type="video/mp4" />
      </video>
      <div className="hero-video-scrim" />
    </div>
  );
}
