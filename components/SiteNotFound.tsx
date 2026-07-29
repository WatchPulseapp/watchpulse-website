import Link from 'next/link';
import { storeUrl } from '@/lib/store-links';

/**
 * The 404 for everything outside the Journal, which has its own.
 *
 * Most arrivals here are not typos. They are stale /movie/{id} and /person/{id}
 * links shared out of the app months ago, pointing at records TMDB has since
 * merged or removed — Search Console was reporting hundreds of them. Someone who
 * followed a friend's recommendation and landed on a dead end deserves better
 * than a single "Go Home" button, so this offers the two places likely to help:
 * the Journal, and the app the link came from.
 *
 * Deliberately a pure server component, with no client component anywhere in
 * it. A notFound() thrown from a route that carries `revalidate` renders this
 * boundary through a path that could not resolve the client manifest, and Next
 * 14 fails there with "Cannot read properties of undefined (reading
 * 'clientModules')" — which surfaced as a correct 404 status with a completely
 * empty body on every film, series and person URL. The store links are plain
 * anchors for the same reason; they still carry their campaign parameters,
 * which is what Play attributes an install by, so only the client-side event is
 * given up and nothing that matters is lost.
 *
 * Bilingual on the page rather than by preference, because reading a preference
 * needs a provider this tree does not always have — and a 404 must not depend
 * on anything.
 */

const STORE_LINK =
  'rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand-primary/40';

export default function SiteNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background-deep px-5 py-20">
      <div className="w-full max-w-lg text-center">
        <p className="font-display text-[5rem] leading-none text-gradient-pulse sm:text-[6.5rem]">404</p>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Bu sayfa burada değil
        </h1>
        <p lang="en" className="mt-1.5 text-[15px] text-text-secondary">
          This page is not here
        </p>

        <p className="mx-auto mt-6 max-w-md text-[15.5px] leading-relaxed text-text-secondary">
          Bağlantı eskimiş ya da adres yanlış yazılmış olabilir.
          <span lang="en" className="mt-1 block text-text-muted">
            The link may have aged out, or the address may be mistyped.
          </span>
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand-primary px-6 py-3 text-[14px] font-semibold text-background-dark transition-opacity hover:opacity-90"
          >
            Ana sayfa
          </Link>
          <Link
            href="/tr/blog"
            className="rounded-full border border-white/15 px-6 py-3 text-[14px] font-medium text-text-primary transition-colors hover:border-brand-primary/40"
          >
            Günlük
          </Link>
          <Link
            href="/blog"
            lang="en"
            className="rounded-full border border-white/15 px-6 py-3 text-[14px] font-medium text-text-primary transition-colors hover:border-brand-primary/40"
          >
            Journal
          </Link>
        </div>

        <div className="mt-12 border-t border-white/[0.07] pt-8">
          <p className="text-[13px] text-text-muted">
            Bir arkadaşınızın paylaştığı listeyi mi arıyordunuz? Uygulamada duruyor.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href={storeUrl('appstore', 'footer')} target="_blank" rel="noopener" className={STORE_LINK}>
              App Store
            </a>
            <a href={storeUrl('play', 'footer')} target="_blank" rel="noopener" className={STORE_LINK}>
              Google Play
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
