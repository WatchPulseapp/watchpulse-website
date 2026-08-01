'use client';

import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { SOCIAL_LINKS } from '@/lib/constants';
import { storeUrl, trackStoreClick } from '@/lib/store-links';
import { Instagram, Mail } from 'lucide-react';

interface FooterProps {
  forceEnglish?: boolean;
}

const EN_FALLBACKS: Record<string, string> = {
  'footer.description': 'Movie & TV tracking, AI recommendations, a where-to-watch finder and taste-based social matching; all in one app.',
  'footer.product': 'Product',
  'footer.features': 'Features',
  'footer.howItWorks': 'How It Works',
  'footer.faqLink': 'FAQ',
  'footer.blog': 'Blog',
  'footer.legal': 'Legal',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.deleteAccount': 'Delete Account',
  'footer.contact': 'Contact',
  'footer.downloadTitle': 'Download',
  'footer.copyright': 'All rights reserved.',
  'footer.tmdb': 'This product uses the TMDB API but is not endorsed or certified by TMDB.',
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer({ forceEnglish = false }: FooterProps) {
  const { t: contextT } = useLanguage();
  const t = (key: string) => (forceEnglish ? EN_FALLBACKS[key] ?? contextT(key) : contextT(key));

  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-background-deep to-background-elevated/30" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/logo.png" alt="WatchPulse" width={32} height={32} className="rounded-lg" />
                <span className="text-xl font-bold">
                  <span className="text-white">Watch</span>
                  <span className="text-gradient-pulse">Pulse</span>
                </span>
              </div>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">
                {t('footer.description')}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  aria-label="E-mail"
                  className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <nav aria-label={t('footer.product')}>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {t('footer.product')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/#features" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.features')}
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.howItWorks')}
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.faqLink')}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.blog')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Legal + download */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {t('footer.legal')}
              </h3>
              <ul className="space-y-3 text-sm mb-8">
                <li>
                  <Link href="/privacy" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/delete-account" className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.deleteAccount')}
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${SOCIAL_LINKS.email}`} className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors">
                    {t('footer.contact')}
                  </a>
                </li>
              </ul>

              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {t('footer.downloadTitle')}
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={storeUrl('play', 'footer')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackStoreClick('play', 'footer')}
                    className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Google Play
                  </a>
                </li>
                <li>
                  <a
                    href={storeUrl('appstore', 'footer')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackStoreClick('appstore', 'footer')}
                    className="inline-block py-1 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    App Store
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} WatchPulse. {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/images/brand/tmdb_logo.svg"
                alt="TMDB"
                width={80}
                height={11}
                className="opacity-60"
              />
              <p className="text-[11px] text-text-muted max-w-xs">{t('footer.tmdb')}</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
