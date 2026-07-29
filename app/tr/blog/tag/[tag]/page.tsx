import type { Metadata } from 'next';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';

/** The Turkish side of a tag page. See the English route for the reasoning. */

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

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return journalIndexMetadata({ locale: 'tr', tagSlug: tag });
}

export default async function Page({ params }: Props) {
  const { tag } = await params;
  return <JournalIndexPage locale="tr" tagSlug={tag} />;
}
