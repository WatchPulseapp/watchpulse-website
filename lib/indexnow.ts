/**
 * IndexNow submission.
 *
 * Tells participating search engines that a URL exists the moment it is
 * published, instead of waiting for a crawl. Bing, Yandex, Seznam and Naver
 * share one endpoint, so a single call reaches all of them.
 *
 * Google does NOT participate, and its own sitemap ping endpoint was retired in
 * 2023 — for Google the route is Search Console plus the sitemap already
 * declared in robots.txt. That is why this is a supplement, not a replacement.
 *
 * Ownership is proved by hosting a file at /<key>.txt whose contents are the
 * key. The file lives in public/ and the key in INDEXNOW_KEY; both must match
 * or submissions are rejected with 403.
 */

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_HOST = 'watchpulseapp.com';

export interface IndexNowResult {
  ok: boolean;
  status?: number;
  reason?: string;
  submitted: number;
}

export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return { ok: false, reason: 'INDEXNOW_KEY is not set', submitted: 0 };

  const urlList = urls.filter((u) => u.startsWith(`https://${SITE_HOST}/`));
  if (urlList.length === 0) return { ok: false, reason: 'no submittable URLs', submitted: 0 };

  // Never let a slow or unreachable search engine hold up the publish request.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key,
        keyLocation: `https://${SITE_HOST}/${key}.txt`,
        urlList,
      }),
      signal: controller.signal,
    });

    // 200 and 202 both mean accepted; 202 means the key is still being verified.
    const ok = res.status === 200 || res.status === 202;
    if (!ok) console.error(`[indexnow] rejected with HTTP ${res.status}`);
    return { ok, status: res.status, submitted: ok ? urlList.length : 0 };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === 'AbortError'
        ? 'timed out after 8s'
        : error instanceof Error
          ? error.message
          : String(error);
    console.error(`[indexnow] ${reason}`);
    return { ok: false, reason, submitted: 0 };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * The URLs worth announcing when an article goes live: the article itself, the
 * index it now leads, and the category page it was added to.
 */
export function urlsForNewPost(slug: string, categorySlug: string): string[] {
  return [
    `https://${SITE_HOST}/blog/${slug}`,
    `https://${SITE_HOST}/blog`,
    `https://${SITE_HOST}/blog/category/${categorySlug}`,
  ];
}
