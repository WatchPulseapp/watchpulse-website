import type { Metadata } from 'next';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';

/** The Turkish side of a tag page. See the English route for the reasoning. */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return journalIndexMetadata({ locale: 'tr', tagSlug: tag });
}

export default async function Page({ params }: Props) {
  const { tag } = await params;
  return <JournalIndexPage locale="tr" tagSlug={tag} />;
}
