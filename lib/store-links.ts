import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@/lib/constants';

/**
 * Store links that say where the visitor came from.
 *
 * Every store link on the site used to be the bare product URL. That left two
 * blind spots stacked on each other: the site did not record that anyone had
 * clicked, and the stores had no way to attribute an install to whatever the
 * person had been reading a second earlier. An article could have been the sole
 * reason for a download and nothing anywhere would show it.
 *
 * Google Play's referrer survives the install — the app receives it through the
 * Install Referrer API and Play Console reports on it — so an install really can
 * be traced back to a specific surface. Apple's campaign token is weaker: it
 * only reaches App Analytics when it travels with the provider token for the
 * account, which is why that one is read from the environment and simply left
 * off when it is not set, rather than guessed at.
 */

/**
 * Where the click happened. Kept as a closed set because these become campaign
 * names in Play Console, and a free-text source turns that report into a list of
 * near-duplicate typos within a month.
 */
export type StoreSource =
  | 'home-hero'
  | 'home-download'
  | 'footer'
  | 'journal-article'
  | 'title-page'
  | 'person-page'
  | 'shared-collection';

const UTM_SOURCE = 'watchpulseapp.com';
const UTM_MEDIUM = 'web';

/**
 * Play takes one `referrer` parameter whose value is itself a query string, so
 * the inner separators have to survive encoding as data rather than be read as
 * parameters of the outer URL.
 */
export function playUrl(source: StoreSource): string {
  const referrer = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: source,
  }).toString();

  const separator = GOOGLE_PLAY_URL.includes('?') ? '&' : '?';
  return `${GOOGLE_PLAY_URL}${separator}referrer=${encodeURIComponent(referrer)}`;
}

/**
 * The provider token identifies the App Store Connect account and is the half
 * of the pair that makes campaign data appear. Set APPLE_PROVIDER_TOKEN (App
 * Store Connect → App Analytics → Campaigns) and the token starts travelling;
 * without it the campaign name is still attached but Apple will ignore it,
 * which is better than shipping an invented provider id.
 */
export function appStoreUrl(source: StoreSource): string {
  const params = new URLSearchParams();
  const provider = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN;
  if (provider) params.set('pt', provider);
  params.set('ct', source);
  // Apple's own campaign links carry mt=8; it is the media type for software.
  params.set('mt', '8');

  const separator = APP_STORE_URL.includes('?') ? '&' : '?';
  return `${APP_STORE_URL}${separator}${params.toString()}`;
}

export type Store = 'play' | 'appstore';

export function storeUrl(store: Store, source: StoreSource): string {
  return store === 'play' ? playUrl(source) : appStoreUrl(source);
}

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
  }
}

/**
 * Records the click on our own side as well.
 *
 * The store link is the last thing that happens on this site, so without an
 * event here the analytics property can report which articles are read and
 * nothing at all about which ones send anyone to a store. gtag is absent for
 * bots and outside production — the analytics component withholds it
 * deliberately — so its absence is normal and not worth logging.
 */
export function trackStoreClick(store: Store, source: StoreSource): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'store_click', {
    store,
    source,
    // Lets the report separate "read the article, then installed" from a click
    // on the same button reached some other way.
    page_path: window.location.pathname,
  });
}
