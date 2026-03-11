"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";

const MotionLink = motion(Link);

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
      <MotionLink
        href="/"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className={`pill shrink-0 ${!activeSlug ? "pill-active" : ""}`}
      >
        All
      </MotionLink>
      {categories.map((cat) => (
        <MotionLink
          key={cat.id}
          href={`/category/${cat.slug}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className={`pill shrink-0 ${activeSlug === cat.slug ? "pill-active" : ""}`}
        >
          {cat.name}
        </MotionLink>
      ))}
    </div>
  );
}
