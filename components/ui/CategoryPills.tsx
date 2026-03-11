"use client";

import Link from "next/link";
import type { Category } from "@/types";

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <Link
        href="/"
        className={`category-pill shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border ${
          !activeSlug
            ? "bg-foreground text-background border-foreground"
            : "bg-surface text-muted hover:text-foreground border-border"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={`category-pill shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border ${
            activeSlug === cat.slug
              ? "active bg-foreground text-background border-foreground"
              : "bg-surface text-muted hover:text-foreground border-border"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
