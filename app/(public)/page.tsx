import { Suspense } from "react";
import {
  getFrames,
  getTrendingFrames,
  getRecentFrames,
  getCategories,
} from "@/lib/queries";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import MasonryGrid from "@/components/frames/MasonryGrid";
import CategoryPills from "@/components/ui/CategoryPills";
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

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-20 pb-16 text-center">
        <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-semibold tracking-[-0.03em] leading-[1.08] mb-5">
          <span className="block hero-line-1">Visual reference</span>
          <span className="block text-muted hero-line-2">for every frame.</span>
        </h1>
        <p className="hero-sub text-[15px] text-muted max-w-md mx-auto mb-8 leading-relaxed">
          Curated GIFs, stills, and clips for filmmakers, DPs, directors, and designers.
        </p>
        <div className="hero-search">
          <HeroSearch />
        </div>
      </section>

      {/* ── Category filters ─────────────────────────── */}
      <section className="mb-12">
        <CategoryPills categories={categories} />
      </section>

      {/* ── Trending ─────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="mb-16 section-reveal">
          <SectionLabel title="Trending" subtitle="Most viewed" />
          <MasonryGrid frames={trending} priority />
        </section>
      )}

      {/* ── Recently Added ───────────────────────────── */}
      {recent.length > 0 && (
        <section className="mb-16 section-reveal">
          <SectionLabel title="Recently Added" />
          <MasonryGrid frames={recent} />
        </section>
      )}

      {/* ── All Frames — infinite scroll ─────────────── */}
      <section className="mb-16">
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

function SectionLabel({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <span className="text-[13px] text-muted">{subtitle}</span>
      )}
    </div>
  );
}
