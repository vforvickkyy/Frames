import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";

export const metadata: Metadata = {
  title: "About",
  description:
    "Frames is a visual reference platform for filmmakers, directors, DPs, and designers. Discover curated GIFs, images, and clips tagged by technique and style.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About Frames",
    description: "Visual reference for every frame.",
    url: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-14">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          About Frames
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          A visual reference library for the people who care about every frame.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">What is Frames?</h2>
        <p className="text-muted leading-relaxed">
          Frames is a curated platform where filmmakers, cinematographers, directors,
          and designers come to find visual inspiration. Think of it as a shared mood
          board for the industry — tagged, searchable, and organized by technique, mood,
          and style.
        </p>
        <p className="text-muted leading-relaxed">
          Whether you&apos;re pitching a look to a client, building a reference deck for a
          shoot, or just exploring the craft, Frames gives you a fast, visual way to
          find exactly what you need.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Browse",
              desc: "Explore thousands of curated GIFs, images, and clips organized by technique, category, and mood.",
            },
            {
              step: "02",
              title: "Discover",
              desc: "Find frames by searching for specific styles, moods, camera techniques, or creator names.",
            },
            {
              step: "03",
              title: "Reference",
              desc: "Use Frames as your go-to reference when pitching, planning, or executing your next project.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="p-5 rounded-2xl bg-surface border border-border"
            >
              <p className="text-xs font-mono text-muted mb-2">{step}</p>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Submit work */}
      <section className="mb-12 p-6 rounded-2xl bg-surface border border-border">
        <h2 className="text-xl font-semibold mb-3">Submit your work</h2>
        <p className="text-muted leading-relaxed mb-4 text-sm">
          Frames is community-first. If you&apos;re a director, DP, designer, or agency
          and want your work featured, reach out. We review all submissions and curate
          carefully to maintain quality.
        </p>
        <p className="text-sm text-muted">
          All content is tagged with technique breakdowns, credited to the original
          creator, and linked back to their profile.
        </p>
      </section>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Start browsing
        </Link>
        <Link
          href="/search"
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          Search frames
        </Link>
      </div>
    </div>
  );
}
