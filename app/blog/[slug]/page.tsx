import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { ArrowLeft } from 'lucide-react';

// Blog post data
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
}> = {
  'best-ai-movie-apps-2024': {
    title: 'Best AI Movie Recommendation Apps in 2024',
    excerpt: 'Discover the top AI-powered apps that help you find your next favorite movie based on your mood and preferences.',
    date: 'December 10, 2024',
    readTime: '5 min read',
    category: 'Technology',
    content: [
      'Finding the perfect movie to watch has never been easier thanks to AI-powered recommendation systems. In 2024, several innovative apps are revolutionizing how we discover entertainment.',
      'WatchPulse leads the pack with its unique mood-based recommendation system. Unlike traditional apps that only consider your watch history, WatchPulse analyzes your current emotional state to suggest content that matches how you\'re feeling right now.',
      'The AI algorithms behind these apps use machine learning to understand patterns in viewing behavior, genre preferences, and even the time of day you typically watch certain types of content. This creates a personalized experience that gets better over time.',
      'Key features to look for in AI movie apps include: mood detection, social watchlists, TMDB integration for comprehensive movie data, and cross-platform availability. The best apps combine all these elements seamlessly.',
      'As streaming platforms continue to grow their libraries, AI-powered discovery tools become essential. They cut through the noise and help you spend less time browsing and more time enjoying great content.',
    ],
  },
  'how-ai-recommends-movies': {
    title: 'How AI Recommends Movies Based on Your Mood',
    excerpt: 'Learn how artificial intelligence analyzes your emotions and preferences to suggest the perfect movie for any moment.',
    date: 'December 8, 2024',
    readTime: '7 min read',
    category: 'AI & Technology',
    content: [
      'Mood-based movie recommendations represent the next evolution in entertainment discovery. But how exactly does AI understand your emotional state and translate it into perfect movie suggestions?',
      'The process begins with sentiment analysis. Advanced algorithms can detect emotional cues from various inputs - whether it\'s direct mood selection, time of day, previous viewing patterns, or even weather conditions in your location.',
      'Machine learning models are trained on vast datasets of movies, their emotional characteristics, pacing, themes, and viewer responses. When you indicate you\'re feeling "relaxed," the AI knows to suggest slower-paced, comfortable content rather than intense thrillers.',
      'Natural Language Processing (NLP) plays a crucial role too. The AI analyzes movie descriptions, reviews, and social media sentiment to understand the emotional impact of each film. This creates a rich emotional profile for every title in the database.',
      'The result is a personalized recommendation system that feels almost magical. It\'s like having a film-savvy friend who always knows exactly what you\'re in the mood for, available 24/7 at the touch of a button.',
    ],
  },
  'netflix-alternatives-2024': {
    title: 'Top Netflix Alternatives for Movie Discovery in 2024',
    excerpt: 'Tired of endless scrolling? Explore these innovative alternatives to Netflix that make finding great content easier.',
    date: 'December 5, 2024',
    readTime: '6 min read',
    category: 'Streaming',
    content: [
      'Netflix fatigue is real. With thousands of titles available, paradoxically, finding something to watch has become harder than ever. Enter the new generation of discovery tools designed to solve this exact problem.',
      'Traditional streaming platforms focus on content delivery, but newer apps prioritize content discovery. They act as intelligent layers on top of existing services, helping you decide what to watch before you even open Netflix, Hulu, or Prime Video.',
      'WatchPulse exemplifies this new approach. Instead of browsing through endless thumbnails, you simply indicate your mood or preferences, and the AI does the heavy lifting. It searches across multiple platforms to find the perfect match.',
      'These discovery tools also add social elements missing from traditional streaming services. Share watchlists with friends, see what others are enjoying, and get recommendations based on your social circle\'s viewing habits.',
      'The future of entertainment isn\'t just about having more content - it\'s about having smarter ways to find the content that\'s right for you, right now. That\'s what makes these Netflix alternatives so valuable.',
    ],
  },
  'movie-recommendation-algorithms': {
    title: 'Understanding Movie Recommendation Algorithms',
    excerpt: 'A deep dive into how recommendation systems work and why mood-based suggestions are the future of streaming.',
    date: 'December 1, 2024',
    readTime: '8 min read',
    category: 'Technology',
    content: [
      'Recommendation algorithms are the invisible force shaping our entertainment choices. Understanding how they work helps us appreciate the technology and use these tools more effectively.',
      'Most streaming services use collaborative filtering - if users similar to you enjoyed a movie, you probably will too. While effective, this approach has limitations. It tends to create "filter bubbles" and rarely suggests content outside your comfort zone.',
      'Content-based filtering takes a different approach, analyzing the characteristics of movies you\'ve enjoyed (genre, director, actors) to find similar titles. This works well but can feel predictable over time.',
      'Hybrid systems combine both methods, and the newest generation adds context awareness. They consider when you\'re watching, what device you\'re using, and increasingly, how you\'re feeling. This is where mood-based recommendations excel.',
      'The future of recommendation technology lies in understanding not just what you like, but why you like it and when you\'re most likely to enjoy it. This contextual intelligence transforms good recommendations into great ones.',
    ],
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - WatchPulse Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background-dark">
      <Header />

      <Container className="py-20">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="max-w-3xl mx-auto">
          {/* Category Badge */}
          <div className="inline-block px-4 py-2 bg-brand-primary/20 rounded-full text-brand-primary text-sm font-medium mb-6">
            {post.category}
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-hero bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-text-muted mb-12 pb-8 border-b border-brand-primary/20">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-text-secondary leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-primary rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to try AI-powered movie recommendations?
            </h3>
            <p className="text-text-secondary mb-6">
              Download WatchPulse and discover your next favorite movie based on your mood!
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-brand-accent rounded-lg font-bold hover:bg-brand-gold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </article>
      </Container>

      <Footer />
    </main>
  );
}
