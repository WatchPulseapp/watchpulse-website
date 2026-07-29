'use client';

import { storeUrl, trackStoreClick, type Store, type StoreSource } from '@/lib/store-links';

/**
 * A link to one of the app stores that records the click and tells the store
 * which surface sent it.
 *
 * Exists so that the server-rendered pages — the film, series and person pages —
 * can carry a tracked link without becoming client components themselves. Only
 * this anchor ships to the browser.
 */
export default function StoreLink({
  store,
  source,
  className,
  children,
}: {
  store: Store;
  source: StoreSource;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={storeUrl(store, source)}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => trackStoreClick(store, source)}
    >
      {children}
    </a>
  );
}
