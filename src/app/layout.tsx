import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://quick-doodle.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QuickDoodle — AI-Powered Real-Time Drawing & Guessing Game",
    template: "%s | QuickDoodle",
  },
  description:
    "Play QuickDoodle! A fast-paced real-time multiplayer drawing & guessing game powered by AI. Create private rooms, draw prompts, and play with friends online.",
  keywords: [
    "QuickDoodle",
    "multiplayer drawing game",
    "skribbl io alternative",
    "real-time draw and guess",
    "AI drawing game",
    "browser party games",
    "online scribble game",
  ],
  authors: [{ name: "UsmanDevCraft", url: "https://github.com/UsmanDevCraft" }],
  creator: "UsmanDevCraft",
  publisher: "QuickDoodle",

  verification: {
    google: "9PbdoRzqApvTZ5ax4Vx_RVhsUe9OWlDNIfVNPKlw1ho",
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "QuickDoodle — AI-Powered Real-Time Drawing & Guessing Game",
    description:
      "Draw, guess, and compete in real-time! Play with friends in private rooms or challenge local AI models.",
    url: siteUrl,
    siteName: "QuickDoodle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuickDoodle Game Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickDoodle — AI-Powered Real-Time Drawing & Guessing Game",
    description:
      "Real-time multiplayer drawing and guessing game powered by AI. Join or create a room now!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QuickDoodle",
    url: siteUrl,
    description:
      "Real-time multiplayer drawing and guessing game powered by AI.",
    applicationCategory: "GameApplication",
    genre: "Multiplayer Party Game",
    browserRequirements: "Requires JavaScript. Requires HTML5 Canvas support.",
    operatingSystem: "All",
    author: {
      "@type": "Person",
      name: "UsmanDevCraft",
      url: "https://github.com/UsmanDevCraft",
    },
    publisher: {
      "@type": "Organization",
      name: "QuickDoodle",
      url: siteUrl,
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
