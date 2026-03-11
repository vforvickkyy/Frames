"use client";

import Link from "next/link";
import type { Category } from "@/types";

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryPills({
  categories,
  activeSlug,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <Link
        href="/"
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !activeSlug
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeSlug === cat.slug
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
