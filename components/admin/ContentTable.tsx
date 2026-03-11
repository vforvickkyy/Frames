"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Frame } from "@/types";
import { Eye, EyeSlash, Trash, ArrowSquareOut } from "@phosphor-icons/react";

interface ContentTableProps {
  frames: Frame[];
}

export default function ContentTable({ frames: initialFrames }: ContentTableProps) {
  const router = useRouter();
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [loading, setLoading] = useState<string | null>(null);

  async function toggleHidden(frame: Frame) {
    setLoading(frame.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("frames")
      .update({ is_hidden: !frame.is_hidden })
      .eq("id", frame.id);

    if (!error) {
      setFrames((prev) =>
        prev.map((f) =>
          f.id === frame.id ? { ...f, is_hidden: !f.is_hidden } : f
        )
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

  if (frames.length === 0) {
    return (
      <p className="text-sm text-muted py-8 text-center">
        No frames yet.{" "}
        <Link href="/admin/upload" className="underline">
          Upload one
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-3 text-left font-medium text-muted w-16" />
            <th className="px-4 py-3 text-left font-medium text-muted">Title</th>
            <th className="px-4 py-3 text-left font-medium text-muted hidden sm:table-cell">
              Category
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted hidden md:table-cell">
              Creator
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted hidden lg:table-cell">
              Rank
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted hidden lg:table-cell">
              Views
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted">
              Status
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted">
              Actions
            </th>
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
                <p className="text-xs text-muted font-mono truncate">
                  {frame.slug}
                </p>
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
              <td className="px-4 py-3 text-right hidden lg:table-cell text-muted">
                {frame.rank}
              </td>

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
                  <Link
                    href={`/frame/${frame.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                    title="View"
                  >
                    <ArrowSquareOut size={14} weight="regular" />
                  </Link>
                  <button
                    onClick={() => toggleHidden(frame)}
                    disabled={loading === frame.id}
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                    title={frame.is_hidden ? "Show" : "Hide"}
                  >
                    {frame.is_hidden ? <Eye size={14} weight="regular" /> : <EyeSlash size={14} weight="regular" />}
                  </button>
                  <button
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
  );
}
