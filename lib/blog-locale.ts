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

/**
 * Tags become URL segments the same way categories do.
 *
 * Separate function despite the identical body, because the two are not the
 * same kind of thing: categories are a closed list the generator picks from,
 * tags are free text it invents per article. If tag slugs ever need their own
 * handling — transliterating "Bilim Kurgu" say — this is where it goes without
 * disturbing every category URL on the site.
 */
export function tagSlug(tag: string): string {
  return categorySlug(tag);
}

/**
 * Tags the archive should not build a page for.
 *
 * The writer tags its own articles and reaches for the brand, which produced a
 * /blog/tag/watchpulse listing the whole blog under the name of the thing
 * publishing it. Nobody searches that, and it is a page about us on a blog whose
 * point is to be about films. The same goes for a tag that is simply the word
 * "blog".
 */
const BRAND_TAG_SLUGS = new Set(['watchpulse', 'watch-pulse', 'watchpulse-app', 'blog', 'app', 'apps']);

/** Whether a tag earns a page and a link. Shared so the two never disagree. */
export function isUsefulTag(tag: string): boolean {
  const slug = tagSlug(tag);
  return slug.length > 1 && !BRAND_TAG_SLUGS.has(slug);
}
