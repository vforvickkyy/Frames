"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Tag } from "@/types";

interface SearchFiltersProps {
  categories: Category[];
  tags: Tag[];
  activeCategory?: string;
  activeTag?: string;
  query?: string;
}

export default function SearchFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
  query,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div>
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("category", null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateFilter(
                  "category",
                  activeCategory === cat.slug ? null : cat.slug
                )
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  updateFilter("tag", activeTag === tag.slug ? null : tag.slug)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTag === tag.slug
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
