import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JournalMasthead, JournalFooter } from '@/components/blog/JournalChrome';
import { JournalThemeProvider } from '@/components/blog/JournalTheme';
import ReadingProgress from '@/components/blog/ReadingProgress';
import TableOfContents from '@/components/blog/TableOfContents';
import RelatedPosts from '@/components/blog/RelatedPosts';

import ShareButtons from '@/components/blog/ShareButtons';
import BlogAppCTA from '@/components/blog/BlogAppCTA';
import { ArrowLeft } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { blogPostContent, type BlogPostContent } from '@/data/static-blog-content';
import { tmdbSrcSet } from '@/lib/tmdb-image';
import { staticBlogPosts } from '@/data/static-blogs';

async function getBlogFromDB(slug: string): Promise<BlogPostContent | null> {
  try {
    await connectDB();
    // One document per article; this edition reads its English fields, and
    // /tr/blog/<slug> reads the Turkish ones from the same row.
    const blog = await Blog.findOne({ slug, isPublished: true }).lean();
    if (blog) {
      return {
        title: blog.title.en,
        excerpt: blog.excerpt.en,
        date: blog.date,
        readTime: blog.readTime,
        category: blog.category,
        author: blog.author || 'WatchPulse Team',
        tags: blog.tags || [],
        coverImage: blog.coverImage,
        content: blog.content,
      };
    }
  } catch (error) {
    console.error('Error fetching blog from DB:', error);
  }
  return null;
}

