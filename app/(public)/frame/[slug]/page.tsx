import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
      <Box sx={{ display: "flex", minHeight: "100vh" }}>

        {/* Left — sticky image viewer (desktop only) */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            width: "60%",
            flexShrink: 0,
            position: "sticky",
            top: 52,
            height: "calc(100vh - 52px)",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            bgcolor: "background.paper",
          }}
        >
          {frame.file_url && (
            <Image
              src={frame.file_url}
              alt={frame.title}
              width={1200}
              height={800}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: 16,
              }}
              priority
              unoptimized={isGif}
            />
          )}
        </Box>

        {/* Right — scrollable metadata */}
        <Box sx={{ width: { xs: "100%", lg: "40%" }, p: { xs: 3, lg: 5 }, overflowY: "auto" }}>

          {/* Mobile image */}
          <Box
            sx={{
              display: { xs: "block", lg: "none" },
              mb: 4,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            {frame.file_url && (
              <Image
                src={frame.file_url}
                alt={frame.title}
                width={1200}
                height={800}
                style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
                priority
                unoptimized={isGif}
              />
            )}
          </Box>

          <FrameDetailSidebar frame={frame} />
        </Box>
      </Box>

      {/* Related frames */}
      {related.length > 0 && (
        <Box
          component="section"
          sx={{ maxWidth: "88rem", mx: "auto", px: { xs: 3, md: 4 }, py: 8 }}
        >
          <Typography
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "text.disabled",
              mb: 3,
              fontWeight: 500,
            }}
          >
            Related Frames
          </Typography>
          <MasonryGrid frames={related} />
        </Box>
      )}
    </>
  );
}
