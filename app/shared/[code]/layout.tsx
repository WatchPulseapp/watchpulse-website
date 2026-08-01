import type { Metadata } from 'next';

interface Props {
  params: Promise<{ code: string }>;
}

/**
 * Link previews for shared collections.
 *
 * The page itself is a client component, so without this layout every
 * collection link pasted into WhatsApp/Twitter showed the site's generic
 * card. The shared-collection API is public (same gate the page uses), so
 * the crawler can be given the collection's real name and first poster.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const safe = String(code || '').replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 20);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://watchpulse.info';
    const res = await fetch(`${apiUrl}/api/user-collections/shared/${safe}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();

    if (data.success && data.collection && typeof data.collection === 'object') {
      const c = data.collection;
      const name = String(c.name || '').substring(0, 80);
      const count = Array.isArray(c.movies) ? c.movies.length : (c.movieCount || 0);
      const firstPoster = Array.isArray(c.movies) ? c.movies[0]?.posterPath : null;
      const poster = c.coverImage
        ? String(c.coverImage)
        : (typeof firstPoster === 'string' && /^\/[A-Za-z0-9._\-/]+$/.test(firstPoster)
          ? `https://image.tmdb.org/t/p/w500${firstPoster}`
          : null);
      const description = count > 0
        ? `A movie & TV collection with ${count} ${count === 1 ? 'title' : 'titles'} on WatchPulse`
        : 'A movie & TV collection on WatchPulse';

      return {
        title: `${name} — WatchPulse`,
        description,
        openGraph: {
          title: `${name} — WatchPulse`,
          description,
          siteName: 'WatchPulse',
          type: 'website',
          ...(poster ? { images: [{ url: poster }] } : {}),
        },
        twitter: { card: poster ? 'summary_large_image' : 'summary' },
      };
    }
  } catch { /* fallback below */ }

  return {
    title: 'Shared Collection — WatchPulse',
    description: 'A movie & TV collection on WatchPulse',
  };
}

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
