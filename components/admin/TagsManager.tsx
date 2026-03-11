"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Tag } from "@/types";
import { Plus, Trash2 } from "lucide-react";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TagsManager({ tags: initial }: { tags: Tag[] }) {
  const router = useRouter();
  const [tags, setTags] = useState(initial);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("tags")
      .insert({ name: name.trim(), slug: slugify(name) })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setTags((prev) => [...prev, data]);
      setName("");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return;
    const supabase = createClient();
    await supabase.from("tags").delete().eq("id", id);
    setTags((prev) => prev.filter((t) => t.id !== id));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold mb-4">Tags</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tag name"
          required
          className="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-foreground"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-xl bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </form>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-sm"
          >
            {tag.name}
            <button
              onClick={() => handleDelete(tag.id)}
              className="text-muted hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
