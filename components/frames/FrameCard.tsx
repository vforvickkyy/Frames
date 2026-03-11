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

  const imageUrl = frame.file_url || frame.thumbnail_url;
  const isGif = imageUrl?.toLowerCase().endsWith(".gif");

  return (
    <Link href={`/frame/${frame.slug}`} className="fade-in block group frame-card">

      {/* Image container */}
      <div className="relative overflow-hidden rounded-2xl">

        {/* Skeleton while loading */}
        {!loaded && (
          <div className="skeleton w-full min-h-[180px]" />
        )}

        {imageUrl && (
          <Image
            src={imageUrl}
            alt={frame.title}
            width={600}
            height={400}
            className={`frame-card-img w-full h-auto object-cover ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            priority={priority}
            unoptimized={isGif}
          />
        )}

        {/* Gradient overlay — CSS class handles opacity on group-hover */}
        <div className="frame-card-overlay" />

        {/* Info panel — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5
                        opacity-0 translate-y-1.5
                        group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300 ease-out">
          <p className="text-white text-[13px] font-medium leading-snug line-clamp-2 mb-1">
            {frame.title}
          </p>
          {frame.creator && (
            <p className="text-white/50 text-[11px]">
              {frame.creator.display_name}
            </p>
          )}
          {frame.tags && frame.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {frame.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/70
                             backdrop-blur-sm border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Category badge — top right */}
        {frame.category && (
          <div className="absolute top-2.5 right-2.5
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-250">
            <span className="text-[10px] px-2 py-0.5 rounded-full
                             bg-black/60 text-white/70
                             backdrop-blur-md border border-white/10">
              {frame.category.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
