"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header
      className={`sticky top-0 z-50 glass border-b border-border transition-shadow duration-300 ${
        scrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight hover:opacity-60 transition-opacity duration-200"
          >
            Frames
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 ${
                  pathname === link.href
                    ? "font-medium text-foreground"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search — inline expand */}
            <div className="flex items-center">
              {searchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-1.5 fade-in-fast"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                    placeholder="Search frames…"
                    className="w-44 sm:w-60 px-3 py-1.5 text-sm rounded-lg border border-border outline-none
                               focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40
                               bg-surface text-foreground transition-all duration-200
                               placeholder:text-muted"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                    aria-label="Close search"
                  >
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                  aria-label="Open search"
                >
                  <Search size={17} />
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block transition-transform duration-200 ${mobileOpen ? "rotate-90" : "rotate-0"}`}
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav — slides down */}
        {mobileOpen && (
          <nav className="md:hidden py-2 pb-3 border-t border-border flex flex-col gap-0.5 slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 text-sm rounded-xl transition-colors duration-150 ${
                  pathname === link.href
                    ? "font-medium bg-surface-hover text-foreground"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
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
