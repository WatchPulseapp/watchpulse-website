import type { Metadata } from 'next';
import { getCategories, localePrefix, type Locale } from '@/lib/blog-index';
import { categoryCopy } from '@/lib/blog-category-copy';
import { strings } from '@/lib/blog-i18n';

/**
 * Metadata for every Journal index surface.
 *
 * hreflang is emitted on all of them so Google knows the two editions are
 * alternates of one another rather than duplicates, and x-default points at
 * English for readers whose language matches neither.
 */

const SITE_URL = 'https://watchpulseapp.com';

function alternates(path: string) {
  return {
    canonical: `${SITE_URL}${path}`,
    languages: {
      en: `${SITE_URL}${path.replace(/^\/tr/, '') || '/blog'}`,
      tr: `${SITE_URL}/tr${path.replace(/^\/tr/, '') || '/blog'}`,
      'x-default': `${SITE_URL}${path.replace(/^\/tr/, '') || '/blog'}`,
    },
  };
}

export async function journalIndexMetadata({
  locale,
  page = 1,
  categorySlug,
}: {
  locale: Locale;
  page?: number;
  categorySlug?: string;
}): Promise<Metadata> {
  const t = strings(locale);
  const prefix = localePrefix(locale);

  let path = `${prefix}/blog`;
  let title = locale === 'tr' ? 'WatchPulse Günlük — Ne İzlesem, Nereden Başlasam' : 'WatchPulse Journal — What to Watch, Where to Start, What is Coming';
  let description = t.intro;

  if (categorySlug) {
    const found = (await getCategories(locale)).find((c) => c.slug === categorySlug);
    if (!found) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };
    const copy = categoryCopy(found.name, locale);
    path = `${prefix}/blog/category/${found.slug}`;
    title = copy.title;
    description = copy.description;
  }

  if (page > 1) {
    path = `${path}/page/${page}`;
    title = `${title} — ${t.pageOf(page, page)}`.replace(/ \/ \d+/, '');
  }

  return {
    title: page > 1 ? title : `${title} | WatchPulse`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: alternates(path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: 'WatchPulse',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, site: '@watchpulseapp' },
    // Deeper pages are the path a crawler takes to the articles, not pages that
    // rank in their own right.
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
  };
}
