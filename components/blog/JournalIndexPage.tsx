import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalIndex from '@/components/blog/JournalIndex';
import { getPostsPage, getCategories, localePrefix, type Locale } from '@/lib/blog-index';
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

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen">
        <JournalMasthead locale={locale} />
        <JournalIndex
          posts={items}
          categories={categories}
          activeCategory={category?.slug ?? null}
          page={current}
          totalPages={totalPages}
          total={total}
          basePath={category ? `${prefix}/blog/category/${category.slug}` : `${prefix}/blog`}
          heading={category ? category.label : t.heading}
          intro={copy ? copy.intro : t.intro}
          locale={locale}
          showLead={!category && current === 1}
        />
        <JournalFooter locale={locale} />
      </div>
    </JournalThemeProvider>
  );
}
