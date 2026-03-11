import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Frames — Visual Reference for Filmmakers",
    template: "%s | Frames",
  },
  description:
    "A visual reference platform for filmmakers, directors, DPs, and designers. Browse curated GIFs, images, and clips tagged by technique, mood, and style.",
  keywords: [
    "filmmaking reference",
    "cinematography",
    "visual reference",
    "directors",
    "DPs",
    "color grading",
    "motion graphics",
    "shot reference",
  ],
  authors: [{ name: "Frames" }],
  creator: "Frames",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Frames",
    title: "Frames — Visual Reference for Filmmakers",
    description:
      "A visual reference platform for filmmakers, directors, DPs, and designers.",
    images: [
      {
        url: `${siteUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Frames — Visual Reference Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frames — Visual Reference for Filmmakers",
    description:
      "A visual reference platform for filmmakers, directors, DPs, and designers.",
    images: [`${siteUrl}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
