import type { Metadata } from "next";
import { Suspense } from "react";
import { getFrames, getTags, getCategories } from "@/lib/queries";
import MasonryGrid from "@/components/frames/MasonryGrid";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import EmptyState from "@/components/ui/EmptyState";
import SearchFilters from "@/components/ui/SearchFilters";
import { FrameCardSkeleton } from "@/components/ui/Skeletons";

interface Props {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";
  const title = q ? `"${q}" — Search` : "Search Frames";
  const description = q
    ? `Visual references for "${q}" on Frames.`
    : "Search curated visual references by technique, mood, category, and more.";

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/search` },
    robots: { index: false, follow: true },
  };
}

async function SearchResults({
  q,
  category,
  tag,
}: {
  q?: string;
  category?: string;
  tag?: string;
}) {
  const { frames, hasMore } = await getFrames(1, {
    search: q,
    category,
    tag,
  });

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  const fetchUrl = `/api/frames?${params.toString()}`;

  if (frames.length === 0) {
    return (
      <EmptyState
        title="No results found"
        description={
          q
            ? `No frames match "${q}". Try a different search term.`
            : "No frames match your filters."
        }
      />
    );
  }

  return (
    <InfiniteGrid
      initialFrames={frames}
      initialHasMore={hasMore}
      fetchUrl={fetchUrl}
    />
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, category, tag } = await searchParams;
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
        {!q && (
          <p className="text-muted text-sm">
            Find visual references by technique, mood, or category.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8">
        <SearchFilters
          categories={categories}
          tags={tags}
          activeCategory={category}
          activeTag={tag}
          query={q}
        />
      </div>

      {/* Results */}
      <Suspense
        fallback={
          <div className="masonry-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <FrameCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <SearchResults q={q} category={category} tag={tag} />
      </Suspense>
    </div>
  );
}
