"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      className={`flex items-center max-w-lg mx-auto bg-surface border rounded-2xl overflow-hidden transition-all duration-300 ${
        focused
          ? "border-foreground/30 shadow-lg shadow-foreground/8"
          : "border-border shadow-sm"
      }`}
    >
      <Search
        size={17}
        className={`ml-4 shrink-0 transition-colors duration-200 ${
          focused ? "text-foreground" : "text-muted"
        }`}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by technique, mood, style…"
        className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="m-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-80 active:scale-95 transition-all duration-150"
      >
        Search
      </button>
    </form>
  );
}
