import type { Metadata } from 'next';
import {
  backdropUrl,
  getRecommendations,
  getTitleDetails,
  type TmdbTitle,
  type TmdbTitleDetails,
} from '@/lib/tmdb';
import { localePrefix, type Locale } from '@/lib/blog-locale';

/**
 * Shared metadata and structured data for /movie/[id] and /tv/[id].
 *
 * Both routes describe the same kind of thing and differ only in media type, so
 * the SEO surface is written once — otherwise the two would drift.
 */

const SITE_URL = 'https://watchpulseapp.com';

export async function loadTitle(rawId: string, mediaType: 'movie' | 'tv'): Promise<TmdbTitleDetails | null> {
  // TMDB ids are integers. Anything else is a URL that was never real, and
  // should 404 rather than cost an upstream request.
  if (!/^\d+$/.test(rawId)) return null;
  // Cached for an hour; streaming availability moves on the order of weeks.
  return getTitleDetails(Number(rawId), mediaType, 3600);
}

/**
 * What to watch next. Cached for a day — a recommendation set moves far slower
 * than availability does, and this is a second upstream call on a page that
 * already made one.
 */
export async function loadSimilar(rawId: string, mediaType: 'movie' | 'tv'): Promise<TmdbTitle[]> {
  if (!/^\d+$/.test(rawId)) return [];
  try {
    return await getRecommendations(Number(rawId), mediaType, 6, 86400);
  } catch {
    // A page without a "watch next" strip is still a page; a page that 500s
    // because a secondary call failed is not.
    return [];
  }
}

/**
 * @param path the id path without a language prefix, e.g. "/movie/1234".
 *
 * Both editions render the same record, so each declares the other via hreflang
 * rather than competing with it — two URLs for one film read as duplication
 * unless the relationship is stated.
 */
export function titleMetadata(
  title: TmdbTitleDetails | null,
  path: string,
  locale: Locale = 'en'
): Metadata {
  if (!title) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };

  const year = title.year ? ` (${title.year})` : '';
  const url = `${SITE_URL}${localePrefix(locale)}${path}`;
  const image = backdropUrl(title.backdropPath) || `${SITE_URL}/og-image.jpg`;
  const isFilm = title.mediaType === 'movie';

  // Leads with the question people actually type, then the facts that answer the
  // rest of the snippet.
  const heading =
    locale === 'tr'
      ? `${title.name}${year} nerede izlenir? Oyuncular ve süre`
      : `${title.name}${year} — Where to Watch, Cast and Runtime`;

  const summary = title.overview.length > 40 ? `${title.overview.slice(0, 150).trim()}… ` : '';
  const description =
    locale === 'tr'
      ? `${summary}${title.name} hangi platformda yayında, oyuncu kadrosu, süresi ve puanı.`
      : `${summary}Where to stream ${title.name}, plus cast, runtime and rating.`;

  const kind = locale === 'tr' ? (isFilm ? 'Film' : 'Dizi') : isFilm ? 'Film' : 'TV Series';

  return {
    title: `${heading} | WatchPulse`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}${path}`,
        tr: `${SITE_URL}/tr${path}`,
        'x-default': `${SITE_URL}${path}`,
      },
    },
    openGraph: {
      title: `${title.name}${year} — ${kind}`,
      description,
      url,
      siteName: 'WatchPulse',
      type: 'video.movie',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      images: [{ url: image, width: 1280, height: 720, alt: title.name }],
    },
    twitter: { card: 'summary_large_image', title: `${title.name}${year}`, description, images: [image], site: '@watchpulseapp' },
    robots: { index: true, follow: true },
  };
}

/** Movie / TVSeries structured data, with only the fields TMDB actually gave us. */
export function titleSchema(title: TmdbTitleDetails, path: string, locale: Locale = 'en'): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': title.mediaType === 'movie' ? 'Movie' : 'TVSeries',
    name: title.name,
    url: `${SITE_URL}${localePrefix(locale)}${path}`,
    inLanguage: locale === 'tr' ? 'tr-TR' : 'en-US',
    ...(title.overview ? { description: title.overview } : {}),
    ...(title.backdropPath ? { image: backdropUrl(title.backdropPath) } : {}),
    ...(title.date ? { datePublished: title.date } : {}),
    ...(title.genres.length ? { genre: title.genres } : {}),
    ...(title.director ? { director: { '@type': 'Person', name: title.director } } : {}),
    ...(title.cast.length ? { actor: title.cast.map((name) => ({ '@type': 'Person', name })) } : {}),
    ...(title.mediaType === 'movie' && title.runtime ? { duration: `PT${title.runtime}M` } : {}),
    ...(title.rating !== null && title.votes > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: title.rating,
            bestRating: 10,
            worstRating: 1,
            ratingCount: title.votes,
          },
        }
      : {}),
  };

  // Escape "<" so a synopsis containing "</script>" cannot break out of the
  // block. The replacement needs two backslashes in source: one produces the
  // character "<" and replaces every "<" with itself, escaping nothing.
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
