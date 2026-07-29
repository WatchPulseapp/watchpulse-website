import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import JournalSearch from '@/components/blog/JournalSearch';
import { getPostsPage, localePrefix, type Locale } from '@/lib/blog-index';
import { strings } from '@/lib/blog-i18n';
import BlogCard from '@/components/blog/BlogCard';

/**
 * The Journal's own 404.
 *
 * The site-wide one is a black page with a purple gradient reading "Page Not
 * Found" and a button to the homepage. Three things wrong with that here: it is
 * English on a Turkish URL, it does not belong to the Journal's design at all,
 * and it treats a dead article link as a reason to leave. Most arrivals here
 * come from a search result or a shared link pointing at something that moved,
 * so the useful response is the language they were expecting, a search box, and
 * the three newest articles — not the door.
 */
export default async function JournalNotFound({ locale }: { locale: Locale }) {
  const t = strings(locale);
  const prefix = localePrefix(locale);

  // Best effort: if the database is unreachable the page still renders, just
  // without the suggestions.
  let recent: Awaited<ReturnType<typeof getPostsPage>>['items'] = [];
  try {
    const { items } = await getPostsPage(1, 3, undefined, locale);
    recent = items;
  } catch {
    recent = [];
  }

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen" lang={locale}>
        <JournalMasthead locale={locale} />

        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:px-8 md:pt-14">
          <Link
            href={`${prefix}/blog`}
            className="group journal-meta mb-10 inline-flex items-center gap-2 py-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            {t.allArticles}
          </Link>

          <div className="journal-measure">
            <p className="journal-eyebrow" style={{ color: 'var(--accent)' }}>
              404
            </p>

            <h1 className="journal-headline mt-4 text-[2rem] leading-[1.15] sm:text-[2.5rem]">
              {t.notFoundTitle}
            </h1>

            <p
              className="mt-4 text-[17px] leading-[1.65]"
              style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {t.notFoundBody}
            </p>

            <div className="mt-8 max-w-md">
              <JournalSearch locale={locale} />
            </div>
          </div>

          {recent.length > 0 && (
            <section className="mt-16 border-t pt-12" style={{ borderColor: 'var(--rule)' }}>
              <h2 className="journal-eyebrow" style={{ color: 'var(--ink-soft)' }}>
                {t.keepReading}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((post) => (
                  <BlogCard key={post.slug} {...post} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </div>

        <JournalFooter locale={locale} />
      </div>
    </JournalThemeProvider>
  );
}
