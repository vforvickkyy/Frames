"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { Eye, ArrowSquareOut } from "@phosphor-icons/react";
import type { Frame } from "@/types";

interface Props {
  frame: Frame;
}

const item = (i: number) => ({
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay: i * 0.07,
  },
});

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "text.disabled",
        mb: 1,
        fontWeight: 500,
      }}
    >
      {children}
    </Typography>
  );
}

export default function FrameDetailSidebar({ frame }: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

      {/* Title */}
      <motion.div {...item(0)}>
        <Typography
          variant="h2"
          sx={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3, color: "text.primary" }}
        >
          {frame.title}
        </Typography>
        {frame.description && (
          <Typography sx={{ mt: 1.5, fontSize: 14, lineHeight: 1.65, color: "text.secondary" }}>
            {frame.description}
          </Typography>
        )}
      </motion.div>

      {/* Views */}
      <motion.div {...item(1)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "text.disabled", fontSize: 12 }}>
          <Eye size={13} weight="regular" />
          <span>{frame.view_count.toLocaleString()} views</span>
        </Box>
      </motion.div>

      <Divider />

      {/* Creator */}
      {frame.creator && (
        <motion.div {...item(2)}>
          <Label>Creator</Label>
          <Box
            component={Link}
            href={`/creator/${frame.creator.username}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              "&:hover .creator-name": { textDecoration: "underline" },
            }}
          >
            {frame.creator.avatar_url ? (
              <Image
                src={frame.creator.avatar_url}
                alt={frame.creator.display_name}
                width={36}
                height={36}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: theme.palette.action.selected,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.primary",
                  flexShrink: 0,
                }}
              >
                {frame.creator.display_name[0]}
              </Box>
            )}
            <Box>
              <Typography
                className="creator-name"
                sx={{ fontSize: 14, fontWeight: 500, color: "text.primary", lineHeight: 1.3 }}
              >
                {frame.creator.display_name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                @{frame.creator.username}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Category */}
      {frame.category && (
        <motion.div {...item(3)}>
          <Label>Category</Label>
          <Chip
            component={Link}
            href={`/category/${frame.category.slug}`}
            label={frame.category.name}
            variant="outlined"
            clickable
            sx={{ textDecoration: "none" }}
          />
        </motion.div>
      )}

      {/* Tags */}
      {frame.tags && frame.tags.length > 0 && (
        <motion.div {...item(4)}>
          <Label>Tags</Label>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {frame.tags.map((tag) => (
              <Chip
                key={tag}
                component={Link}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                label={tag}
                variant="outlined"
                size="small"
                clickable
                sx={{ textDecoration: "none", height: 26, fontSize: 11 }}
              />
            ))}
          </Box>
        </motion.div>
      )}

      {/* Technique notes */}
      {frame.technique_notes && (
        <motion.div {...item(5)}>
          <Label>Technique</Label>
          <Typography sx={{ fontSize: 14, lineHeight: 1.65, color: "text.primary" }}>
            {frame.technique_notes}
          </Typography>
        </motion.div>
      )}

      {/* View original */}
      {frame.file_url && (
        <motion.div {...item(6)}>
          <Box
            component="a"
            href={frame.file_url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 14,
              color: "text.secondary",
              textDecoration: "none",
              transition: "color 0.15s ease",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ArrowSquareOut size={15} weight="regular" />
            View original
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
