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

/**
 * Reads a /page/<n> segment.
 *
 * Lives here rather than in each of the four paginated routes because it was
 * copied into all four, and so was a typo in it: the digit class had lost its
 * backslash, leaving a pattern that matched the letter "d". Every paginated URL
 * in both editions returned 404 while the index went on linking to them.
 *
 * Only bare integers above 1 are pages: "/page/1" would duplicate the index at
 * a second URL, and anything else was never a real page.
 */
export function parsePageParam(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 2 ? n : null;
}

/** Category names become URL segments: "TV Shows" -> "tv-shows". */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
