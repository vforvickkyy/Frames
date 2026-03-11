import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/6 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[13px] font-semibold text-white/60 hover:text-white/90 transition-colors duration-200"
            >
              Frames
            </Link>
            <Link
              href="/about"
              className="text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/search"
              className="text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              Search
            </Link>
          </div>
          <p className="text-[12px] text-white/20">
            © {new Date().getFullYear()} Frames
          </p>
        </div>
      </div>
    </footer>
  );
}
