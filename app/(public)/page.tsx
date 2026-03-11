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
    <div className="max-w-6xl mx-auto px-6 w-full">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-24 pb-20 max-w-4xl mx-auto text-center">
        <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-semibold tracking-[-0.04em] leading-[1.04] mb-6 text-white">
          <span className="block hero-line-1">Visual reference</span>
          <span className="block hero-line-2 text-white/35">
            for every frame.
          </span>
        </h1>
        <p className="hero-sub text-[15px] text-white/40 max-w-sm mx-auto mb-10 leading-relaxed">
          Curated GIFs, stills, and clips for filmmakers, DPs, directors, and designers.
        </p>
        <div className="hero-search">
          <HeroSearch />
        </div>
      </section>

      {/* ── Category filters ─────────────────────────── */}
      <section className="mb-14">
        <CategoryPills categories={categories} />
      </section>

      {/* ── Trending ─────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="mb-16 section-reveal">
          <SectionLabel title="Trending" subtitle="Most viewed" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {trending.map((frame) => (
              <FrameCard key={frame.id} frame={frame} priority />
            ))}
          </div>
        </section>
      )}

      {/* ── Recently Added ───────────────────────────── */}
      {recent.length > 0 && (
        <section className="mb-16 section-reveal">
          <SectionLabel title="Recently Added" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {recent.map((frame) => (
              <FrameCard key={frame.id} frame={frame} />
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
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-[13px] font-semibold tracking-widest uppercase text-white/40">
        {title}
      </h2>
      {subtitle && (
        <>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[12px] text-white/25">{subtitle}</span>
        </>
      )}
    </div>
  );
}
