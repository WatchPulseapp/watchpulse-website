import { NextRequest, NextResponse } from 'next/server';

/**
 * Sends a reader to the Journal edition in their own language.
 *
 * Three rules, in order of authority:
 *
 *  1. An explicit choice wins. The language switch writes `wp-lang`, and a
 *     reader who has chosen is never moved again — being redirected away from
 *     the language you just picked is the worst version of this feature.
 *  2. Otherwise Accept-Language decides, which is the browser's own setting
 *     rather than a guess from IP. A Turkish speaker abroad still gets Turkish.
 *  3. Crawlers are left alone. Googlebot requests without a Turkish
 *     Accept-Language, so it reaches the English edition and finds the Turkish
 *     one through hreflang — redirecting bots by language is how sites end up
 *     with only one edition indexed.
 *
 * The redirect is 307, not 308: this is a preference, not a permanent move, and
 * /blog must stay a real indexable URL in its own right.
 */

const LANG_COOKIE = 'wp-lang';

function prefersTurkish(header: string | null): boolean {
  if (!header) return false;
  // "tr-TR,tr;q=0.9,en;q=0.8" — only the first, highest-priority tag counts.
  const first = header.split(',')[0]?.trim().toLowerCase() || '';
  return first === 'tr' || first.startsWith('tr-');
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const chosen = request.cookies.get(LANG_COOKIE)?.value;

  const onTurkish = pathname === '/tr/blog' || pathname.startsWith('/tr/blog/');
  const onEnglish = pathname === '/blog' || pathname.startsWith('/blog/');

  // A reader who picked English should not be bounced back to Turkish, and the
  // reverse, so both directions are honoured.
  if (chosen === 'en' && onTurkish) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/tr/, '') || '/blog';
    return NextResponse.redirect(url, 307);
  }

  if (onEnglish) {
    const wantsTurkish = chosen === 'tr' || (!chosen && prefersTurkish(request.headers.get('accept-language')));
    if (wantsTurkish) {
      const url = request.nextUrl.clone();
      url.pathname = `/tr${pathname}`;
      url.search = search;
      return NextResponse.redirect(url, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only the Journal has two editions; nothing else on the site is translated.
  matcher: ['/blog', '/blog/:path*', '/tr/blog', '/tr/blog/:path*'],
};
