/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 31536000, // 1 year cache for images
  },
  // Performance optimizations
  swcMinify: true,
  compiler: {
    // Strips console.log in production, but NOT error and warn.
    //
    // It used to strip everything, which quietly deleted every diagnostic the
    // server has: the blog generator's rejection reasons, the TMDB failure
    // logs, every catch block that reports what went wrong. A week of lost
    // articles left no trace anywhere, and finding out why meant reproducing
    // the failure by hand against the upstream API. Logs that only exist in
    // development are not logs.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  // Optimize for faster builds and runtime
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react', 'react-dom'],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Faster development
  reactStrictMode: true,

  // SEO & Performance Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        // Everything under /images is replaced in place, under a name that does
        // not change — new app screenshots land on top of the old ones, the logo
        // gets redrawn, the OG image is re-cut. `immutable` promised the exact
        // opposite: it tells a browser never to ask again for a year, so anyone
        // who had loaded the old screenshots kept seeing them long after they
        // were replaced, with no way to tell them otherwise. An hour, then a
        // revalidation against the ETag, which costs a 304 and nothing else.
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      },
      {
        // Fonts and favicons genuinely are immutable — a new one arrives under a
        // new name — so these keep the year.
        source: '/(.*)\\.(ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Cache blog pages for better SEO crawling
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400'
          }
        ]
      },
      {
        // RSS Feed caching
        source: '/feed.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400'
          },
          {
            key: 'Content-Type',
            value: 'application/rss+xml; charset=utf-8'
          }
        ]
      },
      {
        // The sitemap is built per request and changes several times a day, so
        // a shared cache holding it for a day — which is what s-maxage=86400
        // said — would undo the point of building it fresh.
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
          }
        ]
      }
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/articles',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/posts',
        destination: '/blog',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
