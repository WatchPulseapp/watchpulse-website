import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getAllPosts, collectCategories, paginate, POSTS_PER_PAGE } from '@/lib/blog-index';

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

  const all = await getAllPosts();
  if (requested > Math.ceil(all.length / POSTS_PER_PAGE)) notFound();

  const { items, page, totalPages, total } = paginate(all, requested);

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
        />
        <JournalFooter />
      </div>
    </JournalThemeProvider>
  );
}
