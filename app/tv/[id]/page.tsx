import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TitlePage from '@/components/title/TitlePage';
import { loadTitle, titleMetadata, titleSchema } from '@/lib/title-page';

// Fetched per request: streaming availability changes constantly, and a cached
// "where to watch" answer is worse than none.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return titleMetadata(await loadTitle(id, 'tv'), `/tv/${id}`);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const title = await loadTitle(id, 'tv');
  if (!title) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: titleSchema(title, `/tv/${id}`) }}
      />
      <TitlePage title={title} />
    </>
  );
}
