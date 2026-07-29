import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TitlePage from '@/components/title/TitlePage';
import { loadTitle, titleMetadata, titleSchema } from '@/lib/title-page';

/** The Turkish side of a series page. See the film route for the reasoning. */
export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return titleMetadata(await loadTitle(id, 'tv'), `/tv/${id}`, 'tr');
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const title = await loadTitle(id, 'tv');
  if (!title) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: titleSchema(title, `/tv/${id}`, 'tr') }}
      />
      <TitlePage title={title} locale="tr" />
    </>
  );
}
