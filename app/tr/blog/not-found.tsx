import type { Metadata } from 'next';
import JournalNotFound from '@/components/blog/JournalNotFound';

export const metadata: Metadata = {
  title: 'Bulunamadı | WatchPulse Günlük',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <JournalNotFound locale="tr" />;
}
