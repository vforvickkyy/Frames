"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Frame } from "@/types";
import { Eye, EyeSlash, Trash, ArrowSquareOut, PencilSimple, X } from "@phosphor-icons/react";

interface SimpleCategory { id: string; name: string; slug: string; }
interface SimpleCreator  { id: string; display_name: string; username: string; }

interface ContentTableProps {
  frames: Frame[];
  categories: SimpleCategory[];
  creators: SimpleCreator[];
}

interface EditState {
  title: string;
  slug: string;
  description: string;
  category_id: string;
  creator_id: string;
  tags: string;
  technique_notes: string;
  rank: number;
}

function toEditState(frame: Frame): EditState {
  return {
    title: frame.title,
    slug: frame.slug,
    description: frame.description ?? "",
    category_id: frame.category_id ?? "",
    creator_id: frame.creator_id ?? "",
    tags: (frame.tags ?? []).join(", "),
    technique_notes: frame.technique_notes ?? "",
    rank: frame.rank,
  };
}

export default function ContentTable({ frames: initialFrames, categories, creators }: ContentTableProps) {
  const router = useRouter();
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [loading, setLoading] = useState<string | null>(null);
  const [editingFrame, setEditingFrame] = useState<Frame | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  async function toggleHidden(frame: Frame) {
    setLoading(frame.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("frames")
      .update({ is_hidden: !frame.is_hidden })
      .eq("id", frame.id);

    if (!error) {
      setFrames((prev) =>
        prev.map((f) => f.id === frame.id ? { ...f, is_hidden: !f.is_hidden } : f)
      );
    }
    setLoading(null);
  }

  async function deleteFrame(frame: Frame) {
    if (!confirm(`Delete "${frame.title}"? This cannot be undone.`)) return;
    setLoading(frame.id);
    const supabase = createClient();
    await supabase.from("frames").delete().eq("id", frame.id);
    setFrames((prev) => prev.filter((f) => f.id !== frame.id));
    setLoading(null);
    router.refresh();
  }

  function openEdit(frame: Frame) {
    setEditingFrame(frame);
    setEditState(toEditState(frame));
  }

  function closeEdit() {
    setEditingFrame(null);
    setEditState(null);
  }

  async function saveEdit() {
    if (!editingFrame || !editState) return;
    setSaving(true);
    const supabase = createClient();
    const tags = editState.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("frames")
      .update({
        title: editState.title,
        slug: editState.slug,
        description: editState.description || null,
        category_id: editState.category_id || null,
        creator_id: editState.creator_id || null,
        tags,
        technique_notes: editState.technique_notes || null,
        rank: editState.rank,
      })
      .eq("id", editingFrame.id);

    if (!error) {
      const updatedCategory = categories.find((c) => c.id === editState.category_id);
      const updatedCreator  = creators.find((c) => c.id === editState.creator_id);
      setFrames((prev) =>
        prev.map((f) =>
          f.id === editingFrame.id
            ? {
                ...f,
                ...editState,
                tags,
                description: editState.description || null,
                technique_notes: editState.technique_notes || null,
                category_id: editState.category_id || null,
                creator_id: editState.creator_id || null,
                category: updatedCategory ? { ...updatedCategory, description: null, created_at: "" } : undefined,
                creator: updatedCreator ? { ...updatedCreator, bio: null, avatar_url: null, website: null, instagram: null, created_at: "" } : undefined,
              }
            : f
        )
      );
      closeEdit();
      router.refresh();
    }
    setSaving(false);
  }

  if (frames.length === 0) {
    return (
      <p className="text-sm text-muted py-8 text-center">
        No frames yet.{" "}
        <Link href="/admin/upload" className="underline">Upload one</Link>.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left font-medium text-muted w-16" />
              <th className="px-4 py-3 text-left font-medium text-muted">Title</th>
              <th className="px-4 py-3 text-left font-medium text-muted hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted hidden md:table-cell">Creator</th>
              <th className="px-4 py-3 text-right font-medium text-muted hidden lg:table-cell">Rank</th>
              <th className="px-4 py-3 text-right font-medium text-muted hidden lg:table-cell">Views</th>
              <th className="px-4 py-3 text-center font-medium text-muted">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {frames.map((frame) => (
              <tr
                key={frame.id}
                className={`border-b border-border last:border-0 transition-colors hover:bg-surface-hover ${
                  frame.is_hidden ? "opacity-50" : ""
                }`}
              >
                {/* Thumbnail */}
                <td className="px-4 py-3">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-surface-hover shrink-0">
                    {(frame.thumbnail_url || frame.file_url) && (
                      <Image
                        src={frame.thumbnail_url || frame.file_url}
                        alt={frame.title}
                        width={48}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                </td>

                {/* Title */}
                <td className="px-4 py-3">
                  <p className="font-medium truncate max-w-45">{frame.title}</p>
                  <p className="text-xs text-muted font-mono truncate">{frame.slug}</p>
                </td>

                {/* Category */}
                <td className="px-4 py-3 hidden sm:table-cell text-muted">
                  {frame.category?.name || "—"}
                </td>

                {/* Creator */}
                <td className="px-4 py-3 hidden md:table-cell text-muted">
                  {frame.creator?.display_name || "—"}
                </td>

                {/* Rank */}
                <td className="px-4 py-3 text-right hidden lg:table-cell text-muted">{frame.rank}</td>

                {/* Views */}
                <td className="px-4 py-3 text-right hidden lg:table-cell text-muted">
                  {frame.view_count?.toLocaleString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      frame.is_hidden
                        ? "bg-surface-hover text-muted"
                        : "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    }`}
                  >
                    {frame.is_hidden ? "Hidden" : "Live"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(frame)}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                      title="Edit"
                    >
                      <PencilSimple size={14} weight="regular" />
                    </button>
                    <Link
                      href={`/frame/${frame.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                      title="View"
                    >
                      <ArrowSquareOut size={14} weight="regular" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleHidden(frame)}
                      disabled={loading === frame.id}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                      title={frame.is_hidden ? "Show" : "Hide"}
                    >
                      {frame.is_hidden ? <Eye size={14} weight="regular" /> : <EyeSlash size={14} weight="regular" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFrame(frame)}
                      disabled={loading === frame.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash size={14} weight="regular" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editingFrame && editState && (
        <div
          className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div
            className="admin-modal-panel w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-[13px] font-semibold">Edit Frame</p>
                <p className="text-[11px] text-muted mt-0.5 font-mono truncate max-w-xs">{editingFrame.slug}</p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
              >
                <X size={16} weight="regular" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 flex flex-col gap-4">

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="frame-detail-label block mb-1.5">Title</label>
                  <input
                    type="text"
                    title="Title"
                    className="header-search-input w-full rounded-lg px-3 py-2 text-[13px]"
                    value={editState.title}
                    onChange={(e) => setEditState({ ...editState, title: e.target.value })}
                  />
                </div>
                <div className="w-24">
                  <label className="frame-detail-label block mb-1.5">Rank</label>
                  <input
                    type="number"
                    title="Rank"
                    className="header-search-input w-full rounded-lg px-3 py-2 text-[13px]"
                    value={editState.rank}
                    onChange={(e) => setEditState({ ...editState, rank: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="frame-detail-label block mb-1.5">Slug</label>
                <input
                  type="text"
                  title="Slug"
                  className="header-search-input w-full rounded-lg px-3 py-2 text-[13px] font-mono"
                  value={editState.slug}
                  onChange={(e) => setEditState({ ...editState, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="frame-detail-label block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  title="Description"
                  className="header-search-input w-full rounded-lg px-3 py-2 text-[13px] resize-none"
                  value={editState.description}
                  onChange={(e) => setEditState({ ...editState, description: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="frame-detail-label block mb-1.5">Category</label>
                  <select
                    title="Category"
                    className="header-search-input w-full rounded-lg px-3 py-2 text-[13px]"
                    value={editState.category_id}
                    onChange={(e) => setEditState({ ...editState, category_id: e.target.value })}
                  >
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="frame-detail-label block mb-1.5">Creator</label>
                  <select
                    title="Creator"
                    className="header-search-input w-full rounded-lg px-3 py-2 text-[13px]"
                    value={editState.creator_id}
                    onChange={(e) => setEditState({ ...editState, creator_id: e.target.value })}
                  >
                    <option value="">— None —</option>
                    {creators.map((c) => (
                      <option key={c.id} value={c.id}>{c.display_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="frame-detail-label block mb-1.5">Tags <span className="normal-case tracking-normal">(comma-separated)</span></label>
                <input
                  className="header-search-input w-full rounded-lg px-3 py-2 text-[13px]"
                  value={editState.tags}
                  onChange={(e) => setEditState({ ...editState, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <label className="frame-detail-label block mb-1.5">Technique Notes</label>
                <textarea
                  rows={2}
                  title="Technique Notes"
                  className="header-search-input w-full rounded-lg px-3 py-2 text-[13px] resize-none"
                  value={editState.technique_notes}
                  onChange={(e) => setEditState({ ...editState, technique_notes: e.target.value })}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
              <button
                type="button"
                onClick={closeEdit}
                className="px-4 py-2 rounded-lg text-[13px] border border-border hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
