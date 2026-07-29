import Link from 'next/link';
import { localePrefix, type Locale } from '@/lib/blog-locale';
import { strings } from '@/lib/blog-i18n';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

/**
 * Further reading.
 *
 * Spans the full width rather than the measure — the article has ended, and
 * three side-by-side entries scan faster than a stack the reader has to scroll.
 */
export default function RelatedPosts({
  posts,
  currentSlug,
  locale = 'en',
}: {
  posts: RelatedPost[];
  currentSlug: string;
  locale?: Locale;
}) {
  const items = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (items.length === 0) return null;

  const t = strings(locale);
  const prefix = localePrefix(locale);

  return (
    <section className="mt-20 border-t pt-12" style={{ borderColor: 'var(--rule)' }}>
      <h2 className="journal-eyebrow" style={{ color: 'var(--ink-soft)' }}>
        {t.keepReading}
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <Link key={post.slug} href={`${prefix}/blog/${post.slug}`} className="group block h-full">
            <article className="journal-card flex h-full flex-col gap-3 rounded-xl p-6">
              <span className="journal-eyebrow" style={{ color: 'var(--accent)' }}>
                {post.category}
              </span>

              <h3 className="journal-headline text-[1.0625rem] leading-[1.35]">{post.title}</h3>

              <p
                className="line-clamp-2 flex-1 text-[14px] leading-[1.6]"
                style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                {post.excerpt}
              </p>

              <p className="journal-meta">{post.readTime}</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
