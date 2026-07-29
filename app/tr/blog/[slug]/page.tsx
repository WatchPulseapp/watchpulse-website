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
import { type BlogPostContent } from '@/data/static-blog-content';
import { strings } from '@/lib/blog-i18n';
import { tmdbSrcSet } from '@/lib/tmdb-image';
import { createTitleLinker, type TitleRef } from '@/lib/blog-links';
import { tagSlug, isUsefulTag } from '@/lib/blog-locale';
import { getLinkableTagSlugs } from '@/lib/blog-index';

/**
 * The Turkish side of an article.
 *
 * There is one document per article and both editions serve it, so this reads
 * the same row /blog/<slug> does and simply picks the Turkish fields. An article
 * whose translation has not landed yet falls back to English rather than 404ing
 * — a readable page in the wrong language beats no page at all.
 */
async function getBlogFromDB(slug: string): Promise<BlogPostContent | null> {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug, isPublished: true }).lean();
    if (blog) {
      return {
        title: blog.title.tr || blog.title.en,
        excerpt: blog.excerpt.tr || blog.excerpt.en,
        date: blog.date,
        readTime: blog.readTime,
        category: blog.category,
        author: blog.author || 'WatchPulse Team',
        tags: blog.tags || [],
        coverImage: blog.coverImage,
        content: blog.contentTr?.length ? blog.contentTr : blog.content,
        // The translator copies film and series names verbatim, so the same ids
        // resolve against the Turkish body as against the English one.
        sourceRefs: blog.sourceRefs as TitleRef[] | undefined,
      };
    }
  } catch (error) {
    console.error('Error fetching blog from DB:', error);
  }
  return null;
}

/** Same-category articles, newest first, shown in Turkish. */
async function getRelatedTurkish(slug: string, category: string) {
  try {
    await connectDB();
    const rows = await Blog.find({ isPublished: true, category, slug: { $ne: slug } })
      .select('slug title excerpt category readTime')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    const t = strings('tr');
    return (rows as Array<Record<string, any>>).map((r) => ({
      slug: r.slug,
      title: r.title?.tr || r.title?.en || r.slug,
      excerpt: r.excerpt?.tr || r.excerpt?.en || '',
      category: t.categoryLabel(r.category),
      readTime: r.readTime ? t.readTime(r.readTime) : '',
    }));
  } catch {
    return [];
  }
}

/** "July 28, 2026" was written by the generator in English; show it in Turkish. */
function formatTrDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // No fallback to the curated static posts: those are hand-written English and
  // have no Turkish side, so serving one here would put an English article on a
  // Turkish URL.
  const post = await getBlogFromDB(slug);

  if (!post) {
    // This runs before notFound() renders the boundary, and its title wins, so
    // it has to be the Turkish one or the tab reads English on a Turkish 404.
    return {
      title: 'Bulunamadı | WatchPulse Günlük',
      description: 'Aradığınız yazı bulunamadı.',
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = 'https://watchpulseapp.com';
  const postUrl = `${siteUrl}/tr/blog/${slug}`;
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
    // The same article exists in English at the same slug, so the two are
    // genuine alternates. x-default points at English as the original.
    alternates: {
      canonical: postUrl,
      languages: {
        'tr-TR': postUrl,
        'en-US': `${siteUrl}/blog/${slug}`,
        'x-default': `${siteUrl}/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'WatchPulse',
      locale: 'tr_TR',
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

// Turkish posts live only in the DB, so there is nothing to prerender.
export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // No fallback to the curated static posts: those are hand-written English and
  // have no Turkish side, so serving one here would put an English article on a
  // Turkish URL.
  const post = await getBlogFromDB(slug);

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

  const linkTitles = createTitleLinker(post.sourceRefs, 'tr');

  const linkableTags = await getLinkableTagSlugs();
  const shownTags = post.tags.filter(isUsefulTag).map((tag) => {
    const slug = tagSlug(tag);
    return { tag, slug, linkable: linkableTags.has(slug) };
  });

  // Further reading comes from the Turkish edition only.
  const relatedPosts = await getRelatedTurkish(slug, post.category);

  // post.category stays the canonical English name — it is the query key above
  // and the lookup key for the app prompt below. Only what the reader sees is
  // translated.
  const t = strings('tr');
  const categoryLabel = t.categoryLabel(post.category);

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
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://watchpulseapp.com/tr/blog/${slug}` },
    "image": post.coverImage || "https://watchpulseapp.com/og-image.jpg",
    "articleSection": categoryLabel,
    "keywords": post.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://watchpulseapp.com" },
      { "@type": "ListItem", "position": 2, "name": "Günlük", "item": "https://watchpulseapp.com/tr/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://watchpulseapp.com/tr/blog/${slug}` },
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
        <div className="journal min-h-screen" lang="tr">
          <JournalMasthead locale="tr" />

          <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:px-8 md:pt-14">
            <Link
              href="/tr/blog"
              className="group journal-meta mb-10 inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Tüm yazılar
            </Link>

            <article>
              {/* Header sits on the measure so the title lines up with the body
                  it introduces, rather than spanning a wider column. */}
              <header className="journal-measure">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="journal-eyebrow" style={{ color: 'var(--accent)' }}>
                    {categoryLabel}
                  </span>
                  <span aria-hidden="true" className="h-px w-5" style={{ background: 'var(--rule-strong)' }} />
                  <span className="journal-meta">{formatTrDate(post.date)}</span>
                  <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>·</span>
                  <span className="journal-meta">{t.readTime(post.readTime)}</span>
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
                  {post.author}
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
                <TableOfContents items={tocItems} locale="tr" />

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
                              <li key={i}>{linkTitles ? linkTitles(item) : item}</li>
                            ))}
                          </ul>
                        );
                      default: {
                        const text = block.content as string;
                        return <p key={index}>{linkTitles ? linkTitles(text) : text}</p>;
                      }
                    }
                  })}
                </div>

                <BlogAppCTA category={post.category} slug={slug} locale="tr" />

                {/* Spacing alone separates the tags — the CTA above already draws
                    a rule, and a third one here would stack up. */}
                {/* The tags themselves are stored once, in English, because
                    they are a query key rather than prose — so both editions
                    show the same words and each links into its own edition. */}
                {shownTags.length > 0 && (
                  <div className="mt-10 flex flex-wrap items-center gap-2">
                    <span className="journal-meta mr-1">{t.taggedWith}</span>
                    {shownTags.map(({ tag, slug, linkable }) =>
                      linkable ? (
                        <Link
                          key={tag}
                          href={`/tr/blog/tag/${slug}`}
                          className="journal-meta rounded-full border px-3 py-1.5 text-[12px] transition-colors hover:border-current"
                          style={{ borderColor: 'var(--rule)' }}
                        >
                          {tag}
                        </Link>
                      ) : (
                        <span
                          key={tag}
                          className="journal-meta rounded-full border px-3 py-1.5 text-[12px]"
                          style={{ borderColor: 'var(--rule)' }}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                )}

                <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                  <ShareButtons title={post.title} slug={slug} locale="tr" />
                </div>
              </div>

              <RelatedPosts posts={relatedPosts} currentSlug={slug} locale="tr" />
            </article>
          </div>

          <JournalFooter locale="tr" />
        </div>
      </JournalThemeProvider>
    </>
  );
}
