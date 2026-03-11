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

export default async function HomePage() {
  const [{ frames, hasMore }, trending, recent, categories] =
    await Promise.all([
      getFrames(1),
      getTrendingFrames(12),
      getRecentFrames(12),
      getCategories(),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-5 w-full">

      {/* ── Page title + category pills ──────────────── */}
      <section className="pt-8 pb-6">
        <h1 className="page-title text-3xl font-bold tracking-tight mb-5">
          Discover
        </h1>
        <CategoryPills categories={categories} />
      </section>

      {/* ── Trending ─────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="mb-10 section-reveal">
          <SectionLabel title="Trending" />
          <div className="masonry-grid">
            {trending.map((frame) => (
              <div key={frame.id} className="masonry-item">
                <FrameCard frame={frame} priority />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recently Added ───────────────────────────── */}
      {recent.length > 0 && (
        <section className="mb-10 section-reveal">
          <SectionLabel title="Recently Added" />
          <div className="masonry-grid">
            {recent.map((frame) => (
              <div key={frame.id} className="masonry-item">
                <FrameCard frame={frame} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── All Frames — infinite scroll ─────────────── */}
      <section className="mb-20">
        <SectionLabel title="All Frames" />
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
      </section>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <h2 className="section-label text-xl font-bold tracking-tight mb-4">
      {title}
    </h2>
  );
}
