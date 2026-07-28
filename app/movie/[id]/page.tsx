import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TitlePage from '@/components/title/TitlePage';
import { loadTitle, titleMetadata, titleSchema } from '@/lib/title-page';

// Cached for an hour and revalidated in the background. Without this every
// page view is a TMDB request, which turns traffic — the thing we are trying to
// attract — into an upstream bill and an extra round trip on every load.
// Streaming availability moves on the order of weeks, not minutes.
export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return titleMetadata(await loadTitle(id, 'movie'), `/movie/${id}`);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const title = await loadTitle(id, 'movie');
  if (!title) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: titleSchema(title, `/movie/${id}`) }}
      />
      <TitlePage title={title} />
    </>
  );
}
