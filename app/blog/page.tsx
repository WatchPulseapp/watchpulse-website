import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Blog - WatchPulse | Movie & TV Show Insights',
  description: 'Discover the latest insights about AI-powered movie recommendations, streaming trends, and entertainment technology.',
  openGraph: {
    title: 'WatchPulse Blog',
    description: 'Latest insights about AI movie recommendations and streaming',
  },
};

const blogPosts = [
  {
    slug: 'best-ai-movie-apps-2024',
    title: 'Best AI Movie Recommendation Apps in 2024',
    excerpt: 'Discover the top AI-powered apps that help you find your next favorite movie based on your mood and preferences.',
    date: 'December 10, 2024',
    readTime: '5 min read',
    category: 'Technology',
  },
  {
    slug: 'how-ai-recommends-movies',
    title: 'How AI Recommends Movies Based on Your Mood',
    excerpt: 'Learn how artificial intelligence analyzes your emotions and preferences to suggest the perfect movie for any moment.',
    date: 'December 8, 2024',
    readTime: '7 min read',
    category: 'AI & Technology',
  },
  {
    slug: 'netflix-alternatives-2024',
    title: 'Top Netflix Alternatives for Movie Discovery in 2024',
    excerpt: 'Tired of endless scrolling? Explore these innovative alternatives to Netflix that make finding great content easier.',
    date: 'December 5, 2024',
    readTime: '6 min read',
    category: 'Streaming',
  },
  {
    slug: 'movie-recommendation-algorithms',
    title: 'Understanding Movie Recommendation Algorithms',
    excerpt: 'A deep dive into how recommendation systems work and why mood-based suggestions are the future of streaming.',
    date: 'December 1, 2024',
    readTime: '8 min read',
    category: 'Technology',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background-dark">
      <Header />

      <Container className="py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            WatchPulse Blog
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Insights about AI-powered entertainment, streaming trends, and movie discovery
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-background-card rounded-2xl p-6 h-full border border-brand-primary/10 hover:border-brand-primary/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                {/* Category Badge */}
                <div className="inline-block px-3 py-1 bg-brand-primary/20 rounded-full text-brand-primary text-sm font-medium mb-4">
                  {post.category}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 text-text-primary group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-text-secondary mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-primary rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Want to experience AI-powered recommendations?
          </h2>
          <p className="text-lg text-text-secondary mb-6">
            Download WatchPulse and discover your next favorite movie!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-brand-accent rounded-lg font-bold hover:bg-brand-gold transition-colors"
          >
            Learn More
          </Link>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
