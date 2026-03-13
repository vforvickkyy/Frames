"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { Category } from "@/types";

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        py: 0.25,
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Chip
        label="All"
        variant={!activeSlug ? "filled" : "outlined"}
        onClick={() => router.push("/")}
        sx={{ flexShrink: 0, cursor: "pointer" }}
      />
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.name}
          variant={activeSlug === cat.slug ? "filled" : "outlined"}
          onClick={() => router.push(`/category/${cat.slug}`)}
          sx={{ flexShrink: 0, cursor: "pointer" }}
        />
      ))}
    </Box>
  );
}
