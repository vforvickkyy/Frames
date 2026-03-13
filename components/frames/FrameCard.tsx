"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { Frame } from "@/types";

interface FrameCardProps {
  frame: Frame;
  priority?: boolean;
}

export default function FrameCard({ frame, priority = false }: FrameCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();

  const imageUrl = frame.file_url || frame.thumbnail_url;
  const isGif = imageUrl?.toLowerCase().endsWith(".gif");

  return (
    <Box component={Link} href={`/frame/${frame.slug}`} sx={{ display: "block", textDecoration: "none" }}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Skeleton */}
        {!loaded && (
          <Box
            className="skeleton"
            sx={{ width: "100%", minHeight: 180 }}
          />
        )}

        {/* Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={frame.title}
            width={600}
            height={400}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              display: "block",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
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
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "14px",
              }}
            >
              <Box
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#ffffff",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {frame.title}
              </Box>
              {frame.category && (
                <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)", mt: 0.5 }}>
                  {frame.category.name}
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
}
