'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/blog/JournalTheme';
import { strings, otherLocale, switchPath } from '@/lib/blog-i18n';
import { localePrefix, type Locale } from '@/lib/blog-locale';

/**
 * The Journal's own header and footer.
 *
 * The site chrome is built for a permanently dark ground and would read as
 * broken the moment a reader switches to light, so this surface carries its own
 * masthead. It stays deliberately quiet: the article is the page, and the
 * chrome's job is to get out of its way.
 */

/**
 * Language switch.
 *
 * Writes a cookie so the choice sticks: the middleware only guesses from
 * Accept-Language when the reader has not chosen, and must never override
 * someone who has.
 */
function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/blog';
  const target = otherLocale(locale);
  const t = strings(locale);

  return (
    <Link
      href={switchPath(pathname, target)}
      hrefLang={target}
      onClick={() => {
        document.cookie = `wp-lang=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors"
      style={{ borderColor: 'var(--rule)', color: 'var(--ink-soft)' }}
    >
      {t.switchTo}
    </Link>
  );
}

export function JournalMasthead({ locale = 'en' }: { locale?: Locale }) {
  const t = strings(locale);
  const base = `${localePrefix(locale)}/blog`;

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: 'var(--rule)',
        backgroundColor: 'color-mix(in srgb, var(--paper) 82%, transparent)',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 md:px-8">
        <Link href={base} className="group flex items-baseline gap-2.5">
          <span
            className="journal-headline text-[1.0625rem] leading-none"
            style={{ color: 'var(--ink-strong)' }}
          >
            WatchPulse
          </span>
          <span className="journal-eyebrow leading-none" style={{ color: 'var(--accent)' }}>
            {t.brand}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-[13px] transition-colors sm:inline-flex"
            style={{ color: 'var(--ink-soft)' }}
          >
            {t.theApp}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <LanguageSwitch locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function JournalFooter({ locale = 'en' }: { locale?: Locale }) {
  const t = strings(locale);
  const prefix = localePrefix(locale);

  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 md:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="journal-headline text-[1.25rem]" style={{ color: 'var(--ink-strong)' }}>
              {t.footerHeadline}
            </p>
            <p className="journal-meta mt-1.5 max-w-sm">{t.footerBody}</p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
          >
            {t.footerCta}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--rule)' }}
        >
          <p className="journal-meta">© {new Date().getFullYear()} WatchPulse</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { href: '/', label: t.home },
              { href: `${prefix}/blog`, label: t.journal },
              { href: '/privacy', label: t.privacy },
              { href: '/terms', label: t.terms },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="journal-meta transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="journal-meta mt-6 text-[11px]" style={{ color: 'var(--ink-faint)' }}>
          {t.tmdbNotice}
        </p>
      </div>
    </footer>
  );
}
