import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCreatorByUsername, getCreatorFrames } from "@/lib/queries";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import EmptyState from "@/components/ui/EmptyState";
import { Globe, Instagram } from "lucide-react";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";
  const title = `${creator.display_name} — Frames`;
  const description =
    creator.bio ||
    `Browse visual references by ${creator.display_name} on Frames.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/creator/${username}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/creator/${username}`,
      images: creator.avatar_url
        ? [{ url: creator.avatar_url, width: 400, height: 400, alt: creator.display_name }]
        : [],
    },
  };
}

export default async function CreatorPage({ params }: Props) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) notFound();

  const { frames, hasMore } = await getCreatorFrames(creator.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Creator header */}
      <div className="flex items-start gap-6 mb-12">
        {creator.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.display_name}
            width={80}
            height={80}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-surface-hover flex items-center justify-center text-2xl font-semibold shrink-0">
            {creator.display_name[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {creator.display_name}
          </h1>
          <p className="text-sm text-muted mb-3">@{creator.username}</p>

          {creator.bio && (
            <p className="text-sm text-muted max-w-xl mb-4 leading-relaxed">
              {creator.bio}
            </p>
          )}

          {/* Links */}
          <div className="flex items-center gap-4">
            {creator.website && (
              <a
                href={creator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <Globe size={14} />
                Website
              </a>
            )}
            {creator.instagram && (
              <a
                href={`https://instagram.com/${creator.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <Instagram size={14} />
                {creator.instagram}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Frames grid */}
      <div>
        <p className="text-sm text-muted mb-6">
          {frames.length > 0
            ? `${frames.length}+ visual references`
            : "No frames yet"}
        </p>

        {frames.length === 0 ? (
          <EmptyState
            title="No frames from this creator yet"
            description="Check back soon."
          />
        ) : (
          <InfiniteGrid
            initialFrames={frames}
            initialHasMore={hasMore}
            fetchUrl={`/api/frames?creator=${creator.id}`}
          />
        )}
      </div>
    </div>
  );
}
