import type { Metadata } from 'next';
import JournalNotFound from '@/components/blog/JournalNotFound';

// The 404 status already tells a crawler to drop the URL; saying so in a meta
// tag as well stops the page inheriting the site-wide "index, follow".
export const metadata: Metadata = {
  title: 'Not found | WatchPulse Journal',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <JournalNotFound locale="en" />;
}
