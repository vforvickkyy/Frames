import { Suspense } from "react";
import {
  getFrames,
  getTrendingFrames,
  getRecentFrames,
  getCategories,
} from "@/lib/queries";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InfiniteGrid from "@/components/frames/InfiniteGrid";
import FrameCard from "@/components/frames/FrameCard";
import CategoryPills from "@/components/ui/CategoryPills";
import EmptyState from "@/components/ui/EmptyState";
import { FrameCardSkeleton } from "@/components/ui/Skeletons";
import HomeHero from "@/components/ui/HomeHero";
import RevealSection from "@/components/ui/RevealSection";

const CONTAINER = { maxWidth: "88rem", mx: "auto", px: { xs: 3, md: 4 } };

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "text.disabled",
        mb: 2,
        fontWeight: 500,
      }}
    >
      {children}
    </Typography>
  );
}

export default async function HomePage() {
  const [{ frames, hasMore }, trending, recent, categories] =
    await Promise.all([
      getFrames(1),
      getTrendingFrames(12),
      getRecentFrames(12),
      getCategories(),
    ]);

  return (
    <>
      {/* Hero */}
      <HomeHero />

      {/* Category pills */}
      <Box sx={{ ...CONTAINER, mb: 7 }}>
        <CategoryPills categories={categories} />
      </Box>

      {/* Trending */}
      {trending.length > 0 && (
        <RevealSection>
          <Box sx={{ ...CONTAINER, mb: 8 }}>
            <SectionLabel>Trending</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  xl: "repeat(5, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {trending.map((frame) => (
                <FrameCard key={frame.id} frame={frame} priority />
              ))}
            </Box>
          </Box>
        </RevealSection>
      )}

      {/* Recently Added */}
      {recent.length > 0 && (
        <RevealSection>
          <Box sx={{ ...CONTAINER, mb: 8 }}>
            <SectionLabel>Recently Added</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  xl: "repeat(5, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {recent.map((frame) => (
                <FrameCard key={frame.id} frame={frame} />
              ))}
            </Box>
          </Box>
        </RevealSection>
      )}

      {/* All Frames */}
      <RevealSection>
        <Box sx={{ ...CONTAINER, mb: 12 }}>
          <SectionLabel>All Frames</SectionLabel>
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
        </Box>
      </RevealSection>
    </>
  );
}
