import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

const baseUrl = 'https://watchpulseapp.com';

// Static blog posts for RSS
const staticBlogs = [
  {
    slug: 'best-ai-movie-apps-2025',
    title: 'Best AI Movie Recommendation Apps in 2025',
    excerpt: 'Discover the top AI-powered apps that help you find your next favorite movie based on your mood and preferences.',
    date: 'January 15, 2025',
    category: 'Technology'
  },
  {
    slug: 'why-netflix-recommendations-suck',
    title: 'Why Netflix Recommendations Suck (And What to Use Instead)',
    excerpt: 'Tired of Netflix showing you the same garbage? Here\'s why their algorithm fails and what actually works.',
    date: 'January 14, 2025',
    category: 'Streaming'
  },
  {
    slug: 'hidden-netflix-codes-unlock-categories',
    title: '50+ Hidden Netflix Codes That Unlock Secret Movie Categories',
    excerpt: 'Stop scrolling endlessly. Use these secret Netflix codes to access thousands of hidden categories.',
    date: 'January 13, 2025',
    category: 'Streaming'
  },
  {
    slug: 'how-ai-recommends-movies',
    title: 'How AI Recommends Movies Based on Your Mood',
    excerpt: 'Learn how artificial intelligence analyzes your emotions and preferences to suggest the perfect movie.',
    date: 'January 12, 2025',
    category: 'AI & Technology'
  },
  {
    slug: 'movies-to-watch-when-sad',
    title: 'Top 15 Movies to Watch When You\'re Feeling Down',
    excerpt: 'Feeling blue? These heartwarming films are scientifically proven to boost your mood.',
    date: 'January 12, 2025',
    category: 'Mood Guide'
  }
];

export async function GET() {
  try {
    // Fetch dynamic blogs from database
    let dbBlogs: Array<{
      slug: string;
      title: { en: string };
      excerpt: { en: string };
      date: string;
      category: string;
    }> = [];

    try {
      await connectDB();
      dbBlogs = await Blog.find({ isPublished: true })
        .select('slug title excerpt date category')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    } catch (error) {
      console.error('Failed to fetch blogs for RSS:', error);
    }

    // Combine dynamic and static blogs
    const allBlogs = [
      ...dbBlogs.map(blog => ({
        slug: blog.slug,
        title: blog.title.en,
        excerpt: blog.excerpt.en,
        date: blog.date,
        category: blog.category
      })),
      ...staticBlogs
    ];

    // Generate RSS XML
    const rssItems = allBlogs.map(blog => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.excerpt}]]></description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <category>${blog.category}</category>
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>WatchPulse Blog - AI Movie Recommendations</title>
    <link>${baseUrl}/blog</link>
    <description>Discover AI-powered movie and TV show recommendations based on your mood. Tips, guides, and insights about streaming, entertainment, and the future of content discovery.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>WatchPulse</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
