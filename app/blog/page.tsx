import type { Metadata } from 'next';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import BlogList, { type BlogListItem } from '@/components/blog/BlogList';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { staticBlogPosts } from '@/data/static-blogs';

// Rendered per request so newly published posts appear immediately and the page
// HTML always contains the article list for crawlers (SEO). The DB lives on the
// same host, so the query is a few ms.
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://watchpulseapp.com';

export const metadata: Metadata = {
  title: 'WatchPulse Blog — AI Movie Recommendations, Streaming Tips & Entertainment Insights',
  description:
    'Deep dives into streaming trends, mood-based movie recommendations, hidden gems and the future of entertainment discovery — from the team behind WatchPulse.',
  keywords: [
    'movie recommendations',
    'what to watch',
    'streaming tips',
    'AI movie app',
    'mood based recommendations',
    'hidden gems',
    'WatchPulse blog',
  ].join(', '),
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'WatchPulse Blog — Stories & Insights on Watching Smarter',
    description:
      'Streaming trends, mood-based recommendations and hidden gems from the team behind WatchPulse.',
    url: `${SITE_URL}/blog`,
    siteName: 'WatchPulse',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'WatchPulse Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WatchPulse Blog',
    description: 'Streaming trends, mood-based recommendations and hidden gems.',
    images: [`${SITE_URL}/og-image.jpg`],
    site: '@watchpulseapp',
  },
  robots: { index: true, follow: true },
};

async function getPosts(): Promise<BlogListItem[]> {
  const items: BlogListItem[] = [];
  const seen = new Set<string>();

  try {
    await connectDB();
    const dbBlogs = await Blog.find({ isPublished: true })
      .select('slug title excerpt date readTime category coverImage')
      .sort({ createdAt: -1 })
      .lean();

    for (const b of dbBlogs as Array<Record<string, any>>) {
      if (!b.slug || seen.has(b.slug)) continue;
      seen.add(b.slug);
      items.push({
        slug: b.slug,
        title: b.title?.en || b.title?.tr || '',
        excerpt: b.excerpt?.en || b.excerpt?.tr || '',
        category: b.category || 'General',
        date: b.date || '',
        readTime: b.readTime || '5 min read',
        coverImage: b.coverImage,
      });
    }
  } catch (error) {
    console.error('Blog list DB fetch failed, falling back to static:', error);
  }

  // Merge curated static posts (skip any already served from the DB).
  for (const p of staticBlogPosts) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    items.push({
      slug: p.slug,
      title: p.title.en,
      excerpt: p.excerpt.en,
      category: p.category,
      date: p.date,
      readTime: p.readTime,
      coverImage: p.coverImage,
    });
  }

  return items;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <JournalThemeProvider>
      <div className="journal min-h-screen">
        <JournalMasthead />

        {/* Masthead block — a publication nameplate, left-aligned, not a centred
            hero. The index's job is to get the reader into a story quickly. */}
        <header className="mx-auto w-full max-w-6xl px-5 pb-10 pt-14 sm:px-6 md:px-8 md:pb-12 md:pt-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h1 className="journal-headline text-[2.5rem] leading-[1.05] sm:text-[3.25rem] md:text-[3.75rem]">
                The Journal
              </h1>
              <p
                className="mt-4 text-[16px] leading-[1.65] md:text-[17px]"
                style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                What to watch and why — new releases, streaming guides and the films worth
                clearing an evening for.
              </p>
            </div>

            <p className="journal-meta shrink-0 md:text-right">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              <span className="mx-2" aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>
                ·
              </span>
              Updated daily
            </p>
          </div>
        </header>

        <BlogList posts={posts} />

        <JournalFooter />
      </div>
    </JournalThemeProvider>
  );
}
