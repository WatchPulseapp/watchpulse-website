import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';
import { parsePageParam } from '@/lib/blog-locale';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ category: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await params;
  const n = parsePageParam(page);
  if (!n) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };
  return journalIndexMetadata({ locale: 'tr', page: n, categorySlug: category });
}

export default async function Page({ params }: Props) {
  const { category, page } = await params;
  const n = parsePageParam(page);
  if (!n) notFound();
  return <JournalIndexPage locale="tr" page={n} categorySlug={category} />;
}
