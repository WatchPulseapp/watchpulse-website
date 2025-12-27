import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WatchPulse Blog - AI Movie Recommendations, Streaming Tips & Entertainment Insights',
  description: 'Discover the latest in AI-powered movie recommendations, streaming platform tips, mood-based watching guides, and entertainment industry insights. Updated daily with fresh content.',
  keywords: 'movie blog, streaming tips, Netflix recommendations, AI movie suggestions, what to watch, entertainment news, film reviews, TV show recommendations, mood-based movies, WatchPulse blog',
  openGraph: {
    title: 'WatchPulse Blog - AI Movie & Entertainment Insights',
    description: 'Expert guides on AI movie recommendations, streaming platform comparisons, and mood-based watching. Your ultimate entertainment resource.',
    type: 'website',
    url: 'https://watchpulseapp.com/blog',
    siteName: 'WatchPulse',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WatchPulse Blog - AI Movie Recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WatchPulse Blog - AI Movie Recommendations',
    description: 'Expert guides on AI movie recommendations and streaming tips',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://watchpulseapp.com/blog',
    types: {
      'application/rss+xml': 'https://watchpulseapp.com/feed.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
