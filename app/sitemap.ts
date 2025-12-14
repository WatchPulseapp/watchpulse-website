import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://watchpulse.com'

  // All blog post slugs - updated with 2025 content
  const blogPosts = [
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
  ];

  const blogUrls = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date('2025-01-15'),
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
    ...blogUrls,
  ]
}
