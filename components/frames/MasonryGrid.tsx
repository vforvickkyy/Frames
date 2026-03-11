import FrameCard from "./FrameCard";
import type { Frame } from "@/types";

interface MasonryGridProps {
  frames: Frame[];
  priority?: boolean;
}

export default function MasonryGrid({ frames, priority = false }: MasonryGridProps) {
  if (frames.length === 0) return null;

  return (
    <div className="masonry-grid">
      {frames.map((frame, i) => (
        <FrameCard
          key={frame.id}
          frame={frame}
          priority={priority && i < 8}
        />
      ))}
    </div>
  );
}
