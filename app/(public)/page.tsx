import { Suspense } from "react";
import { getFrames, getTrendingFrames, getRecentFrames, getCategories } from "@/lib/queries";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import MasonryGrid from "@/components/frames/MasonryGrid";
import CategoryPills from "@/components/ui/CategoryPills";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { FrameCardSkeleton } from "@/components/ui/Skeletons";
import HeroSearch from "@/components/ui/HeroSearch";

export default async function HomePage() {
  const [{ frames, hasMore }, trending, recent, categories] =
    await Promise.all([
      getFrames(1),
      getTrendingFrames(12),
      getRecentFrames(12),
      getCategories(),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
          Visual reference
          <br />
          <span className="text-[var(--muted)]">for every frame.</span>
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-8">
          Curated GIFs, images, and clips for filmmakers, DPs, directors, and designers.
        </p>
        <HeroSearch />
      </section>

      {/* Category filters */}
      <section className="mb-10">
        <CategoryPills categories={categories} />
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mb-14">
          <SectionHeader title="Trending" subtitle="Most viewed this week" />
          <MasonryGrid frames={trending} priority />
        </section>
      )}

      {/* Recently Added */}
      {recent.length > 0 && (
        <section className="mb-14">
          <SectionHeader title="Recently Added" />
          <MasonryGrid frames={recent} />
        </section>
      )}

      {/* All frames — infinite scroll */}
      <section className="mb-14">
        <SectionHeader title="All Frames" />
        {frames.length === 0 ? (
          <EmptyState
            title="No frames yet"
            description="Upload the first frame from the admin dashboard."
          />
        ) : (
          <Suspense
            fallback={
              <div className="masonry-grid">
                {Array.from({ length: 12 }).map((_, i) => (
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
      </section>
    </div>
  );
}
