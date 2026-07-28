import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getPostsPage, getCategories } from '@/lib/blog-index';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://watchpulseapp.com';

type Props = { params: Promise<{ page: string }> };

function parsePage(raw: string): number | null {
  // Only bare integers above 1 are pages. "/blog/page/1" would duplicate
  // "/blog", and anything else is a URL that was never meant to exist.
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 2 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) return { title: 'Page Not Found | WatchPulse Journal' };

  return {
    title: `The Journal — Page ${page} | WatchPulse`,
    description: `More from the WatchPulse Journal: new releases, streaming guides and film recommendations. Page ${page}.`,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: `${SITE_URL}/blog/page/${page}` },
    // Deeper pages are for crawling through to the articles, not for ranking on
    // their own — an archive page of excerpts competes with nothing.
    robots: { index: false, follow: true },
  };
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page: raw } = await params;
  const requested = parsePage(raw);
  if (!requested) notFound();

  const [{ items, page, totalPages, total }, categories] = await Promise.all([
    getPostsPage(requested),
    getCategories(),
  ]);
  // A page beyond the end is a URL that never existed.
  if (requested > totalPages) notFound();

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen">
        <JournalMasthead />
        <JournalIndex
          posts={items}
          categories={categories}
          activeCategory={null}
          page={page}
          totalPages={totalPages}
          total={total}
          basePath="/blog"
          heading="The Journal"
          intro="What to watch and why — new releases, streaming guides and the films worth clearing an evening for."
        />
        <JournalFooter />
      </div>
    </JournalThemeProvider>
  );
}
