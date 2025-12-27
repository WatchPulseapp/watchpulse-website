import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filteredPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  if (filteredPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-brand-primary/20">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
          You Might Also Like
        </span>
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-background-card rounded-xl border border-brand-primary/10 hover:border-brand-primary/30 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            <h3 className="font-semibold text-white group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>

            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {post.excerpt}
            </p>

            <span className="inline-flex items-center gap-1 text-sm text-brand-primary group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
