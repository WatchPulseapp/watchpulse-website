import type { Metadata } from 'next';
import { backdropUrl, getTitleDetails, type TmdbTitleDetails } from '@/lib/tmdb';

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

export function titleMetadata(title: TmdbTitleDetails | null, path: string): Metadata {
  if (!title) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };

  const year = title.year ? ` (${title.year})` : '';
  const kind = title.mediaType === 'movie' ? 'Film' : 'TV Series';
  const url = `${SITE_URL}${path}`;
  const image = backdropUrl(title.backdropPath) || `${SITE_URL}/og-image.jpg`;

  // Leads with the question people actually type, then the facts that answer the
  // rest of the snippet.
  const heading = `${title.name}${year} — Where to Watch, Cast and Runtime`;
  const description =
    title.overview.length > 40
      ? `${title.overview.slice(0, 150).trim()}… Where to stream ${title.name}, plus cast, runtime and rating.`
      : `Where to stream ${title.name}${year}, plus cast, runtime and rating.`;

  return {
    title: `${heading} | WatchPulse`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${title.name}${year} — ${kind}`,
      description,
      url,
      siteName: 'WatchPulse',
      type: 'video.movie',
      images: [{ url: image, width: 1280, height: 720, alt: title.name }],
    },
    twitter: { card: 'summary_large_image', title: `${title.name}${year}`, description, images: [image], site: '@watchpulseapp' },
    robots: { index: true, follow: true },
  };
}

/** Movie / TVSeries structured data, with only the fields TMDB actually gave us. */
export function titleSchema(title: TmdbTitleDetails, path: string): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': title.mediaType === 'movie' ? 'Movie' : 'TVSeries',
    name: title.name,
    url: `${SITE_URL}${path}`,
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

  // Escape "<" so a synopsis containing "</script>" cannot break out of the block.
  return JSON.stringify(schema).replace(/</g, '\u003c');
}
