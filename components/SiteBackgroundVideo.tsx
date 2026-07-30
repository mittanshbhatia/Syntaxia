/** Fixed site-wide muted background film (every page). */
export function SiteBackgroundVideo() {
  return (
    <div className="site-bg-video" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="auto">
        <source src="/media/14596810_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
