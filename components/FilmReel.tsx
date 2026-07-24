"use client";

import { useRef, useState } from "react";
import { apsds } from "@/lib/content";

type Props = {
  className?: string;
  caption?: boolean;
};

export function FilmReel({ className = "", caption = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <div className={className}>
      <div className="film group">
        <div className="film-scrim" />
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="aspect-video object-cover"
        >
          <source src={apsds.video.src} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 z-20 grid place-items-center"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          <span
            className={`grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-black/45 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition duration-500 group-hover:scale-105 ${
              playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {playing ? "Pause" : "Play"}
          </span>
        </button>
      </div>
      {caption ? (
        <p className="mt-3 text-xs tracking-wide text-[var(--muted)]">{apsds.video.label}</p>
      ) : null}
    </div>
  );
}
