/**
 * Picks the right TMDB rendition of an image.
 *
 * Cover images are stored at w1280 because that is the size a social preview
 * and an Article schema want. Cards render them about 350 CSS pixels wide, so
 * serving the stored URL meant a 169 KB file for a slot that needs 25 KB —
 * measured, a twelve-card index page pulled 2.0 MB of images where 303 KB would
 * do. On a phone that is the difference between a fast page and a slow one, and
 * it is the largest thing on the page, so it is the one the browser measures.
 *
 * Free of any import so client components can use it without pulling anything
 * into the browser bundle.
 */

/** The widths TMDB actually serves for backdrops. Anything else 404s. */
export type TmdbWidth = 'w300' | 'w500' | 'w780' | 'w1280' | 'original';

const TMDB_HOST = 'https://image.tmdb.org/t/p/';

/**
 * Rewrites the size segment of a TMDB image URL. Anything that is not a TMDB
 * URL — a locally hosted fallback, say — is returned untouched.
 */
export function tmdbImage(url: string | undefined, width: TmdbWidth): string | undefined {
  if (!url || !url.startsWith(TMDB_HOST)) return url;
  return url.replace(/\/t\/p\/(w\d+|original)\//, `/t/p/${width}/`);
}

/**
 * A srcset for a card, so a retina screen gets the sharper file and everyone
 * else gets the small one. `sizes` still has to be supplied by the caller,
 * since only the layout knows how wide the slot is.
 */
export function tmdbSrcSet(
  url: string | undefined,
  scale: 'card' | 'hero' | 'poster' = 'card'
): string | undefined {
  if (!url || !url.startsWith(TMDB_HOST)) return undefined;

  // The hero spans the measure and needs the large rendition on a wide screen;
  // a card never does, so offering it one only invites the browser to pick it.
  // A poster is narrow at every breakpoint — 140px on a phone, 200px on a
  // desktop — so it never has any business fetching w780.
  const widths: TmdbWidth[] =
    scale === 'hero' ? ['w500', 'w780', 'w1280'] : scale === 'poster' ? ['w300', 'w500'] : ['w300', 'w500', 'w780'];

  return widths.map((w) => `${tmdbImage(url, w)} ${w.slice(1)}w`).join(', ');
}
