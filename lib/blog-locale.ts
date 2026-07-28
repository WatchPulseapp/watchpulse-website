/**
 * Language primitives for the Journal.
 *
 * Deliberately free of any database import. These are needed by client
 * components — the masthead, the index chrome — and importing them from
 * lib/blog-index would drag mongoose into the browser bundle, which fails the
 * build outright with "Can't resolve 'net'".
 */

export type Locale = 'en' | 'tr';

export const LOCALES: Locale[] = ['en', 'tr'];

/** URL prefix for a language edition. English is the site root, Turkish sits under /tr. */
export function localePrefix(locale: Locale): string {
  return locale === 'tr' ? '/tr' : '';
}

/** Category names become URL segments: "TV Shows" -> "tv-shows". */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
