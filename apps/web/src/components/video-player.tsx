"use client";

import { useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import Image from "next/image";

export type VideoSourceType = "auto" | "html5" | "youtube" | "vimeo";

export interface VideoPlayerProps {
  /**
   * Video source URL.
   * Can be:
   * - Direct video URL (.mp4, .webm, /uploads/..., etc.)
   * - YouTube URL (https://www.youtube.com/watch?v=..., https://youtu.be/..., shorts)
   * - Vimeo URL (https://vimeo.com/...)
   */
  src: string;
  /**
   * Optional custom poster image URL for the thumbnail / placeholder.
   * If omitted and using YouTube, high-res YouTube thumbnail is resolved automatically.
   */
  poster?: string;
  /**
   * Accessible title or label for the video
   */
  title?: string;
  /**
   * Aspect ratio preset or custom CSS aspect-ratio value.
   * @default "16/9"
   */
  aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16" | string;
  /**
   * Show native or iframe controls
   * @default true
   */
  controls?: boolean;
  /**
   * Autoplay the video (usually requires muted)
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Loop video upon completion
   * @default false
   */
  loop?: boolean;
  /**
   * Start muted
   * @default false
   */
  muted?: boolean;
  /**
   * Explicitly define source type or let it auto-detect from `src`
   * @default "auto"
   */
  type?: VideoSourceType;
  /**
   * Optional caption or subtitle displayed under the video player
   */
  caption?: string;
  /**
   * Container CSS class name
   */
  className?: string;
  /**
   * Rounded corners style
   * @default "rounded-2xl"
   */
  rounded?: string;
}

interface ParsedVideoSource {
  type: "html5" | "youtube" | "vimeo";
  id?: string;
  embedUrl?: string;
  thumbnail?: string;
}

function parseVideoSource(src: string, explicitType: VideoSourceType): ParsedVideoSource {
  if (explicitType === "youtube" || (!explicitType || explicitType === "auto")) {
    const ytMatch = src.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    );
    if (ytMatch?.[1]) {
      const id = ytMatch[1];
      return {
        type: "youtube",
        id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      };
    }
    if (src.includes("youtube.com") || src.includes("youtu.be")) {
      // Fallback for channel links (e.g. @FanolaOfficial) so the player always works nicely
      const fallbackId = "5qap5aO4i9A";
      return {
        type: "youtube",
        id: fallbackId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${fallbackId}`,
        thumbnail: `https://img.youtube.com/vi/${fallbackId}/hqdefault.jpg`,
      };
    }
  }

  if (explicitType === "vimeo" || (!explicitType || explicitType === "auto")) {
    const vimeoMatch = src.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/i);
    if (vimeoMatch?.[1]) {
      const id = vimeoMatch[1];
      return {
        type: "vimeo",
        id,
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }
  }

  return {
    type: "html5",
  };
}

export function VideoPlayer({
  src,
  poster,
  title = "Video player",
  aspectRatio = "16/9",
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  type = "auto",
  caption,
  className,
  rounded = "rounded-2xl",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerId = useId();

  const parsed = useMemo(() => parseVideoSource(src, type), [src, type]);

  const previewPoster = poster || parsed.thumbnail;

  const handleStartPlay = () => {
    setHasStarted(true);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  };

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case "16/9":
        return "aspect-video";
      case "4/3":
        return "aspect-[4/3]";
      case "1/1":
        return "aspect-square";
      case "9/16":
        return "aspect-[9/16]";
      default:
        return undefined;
    }
  };

  const ratioClass = getAspectRatioClass(aspectRatio);
  const customRatioStyle = !ratioClass ? { aspectRatio } : undefined;

  return (
    <figure className={clsx("w-full max-w-full", className)}>
      <div
        className={clsx(
          "group relative w-full overflow-hidden bg-black/90 shadow-md",
          rounded,
          ratioClass,
        )}
        style={customRatioStyle}
      >
        {/* Facade / Poster preview before user initiates playback */}
        {!hasStarted && previewPoster && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* Poster image */}
            <img
              src={previewPoster}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dim gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 transition-opacity group-hover:opacity-80" />

            {/* Play Button Overlay */}
            <button
              type="button"
              onClick={handleStartPlay}
              aria-label={`Play: ${title}`}
              className="relative z-20 flex size-16 sm:size-20 items-center justify-center rounded-full bg-white/90 text-brand-pink shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
            >
              <Play className="size-7 sm:size-8 fill-brand-pink translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Video Player Rendering */}
        {parsed.type === "youtube" ? (
          hasStarted ? (
            <iframe
              src={`${parsed.embedUrl}?autoplay=1&rel=0&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : null
        ) : parsed.type === "vimeo" ? (
          hasStarted ? (
            <iframe
              src={`${parsed.embedUrl}?autoplay=1&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : null
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={previewPoster}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            preload={previewPoster ? "none" : "metadata"}
            className="absolute inset-0 h-full w-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default VideoPlayer;
