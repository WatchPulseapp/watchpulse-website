import { timingSafeEqual } from 'crypto';

/**
 * Checks the shared secret the schedulers send.
 *
 * Header only — never a query parameter, which would write the secret into the
 * nginx access log and into any Referer that leaked from a redirect. Fails
 * closed when CRON_SECRET is unset, so a host that forgot the variable is not
 * an open publish endpoint.
 *
 * The comparison is length-checked and then constant-time. A remote timing
 * attack against a `===` on a high-entropy secret is not a realistic threat over
 * a network; this is simply the form a secret comparison should take, and it
 * costs nothing.
 */
export function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(request.headers.get('authorization') || '');

  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
