"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Frame } from "@/types";

interface FrameCardProps {
  frame: Frame;
  priority?: boolean;
}

export default function FrameCard({ frame, priority = false }: FrameCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = frame.file_url || frame.thumbnail_url;
  const isGif = imageUrl?.toLowerCase().endsWith(".gif");

  return (
    <Link href={`/frame/${frame.slug}`} className="block cursor-pointer">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="frame-card-shell relative rounded-2xl overflow-hidden"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* Skeleton */}
        {!loaded && <div className="skeleton w-full min-h-[180px]" />}

        {/* Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={frame.title}
            width={600}
            height={400}
            className={`w-full h-auto object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            priority={priority}
            unoptimized={isGif}
          />
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="frame-card-overlay absolute inset-0 flex flex-col justify-end p-3.5"
            >
              <p className="text-[13px] font-medium text-white leading-snug line-clamp-2">
                {frame.title}
              </p>
              {frame.category && (
                <p className="frame-card-category text-[11px] mt-0.5">
                  {frame.category.name}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
