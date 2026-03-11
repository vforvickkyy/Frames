"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ArrowSquareOut } from "@phosphor-icons/react";
import type { Frame } from "@/types";

interface Props {
  frame: Frame;
}

const item = (i: number) => ({
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: i * 0.07 },
});

export default function FrameDetailSidebar({ frame }: Props) {
  return (
    <div className="flex flex-col gap-8">

      {/* Title */}
      <motion.div {...item(0)}>
        <h1 className="text-xl font-semibold leading-snug" style={{ color: "var(--text)" }}>
          {frame.title}
        </h1>
        {frame.description && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {frame.description}
          </p>
        )}
      </motion.div>

      {/* Views */}
      <motion.div {...item(1)} className="frame-detail-views flex items-center gap-1.5">
        <Eye size={14} weight="regular" />
        {frame.view_count.toLocaleString()} views
      </motion.div>

      {/* Creator */}
      {frame.creator && (
        <motion.div {...item(2)}>
          <p className="frame-detail-label">Creator</p>
          <Link
            href={`/creator/${frame.creator.username}`}
            className="flex items-center gap-3 group"
          >
            {frame.creator.avatar_url ? (
              <Image
                src={frame.creator.avatar_url}
                alt={frame.creator.display_name}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              >
                {frame.creator.display_name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium group-hover:underline" style={{ color: "var(--text)" }}>
                {frame.creator.display_name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                @{frame.creator.username}
              </p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Category */}
      {frame.category && (
        <motion.div {...item(3)}>
          <p className="frame-detail-label">Category</p>
          <Link
            href={`/category/${frame.category.slug}`}
            className="frame-detail-tag"
          >
            {frame.category.name}
          </Link>
        </motion.div>
      )}

      {/* Tags */}
      {frame.tags && frame.tags.length > 0 && (
        <motion.div {...item(4)}>
          <p className="frame-detail-label">Tags</p>
          <div className="flex flex-wrap gap-2">
            {frame.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className="frame-detail-tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Technique notes */}
      {frame.technique_notes && (
        <motion.div {...item(5)}>
          <p className="frame-detail-label">Technique</p>
          <p className="frame-detail-value leading-relaxed">{frame.technique_notes}</p>
        </motion.div>
      )}

      {/* View original */}
      {frame.file_url && (
        <motion.div {...item(6)}>
          <a
            href={frame.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="frame-detail-external"
          >
            <ArrowSquareOut size={15} weight="regular" />
            View original
          </a>
        </motion.div>
      )}
    </div>
  );
}
