import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WatchPulse",
  description: "AI-powered movie and TV show recommendations based on your mood. Explore trending content, collections, and personalized suggestions.",
  keywords: "movie app, tv shows, AI recommendations, mood-based, watchlist, TMDB, streaming",
  authors: [{ name: "WatchPulse Team" }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "WatchPulse",
    description: "Discover personalized movie and TV show recommendations with AI-powered mood detection",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WatchPulse",
    description: "AI-powered movie recommendations based on your mood",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#7C8DB0",
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
