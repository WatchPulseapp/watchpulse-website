import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PersonPage from '@/components/title/PersonPage';
import { loadPerson, personMetadata, personSchema } from '@/lib/person-page';

/**
 * The Turkish side of an actor or director page.
 *
 * Half the Journal is Turkish, and its articles link to these pages by name.
 * Without this route every one of those links dropped the reader into English.
 */
export const revalidate = 86400;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return personMetadata(await loadPerson(id), id, 'tr');
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const person = await loadPerson(id);
  if (!person) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personSchema(person, id, 'tr') }}
      />
      <PersonPage person={person} locale="tr" />
    </>
  );
}
