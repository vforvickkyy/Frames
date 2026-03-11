import { Film } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Nothing here yet",
  description = "Check back soon — new frames are added regularly.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-border">
        <Film size={22} className="text-muted" />
      </div>
      <h3 className="text-[15px] font-semibold mb-1">{title}</h3>
      <p className="text-[13px] text-muted max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
