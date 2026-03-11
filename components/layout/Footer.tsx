import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[13px] text-muted">
            <Link href="/" className="font-semibold text-foreground hover:opacity-60 transition-opacity">
              Frames
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/search" className="hover:text-foreground transition-colors">
              Search
            </Link>
          </div>
          <p className="text-[12px] text-muted">
            © {new Date().getFullYear()} Frames. Visual reference for creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
