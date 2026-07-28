import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@/lib/constants';

/**
 * In-article call to action.
 *
 * Sits on the measure, left-aligned like the prose around it. A centred,
 * full-bleed promo block reads as an ad and gets skipped; matching the column
 * lets it read as the natural end of the argument the article just made.
 */
export default function BlogAppCTA() {
  return (
    <aside
      className="my-14 rounded-2xl border p-7 sm:p-8"
      style={{ borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }}
    >
      <p className="journal-eyebrow" style={{ color: 'var(--accent)' }}>
        The app
      </p>

      <h3 className="journal-headline mt-3 text-[1.4rem] leading-[1.25] sm:text-[1.55rem]">
        Never ask &ldquo;what should I watch&rdquo; again
      </h3>

      <p
        className="mt-3 max-w-md text-[15.5px] leading-[1.65]"
        style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-serif), Georgia, serif' }}
      >
        Mood-based picks, episode tracking and a where-to-watch finder — free on iPhone and
        Android.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center rounded-full px-5 py-2.5 text-[13.5px] font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
        >
          App Store
        </a>
        <a
          href={GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center rounded-full border px-5 py-2.5 text-[13.5px] font-medium transition-colors"
          style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink)' }}
        >
          Google Play
        </a>
      </div>
    </aside>
  );
}
