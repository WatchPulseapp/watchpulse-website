import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Blog from '@/lib/models/Blog'
import { blogPostContent } from '@/data/static-blog-content'
import { getCategories } from '@/lib/blog-index'

// Static blog post slugs with their creation dates for accurate lastModified
const staticBlogPosts: Array<{ slug: string; date: string; priority: number }> = [
  // HIGH PRIORITY - Main topics
  { slug: 'best-ai-movie-apps-2025', date: '2025-01-15', priority: 0.9 },
  { slug: 'why-netflix-recommendations-suck', date: '2025-01-14', priority: 0.9 },
  { slug: 'how-ai-recommends-movies', date: '2025-01-12', priority: 0.9 },
  { slug: 'hidden-netflix-codes-unlock-categories', date: '2025-01-13', priority: 0.85 },
  { slug: 'stop-wasting-time-scrolling', date: '2025-01-13', priority: 0.85 },

  // MEDIUM-HIGH PRIORITY - Popular topics
  { slug: 'tiktok-changing-movie-discovery', date: '2025-01-08', priority: 0.8 },
  { slug: 'korean-drama-obsession-explained', date: '2025-01-07', priority: 0.8 },
  { slug: 'movies-to-watch-when-sad', date: '2025-01-12', priority: 0.85 },
  { slug: 'psychology-movie-choices', date: '2025-01-10', priority: 0.8 },
  { slug: 'streaming-wars-winners-losers', date: '2025-01-09', priority: 0.8 },
  { slug: 'future-movie-recommendations', date: '2025-01-08', priority: 0.8 },
  { slug: 'netflix-vs-mood-based-ai', date: '2025-01-11', priority: 0.85 },
  { slug: 'best-horror-movies-netflix-unknown', date: '2025-01-10', priority: 0.8 },
  { slug: 'movie-recommendation-psychology', date: '2025-01-09', priority: 0.8 },
  { slug: 'ai-entertainment-future', date: '2025-01-07', priority: 0.8 },

  // MEDIUM PRIORITY - Guides
  { slug: 'perfect-weekend-movie-marathon', date: '2025-01-06', priority: 0.75 },
  { slug: 'movie-genres-explained', date: '2025-01-05', priority: 0.75 },
  { slug: 'streaming-subscription-worth-it', date: '2025-01-04', priority: 0.75 },
  { slug: 'indie-films-discover', date: '2025-01-03', priority: 0.75 },
  { slug: 'classic-movies-modern-audience', date: '2025-01-02', priority: 0.75 },
  { slug: 'binge-watching-psychology', date: '2025-01-01', priority: 0.75 },
  { slug: 'film-theory-beginners', date: '2024-12-30', priority: 0.7 },
  { slug: 'cinematography-appreciation', date: '2024-12-29', priority: 0.7 },
  { slug: 'soundtrack-importance', date: '2024-12-28', priority: 0.7 },
  { slug: 'acting-performances-legendary', date: '2024-12-27', priority: 0.7 },
  { slug: 'director-vision-analysis', date: '2024-12-26', priority: 0.7 },
  { slug: 'plot-twists-memorable', date: '2024-12-25', priority: 0.75 },
  { slug: 'character-development-movies', date: '2024-12-24', priority: 0.7 },
  { slug: 'dialogue-writing-cinema', date: '2024-12-23', priority: 0.7 },
  { slug: 'visual-storytelling', date: '2024-12-22', priority: 0.7 },
  { slug: 'movie-symbolism-guide', date: '2024-12-21', priority: 0.7 },
  { slug: 'film-noir-guide', date: '2024-12-20', priority: 0.7 },
  { slug: 'romantic-comedies-evolution', date: '2024-12-19', priority: 0.7 },
  { slug: 'action-movies-ranking', date: '2024-12-18', priority: 0.75 },
  { slug: 'documentary-must-watch', date: '2024-12-17', priority: 0.75 },
  { slug: 'animation-adult-themes', date: '2024-12-16', priority: 0.7 },
  { slug: 'foreign-cinema-masterpieces', date: '2024-12-15', priority: 0.75 },
  { slug: 'cult-classics-explained', date: '2024-12-14', priority: 0.7 },

  // AI & Tech focused
  { slug: 'dark-side-recommendation-algorithms', date: '2025-01-06', priority: 0.8 },
  { slug: 'psychology-movie-addiction', date: '2025-01-12', priority: 0.8 },
  { slug: 'movies-that-make-you-cry-science', date: '2025-01-11', priority: 0.8 },
  { slug: 'ai-vs-human-recommendations', date: '2025-01-06', priority: 0.85 },

  // Lists
  { slug: 'best-scifi-movies-all-time', date: '2025-01-04', priority: 0.8 },
  { slug: 'date-night-movies-never-watch', date: '2025-01-09', priority: 0.75 },
  { slug: 'plot-twists-never-saw-coming', date: '2025-01-01', priority: 0.75 },
  { slug: 'worst-movies-high-ratings', date: '2025-01-05', priority: 0.7 },
];

interface DBBlog {
  slug: string;
  lang?: string;
  updatedAt?: Date;
  createdAt?: Date;
  sourceRefs?: Array<{ id: number; type: 'movie' | 'tv' | 'person'; name: string }>;
}

