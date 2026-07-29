'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { storeUrl, trackStoreClick, type StoreSource } from '@/lib/store-links';
import { cn } from '@/lib/utils';

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-6 h-6 fill-current', className)} aria-hidden="true">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.293l2.834 1.64a1 1 0 0 1 0 1.732l-2.834 1.64-2.56-2.56 2.56-2.452zM5.864 3.45L16.8 9.784l-2.302 2.302L5.864 3.45z" />
    </svg>
  );
}

function AppStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-6 h-6 fill-current', className)} aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export default function StoreButtons({
  size = 'md',
  className,
  // The hero and the closing download block are the two places these appear on
  // the landing page, and they are very different moments — one is the first
  // thing a visitor sees, the other is what they reach after reading. Reporting
  // them as one number would hide which of the two actually does the work.
  source = 'home-hero',
}: {
  size?: 'md' | 'lg';
  className?: string;
  source?: StoreSource;
}) {
  const { t } = useLanguage();
  const large = size === 'lg';

  return (
    <div className={cn('flex flex-col sm:flex-row gap-4', className)}>
      <a
        href={storeUrl('play', source)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackStoreClick('play', source)}
        className={cn('store-button-primary group justify-center', large && 'px-8 py-4')}
      >
        <GooglePlayIcon className="transition-transform group-hover:scale-110" />
        <span className="text-left">
          <span className="block text-[10px] font-medium opacity-70 uppercase tracking-wider">{t('hero.getItOn')}</span>
          <span className={cn('block font-bold -mt-0.5', large ? 'text-lg' : 'text-base')}>Google Play</span>
        </span>
      </a>

      <a
        href={storeUrl('appstore', source)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackStoreClick('appstore', source)}
        className={cn('store-button-secondary group justify-center', large && 'px-8 py-4')}
      >
        <AppStoreIcon className="transition-transform group-hover:scale-110" />
        <span className="text-left">
          <span className="block text-[10px] font-medium opacity-70 uppercase tracking-wider">{t('hero.downloadOn')}</span>
          <span className={cn('block font-bold -mt-0.5', large ? 'text-lg' : 'text-base')}>App Store</span>
        </span>
      </a>
    </div>
  );
}
