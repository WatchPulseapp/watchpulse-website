import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getPostsPage, getCategories } from '@/lib/blog-index';
import { categoryCopy } from '@/lib/blog-category-copy';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://watchpulseapp.com';

type Props = { params: Promise<{ category: string; page: string }> };

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 2 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug, page: raw } = await params;
  const page = parsePage(raw);
  const found = page ? (await getCategories()).find((c) => c.slug === slug) || null : null;
  if (!found || !page) return { title: 'Page Not Found | WatchPulse Journal' };

  return {
    title: `${found.name} — Page ${page} | WatchPulse Journal`,
    description: categoryCopy(found.name).description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: `${SITE_URL}/blog/category/${found.slug}/page/${page}` },
    // Page one carries the ranking signal for the category; the rest exist to
    // be crawled through to the articles.
    robots: { index: false, follow: true },
  };
}

export default async function BlogCategoryPaginatedPage({ params }: Props) {
  const { category: slug, page: raw } = await params;
  const requested = parsePage(raw);
  if (!requested) notFound();

  const categories = await getCategories();
  const found = categories.find((c) => c.slug === slug) || null;
  if (!found) notFound();

  const { items, page, totalPages, total } = await getPostsPage(requested, undefined, found.name);
  if (requested > totalPages) notFound();

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen">
        <JournalMasthead />
        <JournalIndex
          posts={items}
          categories={categories}
          activeCategory={found.slug}
          page={page}
          totalPages={totalPages}
          total={total}
          basePath={`/blog/category/${found.slug}`}
          heading={found.name}
          intro={categoryCopy(found.name).intro}
        />
        <JournalFooter />
      </div>
    </JournalThemeProvider>
  );
}