/**
 * Ceiling on title pages listed. Ten articles a day naming half a dozen films
 * each grows this without limit, and a sitemap is capped at 50,000 URLs — so it
 * is bounded here, newest first, and the count that was dropped is logged rather
 * than silently discarded.
 */
const MAX_TITLE_URLS = 4000;

// Rebuild every five minutes instead of once at build time.
//
// Without a revalidate Next prerenders the sitemap during the build and serves
// that snapshot forever, so every article published afterwards — ten a day —
// stays invisible to crawlers until the next deploy.
//
// Five minutes rather than an hour because the publisher cannot shorten it on
// demand: revalidatePath does not invalidate a metadata route in Next 14.2
// (measured — the cached copy survived the call and only changed on a rebuild).
// Time is therefore the only lever, and five minutes caps crawler traffic at
// twelve queries an hour however often the file is fetched.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://watchpulseapp.com'

  // Get dynamic blogs from database with their dates
  let dynamicBlogs: Array<{ slug: string; lastModified: Date; priority: number }> = [];
  let turkishBlogs: Array<{ slug: string; lastModified: Date }> = [];
  // Deduplicated across the archive: a popular film is named by a dozen articles
  // and still has exactly one page.
  const titlePaths = new Map<string, Date>();
  try {
    await connectDB();
    const dbBlogs = await Blog.find({ isPublished: true })
      .select('slug lang updatedAt createdAt sourceRefs')
      .sort({ createdAt: -1 })
      .lean() as DBBlog[];

    // Every article is published in both languages under the same slug, so each
    // one contributes two URLs. They are alternates rather than duplicates —
    // the pages declare each other via hreflang.
    const modified = (blog: DBBlog) => blog.updatedAt || blog.createdAt || new Date();

    dynamicBlogs = dbBlogs.map((blog) => ({
      slug: blog.slug,
      lastModified: modified(blog),
      priority: 0.8 // AI-generated blogs get good priority
    }));

    turkishBlogs = dbBlogs.map((blog) => ({ slug: blog.slug, lastModified: modified(blog) }));

    // The films, series and people the articles are written about. These pages
    // were rendering all along but appeared in no sitemap and were linked from
    // nowhere, so the only ones Google knew about were the handful it had found
    // through links shared out of the app.
    for (const blog of dbBlogs) {
      for (const ref of blog.sourceRefs || []) {
        if (!ref?.id || !ref.type) continue;
        const path = `/${ref.type}/${ref.id}`;
        // dbBlogs is newest first, so the first article to name a title sets its
        // date and later (older) ones do not walk it backwards.
        if (!titlePaths.has(path)) titlePaths.set(path, modified(blog));
      }
    }
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
  }

  // Only list static slugs that actually have rendered content — otherwise the
  // page 404s and the sitemap sends crawlers to dead URLs (SEO harm).
  const staticBlogUrls = staticBlogPosts
    .filter((post) => blogPostContent[post.slug])
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: post.priority,
    }));

  const dynamicBlogUrls = dynamicBlogs
    .filter(blog => !staticBlogPosts.some(s => s.slug === blog.slug))
    .map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.lastModified,
      changeFrequency: 'weekly' as const,
      priority: blog.priority,
    }));

  // Core pages with strategic priorities
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-07-23'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-03-08'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/delete-account`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Sort blogs by priority then by date for better crawling
  const allBlogUrls = [...staticBlogUrls, ...dynamicBlogUrls]
    .sort((a, b) => b.priority - a.priority || b.lastModified.getTime() - a.lastModified.getTime());

  // Category landing pages. Each targets a distinct search intent — "best
  // horror films" is a different visitor from "what is on TV this week" — so
  // they are listed in their own right rather than left to be discovered.
  let categoryUrls: MetadataRoute.Sitemap = [];
  try {
    categoryUrls = (await getCategories('en')).map((c) => ({
      url: `${baseUrl}/blog/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Failed to build category sitemap entries:', error);
  }

  // The Turkish edition. Its articles are not translations of the English ones,
  // so they are listed as URLs in their own right rather than as alternates.
  let turkishUrls: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories('tr');
    turkishUrls = [
      {
        url: `${baseUrl}/tr/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.95,
      },
      ...categories.map((c) => ({
        url: `${baseUrl}/tr/blog/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
      ...turkishBlogs.map((p) => ({
        url: `${baseUrl}/tr/blog/${p.slug}`,
        lastModified: p.lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    console.error('Failed to build Turkish sitemap entries:', error);
  }

  // Title pages, in both editions. Lower priority than the articles: they are
  // reference pages that answer one question rather than the writing the site is
  // trying to be known for, and they change only when availability does.
  const titleEntries = [...titlePaths.entries()];
  if (titleEntries.length > MAX_TITLE_URLS) {
    console.warn(
      `[sitemap] ${titleEntries.length} title pages available, listing the ${MAX_TITLE_URLS} most recent`
    );
  }

  const titleUrls: MetadataRoute.Sitemap = titleEntries
    .slice(0, MAX_TITLE_URLS)
    .flatMap(([path, lastModified]) => [
      {
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/tr${path}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
    ]);

  return [...corePages, ...categoryUrls, ...turkishUrls, ...allBlogUrls, ...titleUrls];
}
