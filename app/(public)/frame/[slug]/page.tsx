import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getFrameBySlug, getRelatedFrames } from "@/lib/queries";
import MasonryGrid from "@/components/frames/MasonryGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import FrameDetailSidebar from "@/components/frames/FrameDetailSidebar";

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

      {/* 2-col full-bleed layout */}
      <div className="flex min-h-screen">

        {/* Left — sticky image viewer */}
        <div
          className="frame-detail-left-sticky hidden lg:flex w-[60%] sticky top-13 items-center justify-center p-8"
        >
          {frame.file_url && (
            <Image
              src={frame.file_url}
              alt={frame.title}
              width={1200}
              height={800}
              className="max-h-full max-w-full object-contain rounded-xl"
              priority
              unoptimized={isGif}
            />
          )}
        </div>

        {/* Right — scrollable metadata */}
        <div className="w-full lg:w-[40%] p-8 lg:p-10 overflow-y-auto">

          {/* Mobile image */}
          <div className="lg:hidden mb-8 rounded-xl overflow-hidden frame-detail-left">
            {frame.file_url && (
              <Image
                src={frame.file_url}
                alt={frame.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority
                unoptimized={isGif}
              />
            )}
          </div>

          <FrameDetailSidebar frame={frame} />
        </div>
      </div>

      {/* Related frames */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <SectionHeader title="Related Frames" />
          <MasonryGrid frames={related} />
        </section>
      )}
    </>
  );
}
