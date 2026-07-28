import type { Metadata } from 'next';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getAllPosts, collectCategories, paginate } from '@/lib/blog-index';

// Rendered per request so newly published posts appear immediately and the page
// HTML always contains the article list for crawlers. The DB is on the same
// host, so the query costs a few ms.
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://watchpulseapp.com';

export const metadata: Metadata = {
  title: 'WatchPulse Journal — What to Watch, Where to Start, What is Coming',
  description:
    'New releases, streaming guides, genre roundups and deep dives on the films and series worth clearing an evening for — updated daily.',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: `${SITE_URL}/blog`, types: { 'application/rss+xml': `${SITE_URL}/feed.xml` } },
  openGraph: {
    title: 'WatchPulse Journal',
    description: 'What to watch and why — new releases, streaming guides and the films worth your evening.',
    url: `${SITE_URL}/blog`,
    siteName: 'WatchPulse',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'WatchPulse Journal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WatchPulse Journal',
    description: 'What to watch and why — updated daily.',
    images: [`${SITE_URL}/og-image.jpg`],
    site: '@watchpulseapp',
  },
  robots: { index: true, follow: true },
};

export default async function BlogPage() {
  const all = await getAllPosts();
  const { items, page, totalPages, total } = paginate(all, 1);

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen">
        <JournalMasthead />
        <JournalIndex
          posts={items}
          categories={collectCategories(all)}
          activeCategory={null}
          page={page}
          totalPages={totalPages}
          total={total}
          basePath="/blog"
          heading="The Journal"
          intro="What to watch and why — new releases, streaming guides and the films worth clearing an evening for."
          searchIndex={all.map((p) => ({ slug: p.slug, title: p.title, category: p.category }))}
          showLead
        />
        <JournalFooter />
      </div>
    </JournalThemeProvider>
  );
}
