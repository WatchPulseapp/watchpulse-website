import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = [
    'best-ai-movie-apps-2024',
    'how-ai-recommends-movies',
    'netflix-alternatives-2024',
    'movie-recommendation-algorithms',
  ];

  const blogUrls = blogPosts.map((slug) => ({
    url: `https://watchpulseapp.com/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://watchpulseapp.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://watchpulseapp.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogUrls,
  ]
}
