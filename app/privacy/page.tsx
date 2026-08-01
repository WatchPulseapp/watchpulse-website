import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Shield, Lock, Eye, Database, UserCheck, Trash2, Bell, Globe, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - WatchPulse',
  description: 'WatchPulse Privacy Policy. Learn how we collect, use, and protect your personal data. We are committed to your privacy and comply with Google Play Family Policy.',
  openGraph: {
    title: 'Privacy Policy - WatchPulse',
    description: 'Learn how WatchPulse protects your privacy and handles your personal data.',
    url: 'https://watchpulseapp.com/privacy',
  },
  alternates: {
    canonical: 'https://watchpulseapp.com/privacy',
  },
};

export default function PrivacyPage() {
  const lastUpdated = 'July 23, 2026';

  return (
    // lang="en": sayfa içeriği İngilizce, kök layout tr — ekran okuyucu/crawler için doğru dil
    <main lang="en" className="min-h-screen bg-background-dark">
      <Header hideLanguageSwitcher forceEnglish />

      <div className="pt-24 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-6">
                <Shield className="w-8 h-8 text-brand-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-text-secondary">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-10">
              <p className="text-text-secondary leading-relaxed">
                At WatchPulse, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our mobile application and website.
                Please read this privacy policy carefully. By using our services, you consent to the practices
                described in this policy.
              </p>
            </section>

            {/* Data Security Section - with Play Family Policy compliance */}
            <section className="mb-10 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    We implement industry-standard security measures to protect your personal information.
                    Your data is encrypted both in transit and at rest using AES-256 encryption. We regularly
                    audit our systems and practices to ensure the highest level of security.
                  </p>

                  {/* Play Family Policy Compliance Badge */}
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/40">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="text-green-400 font-semibold text-lg">
                        Google Play Family Policy Compliance
                      </span>
                    </div>
                    <p className="text-text-secondary">
                      WatchPulse is committed to complying with Google Play&apos;s Family Policy. We do not collect
                      personal information from children under 13 without parental consent. Our app is designed
                      to be safe for all users and adheres to all applicable family safety guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                  <h3 className="text-lg font-semibold text-brand-primary mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Email address (for account creation and communication)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Display name (optional, for personalization)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Profile picture (optional)
                    </li>
                  </ul>
                </div>

                <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                  <h3 className="text-lg font-semibold text-brand-primary mb-3">Usage Data</h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Movies and TV shows you add to your watchlist
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Your mood preferences for personalized recommendations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      App interaction data (features used, time spent)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Device information (device type, operating system)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Crash and diagnostic data (via Firebase Crashlytics and Sentry) to fix bugs
                    </li>
                  </ul>
                </div>

                <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                  <h3 className="text-lg font-semibold text-brand-primary mb-3">Social &amp; Communication Data</h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Content you share publicly in the app: posts, comments, poll votes and reposts
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Messages you send in chat, including voice messages (stored so we can deliver them to your conversation partners)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Images you upload (profile picture, banner, post images)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Your taste profile and match interactions when you use social matching (your public profile and taste compatibility may be shown to other users)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      Purchase and subscription status (managed by Google Play / the App Store; we never see your full payment details)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>

              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <ul className="space-y-3 text-text-secondary">
                  {[
                    'Provide personalized movie and TV show recommendations based on your mood',
                    'Maintain and improve our AI-powered recommendation engine',
                    'Sync your watchlist across devices',
                    'Deliver your posts, comments and chat messages to the people you share them with',
                    'Match you with users who have a similar taste in movies and shows — only if you opt in to social matching',
                    'Automatically scan uploaded images for content that violates our policies (e.g. nudity) to keep the community safe',
                    'Send push notifications you have enabled (likes, comments, messages, match requests) — you can turn these off in Settings',
                    'Show ads in the free tier (with consent where required) and process premium subscriptions',
                    'Send important service updates and notifications',
                    'Analyze usage patterns to improve app performance',
                    'Respond to your inquiries and provide customer support'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Data Sharing</h2>
              </div>

              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <p className="text-text-secondary mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span><strong className="text-white">Service Providers:</strong> Trusted third-party services that help us operate our app (e.g., cloud hosting, analytics)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span><strong className="text-white">TMDB API:</strong> We use The Movie Database (TMDB) API for movie/TV data. Your viewing preferences may be used to fetch relevant content. Streaming availability data is powered by JustWatch.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span><strong className="text-white">Media storage:</strong> Images and voice messages you upload are stored on Cloudinary, our media hosting provider.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span><strong className="text-white">Advertising:</strong> Google AdMob serves ads in the free tier. Where required (e.g. EEA/UK), ads are only personalized with your consent, which you can change anytime in the app settings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span><strong className="text-white">Purchases:</strong> Subscriptions are processed by Google Play and the App Store (with RevenueCat on iOS for subscription management). We never receive your full payment details.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Your Rights</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Access', desc: 'Request a copy of your personal data' },
                  { title: 'Correction', desc: 'Update or correct your information' },
                  { title: 'Deletion', desc: 'Request deletion of your account and data' },
                  { title: 'Portability', desc: 'Export your data as JSON in the app: Settings → Download My Data' },
                  { title: 'Opt-out', desc: 'Unsubscribe from marketing communications' },
                  { title: 'Withdraw Consent', desc: 'Revoke previously given consent' }
                ].map((right, index) => (
                  <div key={index} className="bg-background-card rounded-xl border border-brand-primary/20 p-4">
                    <h3 className="text-brand-primary font-semibold mb-1">{right.title}</h3>
                    <p className="text-text-secondary text-sm">{right.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Deletion */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Account Deletion</h2>
              </div>

              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <p className="text-text-secondary mb-4">
                  You have the right to delete your account at any time. When you delete your account,
                  all your personal data will be permanently removed from our servers within 48 hours.
                </p>
                <Link
                  href="/delete-account"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Learn how to delete your account
                </Link>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Cookies and Tracking</h2>
              </div>

              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <p className="text-text-secondary mb-4">
                  We use essential cookies and similar technologies to:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    Keep you signed in to your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    Remember your preferences and settings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    Analyze app usage to improve our services
                  </li>
                </ul>
                <p className="text-text-muted text-sm mt-4">
                  We use Google Analytics and Vercel Analytics for website analytics. You can opt out of
                  tracking by using browser privacy settings or extensions.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Children&apos;s Privacy</h2>
              </div>

              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <p className="text-text-secondary">
                  WatchPulse is not intended for children under 13 years of age. We do not knowingly collect
                  personal information from children under 13. If you are a parent or guardian and believe
                  your child has provided us with personal information, please contact us immediately at{' '}
                  <a href="mailto:watchpulseapp@gmail.com" className="text-brand-accent hover:text-brand-gold">
                    watchpulseapp@gmail.com
                  </a>
                  , and we will promptly delete such information.
                </p>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">Updates to This Policy</h2>
              </div>

              <div className="bg-background-card rounded-xl border border-brand-primary/20 p-6">
                <p className="text-text-secondary">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by
                  posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are
                  advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <div className="bg-brand-primary/10 rounded-xl border border-brand-primary/30 p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                <p className="text-text-secondary mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <a
                  href="mailto:watchpulseapp@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  watchpulseapp@gmail.com
                </a>
              </div>
            </section>

            {/* Back Link */}
            <div className="text-center">
              <Link
                href="/"
                className="text-text-muted hover:text-brand-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Footer forceEnglish />
    </main>
  );
}
