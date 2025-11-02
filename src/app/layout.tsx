import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickDoodle — Multiplayer Drawing Game",
  description:
    "Real-time multiplayer drawing & guessing game. Create rooms, draw prompts, compete with friends. Built with Next.js, Socket.IO, and Node.js.",
  keywords: [
    "QuickDoodle",
    "multiplayer",
    "drawing game",
    "socket.io",
    "scribble",
    "nextjs game",
    "real-time",
  ],
  authors: [{ name: "UsmanDevCraft" }],
  openGraph: {
    title: "QuickDoodle — Multiplayer Drawing Game",
    description:
      "Draw. Guess. Compete. Real-time multiplayer game built with Next.js + Socket.IO.",
    type: "website",
    // url: "https://quickdoodle.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
