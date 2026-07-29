import { Metadata } from 'next';

/**
 * The Turkish edition's segment defaults.
 *
 * The theme script that used to live in a layout is rendered by
 * JournalThemeProvider now — the Turkish routes were added without a layout,
 * so that whole edition ignored the reader's stored theme and painted dark
 * whatever they had chosen.
 */

export const metadata: Metadata = {
  title: 'WatchPulse Günlük — Film ve Dizi Rehberleri',
  description:
    'Bu akşam ne izlensin: yeni çıkanlar, platform rehberleri, tür seçkileri ve bir akşamınızı ayırmaya değer filmler. Her gün güncelleniyor.',
  keywords:
    'film önerisi, dizi önerisi, ne izlesem, hangi platformda, yeni çıkan filmler, film blogu, dizi blogu, WatchPulse',
  alternates: {
    canonical: 'https://watchpulseapp.com/tr/blog',
  },
  robots: { index: true, follow: true },
};

export default function TurkishJournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
