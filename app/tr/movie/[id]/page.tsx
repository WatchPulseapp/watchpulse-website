import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TitlePage from '@/components/title/TitlePage';
import { loadTitle, titleMetadata, titleSchema } from '@/lib/title-page';

/**
 * The Turkish side of a film page. Same record, same cache, Turkish frame — the
 * two declare each other via hreflang so they read as one page in two languages
 * rather than as duplicates competing for the same query.
 */
export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return titleMetadata(await loadTitle(id, 'movie'), `/movie/${id}`, 'tr');
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const title = await loadTitle(id, 'movie');
  if (!title) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: titleSchema(title, `/movie/${id}`, 'tr') }}
      />
      <TitlePage title={title} locale="tr" />
    </>
  );
}
