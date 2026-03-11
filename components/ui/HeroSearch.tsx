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
      className={`flex items-center max-w-xl mx-auto rounded-full overflow-hidden
                  transition-all duration-300 ease-out
                  bg-white/8 border backdrop-blur-md
                  ${focused
                    ? "border-white/30 shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
                    : "border-white/12 shadow-none"
                  }`}
    >
      <Search
        size={16}
        className={`ml-5 shrink-0 transition-colors duration-200 ${
          focused ? "text-white/70" : "text-white/30"
        }`}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by technique, mood, style…"
        className="flex-1 px-4 py-4 text-[14px] bg-transparent outline-none
                   text-white/90 placeholder:text-white/30"
      />
      <button
        type="submit"
        className="m-1.5 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold
                   hover:bg-white/90 active:scale-95 transition-all duration-150 shrink-0"
      >
        Search
      </button>
    </form>
  );
}
