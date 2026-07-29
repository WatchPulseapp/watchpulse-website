import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';
import { parsePageParam } from '@/lib/blog-locale';

/**
 * Cached for five minutes rather than rendered per request.
 *
 * Every listing surface was force-dynamic, so each view cost a database round
 * trip — measured, 388ms to first byte on the index. Articles publish about
 * every two and a half hours, so a five-minute window is not a freshness
 * trade at all, and the publisher calls revalidatePath on the indexes anyway,
 * which puts a new article up immediately.
 */
export const revalidate = 300;

type Props = { params: Promise<{ category: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await params;
  const n = parsePageParam(page);
  if (!n) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };
  return journalIndexMetadata({ locale: 'en', page: n, categorySlug: category });
}

export default async function Page({ params }: Props) {
  const { category, page } = await params;
  const n = parsePageParam(page);
  if (!n) notFound();
  return <JournalIndexPage locale="en" page={n} categorySlug={category} />;
}
