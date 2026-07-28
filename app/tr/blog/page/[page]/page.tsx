import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ page: string }> };

function parsePage(raw: string): number | null {
  // Only bare integers above 1 are pages: "/page/1" would duplicate the index,
  // and anything else is a URL that was never real.
  if (!/^d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 2 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const n = parsePage(page);
  if (!n) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };
  return journalIndexMetadata({ locale: 'tr', page: n });
}

export default async function Page({ params }: Props) {
  const { page } = await params;
  const n = parsePage(page);
  if (!n) notFound();
  return <JournalIndexPage locale="tr" page={n} />;
}
