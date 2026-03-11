import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getFrames, getCategories } from "@/lib/queries";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import CategoryPills from "@/components/ui/CategoryPills";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";
  const title = `${category.name} — Visual References`;
  const description =
    category.description ||
    `Browse curated ${category.name.toLowerCase()} visual references for filmmakers and designers.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/category/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, { frames, hasMore }, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getFrames(1, { category: slug }),
    getCategories(),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-muted max-w-xl">{category.description}</p>
        )}
      </div>

      {/* Category filter pills */}
      <div className="mb-8">
        <CategoryPills categories={categories} activeSlug={slug} />
      </div>

      {/* Grid */}
      {frames.length === 0 ? (
        <EmptyState
          title="No frames in this category yet"
          description="Upload frames from the admin dashboard to populate this category."
        />
      ) : (
        <InfiniteGrid
          initialFrames={frames}
          initialHasMore={hasMore}
          fetchUrl={`/api/frames?category=${slug}`}
        />
      )}
    </div>
  );
}
