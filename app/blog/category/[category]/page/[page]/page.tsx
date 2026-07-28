import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getAllPosts, collectCategories, findCategoryBySlug, paginate, POSTS_PER_PAGE } from '@/lib/blog-index';
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
  const found = page ? findCategoryBySlug(await getAllPosts(), slug) : null;
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

  const all = await getAllPosts();
  const found = findCategoryBySlug(all, slug);
  if (!found) notFound();

  const inCategory = all.filter((p) => p.category === found.name);
  if (requested > Math.ceil(inCategory.length / POSTS_PER_PAGE)) notFound();

  const { items, page, totalPages, total } = paginate(inCategory, requested);

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen">
        <JournalMasthead />
        <JournalIndex
          posts={items}
          categories={collectCategories(all)}
          activeCategory={found.slug}
          page={page}
          totalPages={totalPages}
          total={total}
          basePath={`/blog/category/${found.slug}`}
          heading={found.name}
          intro={categoryCopy(found.name).intro}
          searchIndex={all.map((p) => ({ slug: p.slug, title: p.title, category: p.category }))}
        />
        <JournalFooter />
      </div>
    </JournalThemeProvider>
  );
}
