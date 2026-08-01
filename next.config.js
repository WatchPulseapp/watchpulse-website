/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The shared-collection page is the one place that hands a remote URL to
    // next/image, and without a matching pattern the optimizer refuses it:
    // /_next/image?url=https%3A%2F%2Fimage.tmdb.org%2F... answered 400 with
    // '"url" parameter is not allowed', so every poster on a shared link was a
    // broken tile. The check is dev-only in the client loader, which is why it
    // was invisible until someone opened a real shared link.
    //
    // Narrow on purpose: this host, this path prefix. `domains` would allow any
    // path on the host, and anything wider would make the optimizer a general
    // image proxy for the internet.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
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

  // SEO, performance and security headers
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
            // Everything the site does not use is turned off, not just the
            // three that were listed. A feature nobody calls costs nothing to
            // deny and closes the door on anything injected later.
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), midi=(), serial=(), bluetooth=(), display-capture=(), browsing-topics=()'
          },
          {
            // No one frames this site. Both headers, because frame-ancestors is
            // the one modern browsers honour and X-Frame-Options is what an old
            // one understands — clickjacking a "Delete account" or a store link
            // needs nothing more than an invisible iframe.
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            // A tab opened from here cannot reach back through window.opener.
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // Strict-Transport-Security is deliberately NOT here. nginx already
          // sends it with includeSubDomains and preload, which is the stronger
          // form, and it belongs at the edge: it should hold for the two paths
          // nginx serves without asking this app (app-ads.txt and the ACME
          // challenge) and for the 502 page shown when this app is down. Two
          // HSTS headers would also mean the browser silently takes the first
          // and discards the other, which is how a weaker one wins by accident.
          {
            /**
             * Content policy.
             *
             * 'unsafe-inline' is in script-src because it has to be: the site
             * is statically generated, Next's bootstrap and the JSON-LD blocks
             * are inline, and a nonce cannot be minted for a page that was
             * rendered at build time. What the policy does buy is the part that
             * actually stops an injected payload from being useful — script,
             * frame and connect are pinned to a named list of hosts, so an
             * injection cannot pull code from an attacker's domain, post the
             * page's data anywhere, or reframe the site.
             *
             * The list is what the site genuinely talks to: TMDB for artwork,
             * YouTube for trailer stills and the no-cookie embed, Google and
             * Vercel for analytics, and watchpulse.info, which is the app's own
             * API on its own host.
             *
             * This replaces the policy the nginx vhost used to send. Two CSP
             * headers are not "the stricter one wins" — a browser enforces both
             * and a request has to satisfy each, so the pair silently became an
             * intersection nobody had written down or could reason about. The
             * hosts nginx allowed and this does not were all dead entries:
             * Google Fonts, which next/font self-hosts, and youtube.com, which
             * only the no-cookie domain is ever embedded from.
             *
             * 'unsafe-eval', which the nginx policy carried, is gone. Nothing in
             * a production Next build calls eval, and it was the one directive
             * that made the rest of the script policy negotiable.
             */
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://image.tmdb.org https://i.ytimg.com https://www.googletagmanager.com https://*.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https://watchpulse.info https://image.tmdb.org https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-src https://www.youtube-nocookie.com",
              "media-src 'self'",
              "manifest-src 'self'",
              "worker-src 'self' blob:",
              'upgrade-insecure-requests',
            ].join('; ')
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
