import SiteNotFound from '@/components/SiteNotFound';

/**
 * A notFound() thrown from this segment does not reliably reach the root
 * boundary in Next 14 — measured, it returned a correct 404 status with an
 * empty body. Declaring the boundary here is what makes the page render.
 */
export default function NotFound() {
  return <SiteNotFound />;
}
