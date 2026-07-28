import type { Metadata } from 'next';
import JournalIndexPage from '@/components/blog/JournalIndexPage';
import { journalIndexMetadata } from '@/lib/blog-meta';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return journalIndexMetadata({ locale: 'tr' });
}

export default async function Page() {
  return <JournalIndexPage locale="tr" />;
}
