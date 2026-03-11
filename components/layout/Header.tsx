"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Moon, Sun } from "@phosphor-icons/react";

const navLinks = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved !== "light" : true;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSearchFocused(false);
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        borderColor: "var(--border)",
        height: 52,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-[14px] font-semibold tracking-tight transition-opacity hover:opacity-60"
          style={{ color: "var(--text)" }}
        >
          Frames
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors duration-150"
              style={{
                color: pathname === link.href ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search — center, expands on focus */}
        <form onSubmit={handleSearch} className="flex-1 flex justify-center">
          <motion.div
            animate={{ width: searchFocused ? 460 : 380 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative flex items-center"
          >
            <MagnifyingGlass
              size={15}
              weight="regular"
              className="absolute left-3.5 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search frames…"
              className="header-search-input w-full pl-9 pr-4 py-1.5 rounded-full text-sm"
            />
          </motion.div>
        </form>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="header-icon-btn shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-60"
          aria-label="Toggle theme"
        >
          {dark
            ? <Sun size={18} weight="regular" />
            : <Moon size={18} weight="regular" />
          }
        </button>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="header-icon-btn md:hidden shrink-0 text-sm transition-opacity hover:opacity-60"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="header-mobile-nav md:hidden px-5 pb-3 flex flex-col gap-0.5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: pathname === link.href ? "var(--text)" : "var(--text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
