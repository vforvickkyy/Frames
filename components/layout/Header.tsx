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
    <header className={`fixed top-0 left-0 right-0 z-50 nav-glass transition-all duration-300 ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-white/90 hover:text-white transition-colors duration-200"
          >
            Frames
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white/90 hover:bg-white/8"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
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
                  className="w-48 sm:w-60 px-3.5 py-1.5 text-[13px] rounded-full
                             bg-white/8 border border-white/15 text-white/90
                             placeholder:text-white/35 outline-none
                             focus:bg-white/12 focus:border-white/30
                             transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-all"
                  aria-label="Close search"
                >
                  <X size={15} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-200"
                aria-label="Open search"
              >
                <Search size={16} />
              </button>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-all"
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
          <nav className="md:hidden py-3 pb-4 border-t border-white/8 flex flex-col gap-0.5 slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-150 ${
                  pathname === link.href
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/8"
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
