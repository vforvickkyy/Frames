"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Tag } from "@/types";
import { Upload, X, Check } from "lucide-react";

interface UploadFormProps {
  categories: Category[];
  tags: Tag[];
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function UploadForm({ categories, tags }: UploadFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category_id: "",
    technique_notes: "",
    rank: "0",
    tagsInput: "",
    selectedTags: [] as string[],
    creatorUsername: "",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!form.title) {
      const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setForm((prev) => ({
        ...prev,
        title: name,
        slug: slugify(name),
      }));
    }
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  }

  function toggleTag(slug: string) {
    setForm((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(slug)
        ? prev.selectedTags.filter((t) => t !== slug)
        : [...prev.selectedTags, slug],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Please select a file.");
    if (!form.title || !form.slug) return setError("Title is required.");

    setUploading(true);
    setError(null);

    try {
      // ── Step 1: Upload file to R2 via server API ──────────────────────────
      setUploadProgress("Uploading to Cloudflare R2…");
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "frames");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const { error: uploadErr } = await uploadRes.json();
        throw new Error(uploadErr || "Upload failed.");
      }

      const { url: fileUrl } = await uploadRes.json();

      // ── Step 2: Save metadata to Supabase ─────────────────────────────────
      setUploadProgress("Saving metadata…");
      const supabase = createClient();

      // Resolve creator ID from username
      let creatorId: string | null = null;
      if (form.creatorUsername) {
        const { data: creator } = await supabase
          .from("creators")
          .select("id")
          .eq("username", form.creatorUsername.toLowerCase())
          .single();
        creatorId = creator?.id ?? null;
      }

      // Merge selected tag pills + comma-separated input
      const tagsArray = [
        ...form.selectedTags,
        ...form.tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ];

      const { data: frame, error: insertError } = await supabase
        .from("frames")
        .insert({
          title: form.title,
          slug: form.slug,
          description: form.description || null,
          file_url: fileUrl,
          thumbnail_url: fileUrl,
          category_id: form.category_id || null,
          creator_id: creatorId,
          tags: tagsArray,
          technique_notes: form.technique_notes || null,
          rank: parseInt(form.rank, 10) || 0,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      // Insert frame_tags junction rows
      if (form.selectedTags.length > 0 && frame) {
        const tagRows = tags
          .filter((t) => form.selectedTags.includes(t.slug))
          .map((t) => ({ frame_id: frame.id, tag_id: t.id }));
        await supabase.from("frame_tags").insert(tagRows);
      }

      setSuccess(true);
      setUploadProgress(null);
      setTimeout(() => {
        router.push("/admin/content");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* File drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          preview
            ? "border-border"
            : "border-border hover:border-muted"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.gif"
          onChange={handleFileChange}
          className="hidden"
        />
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <Upload size={28} />
            <p className="text-sm font-medium">Drop a file or click to upload</p>
            <p className="text-xs">GIF, JPG, PNG, MP4, WebM — up to 50 MB</p>
          </div>
        )}
      </div>

      {/* Fields grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="e.g. Anamorphic Flare in Golden Hour"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((p) => ({ ...p, slug: slugify(e.target.value) }))
            }
            placeholder="auto-generated from title"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            placeholder="Brief description of this frame…"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, category_id: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground"
          >
            <option value="">— None —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Creator username</label>
          <input
            type="text"
            value={form.creatorUsername}
            onChange={(e) =>
              setForm((p) => ({ ...p, creatorUsername: e.target.value }))
            }
            placeholder="e.g. johndoe"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Technique Notes</label>
          <textarea
            value={form.technique_notes}
            onChange={(e) =>
              setForm((p) => ({ ...p, technique_notes: e.target.value }))
            }
            rows={2}
            placeholder="Camera, lens, lighting setup, post-production details…"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Rank / Priority</label>
          <input
            type="number"
            value={form.rank}
            onChange={(e) =>
              setForm((p) => ({ ...p, rank: e.target.value }))
            }
            min={0}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Extra tags (comma-separated)
          </label>
          <input
            type="text"
            value={form.tagsInput}
            onChange={(e) =>
              setForm((p) => ({ ...p, tagsInput: e.target.value }))
            }
            placeholder="anamorphic, bokeh, neon"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>
      </div>

      {/* Tag picker */}
      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  form.selectedTags.includes(tag.slug)
                    ? "bg-foreground text-background"
                    : "border border-border text-muted hover:text-foreground"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {uploadProgress && (
        <p className="text-sm text-muted flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-muted border-t-transparent animate-spin" />
          {uploadProgress}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading || !file}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {success ? (
          <>
            <Check size={16} /> Uploaded!
          </>
        ) : uploading ? (
          "Uploading…"
        ) : (
          <>
            <Upload size={16} /> Upload Frame
          </>
        )}
      </button>
    </form>
  );
}
