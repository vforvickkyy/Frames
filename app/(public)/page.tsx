import { Suspense } from "react";
import {
  getFrames,
  getTrendingFrames,
  getRecentFrames,
  getCategories,
} from "@/lib/queries";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import FrameCard from "@/components/frames/FrameCard";
import CategoryPills from "@/components/ui/CategoryPills";
import EmptyState from "@/components/ui/EmptyState";
import { FrameCardSkeleton } from "@/components/ui/Skeletons";
import HomeHero from "@/components/ui/HomeHero";
import RevealSection from "@/components/ui/RevealSection";

export default async function HomePage() {
  const [{ frames, hasMore }, trending, recent, categories] =
    await Promise.all([
      getFrames(1),
      getTrendingFrames(12),
      getRecentFrames(12),
      getCategories(),
    ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────── */}
      <HomeHero />

      {/* ── Category pills ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <CategoryPills categories={categories} />
      </div>

      {/* ── Trending ─────────────────────────────── */}
      {trending.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-6 mb-14">
          <p className="section-faint text-[11px] uppercase tracking-[0.12em] mb-4">
            Trending
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {trending.map((frame) => (
              <FrameCard key={frame.id} frame={frame} priority />
            ))}
          </div>
        </RevealSection>
      )}

      {/* ── Recently Added ───────────────────────── */}
      {recent.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-6 mb-14">
          <p className="section-faint text-[11px] uppercase tracking-[0.12em] mb-4">
            Recently Added
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {recent.map((frame) => (
              <FrameCard key={frame.id} frame={frame} />
            ))}
          </div>
        </RevealSection>
      )}

      {/* ── All Frames ───────────────────────────── */}
      <RevealSection className="max-w-7xl mx-auto px-6 mb-20">
        <p className="section-faint text-[11px] uppercase tracking-[0.12em] mb-4">
          All Frames
        </p>
        {frames.length === 0 ? (
          <EmptyState
            title="No frames yet"
            description="Upload the first frame from the admin dashboard."
          />
        ) : (
          <Suspense
            fallback={
              <div className="masonry-grid">
                {Array.from({ length: 20 }).map((_, i) => (
                  <FrameCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <InfiniteGrid
              initialFrames={frames}
              initialHasMore={hasMore}
              fetchUrl="/api/frames"
            />
          </Suspense>
        )}
      </RevealSection>
    </>
  );
}
