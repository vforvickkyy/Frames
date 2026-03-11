import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t mt-24 py-12"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
            <Link href="/" className="font-semibold text-[var(--foreground)]">
              Frames
            </Link>
            <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
              About
            </Link>
            <Link href="/search" className="hover:text-[var(--foreground)] transition-colors">
              Search
            </Link>
          </div>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Frames. Visual reference for creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
