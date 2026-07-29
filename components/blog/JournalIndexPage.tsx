import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getPostsPage, getCategories, localePrefix, POSTS_PER_PAGE, type Locale } from '@/lib/blog-index';
import { strings } from '@/lib/blog-i18n';
import { categoryCopy } from '@/lib/blog-category-copy';

/**
 * Every Journal index surface, in both languages.
 *
 * There are ten of them once you multiply index, paginated and category pages
 * by two editions. Written out as ten files they would drift apart within a
 * week, so the routes stay thin and the behaviour lives here.
 */
export default async function JournalIndexPage({
  locale,
  page = 1,
  categorySlug,
}: {
  locale: Locale;
  page?: number;
  categorySlug?: string;
}) {
  const t = strings(locale);
  const prefix = localePrefix(locale);
  const categories = await getCategories(locale);

  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) || null : null;
  if (categorySlug && !category) notFound();

  const { items, page: current, totalPages, total } = await getPostsPage(
    page,
    undefined,
    category?.name,
    locale
  );

  // A page past the end is a URL that never existed.
  if (page > totalPages) notFound();

  const copy = category ? categoryCopy(category.name, locale) : null;

  const siteUrl = 'https://watchpulseapp.com';
  const heading = category ? category.label : t.heading;
  const path = category ? `${prefix}/blog/category/${category.slug}` : `${prefix}/blog`;
  const url = `${siteUrl}${path}${current > 1 ? `/page/${current}` : ''}`;

  // Tells a crawler what this page is — a list of articles, in order, with the
  // URL of each — rather than leaving it to infer that from the markup. The
  // article pages already carry Article and BreadcrumbList; the listing pages
  // that lead to them carried nothing at all.
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: heading,
    description: copy ? copy.description : t.intro,
    url,
    inLanguage: locale === 'tr' ? 'tr-TR' : 'en-US',
    isPartOf: {
      '@type': 'Blog',
      name: locale === 'tr' ? 'WatchPulse Günlük' : 'WatchPulse Journal',
      url: `${siteUrl}${prefix}/blog`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((post, i) => ({
        '@type': 'ListItem',
        // Continues across pages, so page two starts where page one stopped.
        // Uses the page size, not the number of items on this page — the last
        // page is short, and that would renumber it from the wrong offset.
        position: (current - 1) * POSTS_PER_PAGE + i + 1,
        url: `${siteUrl}${prefix}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: siteUrl },
      { '@type': 'ListItem', position: 2, name: t.journal, item: `${siteUrl}${prefix}/blog` },
      ...(category
        ? [{ '@type': 'ListItem', position: 3, name: category.label, item: `${siteUrl}${path}` }]
        : []),
    ],
  };

  // Escapes "<" so a category name containing "</script>" cannot break out of
  // the JSON-LD block.
  const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');

  return (
    <JournalThemeProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      {/* The root layout declares lang="tr" because the rest of the site is
          Turkish. The Journal has two editions, so each one states its own
          language for the subtree it owns — otherwise an English article tells
          a screen reader to pronounce it as Turkish. */}
      <div className="journal min-h-screen" lang={locale}>
        <JournalMasthead locale={locale} />
        <JournalIndex
          posts={items}
          categories={categories}
          activeCategory={category?.slug ?? null}
          page={current}
          totalPages={totalPages}
          total={total}
          basePath={path}
          heading={heading}
          intro={copy ? copy.intro : t.intro}
          locale={locale}
          showLead={!category && current === 1}
        />
        <JournalFooter locale={locale} />
      </div>
    </JournalThemeProvider>
  );
}
