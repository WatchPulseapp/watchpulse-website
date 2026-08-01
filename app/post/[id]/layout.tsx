import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://watchpulse.info';
    const res = await fetch(`${apiUrl}/api/posts/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();

    if (data.success && data.data?.post && typeof data.data.post === 'object') {
      const post = data.data.post;
      const author = String(post.userId?.username || post.userId?.displayName || 'WatchPulse').substring(0, 40);
      const title = String(post.movieTitle || 'WatchPulse').substring(0, 80);
      const description = String(post.content || '').substring(0, 150);

      // Preview image: the post's own image wins; otherwise the movie poster.
      const firstImage = Array.isArray(post.images) ? post.images[0]?.url : null;
      const image = (typeof firstImage === 'string' && /^https:\/\//.test(firstImage))
        ? firstImage
        : (typeof post.moviePoster === 'string' && /^\/[A-Za-z0-9._\-/]+$/.test(post.moviePoster)
          ? `https://image.tmdb.org/t/p/w500${post.moviePoster}`
          : null);

      return {
        title: `${title} — ${author} | WatchPulse`,
        description,
        openGraph: {
          title: `${title} — ${author}`,
          description,
          type: 'article',
          siteName: 'WatchPulse',
          ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: { card: image ? 'summary_large_image' : 'summary' },
      };
    }
  } catch { /* fallback below */ }

  return {
    title: 'WatchPulse',
    description: 'Film ve dizi tutkunlarının buluşma noktası',
  };
}

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
