"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Frame } from "@/types";

interface FrameCardProps {
  frame: Frame;
  priority?: boolean;
}

export default function FrameCard({ frame, priority = false }: FrameCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = frame.file_url || frame.thumbnail_url;
  const isGif = imageUrl?.toLowerCase().endsWith(".gif");

  return (
    <Link
      href={`/frame/${frame.slug}`}
      className="masonry-item fade-in block group frame-card rounded-xl overflow-hidden bg-surface relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {!loaded && (
          <div className="skeleton absolute inset-0" style={{ minHeight: "160px" }} />
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={frame.title}
            width={600}
            height={400}
            className={`w-full h-auto object-cover transition-all duration-500 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            onLoad={() => setLoaded(true)}
            priority={priority}
            unoptimized={isGif}
          />
        )}
      </div>

      {/* Hover overlay — gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Info — slides up on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ease-out ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <p className="text-white text-sm font-medium leading-tight line-clamp-2">
          {frame.title}
        </p>
        {frame.creator && (
          <p className="text-white/60 text-xs mt-0.5">
            {frame.creator.display_name}
          </p>
        )}
        {frame.tags && frame.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {frame.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white/80 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Category badge — top left */}
      {frame.category && (
        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {frame.category.name}
          </span>
        </div>
      )}
    </Link>
  );
}
