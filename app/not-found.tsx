import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p className="text-6xl font-semibold text-[var(--muted)] mb-4">404</p>
        <h1 className="text-xl font-semibold mb-2">Page not found</h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          The frame you&apos;re looking for doesn&apos;t exist or was removed.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Back to Frames
        </Link>
      </div>
    </div>
  );
}
