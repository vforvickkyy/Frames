"use client";

import { motion } from "framer-motion";
import HeroSearch from "./HeroSearch";

const item = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
});

export default function HomeHero() {
  return (
    <div className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6">
      <motion.h1 {...item(0)} className="mb-4">
        <span className="block" style={{ color: "var(--text)" }}>Visual reference</span>
        <span className="block" style={{ color: "var(--text-muted)" }}>for every frame.</span>
      </motion.h1>

      <motion.p
        {...item(0.1)}
        className="text-[15px] max-w-xs mx-auto mt-4 mb-8 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        Curated GIFs, stills, and clips for filmmakers, DPs, directors, and designers.
      </motion.p>

      <motion.div {...item(0.22)} className="w-full max-w-xl">
        <HeroSearch />
      </motion.div>
    </div>
  );
}
