"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";
import { Plus, Trash } from "@phosphor-icons/react";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoriesManager({
  categories: initial,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug: slugify(name), description: description || null })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setCategories((prev) => [...prev, data]);
      setName("");
      setDescription("");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold mb-4">Categories</h2>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          className="px-3 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-foreground"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="px-3 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-foreground"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <Plus size={14} />
          Add Category
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-border"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{cat.name}</p>
              <p className="text-xs text-muted font-mono">{cat.slug}</p>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted hover:text-red-500 shrink-0 transition-colors"
            >
              <Trash size={14} weight="regular" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
