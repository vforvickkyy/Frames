"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="hero-search-form">
      <MagnifyingGlass
        size={16}
        weight="regular"
        className="hero-search-icon shrink-0 ml-5"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by technique, mood, style…"
        className={`hero-search-input flex-1 px-4 py-4 text-[14px] bg-transparent outline-none ${focused ? "focused" : ""}`}
      />
      <button
        type="submit"
        className="hero-search-btn shrink-0 m-1.5 px-5 py-2.5 rounded-full text-[13px] font-medium"
      >
        Search
      </button>
    </form>
  );
}
