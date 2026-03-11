"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Creator } from "@/types";
import { Plus, Trash2, ExternalLink, X } from "lucide-react";

interface NewCreator {
  username: string;
  display_name: string;
  bio: string;
  website: string;
  instagram: string;
}

const empty: NewCreator = {
  username: "",
  display_name: "",
  bio: "",
  website: "",
  instagram: "",
};

export default function CreatorsManager({
  creators: initial,
}: {
  creators: Creator[];
}) {
  const router = useRouter();
  const [creators, setCreators] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewCreator>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.display_name) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("creators")
      .insert({
        username: form.username.toLowerCase(),
        display_name: form.display_name,
        bio: form.bio || null,
        website: form.website || null,
        instagram: form.instagram || null,
      })
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setCreators((prev) => [...prev, data]);
      setForm(empty);
      setShowForm(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this creator?")) return;
    const supabase = createClient();
    await supabase.from("creators").delete().eq("id", id);
    setCreators((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Add creator button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add Creator"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-border bg-surface p-6 space-y-4"
        >
          <h2 className="text-base font-semibold">New Creator</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { field: "username" as const, label: "Username *", placeholder: "johndoe" },
              { field: "display_name" as const, label: "Display Name *", placeholder: "John Doe" },
              { field: "website" as const, label: "Website", placeholder: "https://..." },
              { field: "instagram" as const, label: "Instagram", placeholder: "@handle" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-muted mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                rows={2}
                placeholder="Short bio…"
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-foreground resize-none"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save Creator"}
          </button>
        </form>
      )}

      {/* Creators list */}
      <div className="rounded-2xl border border-border overflow-hidden">
        {creators.length === 0 ? (
          <p className="text-sm text-muted p-6 text-center">
            No creators yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-medium text-muted">Creator</th>
                <th className="px-4 py-3 text-left font-medium text-muted hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((creator) => (
                <tr
                  key={creator.id}
                  className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {creator.avatar_url ? (
                        <Image
                          src={creator.avatar_url}
                          alt={creator.display_name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-xs font-semibold shrink-0">
                          {creator.display_name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{creator.display_name}</p>
                        <p className="text-xs text-muted">@{creator.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted text-xs">
                    {creator.instagram && <p>{creator.instagram}</p>}
                    {creator.website && (
                      <a
                        href={creator.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground underline"
                      >
                        Website
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/creator/${creator.username}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(creator.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
