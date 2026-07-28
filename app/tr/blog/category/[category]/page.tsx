import type { Metadata } from 'next';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return journalIndexMetadata({ locale: 'tr', categorySlug: category });
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  return <JournalIndexPage locale="tr" categorySlug={category} />;
}
