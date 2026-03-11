export function FrameCardSkeleton() {
  const heights = ["h-40", "h-52", "h-64", "h-36", "h-48"];
  const height = heights[Math.floor(Math.random() * heights.length)];

  return (
    <div className={`masonry-item skeleton ${height} rounded-xl`} />
  );
}

export function TextSkeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton h-4 rounded ${className}`} />;
}

export function AvatarSkeleton({ size = 40 }: { size?: number }) {
  return (
    <div
      className="skeleton rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <TextSkeleton className="w-48 h-8 mb-3" />
      <TextSkeleton className="w-96 max-w-full" />
    </div>
  );
}
