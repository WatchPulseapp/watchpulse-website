import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WatchPulse - AI-Powered Movie & TV Show Recommendations Based on Your Mood",
  description: "Discover personalized movie and TV show recommendations with AI-powered mood detection. Smart watchlist, TMDB integration, social features. Download free!",
  keywords: "movie recommendations, tv show suggestions, AI movies, mood-based recommendations, netflix alternative, watchlist app, TMDB, personalized streaming, movie app, AI film recommendation, what to watch, streaming guide, watchpulse",
  authors: [{ name: "WatchPulse Team" }],
  creator: "WatchPulse",
  publisher: "WatchPulse",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "WatchPulse - AI Movie Recommendations Based on Your Mood",
    description: "Get personalized movie and TV show recommendations powered by AI. Discover what to watch next based on your current mood and preferences.",
    type: "website",
    locale: "en_US",
    url: "https://watchpulseapp.com",
    siteName: "WatchPulse",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'WatchPulse - AI-Powered Movie Recommendations',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WatchPulse - AI Movie Recommendations",
    description: "AI-powered movie and TV show recommendations based on your mood. Discover what to watch next!",
    creator: "@watchpulseapp",
    images: ['/logo.png'],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#7C8DB0",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://watchpulseapp.com",
  },
  category: 'entertainment',
};

import { LanguageProvider } from "@/contexts/LanguageContext";
import { Analytics } from '@vercel/analytics/react';
import Schema from './schema';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Schema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
