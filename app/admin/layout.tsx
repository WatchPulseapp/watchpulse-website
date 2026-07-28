import type { Metadata } from 'next';

// Admin surfaces must never be indexed or followed.
export const metadata: Metadata = {
  title: 'Admin — WatchPulse',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