/** Same-category published articles, newest first. */
async function getRelatedFromDB(slug: string, category: string) {
  try {
    await connectDB();
    const rows = await Blog.find({ isPublished: true, category, slug: { $ne: slug } })
      .select('slug title excerpt category readTime')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return (rows as Array<Record<string, any>>).map((r) => ({
      slug: r.slug as string,
      title: (r.title?.en || r.title?.tr || r.slug) as string,
      excerpt: (r.excerpt?.en || r.excerpt?.tr || '') as string,
      category: (r.category || 'General') as string,
      readTime: (r.readTime || '') as string,
    }));
  } catch {
    return [];
  }
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let post = await getBlogFromDB(slug);
  // Only DB articles have a Turkish side; the curated static posts are
  // hand-written English with no /tr/blog counterpart to point at.
  const hasTurkish = Boolean(post);
  if (!post) {
    post = blogPostContent[slug] || null;
  }

  if (!post) {
    return {
      title: 'Not found | WatchPulse Journal',
      description: 'The article you are looking for could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = 'https://watchpulseapp.com';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const imageUrl = post.coverImage || `${siteUrl}/og-image.jpg`;

  return {
    title: `${post.title} | WatchPulse Blog`,
    description: post.excerpt,
    keywords: [...post.tags, 'WatchPulse', 'movie recommendations', 'AI', 'streaming', 'entertainment', 'mood-based', 'film discovery'].join(', '),
    authors: [{ name: post.author }],
    creator: 'WatchPulse',
    publisher: 'WatchPulse',
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL(siteUrl),
    alternates: hasTurkish
      ? {
          canonical: postUrl,
          languages: {
            'en-US': postUrl,
            'tr-TR': `${siteUrl}/tr/blog/${slug}`,
            'x-default': postUrl,
          },
        }
      : { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'WatchPulse',
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      creator: '@watchpulseapp',
      site: '@watchpulseapp',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPostContent).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post = await getBlogFromDB(slug);
  if (!post) {
    post = blogPostContent[slug] || null;
  }

  if (!post) {
    notFound();
  }

  const tocItems = post.content
    .filter(block => block.type === 'heading')
    .map((block, i) => ({
      id: `section-${i}`,
      title: block.content as string,
    }));

  let headingIndex = 0;

  // Published articles first, curated ones after. Built the other way round it
  // only ever surfaced the hand-written archive, so the generated articles —
  // most of the blog, and the part that grows daily — never linked to each
  // other and had no internal links of their own beyond the index.
  const relatedPosts = await getRelatedFromDB(slug, post.category);

  for (const [key, p] of Object.entries(blogPostContent)) {
    if (relatedPosts.length >= 3) break;
    if (key === slug || p.category !== post.category) continue;
    if (relatedPosts.some((r) => r.slug === key)) continue;
    relatedPosts.push({
      slug: key,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
    });
  }

  if (relatedPosts.length < 3) {
    const morePosts = staticBlogPosts
      .filter(p => p.slug !== slug && p.category === post!.category && !relatedPosts.find(r => r.slug === p.slug))
      .slice(0, 3 - relatedPosts.length)
      .map(p => ({
        slug: p.slug,
        title: typeof p.title === 'string' ? p.title : p.title.en,
        excerpt: typeof p.excerpt === 'string' ? p.excerpt : p.excerpt.en,
        category: p.category,
        readTime: p.readTime,
      }));
    relatedPosts.push(...morePosts);
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    // "WatchPulse Team" is a masthead, not a person; Google treats a Person
    // author as a real individual and expects an entity behind it.
    "author": { "@type": "Organization", "name": post.author, "url": "https://watchpulseapp.com" },
    "publisher": {
      "@type": "Organization",
      "name": "WatchPulse",
      "logo": { "@type": "ImageObject", "url": "https://watchpulseapp.com/logo.png" },
    },
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://watchpulseapp.com/blog/${slug}` },
    "image": post.coverImage || "https://watchpulseapp.com/og-image.jpg",
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://watchpulseapp.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://watchpulseapp.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://watchpulseapp.com/blog/${slug}` },
    ],
  };

  // Escape "<" so a title/excerpt/tag containing "</script>" can't break out of the JSON-LD block (stored-XSS defense).
  const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <ReadingProgress />

      <JournalThemeProvider>
        {/* The root layout declares lang="tr" for the rest of the site; this
            article is English and says so for its own subtree. */}
        <div className="journal min-h-screen" lang="en">
          <JournalMasthead />

          <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:px-8 md:pt-14">
            <Link
              href="/blog"
              className="group journal-meta mb-10 inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              All articles
            </Link>

            <article>
              {/* Header sits on the measure so the title lines up with the body
                  it introduces, rather than spanning a wider column. */}
              <header className="journal-measure">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="journal-eyebrow" style={{ color: 'var(--accent)' }}>
                    {post.category}
                  </span>
                  <span aria-hidden="true" className="h-px w-5" style={{ background: 'var(--rule-strong)' }} />
                  <span className="journal-meta">{post.date}</span>
                  <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>·</span>
                  <span className="journal-meta">{post.readTime}</span>
                </div>

                <h1 className="journal-headline mt-5 text-[2.125rem] leading-[1.12] sm:text-[2.625rem] md:text-[3rem]">
                  {post.title}
                </h1>

                <p
                  className="mt-5 text-[17px] leading-[1.6] md:text-[19px]"
                  style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
                >
                  {post.excerpt}
                </p>

                <p
                  className="journal-meta mt-7 border-t pt-5"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  By {post.author}
                </p>
              </header>

              {post.coverImage && (
                <figure className="mt-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    srcSet={tmdbSrcSet(post.coverImage, 'hero')}
                    sizes="(min-width: 1152px) 72rem, 100vw"
                    alt=""
                    width={1200}
                    height={630}
                    loading="eager"
                    className="aspect-[1200/630] w-full rounded-xl object-cover"
                    style={{ backgroundColor: 'var(--card)' }}
                  />
                </figure>
              )}

              <div className="journal-measure mt-12">
                <TableOfContents items={tocItems} locale="en" />

                <div className="journal-prose mt-10">
                  {post.content.map((block, index) => {
                    switch (block.type) {
                      case 'heading': {
                        const id = `section-${headingIndex++}`;
                        return (
                          <h2 key={index} id={id}>
                            {block.content as string}
                          </h2>
                        );
                      }
                      case 'quote':
                        return (
                          <blockquote key={index}>
                            <p>{block.content as string}</p>
                          </blockquote>
                        );
                      case 'list':
                        return (
                          <ul key={index}>
                            {(block.content as string[]).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        );
                      default:
                        return <p key={index}>{block.content as string}</p>;
                    }
                  })}
                </div>

                <BlogAppCTA category={post.category} slug={slug} locale="en" />

                {/* Spacing alone separates the tags — the CTA above already draws
                    a rule, and a third one here would stack up. */}
                {post.tags.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="journal-meta rounded-full border px-3 py-1.5 text-[12px]"
                        style={{ borderColor: 'var(--rule)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                  <ShareButtons title={post.title} slug={slug} locale="en" />
                </div>
              </div>

              <RelatedPosts posts={relatedPosts} currentSlug={slug} locale="en" />
            </article>
          </div>

          <JournalFooter />
        </div>
      </JournalThemeProvider>
    </>
  );
}
