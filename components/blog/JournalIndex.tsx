import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import JournalSearch from '@/components/blog/JournalSearch';
import type { BlogListItem, CategoryInfo } from '@/lib/blog-index';
import type { Locale } from '@/lib/blog-locale';
import { localePrefix } from '@/lib/blog-locale';
import { strings } from '@/lib/blog-i18n';

/**
 * The Journal index, shared by /blog, /blog/page/N and /blog/category/X.
 *
 * Categories and pagination are real links to real URLs rather than client
 * state. That is the whole point: with state, page two and every category
 * existed only after a click, so a crawler saw the first twelve articles and
 * nothing else, and no internal links pointed at the rest. At five new posts a
 * day that is most of the archive unreachable within a fortnight.
 */

interface JournalIndexProps {
  /** Posts for this page only. */
  posts: BlogListItem[];
  categories: CategoryInfo[];
  /** Slug of the category being viewed, or null on the main index. */
  activeCategory: string | null;
  page: number;
  totalPages: number;
  total: number;
  /** Where pagination links point; page 1 is the bare path, with no /page/1. */
  basePath: string;
  heading: string;
  intro: string;
  /** The lead story treatment only makes sense on the unfiltered first page. */
  showLead?: boolean;
  locale: Locale;
}

function pageHref(basePath: string, page: number, locale: Locale): string {
  if (page <= 1) return basePath;
  const indexPath = `${localePrefix(locale)}/blog`;
  return basePath === indexPath ? `${indexPath}/page/${page}` : `${basePath}/page/${page}`;
}

function pageNumbers(page: number, totalPages: number): Array<number | 'gap'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const out: Array<number | 'gap'> = [1];
  if (page > 3) out.push('gap');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) out.push(i);
  if (page < totalPages - 2) out.push('gap');
  out.push(totalPages);
  return out;
}

export default function JournalIndex({
  posts,
  categories,
  activeCategory,
  page,
  totalPages,
  total,
  basePath,
  heading,
  intro,
  showLead = false,
  locale,
}: JournalIndexProps) {
  const t = strings(locale);
  const prefix = localePrefix(locale);
  const lead = showLead && page === 1 ? posts[0] : null;
  const rest = lead ? posts.slice(1) : posts;

  return (
    <>
      <header className="mx-auto w-full max-w-6xl px-5 pb-10 pt-14 sm:px-6 md:px-8 md:pb-12 md:pt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="journal-headline text-[2.5rem] leading-[1.05] sm:text-[3.25rem] md:text-[3.75rem]">
              {heading}
            </h1>
            <p
              className="mt-4 text-[16px] leading-[1.65] md:text-[17px]"
              style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {intro}
            </p>
          </div>

          <p className="journal-meta shrink-0 md:text-right">
            {t.articles(total)}
            {totalPages > 1 && (
              <>
                <span className="mx-2" aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>
                  ·
                </span>
                {t.pageOf(page, totalPages)}
              </>
            )}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 md:px-8">
        <div
          className="flex flex-col gap-4 border-y py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
          style={{ borderColor: 'var(--rule)' }}
        >
          <nav
            className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0"
            style={{ scrollbarWidth: 'none' }}
            aria-label={t.categoriesAria}
          >
            <Link
              href={`${prefix}/blog`}
              aria-current={activeCategory === null ? 'page' : undefined}
              className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
              style={
                activeCategory === null
                  ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                  : { color: 'var(--ink-soft)' }
              }
            >
              {t.all}
            </Link>
            {categories.map((c) => {
              const active = activeCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`${prefix}/blog/category/${c.slug}`}
                  aria-current={active ? 'page' : undefined}
                  className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
                  style={
                    active
                      ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                      : { color: 'var(--ink-soft)' }
                  }
                >
                  {c.name}
                </Link>
              );
            })}
          </nav>

          <JournalSearch locale={locale} />
        </div>

        {lead && (
          <div className="mt-8">
            <BlogCard {...lead} featured />
          </div>
        )}

        {rest.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          !lead && (
            <div className="py-24 text-center">
              <p className="journal-headline text-[1.25rem]">{t.emptyTitle}</p>
              <p className="journal-meta mt-2">{t.emptyBody}</p>
            </div>
          )
        )}

        {totalPages > 1 && (
          <nav className="mt-14 flex items-center justify-center gap-1" aria-label={t.pagination}>
            {page > 1 ? (
              <Link
                href={pageHref(basePath, page - 1, locale)}
                rel="prev"
                aria-label={t.previousPage}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors"
                style={{ color: 'var(--ink-soft)' }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span className="grid h-9 w-9 place-items-center opacity-30" style={{ color: 'var(--ink-soft)' }}>
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}

            {pageNumbers(page, totalPages).map((n, i) =>
              n === 'gap' ? (
                <span key={`gap-${i}`} className="journal-meta px-1">
                  …
                </span>
              ) : (
                <Link
                  key={n}
                  href={pageHref(basePath, n, locale)}
                  aria-current={page === n ? 'page' : undefined}
                  className="grid h-9 min-w-9 place-items-center rounded-full px-3 text-[13px] font-medium tabular-nums transition-colors"
                  style={
                    page === n
                      ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                      : { color: 'var(--ink-soft)' }
                  }
                >
                  {n}
                </Link>
              )
            )}

            {page < totalPages ? (
              <Link
                href={pageHref(basePath, page + 1, locale)}
                rel="next"
                aria-label={t.nextPage}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors"
                style={{ color: 'var(--ink-soft)' }}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="grid h-9 w-9 place-items-center opacity-30" style={{ color: 'var(--ink-soft)' }}>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
