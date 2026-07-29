import type { Metadata } from 'next';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';

/**
 * Articles carrying one tag.
 *
 * Tags were rendered at the foot of every article as plain labels that went
 * nowhere — eight per article, none of them a link, doing nothing for a reader
 * following a thread or for a crawler looking for a route deeper in. Only tags
 * the archive uses more than once get a page; see MIN_POSTS_PER_TAG.
 */

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
  return journalIndexMetadata({ locale: 'en', tagSlug: tag });
}

export default async function Page({ params }: Props) {
  const { tag } = await params;
  return <JournalIndexPage locale="en" tagSlug={tag} />;
}
