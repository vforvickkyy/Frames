"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
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
      className="flex items-center max-w-lg mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden"
    >
      <Search size={18} className="ml-4 text-[var(--muted)] flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by technique, mood, style…"
        className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none placeholder:text-[var(--muted)]"
      />
      <button
        type="submit"
        className="m-1.5 px-4 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-80 transition-opacity"
      >
        Search
      </button>
    </form>
  );
}
