import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Blog from '@/lib/models/Blog'

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
  updatedAt?: Date;
  createdAt?: Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://watchpulseapp.com'

  // Get dynamic blogs from database with their dates
  let dynamicBlogs: Array<{ slug: string; lastModified: Date; priority: number }> = [];
  try {
    await connectDB();
    const dbBlogs = await Blog.find({ isPublished: true })
      .select('slug updatedAt createdAt')
      .lean() as DBBlog[];

    dynamicBlogs = dbBlogs.map((blog) => ({
      slug: blog.slug,
      lastModified: blog.updatedAt || blog.createdAt || new Date(),
      priority: 0.8 // AI-generated blogs get good priority
    }));
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
  }

  // Create blog URLs with proper dates
  const staticBlogUrls = staticBlogPosts.map((post) => ({
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
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'monthly',
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

  return [...corePages, ...allBlogUrls];
}
