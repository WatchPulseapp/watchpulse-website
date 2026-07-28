'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@/lib/constants';

type Platform = 'ios' | 'android' | null;

/**
 * End-of-article prompt to install the app.
 *
 * Deliberately not a panel. A tinted, bordered box in the middle of a column of
 * prose reads as an ad and gets skipped on sight, so this is set as an editorial
 * sign-off instead: a hairline, the same serif as the article, and one clear
 * action. The pull comes from the copy tying back to what the reader just read,
 * not from surrounding it in a frame.
 */
export default function BlogAppCTA() {
  const [platform, setPlatform] = useState<Platform>(null);

  // Two store buttons side by side means one of them is always wrong for the
  // device in the reader's hand. Detection happens after mount so the server
  // and first client render agree; until then both links carry equal weight,
  // which is also what a reader without JS gets.
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform('ios');
    else if (/Android/i.test(ua)) setPlatform('android');
  }, []);

  const stores = {
    ios: { href: APP_STORE_URL, label: 'App Store' },
    android: { href: GOOGLE_PLAY_URL, label: 'Google Play' },
  };

  const primary = platform === 'android' ? stores.android : stores.ios;
  const secondary = platform === 'android' ? stores.ios : stores.android;

  return (
    <aside className="mt-16 border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
      <p className="journal-eyebrow" style={{ color: 'var(--accent)' }}>
        WatchPulse
      </p>

      <h3 className="journal-headline mt-2.5 text-[1.3rem] leading-[1.3] sm:text-[1.45rem]">
        Never lose a recommendation again
      </h3>

      <p
        className="mt-2.5 max-w-lg text-[15.5px] leading-[1.65]"
        style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
      >
        Save what you found here, track what you are part-way through, and get a pick that
        matches your mood on the nights nothing looks right.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={primary.href}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
        >
          Get it free
          <ArrowUpRight className="h-4 w-4" />
        </a>

        {/* The other store stays available, but as a quiet aside rather than a
            second button competing with the first. */}
        <a
          href={secondary.href}
          target="_blank"
          rel="noopener"
          className="journal-meta underline-offset-4 hover:underline"
        >
          Also on {secondary.label}
        </a>
      </div>
    </aside>
  );
}
