"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MasonryGrid from "./MasonryGrid";
import { FrameCardSkeleton } from "@/components/ui/Skeletons";
import type { Frame } from "@/types";

interface InfiniteGridProps {
  initialFrames: Frame[];
  initialHasMore: boolean;
  fetchUrl: string;
}

export default function InfiniteGrid({
  initialFrames,
  initialHasMore,
  fetchUrl,
}: InfiniteGridProps) {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    try {
      const separator = fetchUrl.includes("?") ? "&" : "?";
      const res = await fetch(`${fetchUrl}${separator}page=${nextPage}`);
      const data = await res.json();
      setFrames((prev) => [...prev, ...data.frames]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      // silently ignore network errors
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchUrl]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <MasonryGrid frames={frames} priority />
      {loading && (
        <div className="masonry-grid mt-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <FrameCardSkeleton key={i} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-1" />
    </>
  );
}
