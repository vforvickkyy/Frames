interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <span className="text-[13px] text-muted">{subtitle}</span>
      )}
    </div>
  );
}
