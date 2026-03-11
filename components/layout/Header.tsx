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
    const onScroll = () => setScrolled(window.scrollY > 4);
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
      className={`sticky top-0 z-50 glass border-b transition-all duration-300 ${
        scrolled ? "header-scrolled" : "border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[3.5rem]">

          {/* Logo */}
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight hover:opacity-50 transition-opacity duration-200"
          >
            Frames
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  pathname === link.href
                    ? "text-foreground bg-surface-hover"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-1 fade-in-fast"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                  placeholder="Search frames…"
                  className="w-44 sm:w-56 px-3 py-1.5 text-[13px] rounded-lg border border-border outline-none
                             focus:ring-2 focus:ring-foreground/15 focus:border-foreground/30
                             bg-surface text-foreground placeholder:text-muted transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
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
                <Search size={16} />
              </button>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block transition-transform duration-200 ${mobileOpen ? "rotate-90" : ""}`}>
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-2 pb-3 border-t border-border flex flex-col gap-0.5 slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 text-[13px] font-medium rounded-xl transition-colors duration-150 ${
                  pathname === link.href
                    ? "bg-surface-hover text-foreground"
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
