import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

// Reading face for the Journal. Newsreader is drawn for long-form text on
// screen — generous x-height, real italics, an optical range that holds up from
// caption to headline — which Inter, a UI face, is not trying to do.
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  // Next has no built-in metrics for Newsreader, so the fallback stack is named
  // explicitly. Without it the swap from Georgia shifts the text noticeably.
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
  // Declared at the root so every Journal surface can reach it, but only the
  // Journal actually sets text in it. Preloading is per-page and this variable
  // lives on <body>, so the landing page was pulling four Newsreader files —
  // roman and italic, latin and latin-ext — that nothing on it renders. Without
  // the preload the browser fetches them when a blog page first asks.
  preload: false,
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0F14",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://watchpulseapp.com'),
  title: "WatchPulse — Film & Dizi Takip, AI Öneri ve Sosyal Uygulama",
  description: "Bu akşam ne izlesem derdine son. Ruh haline göre AI önerileri, bölüm takibi, hangi film hangi platformda, film zevkine göre eşleşme ve gerçek zamanlı sohbet. Google Play ve App Store'da ücretsiz.",
  keywords: "ne izlesem, film önerisi, dizi önerisi, film takip uygulaması, dizi takip, bölüm takibi, hangi platformda, yapay zeka film önerisi, film uygulaması, izleme listesi, watchpulse, movie tracker, tv show tracker, what to watch, AI movie recommendations",
  authors: [{ name: "WatchPulse" }],
  creator: "WatchPulse",
  publisher: "WatchPulse",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "WatchPulse — Bu akşam ne izlesem derdine son",
    description: "Ruh haline göre AI film & dizi önerileri, bölüm takibi, platform bulucu ve film zevkine göre sosyal eşleşme. Ücretsiz indir.",
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    url: "https://watchpulseapp.com",
    siteName: "WatchPulse",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WatchPulse — Film & Dizi Takip, AI Öneri ve Sosyal Uygulama',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WatchPulse — Bu akşam ne izlesem derdine son",
    description: "Ruh haline göre AI film & dizi önerileri, bölüm takibi, platform bulucu ve sosyal eşleşme. Ücretsiz indir.",
    creator: "@watchpulseapp",
    site: "@watchpulseapp",
    images: {
      url: '/og-image.jpg',
      alt: 'WatchPulse — Film & Dizi Takip ve AI Öneri Uygulaması',
    },
  },
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
  // Search Console's HTML-tag verification. Set GOOGLE_SITE_VERIFICATION on the
  // server to the token Google hands you and the meta tag appears; leave it
  // unset and nothing is emitted. Verification via the existing Google
  // Analytics property also works and needs nothing here.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: {
    canonical: "https://watchpulseapp.com",
    languages: {
      'tr': 'https://watchpulseapp.com',
      'en': 'https://watchpulseapp.com',
      'x-default': 'https://watchpulseapp.com',
    },
  },
  category: 'entertainment',
  appLinks: {
    ios: {
      app_store_id: '6759836378',
      url: 'https://apps.apple.com/app/id6759836378',
    },
    android: {
      package: 'com.watchpulse.app',
      url: 'https://play.google.com/store/apps/details?id=com.watchpulse.app',
    },
  },
  other: {
    'apple-itunes-app': 'app-id=6759836378',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'WatchPulse',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0D0F14',
    'format-detection': 'telephone=no',
  },
};

import { LanguageProvider } from "@/contexts/LanguageContext";
import ImageGuard from "@/components/ui/ImageGuard";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import Schema from './schema';
import GoogleAnalytics from './GoogleAnalytics';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        {/* The social band's poster row is the first third-party fetch on the
            page and it now sits directly under the fold, so the TLS handshake
            is opened while the hero is still painting rather than after. */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <Schema />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} ${newsreader.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <ImageGuard />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
