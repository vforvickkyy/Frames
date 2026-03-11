"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Sun, Moon, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  // Read saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 site-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center gap-4 h-15">

          {/* Logo */}
          <Link href="/" className="nav-logo shrink-0 text-[15px] font-bold tracking-tight hover:opacity-70 transition-opacity">
            Frames
          </Link>

          {/* Search bar — centered, always visible */}
          <form onSubmit={handleSearch} className="flex-1 max-w-125 mx-auto">
            <div className="nav-search-box flex items-center gap-2 px-4 py-2 rounded-full">
              <Search size={15} className="nav-search-icon shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search frames…"
                className="nav-search-input flex-1 text-[13px] outline-none"
              />
            </div>
          </form>

          {/* Right: nav links + theme toggle */}
          <div className="shrink-0 hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 ${
                  pathname === link.href ? "nav-link-active" : "nav-link"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="nav-icon-btn ml-1 p-2 rounded-full transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-1 shrink-0 ml-auto">
            <button
              type="button"
              onClick={toggleTheme}
              className="nav-icon-btn p-2 rounded-full transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              className="nav-icon-btn p-2 rounded-full transition-colors duration-150"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden nav-mobile-border py-3 pb-4 flex flex-col gap-0.5 slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 text-[13px] font-medium rounded-xl transition-colors duration-150 ${
                  pathname === link.href ? "nav-mobile-link-active" : "nav-mobile-link"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
