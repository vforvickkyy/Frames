import type { NextConfig } from "next";

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 — resolved from env at build time
      ...(r2Hostname
        ? [{ protocol: "https" as const, hostname: r2Hostname, pathname: "/**" }]
        : []),
      // Wildcard fallback for r2.dev public buckets
      { protocol: "https" as const, hostname: "*.r2.dev", pathname: "/**" },
      // Supabase (creator avatars, etc.)
      {
        protocol: "https" as const,
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
