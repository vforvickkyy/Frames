import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFrameBySlug, getRelatedFrames } from "@/lib/queries";
import MasonryGrid from "@/components/frames/MasonryGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import { ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const frame = await getFrameBySlug(slug);
  if (!frame) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";
  const imageUrl = frame.thumbnail_url || frame.file_url;
  const title = frame.title;
  const description =
    frame.description ||
    `Visual reference: ${frame.title}${frame.category ? ` — ${frame.category.name}` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/frame/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/frame/${slug}`,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function FramePage({ params }: Props) {
  const { slug } = await params;
  const frame = await getFrameBySlug(slug);
  if (!frame) notFound();

  const related = await getRelatedFrames(frame.id, frame.category_id);
  const isGif = frame.file_url?.toLowerCase().endsWith(".gif");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isGif ? "VideoObject" : "ImageObject",
    name: frame.title,
    description: frame.description,
    contentUrl: frame.file_url,
    thumbnailUrl: frame.thumbnail_url || frame.file_url,
    url: `${siteUrl}/frame/${slug}`,
    uploadDate: frame.created_at,
    creator: frame.creator
      ? {
          "@type": "Person",
          name: frame.creator.display_name,
          url: `${siteUrl}/creator/${frame.creator.username}`,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Frames
          </Link>
          {frame.category && (
            <>
              <span>/</span>
              <Link
                href={`/category/${frame.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {frame.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium truncate">{frame.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Main media */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-surface border border-border">
              {frame.file_url && (
                <Image
                  src={frame.file_url}
                  alt={frame.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                  unoptimized={isGif}
                />
              )}
            </div>

            {/* View count */}
            <p className="text-xs text-muted mt-3">
              {frame.view_count.toLocaleString()} views
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Title & description */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-3">
                {frame.title}
              </h1>
              {frame.description && (
                <p className="text-sm text-muted leading-relaxed">
                  {frame.description}
                </p>
              )}
            </div>

            {/* Creator */}
            {frame.creator && (
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                  Creator
                </p>
                <Link
                  href={`/creator/${frame.creator.username}`}
                  className="flex items-center gap-3 group"
                >
                  {frame.creator.avatar_url ? (
                    <Image
                      src={frame.creator.avatar_url}
                      alt={frame.creator.display_name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-sm font-semibold">
                      {frame.creator.display_name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium group-hover:underline">
                      {frame.creator.display_name}
                    </p>
                    <p className="text-xs text-muted">
                      @{frame.creator.username}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Category */}
            {frame.category && (
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                  Category
                </p>
                <Link
                  href={`/category/${frame.category.slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-border hover:bg-surface-hover transition-colors"
                >
                  {frame.category.name}
                </Link>
              </div>
            )}

            {/* Tags */}
            {frame.tags && frame.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {frame.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 rounded-full text-xs bg-surface border border-border hover:bg-surface-hover transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Technique notes */}
            {frame.technique_notes && (
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                  Technique
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  {frame.technique_notes}
                </p>
              </div>
            )}

            {/* Source link */}
            {frame.file_url && (
              <a
                href={frame.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <ExternalLink size={14} />
                View original
              </a>
            )}
          </div>
        </div>

        {/* Related frames */}
        {related.length > 0 && (
          <section className="mt-16">
            <SectionHeader title="Related Frames" />
            <MasonryGrid frames={related} />
          </section>
        )}
      </div>
    </>
  );
}
