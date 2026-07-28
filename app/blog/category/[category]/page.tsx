import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getPostsPage, getCategories } from '@/lib/blog-index';
import { categoryCopy } from '@/lib/blog-category-copy';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://watchpulseapp.com';

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const found = (await getCategories()).find((c) => c.slug === slug) || null;
  if (!found) return { title: 'Category Not Found | WatchPulse Journal' };

  const copy = categoryCopy(found.name);
  const url = `${SITE_URL}/blog/category/${found.slug}`;

  return {
    title: `${copy.title} | WatchPulse Journal`,
    description: copy.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      siteName: 'WatchPulse',
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: copy.title }],
    },
    twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, site: '@watchpulseapp' },
    robots: { index: true, follow: true },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const categories = await getCategories();
  const found = categories.find((c) => c.slug === slug) || null;
  if (!found) notFound();

  const { items, page, totalPages, total } = await getPostsPage(1, undefined, found.name);
  const copy = categoryCopy(found.name);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: found.name, item: `${SITE_URL}/blog/category/${found.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\u003c') }}
      />
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
            intro={copy.intro}
          />
          <JournalFooter />
        </div>
      </JournalThemeProvider>
    </>
  );
}
