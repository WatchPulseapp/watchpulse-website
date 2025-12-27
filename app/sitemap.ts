import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Blog from '@/lib/models/Blog'

// Static blog post slugs (hardcoded content)
const staticBlogPosts = [
  'best-ai-movie-apps-2025',
  'why-netflix-recommendations-suck',
  'how-ai-recommends-movies',
  'hidden-netflix-codes-unlock-categories',
  'stop-wasting-time-scrolling',
  'tiktok-changing-movie-discovery',
  'korean-drama-obsession-explained',
  'movies-to-watch-when-sad',
  'psychology-movie-choices',
  'streaming-wars-winners-losers',
  'future-movie-recommendations',
  'netflix-vs-mood-based-ai',
  'best-horror-movies-netflix-unknown',
  'movie-recommendation-psychology',
  'ai-entertainment-future',
  'perfect-weekend-movie-marathon',
  'movie-genres-explained',
  'streaming-subscription-worth-it',
  'indie-films-discover',
  'classic-movies-modern-audience',
  'binge-watching-psychology',
  'film-theory-beginners',
  'cinematography-appreciation',
  'soundtrack-importance',
  'acting-performances-legendary',
  'director-vision-analysis',
  'plot-twists-memorable',
  'character-development-movies',
  'dialogue-writing-cinema',
  'visual-storytelling',
  'movie-symbolism-guide',
  'film-noir-guide',
  'romantic-comedies-evolution',
  'action-movies-ranking',
  'documentary-must-watch',
  'animation-adult-themes',
  'foreign-cinema-masterpieces',
  'cult-classics-explained',
  'dark-side-recommendation-algorithms',
  'psychology-movie-addiction',
  'movies-that-make-you-cry-science',
  'ai-vs-human-recommendations',
  'best-scifi-movies-all-time',
  'date-night-movies-never-watch',
  'plot-twists-never-saw-coming',
  'worst-movies-high-ratings',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://watchpulseapp.com'

  // Get dynamic blogs from database
  let dynamicBlogSlugs: string[] = [];
  try {
    await connectDB();
    const dbBlogs = await Blog.find({ isPublished: true }).select('slug updatedAt').lean();
    dynamicBlogSlugs = dbBlogs.map((blog) => blog.slug);
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
  }

  // Combine static and dynamic blog slugs
  const allBlogSlugs = [...new Set([...dynamicBlogSlugs, ...staticBlogPosts])];

  const blogUrls = allBlogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/delete-account`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogUrls,
  ]
}
